/**
 * CSV 数据画像 - 自适应多数据源 O(n) 一次扫描
 *
 * 兼容 3 种 CSV 格式：
 *   英图.csv         → type / year / image_url / local_image
 *   all_data.csv     → category / service_year / images / local_images
 *   normalized_merged → type / year / image_link / local_image_path
 */

export interface CsvProfile {
  totalRows: number
  encoding: 'utf-8' | 'gbk'
  types: Array<{ name: string; count: number; pct: number }>
  countries: {
    total: number
    empty: number
    emptyPct: number
    top5: Array<{ name: string; count: number }>
  }
  years: {
    withYear: number
    unknown: number
    unknownPct: number
    range: [number, number] | null
  }
  images: {
    withImage: number
    withoutImage: number
    withoutPct: number
  }
  parseErrors: number
}

/**
 * 从 row 中取第一个非空值（按候选键顺序）
 */
function pick(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    const v = (row as any)[k]
    if (v && String(v).trim()) return String(v).trim()
  }
  return ''
}

export function profileRows(
  rows: Record<string, string>[],
  encoding: 'utf-8' | 'gbk',
  parseErrors: number
): CsvProfile {
  const total = rows.length
  if (total === 0) {
    return {
      totalRows: 0,
      encoding,
      types: [],
      countries: { total: 0, empty: 0, emptyPct: 0, top5: [] },
      years: { withYear: 0, unknown: 0, unknownPct: 0, range: null },
      images: { withImage: 0, withoutImage: 0, withoutPct: 0 },
      parseErrors
    }
  }

  const typeMap = new Map<string, number>()
  const countryMap = new Map<string, number>()
  let emptyCountry = 0
  let yearUnknown = 0
  let withImage = 0
  let minYear = Infinity, maxYear = -Infinity

  for (const r of rows) {
    // 类型：优先 type（英图/归一化），其次 category（all_data）
    const t = pick(r, 'type', 'category')
    if (t) typeMap.set(t, (typeMap.get(t) || 0) + 1)

    // 国家
    const c = pick(r, 'country')
    if (!c) emptyCountry++
    else countryMap.set(c, (countryMap.get(c) || 0) + 1)

    // 年份：优先 year（英图/归一化），其次 service_year（all_data）
    const yRaw = pick(r, 'year', 'service_year')
    if (yRaw === '' || yRaw === '0') {
      yearUnknown++
    } else {
      const y = Number(yRaw)
      if (isNaN(y)) yearUnknown++
      else {
        if (y < minYear) minYear = y
        if (y > maxYear) maxYear = y
      }
    }

    // 图片：兼容 image_url / image_link / images / local_image / local_image_path / local_images
    const img = pick(r, 'image_url', 'image_link', 'images')
    const localImg = pick(r, 'local_image', 'local_image_path', 'local_images')
    if (img || localImg) {
      withImage++
    }
  }

  const types = Array.from(typeMap.entries())
    .map(([name, count]) => ({ name, count, pct: count / total }))
    .sort((a, b) => b.count - a.count)

  const top5 = Array.from(countryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  return {
    totalRows: total,
    encoding,
    types,
    countries: {
      total: countryMap.size,
      empty: emptyCountry,
      emptyPct: emptyCountry / total,
      top5
    },
    years: {
      withYear: total - yearUnknown,
      unknown: yearUnknown,
      unknownPct: yearUnknown / total,
      range: minYear === Infinity ? null : [minYear, maxYear]
    },
    images: {
      withImage,
      withoutImage: total - withImage,
      withoutPct: (total - withImage) / total
    },
    parseErrors
  }
}