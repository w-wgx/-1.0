/**
 * Mock API 服务
 * 用于生产环境（Vercel部署）时，使用静态JSON数据替代后端API
 *
 * 修复：字段名映射到前端期望的格式
 */

// Mock 原始数据类型（JSON 中的字段）
interface RawMockEquipment {
  platform_id?: number
  id?: number
  name: string
  type?: string
  type_class?: string
  category?: string
  country?: string
  commissioned_year?: number | null
  year?: number | null
  width?: number | null
  length?: number | null
  max_range?: number | null
  crew?: number | null
  has_image?: boolean
  image_url?: string
  local_image?: string
  source_url?: string
  crawl_time?: string
  subtype?: string      // 新增：细分子类型（如战斗机、驱逐舰等）
  subtype_id?: string   // 新增：子类型ID
}

// 转换后的数据类型（前端期望的字段名）
interface TransformedEquipment {
  id: number
  name: string
  subtitle?: string
  type: string
  category: string
  subtype?: string       // 细分子类型（如战斗机、驱逐舰等）
  country: string
  year: number | null
  width: number | null
  length: number | null
  height?: number | null
  weight?: number | null
  max_range?: number | null
  maxSpeed?: number | null
  crew: number | null
  maxRange?: number | null
  detectionRange?: number | null
  ceiling?: number | null
  engine?: string
  manufacturer?: string
  totalProduction?: number
  description?: string
  has_image: boolean
  imageLink?: string      // 完整外链 URL (image_url)
  imagePath?: string      // 本地路径 (local_image)
  sourceLink?: string     // 来源链接 (source_url)
  detailUrl?: string      // 详情链接
  source?: string         // 数据来源
  operators?: string      // 使用方
  variants?: string       // 变体型号
}

// Mock 响应格式
interface MockResponse {
  code: number
  message: string
  data: any
  total?: number
}

// Mock 数据（从 public 目录加载）
let mockData: RawMockEquipment[] = []
let transformedData: TransformedEquipment[] = []

/**
 * 数据字段转换函数
 * 将 JSON 原始字段映射为前端期望的字段名
 */
function transformItem(item: RawMockEquipment): TransformedEquipment {
  return {
    id: item.platform_id || item.id || 0,
    name: item.name?.replace(/\n/g, ' ').trim() || '',
    subtitle: extractSubtitle(item.name),
    // 使用细分子类型（subtype），如果没有则回退到 category
    type: (item.subtype || item.category || 'Unknown').trim(),
    category: (item.category || '').trim(),
    // 保存子类型信息用于详细分类
    subtype: item.subtype || null,
    // 修复：标准化国家名称（移除年份后缀如 "Russia [1992-]" -> "Russia"）
    country: normalizeCountryName(item.country || ''),
    year: item.commissioned_year ?? item.year ?? null,
    width: item.width ?? null,
    length: item.length ?? null,
    height: null,
    weight: null,
    max_range: item.max_range ?? null,
    maxSpeed: null,
    crew: item.crew ?? null,
    maxRange: item.max_range ?? null,
    detectionRange: null,
    ceiling: null,
    engine: null,
    manufacturer: null,
    totalProduction: null,
    description: null,
    has_image: !!item.has_image,
    // 图片字段映射
    imageLink: item.image_url || null,        // image_url -> imageLink
    imagePath: item.local_image || null,       // local_image -> imagePath
    sourceLink: item.source_url || null,       // source_url -> sourceLink
    detailUrl: item.source_url || null,        // source_url -> detailUrl
    source: item.source_url || null,           // source_url -> source
    operators: null,
    variants: null
  }
}

/**
 * 从名称中提取副标题
 */
function extractSubtitle(name: string): string | undefined {
  if (!name) return undefined
  const match = name.match(/\[(.*?)\]/)
  if (match) {
    return match[1]
  }
  if (name.includes(' - ')) {
    return name.split(' - ').slice(1).join(' - ').trim()
  }
  return undefined
}

/**
 * 标准化国家名称
 * 移除年份后缀和特殊字符，统一格式
 * 例如: "Russia [1992-]" -> "Russia", "Soviet Union [-1991]" -> "Soviet Union"
 */
function normalizeCountryName(country: string): string {
  if (!country) return ''
  
  // 移除方括号中的年份信息，如 "Russia [1992-]" -> "Russia "
  let normalized = country.replace(/\s*\[.*?\]\s*/g, ' ').trim()
  
  // 移除多余空格
  normalized = normalized.replace(/\s+/g, ' ').trim()
  
  return normalized
}

/**
 * 加载并转换 Mock 数据
 */
export async function loadMockData(): Promise<void> {
  try {
    const response = await fetch('/mock-data/all-equipment.json')
    const rawData: RawMockEquipment[] = await response.json()
    mockData = rawData
    // 转换所有数据
    transformedData = rawData.map(transformItem)
    console.log(`Mock data loaded: ${transformedData.length} records`)
  } catch (error) {
    console.error('Failed to load mock data:', error)
    mockData = []
    transformedData = []
  }
}

/**
 * 模拟分页查询
 */
