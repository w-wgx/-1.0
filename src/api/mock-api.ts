/**
 * Mock API 服务
 * 用于生产环境（Vercel部署）时，使用静态JSON数据替代后端API
 */

// Mock 数据类型
interface MockEquipment {
  platform_id?: number
  id?: number
  name: string
  type?: string
  category?: string
  country?: string
  commissioned_year?: number
  year?: number
  width?: number
  length?: number
  max_range?: number
  crew?: number
  has_image?: boolean
  image_url?: string
  local_image?: string
  source_url?: string
}

// Mock 响应格式
interface MockResponse {
  code: number
  message: string
  data: any
  total?: number
}

// Mock 数据（从 public 目录加载）
let mockData: MockEquipment[] = []

/**
 * 加载 Mock 数据
 */
export async function loadMockData(): Promise<void> {
  try {
    const response = await fetch('/mock-data/all-equipment.json')
    mockData = await response.json()
    console.log(`Mock data loaded: ${mockData.length} records`)
  } catch (error) {
    console.error('Failed to load mock data:', error)
    mockData = []
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
  let filtered = [...mockData]

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
    data: mockData,
    total: mockData.length
  }
}

/**
 * 模拟获取国家列表
 */
export function mockGetDistinctCountries(): MockResponse {
  const countries = [...new Set(mockData.map(item => item.country).filter(Boolean))]
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
  mockData.forEach(item => {
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
  const lightweight = mockData.map(item => ({
    id: item.platform_id || item.id,
    name: item.name,
    type: item.type || item.category,
    category: item.category,
    country: item.country,
    year: item.commissioned_year || item.year,
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
 */
export function mockGetCountryStats(country: string): MockResponse {
  const countryData = mockData.filter(item => item.country === country)

  // 类型统计
  const typeCounts: Record<string, number> = {}
  countryData.forEach(item => {
    const type = item.type || item.category || 'Unknown'
    typeCounts[type] = (typeCounts[type] || 0) + 1
  })

  // 年份统计
  const yearCounts: Record<string, number> = {}
  countryData.forEach(item => {
    const year = item.commissioned_year || item.year
    if (year) {
      const decade = Math.floor(year / 10) * 10
      yearCounts[`${decade}s`] = (yearCounts[`${decade}s`] || 0) + 1
    }
  })

  // 最新装备列表
  const latestEquipment = countryData
    .filter(item => item.commissioned_year || item.year)
    .sort((a, b) => (b.commissioned_year || b.year || 0) - (a.commissioned_year || a.year || 0))
    .slice(0, 10)

  return {
    code: 200,
    message: 'success',
    data: {
      country,
      total: countryData.length,
      typeStats: Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      yearStats: Object.entries(yearCounts)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => a.year.localeCompare(b.year)),
      latestEquipment
    }
  }
}

/**
 * 模拟获取统计数据
 */
export function mockGetStats(): MockResponse {
  const typeCounts: Record<string, number> = {}
  const countryCounts: Record<string, number> = {}

  mockData.forEach(item => {
    const type = item.type || item.category || 'Unknown'
    typeCounts[type] = (typeCounts[type] || 0) + 1

    if (item.country) {
      countryCounts[item.country] = (countryCounts[item.country] || 0) + 1
    }
  })

  return {
    code: 200,
    message: 'success',
    data: {
      total: mockData.length,
      typeStats: Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      countryStats: Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
      hasImage: mockData.filter(item => item.has_image).length,
      noImage: mockData.filter(item => !item.has_image).length
    }
  }
}

/**
 * 模拟获取详情
 */
export function mockGetDetail(id: number | string): MockResponse {
  const item = mockData.find(d => d.platform_id == id || d.id == id)

  if (!item) {
    return {
      code: 404,
      message: 'Equipment not found',
      data: null
    }
  }

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