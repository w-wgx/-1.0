/**
 * RFC 4180 兼容的 CSV 解析器
 * 验证样本: G:\testdb\终极3\英图.csv 29085 行
 * - 915 行 name 含逗号（如 "Dagger A [Nesher S, Mod Mirage 5]"）
 * - 7015 行 description 含逗号
 * - 4 行 description 含换行
 */

export interface CsvParseResult {
  headers: string[]
  rows: Record<string, string>[]
  encoding: 'utf-8' | 'gbk'
  totalRows: number
  errors: Array<{ line: number; message: string }>
}

/**
 * 解析 CSV 文件
 * @param file 要解析的 CSV 文件
 * @returns 解析结果，包含表头、数据行、编码、总行数和错误信息
 */
export async function parseCsvFile(file: File): Promise<CsvParseResult> {
  const buffer = await file.arrayBuffer()
  const encoding = detectEncoding(buffer)
  const text = decodeBuffer(buffer, encoding)
  const cleanText = text.replace(/^\uFEFF/, '')  // 去 BOM
  
  const { headers, rows, errors } = parseRfc4180(cleanText)
  
  return { headers, rows, encoding, totalRows: rows.length, errors }
}

/**
 * 检测文件编码（UTF-8 / GBK）
 */
function detectEncoding(buffer: ArrayBuffer): 'utf-8' | 'gbk' {
  const view = new Uint8Array(buffer)
  
  // UTF-8 BOM
  if (view[0] === 0xEF && view[1] === 0xBB && view[2] === 0xBF) {
    return 'utf-8'
  }
  
  // 尝试 UTF-8 解码
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buffer)
    return 'utf-8'
  } catch {
    return 'gbk'
  }
}

/**
 * 解码 Buffer
 */
function decodeBuffer(buffer: ArrayBuffer, encoding: 'utf-8' | 'gbk'): string {
  return new TextDecoder(encoding).decode(buffer)
}

/**
 * 状态机实现 RFC 4180
 * 处理：引号包裹、转义双引号 ""、多行字段、引号内逗号
 */
function parseRfc4180(text: string): {
  headers: string[]
  rows: Record<string, string>[]
  errors: Array<{ line: number; message: string }>
} {
  const records: string[][] = []
  let field = ''
  let record: string[] = []
  let inQuotes = false
  let lineNumber = 1
  const errors: Array<{ line: number; message: string }> = []
  
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'  // 转义双引号 ""
          i++
        } else {
          inQuotes = false
        }
      } else {
        if (ch === '\n') lineNumber++
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        record.push(field)
        field = ''
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++
        lineNumber++
        record.push(field)
        field = ''
        if (!(record.length === 1 && record[0] === '')) {
          records.push(record)
        }
        record = []
      } else {
        field += ch
      }
    }
  }
  
  // 最后一字段/行
  if (field || record.length > 0) {
    record.push(field)
    if (!(record.length === 1 && record[0] === '')) {
      records.push(record)
    }
  }
  
  if (records.length === 0) {
    return { headers: [], rows: [], errors }
  }
  
  const headers = records[0].map(h => h.trim())
  const rows: Record<string, string>[] = []
  
  for (let r = 1; r < records.length; r++) {
    const record = records[r]
    if (record.length !== headers.length) {
      errors.push({
        line: r + 1,
        message: `列数不匹配：期望 ${headers.length} 列，实际 ${record.length} 列`
      })
      // 尽力而为
    }
    const obj: Record<string, string> = {}
    headers.forEach((h, idx) => {
      obj[h] = (record[idx] ?? '').trim()
    })
    rows.push(obj)
  }
  
  return { headers, rows, errors }
}
