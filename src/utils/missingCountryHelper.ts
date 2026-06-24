/**
 * missingCountryHelper.ts
 *
 * 缺失国家诊断工具
 * - 控制台执行 diagnoseMissingCountries() 查看匹配报告
 * - 输出表格 + 一键生成补全代码
 */

import { getLastReport } from './geoDataService'

export interface MissingDiagnosis {
  total: number
  matched: number
  missing: string[]
  byMethod: Record<string, number>
  suggestionCode: string
}

/**
 * 诊断缺失国家
 * - 在浏览器控制台执行: import('/src/utils/missingCountryHelper.ts').then(m => m.diagnoseMissingCountries())
 */
export function diagnoseMissingCountries(): MissingDiagnosis | null {
  const report = getLastReport()
  if (!report) {
    console.error('[missingCountryHelper] 尚未加载国家数据，请先刷新全球概览页')
    return null
  }

  const { total, matched, missing, byMethod } = report

  // 表格输出
  console.group('[missingCountryHelper] 匹配诊断报告')
  console.table({
    '总计': total,
    '已匹配': matched,
    '缺失': missing.length,
    '匹配率': `${((matched / total) * 100).toFixed(1)}%`
  })

  console.log('\n匹配策略分布:')
  console.table(byMethod)

  if (missing.length > 0) {
    console.warn(`\n缺失国家 (${missing.length} 个):`)
    console.table(missing.map(name => ({ 国家: name })))

    // 生成补全代码
    const aliasCode = missing
      .map(name => `  '${name}': ''  // TODO: 填入 ISO2 代码`)
      .join(',\n')

    const manualCode = missing
      .map(name => `  // '${name}': { coord: [0, 0], bbox: [-180, -90, 180, 90], nameEn: '${name}' }`)
      .join('\n')

    const suggestion = [
      '// ============== 自动生成的补全代码 ==============',
      '// 1. 添加到 EN_ALIAS_TO_ISO2（拼写变体 → ISO2）:',
      `{`,
      aliasCode,
      `}`,
      '',
      '// 2. 添加到 MANUAL_CENTERS（GeoJSON 未收录的小国）:',
      `{`,
      manualCode,
      `}`
    ].join('\n')

    console.log('\n一键补全代码（复制到 geoDataService.ts）:')
    console.log(suggestion)

    return { total, matched, missing, byMethod, suggestionCode: suggestion }
  } else {
    console.log('\n✅ 全部匹配成功，无需补全')
    return { total, matched, missing: [], byMethod, suggestionCode: '' }
  }

  console.groupEnd()
}

/**
 * 快速检查当前匹配状态（不输出表格，仅返回摘要）
 */
export function getMatchSummary(): string {
  const report = getLastReport()
  if (!report) return '尚未加载国家数据'
  const rate = ((report.matched / report.total) * 100).toFixed(1)
  return `已匹配 ${report.matched}/${report.total} (${rate}%)，缺失 ${report.missing.length} 个`
}