export function mockGetList(params: {
  current: number
  size: number
  name?: string
  type?: string
  country?: string
}): MockResponse {
  let filtered = [...transformedData]

  // 筛选条件
  if (params.name) {
    filtered = filtered.filter(item =>
      item.name?.toLowerCase().includes(params.name!.toLowerCase())
    )
  }
  if (params.type) {
    filtered = filtered.filter(item =>
      item.type?.toLowerCase().includes(params.type!.toLowerCase()) ||
      item.category?.toLowerCase().includes(params.type!.toLowerCase())
    )
  }
  if (params.country) {
    filtered = filtered.filter(item =>
      item.country?.toLowerCase().includes(params.country!.toLowerCase())
    )
  }

  // 分页
  const total = filtered.length
  const start = (params.current - 1) * params.size
  const end = start + params.size
  const records = filtered.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      records,
      total,
      size: params.size,
      current: params.current,
      pages: Math.ceil(total / params.size)
    },
    total
  }
}

/**
 * 模拟获取所有数据
 */
export function mockGetAll(): MockResponse {
  return {
    code: 200,
    message: 'success',
    data: transformedData,
    total: transformedData.length
  }
}

/**
 * 模拟获取国家列表
 */
export function mockGetDistinctCountries(): MockResponse {
  const countries = [...new Set(transformedData.map(item => item.country).filter(Boolean))]
  return {
    code: 200,
    message: 'success',
    data: countries,
    total: countries.length
  }
}

/**
 * 模拟获取国家摘要
 */
export function mockGetCountriesSummary(): MockResponse {
  const countryCounts: Record<string, number> = {}
  transformedData.forEach(item => {
    if (item.country) {
      countryCounts[item.country] = (countryCounts[item.country] || 0) + 1
    }
  })

  const summary = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)

  return {
    code: 200,
    message: 'success',
    data: summary,
    total: summary.length
  }
}

/**
 * 模拟获取轻量数据
 */
export function mockGetLightweight(): MockResponse {
  const lightweight = transformedData.map(item => ({
    id: item.id,
    name: item.name,
    type: item.type,
    category: item.category,
    country: item.country,
    year: item.year,
    has_image: item.has_image
  }))

  return {
    code: 200,
    message: 'success',
    data: lightweight,
    total: lightweight.length
  }
}

/**
 * 模拟获取国家统计
 * 修复：返回正确的字段名 topEquipment, byType, byYear
 */
export function mockGetCountryStats(country: string): MockResponse {
  const countryData = transformedData.filter(item => item.country === country)

  // 类型统计 -> byType
  const byType: Record<string, number> = {}
  countryData.forEach(item => {
    const type = item.type || 'Other'
    byType[type] = (byType[type] || 0) + 1
  })

  // 年份统计 -> byYear
  const byYear: Record<string, number> = {}
  countryData.forEach(item => {
    if (item.year) {
      const decade = Math.floor(Number(item.year) / 10) * 10
      byYear[`${decade}s`] = (byYear[`${decade}s`] || 0) + 1
    }
  })

  // 最新装备列表 -> topEquipment（取前20条，包含完整信息）
  const topEquipment = countryData
    .filter(item => item.year)
    .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
    .slice(0, 20)
    .map(item => ({
      id: item.id,
      name: item.name,
      subtitle: item.subtitle,
      type: item.type,
      category: item.category,
      country: item.country,
      year: item.year,
      manufacturer: item.manufacturer,
      height: item.height,
      engine: item.engine,
      source: item.sourceLink,
      has_image: item.has_image,
      imageLink: item.imageLink,
      imagePath: item.imagePath
    }))

  console.log('[MockAPI] getCountryStats:', country, 'total:', countryData.length, 'topEquipment:', topEquipment.length)

  return {
    code: 200,
    message: 'success',
    data: {
      country,
      total: countryData.length,
      byType: Object.entries(byType)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      byYear: Object.entries(byYear)
        .map(([decade, count]) => ({ decade, count }))
        .sort((a, b) => a.decade.localeCompare(b.decade)),
      topEquipment  // 修复：使用正确的字段名
    }
  }
}

/**
 * 模拟获取统计数据
 */
export function mockGetStats(): MockResponse {
  const typeCounts: Record<string, number> = {}
  const countryCounts: Record<string, number> = {}

  transformedData.forEach(item => {
    const type = item.type || 'Unknown'
    typeCounts[type] = (typeCounts[type] || 0) + 1

    if (item.country) {
      countryCounts[item.country] = (countryCounts[item.country] || 0) + 1
    }
  })

  return {
    code: 200,
    message: 'success',
    data: {
      total: transformedData.length,
      typeStats: Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      countryStats: Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
      hasImage: transformedData.filter(item => item.has_image).length,
      noImage: transformedData.filter(item => !item.has_image).length
    }
  }
}

/**
 * 模拟获取详情
 * 返回转换后的完整数据
 */
export function mockGetDetail(id: number | string): MockResponse {
  const item = transformedData.find(d => d.id == id)

  if (!item) {
    console.warn('[MockAPI] getDetail not found:', id)
    return {
      code: 404,
      message: 'Equipment not found',
      data: null
    }
  }

  console.log('[MockAPI] getDetail found:', item.name)

  return {
    code: 200,
    message: 'success',
    data: item
  }
}

/**
 * Mock API 导出
 */
export const mockApi = {
  loadMockData,
  getList: mockGetList,
  getAll: mockGetAll,
  getDistinctCountries: mockGetDistinctCountries,
  getCountriesSummary: mockGetCountriesSummary,
  getLightweight: mockGetLightweight,
  getCountryStats: mockGetCountryStats,
  getStats: mockGetStats,
  getDetail: mockGetDetail
}
