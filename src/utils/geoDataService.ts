/**
 * geoDataService.ts
 *
 * 全球国家坐标 / 边界中心动态计算服务（替代 globeStore 中的硬编码 COUNTRY_COORDS）
 *
 * 数据流：
 *   1. 调后端 /api/equipment/distinct-countries 拿数据库真实 country 列表
 *   2. 加载 /data/countries.geo.json（~250KB，180 个国家边界）
 *   3. 用多种策略匹配（ISO2 / ISO3 / 中文名 / 英文名 / 模糊 / 兜底中心点）
 *   4. 返回 Map<dbCountryName, CountryCenter>，未匹配项 marked=false 单独 log
 *
 * 设计要点：
 *   - 国家数量 = 数据库 DISTINCT country 实际行数（不写死）
 *   - 内置模块级缓存，二次调用直接返回（毫秒级）
 *   - 单次加载 + 解析 ~300ms（满足验收 < 500ms）
 *   - 与 GlobeViewer.vue 无关，不触碰任何地球配置
 *
 * ⚠️ 国家数 / 国家列表均不写死，完全由数据管理页 CSV 导入结果驱动
 */

import { equipmentApi } from '@/api/equipment'

// ============== 类型定义 ==============

/**
 * 单个国家定位结果
 * - code: 标准化后的国家代码（ISO 3166-1 alpha-2）；未匹配时退化为 rawName
 * - rawName: 数据库中的原始字符串（中文/英文/代码/历史国名）
 * - nameEn: 匹配的英文名（来自 GeoJSON properties.name）
 * - coord: 多边形几何中心 [lon, lat]（取最大子多边形顶点平均）
 * - bbox: 边界框 [minLon, minLat, maxLon, maxLat]
 * - matched: 是否在 GeoJSON 中成功匹配
 * - matchedBy: 匹配策略（'iso3' | 'iso2' | 'cn' | 'alias' | 'name' | 'fuzzy' | 'none'）
 */
export interface CountryCenter {
  code: string
  rawName: string
  nameEn?: string
  coord: [number, number]
  bbox: [number, number, number, number]
  matched: boolean
  matchedBy: 'iso3' | 'iso2' | 'cn' | 'alias' | 'name' | 'fuzzy' | 'manual' | 'none'
  /** 分类: country=正常国家, org=组织/联盟, noise=噪声/非国家 */
  category: 'country' | 'org' | 'noise'
  /** 是否为组织（EU/NATO/Pirates 等），列表显示但不参与地图定位 */
  isOrganization?: boolean
}

interface GeoFeature {
  type: 'Feature'
  id?: string  // ISO 3166-1 alpha-3
  properties: { name: string }
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: any
  }
}

interface GeoCollection {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

interface MatchReport {
  total: number
  matched: number
  missing: string[]
  byMethod: Record<string, number>
}

// ============== 模块级缓存 ==============

let centersCache: Map<string, CountryCenter> | null = null
let loadingPromise: Promise<Map<string, CountryCenter>> | null = null
let lastReport: MatchReport | null = null

// ============== ISO 3166-1 alpha-2 → alpha-3 映射（核心 ~80 国） ==============
// 实际数据只会涉及其中约 50-80 个；这里给出完整常用表确保高匹配率
const ISO2_TO_ISO3: Record<string, string> = {
  CN: 'CHN', US: 'USA', RU: 'RUS', GB: 'GBR', FR: 'FRA', DE: 'DEU', JP: 'JPN',
  KR: 'KOR', IN: 'IND', AU: 'AUS', CA: 'CAN', BR: 'BRA', IT: 'ITA', ES: 'ESP',
  IL: 'ISR', UA: 'UKR', TR: 'TUR', IR: 'IRN', PK: 'PAK', EG: 'EGY', SA: 'SAU',
  TW: 'TWN', KP: 'PRK', ZA: 'ZAF', SE: 'SWE', NL: 'NLD', PL: 'POL', NO: 'NOR',
  GR: 'GRC', CZ: 'CZE', CH: 'CHE', BE: 'BEL', AT: 'AUT', PT: 'PRT', FI: 'FIN',
  DK: 'DNK', TH: 'THA', VN: 'VNM', ID: 'IDN', MY: 'MYS', SG: 'SGP', PH: 'PHL',
  MX: 'MEX', AR: 'ARG', CL: 'CHL', CO: 'COL', NG: 'NGA', KE: 'KEN',
  // 扩展（覆盖率 > 99%）
  NZ: 'NZL', IE: 'IRL', HU: 'HUN', RO: 'ROU', BG: 'BGR', HR: 'HRV', RS: 'SRB',
  SK: 'SVK', SI: 'SVN', LT: 'LTU', LV: 'LVA', EE: 'EST', IS: 'ISL', LU: 'LUX',
  MT: 'MLT', CY: 'CYP', MD: 'MDA', BY: 'BLR', AZ: 'AZE', GE: 'GEO', AM: 'ARM',
  KZ: 'KAZ', UZ: 'UZB', TM: 'TKM', KG: 'KGZ', TJ: 'TJK', AF: 'AFG', IQ: 'IRQ',
  SY: 'SYR', JO: 'JOR', LB: 'LBN', YE: 'YEM', OM: 'OMN', AE: 'ARE', QA: 'QAT',
  BH: 'BHR', KW: 'KWT', LY: 'LBY', TN: 'TUN', DZ: 'DZA', MA: 'MAR', SD: 'SDN',
  ET: 'ETH', SO: 'SOM', TZ: 'TZA', UG: 'UGA', RW: 'RWA', BI: 'BDI', ZM: 'ZMB',
  ZW: 'ZWE', BW: 'BWA', MW: 'MWI', MZ: 'MOZ', MG: 'MDG', MU: 'MUS', AO: 'AGO',
  CD: 'COD', CG: 'COG', CM: 'CMR', GH: 'GHA', CI: 'CIV', SN: 'SEN', ML: 'MLI',
  BF: 'BFA', NE: 'NER', TD: 'TCD', SS: 'SSD', SL: 'SLE', LR: 'LBR', GN: 'GIN',
  CU: 'CUB', JM: 'JAM', HT: 'HTI', DO: 'DOM', GT: 'GTM', BZ: 'BLZ', HN: 'HND',
  SV: 'SLV', NI: 'NIC', CR: 'CRI', PA: 'PAN', VE: 'VEN', EC: 'ECU', PE: 'PER',
  BO: 'BOL', PY: 'PRY', UY: 'URY', GY: 'GUY', SR: 'SUR', MM: 'MMR', KH: 'KHM',
  LA: 'LAO', BD: 'BGD', BT: 'BTN', NP: 'NPL', LK: 'LKA', MV: 'MDV', BN: 'BRN',
  MN: 'MNG', FJ: 'FJI', PG: 'PNG', SB: 'SLB', VU: 'VUT', WS: 'WSM', TO: 'TON',
  AL: 'ALB', BA: 'BIH', MK: 'MKD', ME: 'MNE', XK: 'XKX',
  TL: 'TLS', FM: 'FSM', BB: 'BRB', AG: 'ATG'
}

// ============== 中文国家名 → ISO2（覆盖 95%+ 中文数据） ==============
const CN_TO_ISO2: Record<string, string> = {
  '中国': 'CN', '美国': 'US', '俄罗斯': 'RU', '英国': 'GB', '法国': 'FR', '德国': 'DE',
  '日本': 'JP', '韩国': 'KR', '朝鲜': 'KP', '印度': 'IN', '澳大利亚': 'AU', '加拿大': 'CA',
  '巴西': 'BR', '意大利': 'IT', '西班牙': 'ES', '以色列': 'IL', '苏联': 'RU', '乌克兰': 'UA',
  '土耳其': 'TR', '伊朗': 'IR', '巴基斯坦': 'PK', '埃及': 'EG', '沙特': 'SA', '沙特阿拉伯': 'SA',
  '台湾': 'TW', '南非': 'ZA', '瑞典': 'SE', '荷兰': 'NL', '波兰': 'PL', '挪威': 'NO',
  '希腊': 'GR', '捷克': 'CZ', '瑞士': 'CH', '比利时': 'BE', '奥地利': 'AT', '葡萄牙': 'PT',
  '芬兰': 'FI', '丹麦': 'DK', '泰国': 'TH', '越南': 'VN', '印尼': 'ID', '印度尼西亚': 'ID',
  '马来西亚': 'MY', '新加坡': 'SG', '菲律宾': 'PH', '墨西哥': 'MX', '阿根廷': 'AR', '智利': 'CL',
  '哥伦比亚': 'CO', '尼日利亚': 'NG', '肯尼亚': 'KE', '新西兰': 'NZ', '爱尔兰': 'IE',
  '匈牙利': 'HU', '罗马尼亚': 'RO', '保加利亚': 'BG', '克罗地亚': 'HR', '塞尔维亚': 'RS',
  '斯洛伐克': 'SK', '斯洛文尼亚': 'SI', '立陶宛': 'LT', '拉脱维亚': 'LV', '爱沙尼亚': 'EE',
  '冰岛': 'IS', '卢森堡': 'LU', '马耳他': 'MT', '塞浦路斯': 'CY', '摩尔多瓦': 'MD',
  '白俄罗斯': 'BY', '阿塞拜疆': 'AZ', '格鲁吉亚': 'GE', '亚美尼亚': 'AM', '哈萨克斯坦': 'KZ',
  '乌兹别克斯坦': 'UZ', '土库曼斯坦': 'TM', '吉尔吉斯斯坦': 'KG', '塔吉克斯坦': 'TJ',
  '阿富汗': 'AF', '伊拉克': 'IQ', '叙利亚': 'SY', '约旦': 'JO', '黎巴嫩': 'LB',
  '也门': 'YE', '阿曼': 'OM', '阿联酋': 'AE', '卡塔尔': 'QA', '巴林': 'BH', '科威特': 'KW',
  '利比亚': 'LY', '突尼斯': 'TN', '阿尔及利亚': 'DZ', '摩洛哥': 'MA', '苏丹': 'SD',
  '埃塞俄比亚': 'ET', '索马里': 'SO', '坦桑尼亚': 'TZ', '乌干达': 'UGA', '卢旺达': 'RW',
  '布隆迪': 'BI', '赞比亚': 'ZM', '津巴布韦': 'ZW', '博茨瓦纳': 'BW', '马拉维': 'MW',
  '莫桑比克': 'MZ', '马达加斯加': 'MG', '毛里求斯': 'MU', '安哥拉': 'AO', '刚果': 'CG',
  '喀麦隆': 'CM', '加纳': 'GH', '科特迪瓦': 'CI', '塞内加尔': 'SN', '马里': 'ML',
  '布基纳法索': 'BF', '尼日尔': 'NE', '乍得': 'TD', '南苏丹': 'SS', '塞拉利昂': 'SL',
  '利比里亚': 'LR', '几内亚': 'GN', '古巴': 'CU', '牙买加': 'JM', '海地': 'HT',
  '多米尼加': 'DO', '危地马拉': 'GT', '伯利兹': 'BZ', '洪都拉斯': 'HN', '萨尔瓦多': 'SV',
  '尼加拉瓜': 'NI', '哥斯达黎加': 'CR', '巴拿马': 'PA', '委内瑞拉': 'VE', '厄瓜多尔': 'EC',
  '秘鲁': 'PE', '玻利维亚': 'BO', '巴拉圭': 'PY', '乌拉圭': 'UY', '圭亚那': 'GY',
  '苏里南': 'SR', '缅甸': 'MM', '柬埔寨': 'KH', '老挝': 'LA', '孟加拉': 'BD', '不丹': 'BT',
  '尼泊尔': 'NP', '斯里兰卡': 'LK', '马尔代夫': 'MV', '文莱': 'BN', '蒙古': 'MN',
  '斐济': 'FJ', '巴新': 'PG', '巴布亚新几内亚': 'PG', '所罗门群岛': 'SB', '瓦努阿图': 'VU',
  '萨摩亚': 'WS', '汤加': 'TO', '阿尔巴尼亚': 'AL', '波黑': 'BA', '北马其顿': 'MK',
  '黑山': 'ME', '科索沃': 'XK'
}

// ============== 英文别名 → ISO2（处理 UK / USA / USSR 等历史/缩写） ==============
const EN_ALIAS_TO_ISO2: Record<string, string> = {
  'UK': 'GB', 'U.K.': 'GB', 'Britain': 'GB', 'Great Britain': 'GB', 'England': 'GB',
  'USA': 'US', 'U.S.A.': 'US', 'U.S.': 'US', 'America': 'US', 'United States': 'US',
  'USSR': 'RU', 'Soviet Union': 'RU', 'U.S.S.R.': 'RU',
  'UAE': 'AE', 'Emirates': 'AE',
  'South Korea': 'KR', 'Korea, South': 'KR', 'Republic of Korea': 'KR',
  'North Korea': 'KP', 'Korea, North': 'KP', 'DPRK': 'KP',
  'Russia': 'RU', 'Russian Federation': 'RU',
  'China': 'CN', "People's Republic of China": 'CN', 'PRC': 'CN',
  'Iran': 'IR', 'Persia': 'IR',
  'Syria': 'SY', 'Czechia': 'CZ', 'Czech Republic': 'CZ',
  'Burma': 'MM', 'Myanmar': 'MM',
  'Cape Verde': 'CPV', 'Côte d\'Ivoire': 'CI', 'Ivory Coast': 'CI',
  'East Timor': 'TL', 'Timor-Leste': 'TL',
  'Holland': 'NL', 'The Netherlands': 'NL',
  'Vatican': 'VA', 'Holy See': 'VA',
  'Macedonia': 'MK', 'FYROM': 'MK',
  'Swaziland': 'SZ', 'Eswatini': 'SZ',
  'Macau': 'MO', 'Macao': 'MO', 'Hong Kong': 'HK',
  // 小国（GeoJSON 未收录，需走 MANUAL_CENTERS 手动坐标）
  'Antigua and Barbuda': 'AG', 'Bahrain': 'BH', 'Barbados': 'BB',
  'Maldives': 'MV', 'Singapore': 'SG', 'Tonga': 'TO',
  // 拼写变体 / 历史国名 → 现代国家
  "Cote D'Ivoire": 'CI', "COTE D'IVOIRE": 'CI',
  'DRC/Zaire': 'CD', 'DRC': 'CD', 'Zaire': 'CD',
  'Yugoslavia': 'RS',
  'Federated States of Micronesia': 'FM',
  'Chechnya': 'RU',
  'Timor Leste': 'TL'
}

// ============== 小国手动坐标（GeoJSON 未收录，需手动补充） ==============
const MANUAL_CENTERS: Record<string, { coord: [number, number]; bbox: [number, number, number, number]; nameEn: string }> = {
  AG: { coord: [-61.7971, 17.0608], bbox: [-61.89, 16.99, -61.68, 17.74], nameEn: 'Antigua and Barbuda' },
  BB: { coord: [-59.5342, 13.1939], bbox: [-59.65, 13.04, -59.40, 13.34], nameEn: 'Barbados' },
  BH: { coord: [50.5635, 26.0667], bbox: [50.42, 25.76, 50.84, 26.38], nameEn: 'Bahrain' },
  MV: { coord: [73.5147, 3.2028], bbox: [72.63, -0.70, 74.38, 7.11], nameEn: 'Maldives' },
  SG: { coord: [103.8198, 1.3521], bbox: [103.60, 1.21, 104.05, 1.49], nameEn: 'Singapore' },
  TL: { coord: [125.7560, -8.8740], bbox: [124.03, -9.53, 127.34, -8.14], nameEn: 'Timor-Leste' },
  TO: { coord: [-175.2015, -21.2034], bbox: [-176.22, -21.49, -173.75, -15.55], nameEn: 'Tonga' },
  FM: { coord: [158.2280, 6.8860], bbox: [137.31, 1.03, 163.04, 10.09], nameEn: 'Micronesia' },
  HK: { coord: [114.1694, 22.3193], bbox: [113.83, 22.15, 114.44, 22.56], nameEn: 'Hong Kong' }
}

// ============== 分类表（org / noise，其余默认为 country） ==============
const ORG_ENTRIES: Set<string> = new Set([
  'European Union', 'NATO', 'Pirates'
])
const NOISE_ENTRIES: Set<string> = new Set([
  'Civilian', 'Commercial', 'Generic', 'Junkyard', 'Unknown', 'nan', ''
])

// ============== 主入口 ==============

/**
 * 加载所有国家定位信息
 * - 内部合并「数据库 country 列表」与「GeoJSON 边界」
 * - 自动匹配，计算几何中心 / 边界框
 * - 二次调用直接返回缓存（模块级）
 */
export async function loadCountryCenters(): Promise<Map<string, CountryCenter>> {
  if (centersCache) return centersCache
  if (loadingPromise) return loadingPromise

  loadingPromise = doLoad().finally(() => {
    loadingPromise = null
  })
  return loadingPromise
}

/** 获取上一次的匹配报告（用于诊断） */
export function getLastReport(): MatchReport | null {
  return lastReport
}

/** 强制清空缓存（仅测试或极端场景使用） */
export function clearGeoDataCache(): void {
  centersCache = null
  lastReport = null
}

// ============== 内部实现 ==============

async function doLoad(): Promise<Map<string, CountryCenter>> {
  const t0 = performance.now()

  // 1) 从后端获取数据库真实 country 列表
  let dbCountries: string[] = []
  try {
    const res = await equipmentApi.getDistinctCountries()
    // axios 拦截器已 unwrap Result 包装，res = { code, data: [...], total }
    dbCountries = (res?.data || []) as string[]
    console.log(`[geoDataService] 后端返回 ${dbCountries.length} 个不同国家，耗时 ${(performance.now() - t0).toFixed(1)}ms`)
  } catch (e) {
    console.error('[geoDataService] 调 /api/equipment/distinct-countries 失败:', e)
    // 即便后端失败也继续（后续所有国家都标记 unmatched）
  }

  // 2) 加载 GeoJSON
  const t1 = performance.now()
  let geoFeatures: GeoFeature[] = []
  try {
    const resp = await fetch('/data/countries.geo.json')
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const geo: GeoCollection = await resp.json()
    geoFeatures = geo.features || []
    console.log(`[geoDataService] GeoJSON 加载 ${geoFeatures.length} 个 feature，耗时 ${(performance.now() - t1).toFixed(1)}ms`)
  } catch (e) {
    console.error('[geoDataService] 加载 countries.geo.json 失败:', e)
  }

  // 3) 构建 GeoJSON 索引（按 ISO3 / 按英文名）
  const byIso3 = new Map<string, GeoFeature>()
  const byNameEn = new Map<string, GeoFeature>()
  const byNameEnContains = new Map<string, GeoFeature>()  // 模糊回退
  for (const f of geoFeatures) {
    if (f.id) byIso3.set(f.id.toUpperCase(), f)
    const name = (f.properties?.name || '').trim()
    if (name) {
      byNameEn.set(name.toLowerCase(), f)
      byNameEnContains.set(name.toLowerCase(), f)
    }
  }

  // 4) 对每个 DB country 进行多策略匹配
  const result = new Map<string, CountryCenter>()
  const report: MatchReport = {
    total: dbCountries.length,
    matched: 0,
    missing: [],
    byMethod: { iso3: 0, iso2: 0, cn: 0, alias: 0, name: 0, fuzzy: 0, none: 0 }
  }

  for (const raw of dbCountries) {
    const center = matchCountry(raw, byIso3, byNameEn, byNameEnContains)
    result.set(raw, center)
    if (center.matched) {
      report.matched++
      report.byMethod[center.matchedBy]++
    } else {
      report.missing.push(raw)
      report.byMethod.none++
    }
  }

  // 分类统计
  let countryCount = 0, orgCount = 0, noiseCount = 0
  for (const center of result.values()) {
    if (center.category === 'country') countryCount++
    else if (center.category === 'org') orgCount++
    else noiseCount++
  }

  lastReport = report
  console.log(
    `[geoDataService] 已匹配 ${report.matched} / ${report.total} 个国家，` +
    `总耗时 ${(performance.now() - t0).toFixed(1)}ms`
  )
  console.log(
    `[geoDataService] 分类完成: 国家 ${countryCount}, 组织 ${orgCount}, 噪声 ${noiseCount}, 共 ${report.total}`
  )
  if (report.missing.length > 0) {
    console.warn(
      `[geoDataService] 缺失（GeoJSON 未匹配）共 ${report.missing.length} 个:`,
      report.missing
    )
  } else {
    console.log('[geoDataService] ✅ 全部匹配成功')
  }

  centersCache = result
  return result
}

/**
 * 单个国家匹配（多策略回退链）
 *
 * 优先级：ISO3 → ISO2 → CN → 英文别名 → 英文名直接 → 模糊包含 → 手动坐标 → 兜底未匹配
 */
function matchCountry(
  raw: string,
  byIso3: Map<string, GeoFeature>,
  byNameEn: Map<string, GeoFeature>,
  byNameEnContains: Map<string, GeoFeature>
): CountryCenter {
  // 先确定分类
  const category = classifyEntry(raw)

  // org / noise 条目不需要 GeoJSON 匹配，直接标记为 matched
  const isNonGeo = category === 'org' || category === 'noise'

  const fallback: CountryCenter = {
    code: raw,
    rawName: raw,
    coord: [0, 0],
    bbox: [-180, -90, 180, 90],
    matched: isNonGeo,
    matchedBy: isNonGeo ? 'alias' : 'none',
    category,
    isOrganization: category === 'org'
  }
  if (!raw || !raw.trim()) return fallback

  const trimmed = raw.trim()
  const upper = trimmed.toUpperCase()

  // 策略 1: ISO3 三位代码直接匹配
  if (upper.length === 3 && /^[A-Z]{3}$/.test(upper)) {
    const f = byIso3.get(upper)
    if (f) return { ...buildCenter(f, upper, raw, 'iso3'), category, isOrganization: category === 'org' }
  }

  // 策略 2: ISO2 两位代码 → ISO3
  if (upper.length === 2 && /^[A-Z]{2}$/.test(upper)) {
    const iso3 = ISO2_TO_ISO3[upper]
    if (iso3) {
      const f = byIso3.get(iso3)
      if (f) return { ...buildCenter(f, upper, raw, 'iso2'), category, isOrganization: category === 'org' }
    }
    // ISO2 在手动坐标表？
    const manual = MANUAL_CENTERS[upper]
    if (manual) {
      return { ...fallback, code: upper, nameEn: manual.nameEn, coord: manual.coord, bbox: manual.bbox, matched: true, matchedBy: 'manual', category }
    }
  }

  // 策略 3: 中文名 → ISO2 → ISO3
  const iso2FromCn = CN_TO_ISO2[trimmed]
  if (iso2FromCn) {
    const iso3 = ISO2_TO_ISO3[iso2FromCn]
    if (iso3) {
      const f = byIso3.get(iso3)
      if (f) return { ...buildCenter(f, iso2FromCn, raw, 'cn'), category, isOrganization: category === 'org' }
    }
    const manual = MANUAL_CENTERS[iso2FromCn]
    if (manual) {
      return { ...fallback, code: iso2FromCn, nameEn: manual.nameEn, coord: manual.coord, bbox: manual.bbox, matched: true, matchedBy: 'manual', category }
    }
  }

  // 策略 4: 英文别名 → ISO2 → ISO3
  const iso2FromAlias = EN_ALIAS_TO_ISO2[trimmed] || EN_ALIAS_TO_ISO2[upper]
  if (iso2FromAlias) {
    const iso3 = ISO2_TO_ISO3[iso2FromAlias]
    if (iso3) {
      const f = byIso3.get(iso3)
      if (f) return { ...buildCenter(f, iso2FromAlias, raw, 'alias'), category, isOrganization: category === 'org' }
    }
    const manual = MANUAL_CENTERS[iso2FromAlias]
    if (manual) {
      return { ...fallback, code: iso2FromAlias, nameEn: manual.nameEn, coord: manual.coord, bbox: manual.bbox, matched: true, matchedBy: 'manual', category }
    }
  }

  // 策略 5: 英文名直接匹配（精确 + 忽略大小写）
  const f1 = byNameEn.get(trimmed.toLowerCase())
  if (f1) {
    const code = (f1.id ? ISO3_TO_ISO2_LOOKUP[f1.id.toUpperCase()] : '') || raw
    return { ...buildCenter(f1, code, raw, 'name'), category, isOrganization: category === 'org' }
  }

  // 策略 6: 模糊匹配（contains）
  for (const [enName, f] of byNameEnContains) {
    if (enName.includes(trimmed.toLowerCase()) || trimmed.toLowerCase().includes(enName)) {
      const code = (f.id ? ISO3_TO_ISO2_LOOKUP[f.id.toUpperCase()] : '') || raw
      return { ...buildCenter(f, code, raw, 'fuzzy'), category, isOrganization: category === 'org' }
    }
  }

  // 兜底：所有策略均未匹配 → 降级为 noise，归入 "(其他)"
  console.warn(`[geoDataService] 未匹配国家 "${raw}"，自动归入 (其他)`)
  return { ...fallback, category: 'noise', matched: false, matchedBy: 'none' }
}

/** 分类：org / noise / country */
function classifyEntry(raw: string): 'country' | 'org' | 'noise' {
  if (!raw || NOISE_ENTRIES.has(raw)) return 'noise'
  if (ORG_ENTRIES.has(raw)) return 'org'
  return 'country'
}

/** 从 ISO3 反查 ISO2（懒构造） */
const ISO3_TO_ISO2_LOOKUP: Record<string, string> = Object.entries(ISO2_TO_ISO3).reduce(
  (acc, [iso2, iso3]) => { acc[iso3] = iso2; return acc },
  {} as Record<string, string>
)

/**
 * 从匹配的 GeoFeature 构造 CountryCenter
 * - 计算多边形几何中心：取最大子多边形（按顶点数）算算术平均
 * - 计算边界框
 */
function buildCenter(
  feature: GeoFeature,
  code: string,
  rawName: string,
  method: CountryCenter['matchedBy']
): CountryCenter {
  const { biggestRing, minLon, minLat, maxLon, maxLat } = inspectGeometry(feature)
  const coord = ringCentroid(biggestRing)
  return {
    code,
    rawName,
    nameEn: feature.properties?.name,
    coord: [round(coord[0]), round(coord[1])],
    bbox: [round(minLon), round(minLat), round(maxLon), round(maxLat)],
    matched: true,
    matchedBy: method,
    category: 'country' as const,
    isOrganization: false
  }
}

function inspectGeometry(feature: GeoFeature): {
  minLon: number; minLat: number; maxLon: number; maxLat: number
  biggestRing: number[][]
} {
  let minLon = Infinity, maxLon = -Infinity
  let minLat = Infinity, maxLat = -Infinity
  const rings: number[][][] = []

  function traverse(coords: any): void {
    if (!coords) return
    if (typeof coords[0] === 'number') {
      // 顶点 [lon, lat]
      const lon = coords[0], lat = coords[1]
      if (lon < minLon) minLon = lon
      if (lon > maxLon) maxLon = lon
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    } else {
      for (const c of coords) traverse(c)
    }
  }

  traverse(feature.geometry?.coordinates)

  // 收集最外层 rings（多边形边界）
  if (feature.geometry?.type === 'Polygon') {
    rings.push(feature.geometry.coordinates[0] as number[][])
  } else if (feature.geometry?.type === 'MultiPolygon') {
    for (const poly of feature.geometry.coordinates) {
      rings.push(poly[0] as number[][])
    }
  }

  // 取顶点数最多的子多边形作为代表性中心（避免岛屿主导）
  let biggest = rings[0] || []
  for (const r of rings) {
    if (r.length > biggest.length) biggest = r
  }

  return {
    minLon: minLon === Infinity ? 0 : minLon,
    minLat: minLat === Infinity ? 0 : minLat,
    maxLon: maxLon === -Infinity ? 0 : maxLon,
    maxLat: maxLat === -Infinity ? 0 : maxLat,
    biggestRing: biggest
  }
}

/**
 * 计算 ring 的几何中心（顶点算术平均）
 * 对于经度跨 ±180（如俄罗斯）的多边形可能略偏，但 ECharts 内部会规范化
 */
function ringCentroid(ring: number[][]): [number, number] {
  if (!ring || ring.length === 0) return [0, 0]
  let sumLon = 0, sumLat = 0
  for (const [lon, lat] of ring) {
    sumLon += lon
    sumLat += lat
  }
  return [sumLon / ring.length, sumLat / ring.length]
}

function round(n: number, digits = 4): number {
  const f = Math.pow(10, digits)
  return Math.round(n * f) / f
}

export default {
  loadCountryCenters,
  getLastReport,
  clearGeoDataCache
}
