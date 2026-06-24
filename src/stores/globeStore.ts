/**
 * globeStore.ts
 * 全球视图状态管理
 *
 * 数据策略：
 *  - 从后端 /api/equipment/list 获取全量数据（size=30000）
 *  - 从后端 /api/equipment/distinct-countries 获取国家列表（5 分钟内存缓存）
 *  - 从 /data/countries.geo.json 动态计算每个国家坐标（替代硬编码 COUNTRY_COORDS）
 *  - 国家数 / 国家列表完全由数据管理页 CSV 导入结果驱动，**不在前端写死任何数字**
 *  - 缓存全量数据，避免重复请求
 */
import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import { eventBus, Events } from '@/utils/EventBus'
import { equipmentApi } from '@/api/equipment'
import type { Country, EquipmentStats, Equipment } from '@/types'
import { loadCountryCenters, type CountryCenter } from '@/utils/geoDataService'

// 仅保留用于 UI 显示（不写死国家数；缺失时为空）
// 实际定位 / 覆盖范围已由 geoDataService + GeoJSON 动态计算
const COUNTRY_FLAGS: Record<string, string> = {
  CN: '🇨🇳', US: '🇺🇸', RU: '🇷🇺', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', JP: '🇯🇵',
  KR: '🇰🇷', IN: '🇮🇳', AU: '🇦🇺', CA: '🇨🇦', BR: '🇧🇷', IT: '🇮🇹', ES: '🇪🇸',
  IL: '🇮🇱', SU: '☭', UA: '🇺🇦', TR: '🇹🇷', IR: '🇮🇷', PK: '🇵🇰', EG: '🇪🇬',
  SA: '🇸🇦', TW: '🇹🇼', KP: '🇰🇵', ZA: '🇿🇦', SE: '🇸🇪', NL: '🇳🇱', PL: '🇵🇱',
  NO: '🇳🇴', GR: '🇬🇷', CZ: '🇨🇿', CH: '🇨🇭', BE: '🇧🇪', AT: '🇦🇹', PT: '🇵🇹',
  FI: '🇫🇮', DK: '🇩🇰', TH: '🇹🇭', VN: '🇻🇳', ID: '🇮🇩', MY: '🇲🇾', SG: '🇸🇬',
  PH: '🇵🇭', MX: '🇲🇽', AR: '🇦🇷', CL: '🇨🇱', CO: '🇨🇴', NG: '🇳🇬', KE: '🇰🇪'
}

// 国家代码 → 中文名称映射表（覆盖全量国家，确保无英文残留）
const COUNTRY_CODE_TO_CN: Record<string, string> = {
  // 核心大国
  CN: '中国', US: '美国', RU: '俄罗斯', GB: '英国', FR: '法国', DE: '德国', JP: '日本',
  KR: '韩国', IN: '印度', AU: '澳大利亚', CA: '加拿大', BR: '巴西', IT: '意大利', ES: '西班牙',
  
  // 中东地区
  IL: '以色列', SU: '苏联', UA: '乌克兰', TR: '土耳其', IR: '伊朗', PK: '巴基斯坦', EG: '埃及',
  SA: '沙特', TW: '台湾', KP: '朝鲜', ZA: '南非', SE: '瑞典', NL: '荷兰', PL: '波兰',
  
  // 欧洲国家
  NO: '挪威', GR: '希腊', CZ: '捷克', CH: '瑞士', BE: '比利时', AT: '奥地利', PT: '葡萄牙',
  FI: '芬兰', DK: '丹麦', IE: '爱尔兰', HU: '匈牙利', RO: '罗马尼亚', BG: '保加利亚',
  HR: '克罗地亚', RS: '塞尔维亚', SK: '斯洛伐克', SI: '斯洛文尼亚', LT: '立陶宛',
  LV: '拉脱维亚', EE: '爱沙尼亚', IS: '冰岛', LU: '卢森堡', MT: '马耳他', CY: '塞浦路斯',
  MD: '摩尔多瓦', BY: '白俄罗斯', AL: '阿尔巴尼亚', BA: '波黑', MK: '北马其顿', ME: '黑山',
  XK: '科索沃',
  
  // 亚洲国家
  TH: '泰国', VN: '越南', ID: '印尼', MY: '马来西亚', SG: '新加坡', PH: '菲律宾',
  MM: '缅甸', KH: '柬埔寨', LA: '老挝', BD: '孟加拉', BT: '不丹', NP: '尼泊尔',
  LK: '斯里兰卡', MV: '马尔代夫', BN: '文莱', MN: '蒙古', KZ: '哈萨克斯坦',
  UZ: '乌兹别克斯坦', TM: '土库曼斯坦', KG: '吉尔吉斯斯坦', TJ: '塔吉克斯坦',
  AF: '阿富汗', IQ: '伊拉克', SY: '叙利亚', JO: '约旦', LB: '黎巴嫩', YE: '也门',
  OM: '阿曼', AE: '阿联酋', QA: '卡塔尔', BH: '巴林', KW: '科威特',
  
  // 非洲国家
  NG: '尼日利亚', KE: '肯尼亚', ET: '埃塞俄比亚', SO: '索马里', TZ: '坦桑尼亚',
  UG: '乌干达', RW: '卢旺达', BI: '布隆迪', ZM: '赞比亚', ZW: '津巴布韦',
  BW: '博茨瓦纳', MW: '马拉维', MZ: '莫桑比克', MG: '马达加斯加', MU: '毛里求斯',
  AO: '安哥拉', CD: '刚果(金)', CG: '刚果', CM: '喀麦隆', GH: '加纳', CI: '科特迪瓦',
  SN: '塞内加尔', ML: '马里', BF: '布基纳法索', NE: '尼日尔', TD: '乍得',
  SD: '苏丹', SS: '南苏丹', SL: '塞拉利昂', LR: '利比里亚', GN: '几内亚',
  LY: '利比亚', TN: '突尼斯', DZ: '阿尔及利亚', MA: '摩洛哥',
  
  // 北美洲国家
  MX: '墨西哥', CU: '古巴', JM: '牙买加', HT: '海地', DO: '多米尼加',
  GT: '危地马拉', BZ: '伯利兹', HN: '洪都拉斯', SV: '萨尔瓦多', NI: '尼加拉瓜',
  CR: '哥斯达黎加', PA: '巴拿马', AG: '安提瓜和巴布达', BB: '巴巴多斯',
  
  // 南美洲国家
  AR: '阿根廷', CL: '智利', CO: '哥伦比亚', VE: '委内瑞拉', EC: '厄瓜多尔',
  PE: '秘鲁', BO: '玻利维亚', PY: '巴拉圭', UY: '乌拉圭', GY: '圭亚那', SR: '苏里南',
  
  // 大洋洲国家
  NZ: '新西兰', FJ: '斐济', PG: '巴布亚新几内亚', SB: '所罗门群岛', VU: '瓦努阿图',
  WS: '萨摩亚', TO: '汤加', FM: '密克罗尼西亚', TL: '东帝汶',
  
  // 其他
  HK: '香港', MO: '澳门'
}

export const useGlobeStore = defineStore('globe', () => {
  // ========== 状态 ==========
  const countries = ref<Country[]>([])
  const currentCountry = ref<Country | null>(null)
  const currentStats = ref<EquipmentStats | null>(null)
  const isFlying = ref(false)
  const cameraState = ref({
    targetCoord: [0, 0] as [number, number],
    distance: 240,
    autoRotate: true
  })

  // 类型筛选状态
  const activeType = ref<string | null>(null) // null = 全部
  // 年份范围筛选
  const yearRange = ref<[number, number]>([1940, 2030])

  // 全量装备数据缓存（shallowRef 减少大数据的响应式开销）
  const allEquipmentCache = shallowRef<Equipment[]>([])
  let cacheLoaded = false
  let loadingPromise: Promise<void> | null = null // 防止重复加载

  // 国家定位表（Map<rawDbName, CountryCenter>），由 geoDataService 提供
  // 不需要响应式：仅在 _doLoadCountries 中填充，在 computed / 方法中只读
  let centersMap: Map<string, CountryCenter> = new Map()

  // ========== 计算属性 ==========
  const filteredCountries = computed(() =>
    countries.value.filter(c => c.equipmentCount > 0)
  )

  const totalCountries = computed(() => countries.value.length)

  // 装备总数（优先使用 API 数据，回退到缓存长度）
  const _totalFromApi = ref(0)
  const totalEquipment = computed(() => _totalFromApi.value || allEquipmentCache.value.length)

  // 按类型统计（优先使用 stats API 数据，回退到全量数据计算）
  const _typeStatsFromApi = ref<Record<string, number>>({})
  const typeStats = computed(() => {
    // 如果 API 已返回类型统计数据，直接使用
    if (Object.keys(_typeStatsFromApi.value).length > 0) {
      return _typeStatsFromApi.value
    }
    // 回退：从全量缓存计算
    const stats: Record<string, number> = {}
    for (const item of allEquipmentCache.value) {
      const type = item.type || 'Other'
      stats[type] = (stats[type] || 0) + 1
    }
    return stats
  })

  // 国家坐标映射（code → [lon, lat]），供 GlobeViewer 等组件使用
  const countryCoords = computed(() => {
    const map: Record<string, [number, number]> = {}
    for (const c of countries.value) {
      map[c.code] = c.coord
    }
    return map
  })

  // 国家英文名映射（code → nameEn），供 GlobeViewer 等组件使用
  const countryNameMap = computed(() => {
    const map: Record<string, string> = {}
    for (const c of countries.value) {
      if (c.nameEn) map[c.code] = c.nameEn
    }
    return map
  })

  // 筛选后的国家列表（按当前类型和年份重新计算装备数量）
  const displayCountries = computed(() => {
    if (!activeType.value && yearRange.value[0] === 1940 && yearRange.value[1] === 2030) {
      return countries.value
    }

    const filtered = allEquipmentCache.value.filter(item => {
      // 类型筛选
      if (activeType.value && item.type !== activeType.value) return false
      // 年份筛选
      if (item.year) {
        const y = Number(item.year)
        if (y < yearRange.value[0] || y > yearRange.value[1]) return false
      }
      return true
    })

    // 重新按国家（code）统计
    const countryMap = new Map<string, number>()
    filtered.forEach(item => {
      const center = centersMap.get(item.country || '')
      if (!center || !center.matched) return
      countryMap.set(center.code, (countryMap.get(center.code) || 0) + 1)
    })

    return countries.value
      .map(c => ({
        ...c,
        equipmentCount: countryMap.get(c.code) || 0
      }))
      .filter(c => c.equipmentCount > 0)
      .sort((a, b) => b.equipmentCount - a.equipmentCount)
  })

  // ========== 方法：加载全量装备数据（轻量字段，适合 cpolar 低带宽） ==========
  async function fetchAllEquipment(): Promise<Equipment[]> {
    if (cacheLoaded && allEquipmentCache.value.length > 0) {
      console.log('[globeStore] 使用缓存数据，共', allEquipmentCache.value.length, '条')
      return allEquipmentCache.value
    }

    try {
      console.log('[globeStore] 开始获取装备轻量数据...')
      const startTime = Date.now()

      const res = await equipmentApi.getLightweight()
      const records = (res.data || []) as Equipment[]
      allEquipmentCache.value = records
      cacheLoaded = true
      console.log('[globeStore] 轻量数据加载完成，耗时', Date.now() - startTime, 'ms，共', records.length, '条')

      return allEquipmentCache.value
    } catch (e) {
      console.warn('[globeStore] 轻量接口失败，回退到 getAll:', e)
      try {
        const res = await equipmentApi.getAll(60000)
        const records = (res.data || []) as Equipment[]
        allEquipmentCache.value = records
        cacheLoaded = true
        return allEquipmentCache.value
      } catch (e2) {
        console.error('[globeStore] 回退也失败:', e2)
        return []
      }
    }
  }

  // ========== 方法：加载国家列表 ==========
  async function loadCountries() {
    // 防止重复加载：如果正在加载中，复用同一个 Promise
    if (loadingPromise) {
      console.log('[globeStore] 数据正在加载中，等待完成...')
      return loadingPromise
    }
    // 如果已加载完成，直接返回
    if (countries.value.length > 0) {
      console.log('[globeStore] 数据已加载，跳过')
      return
    }

    loadingPromise = _doLoadCountries()
    try {
      await loadingPromise
    } finally {
      loadingPromise = null
    }
  }

  async function _doLoadCountries() {
    try {
      console.log('[globeStore] 开始加载国家摘要数据')
      const startTime = Date.now()

      // 并行获取：国家摘要 + GeoJSON 国家定位 + 全量装备数据（供类型筛选）
      const [summaryRes, centers] = await Promise.all([
        equipmentApi.getCountriesSummary(),
        loadCountryCenters(),
        fetchAllEquipment()
      ])
      centersMap = centers

      const summaryData = summaryRes.data || []
      if (summaryData.length === 0) {
        console.warn('[globeStore] 无国家数据，国家列表置空')
        countries.value = []
        eventBus.emit(Events.DATA_LOADED, { type: 'countries', count: 0 })
        return
      }

      console.log('[globeStore] 国家摘要加载完成，耗时', Date.now() - startTime, 'ms，共', summaryData.length, '个国家')

      // 异步统计，避免阻塞主线程
      await new Promise(resolve => setTimeout(resolve, 0))

      // 按匹配 code 聚合（"US" + "United States" 会合并为同一条）
      const countryMap = new Map<string, {
        code: string; name: string; nameEn: string; coord: [number, number]
        equipmentCount: number; isOrganization?: boolean
      }>()

      let matchedCount = 0
      let unmatchedCount = 0
      const unmatchedSample: string[] = []

      // summaryData: [{country: "US", count: 5000}, ...]
      summaryData.forEach((item: any) => {
        const countryName = item.country || ''
        const count = item.count || 0
        const center = centersMap.get(countryName)

        // center 不存在（DB 有但 geoDataService 没返回）→ 归入 "(其他)"
        if (!center) {
          if (!countryMap.has('__noise__')) {
            countryMap.set('__noise__', {
              code: '__noise__',
              name: '(其他)',
              nameEn: 'Other',
              coord: [0, 0] as [number, number],
              equipmentCount: 0
            })
          }
          countryMap.get('__noise__')!.equipmentCount += count
          unmatchedCount++
          if (unmatchedSample.length < 10) unmatchedSample.push(countryName || '(空)')
          return
        }

        // noise 类归入 "(其他)"
        if (center.category === 'noise') {
          if (!countryMap.has('__noise__')) {
            countryMap.set('__noise__', {
              code: '__noise__',
              name: '(其他)',
              nameEn: 'Other',
              coord: [0, 0] as [number, number],
              equipmentCount: 0
            })
          }
          countryMap.get('__noise__')!.equipmentCount += count
          matchedCount++
          return
        }

        // org / country 正常聚合
        matchedCount++

        if (!countryMap.has(center.code)) {
          countryMap.set(center.code, {
            code: center.code,
            name: COUNTRY_CODE_TO_CN[center.code] || center.nameEn || center.code,
            nameEn: center.nameEn || center.rawName,
            coord: center.coord,
            equipmentCount: 0,
            isOrganization: center.isOrganization || false
          })
        }
        countryMap.get(center.code)!.equipmentCount += count
      })

      countries.value = Array.from(countryMap.values())
        .map(c => ({
          code: c.code,
          name: c.name,
          nameEn: c.nameEn,
          coord: c.coord,
          equipmentCount: c.equipmentCount,
          flag: COUNTRY_FLAGS[c.code] || '',
          isOrganization: c.isOrganization || false
        }))
        .sort((a, b) => b.equipmentCount - a.equipmentCount)

      console.log(
        `[globeStore] 国家统计完成：共 ${countries.value.length} 个国家，` +
        `匹配装备 ${matchedCount} 条，未匹配 ${unmatchedCount} 条，总耗时 ${Date.now() - startTime} ms`
      )
      if (unmatchedCount > 0) {
        console.warn(
          `[globeStore] 未匹配的国家（前 10 个示例）:`, unmatchedSample,
          '— 详细列表见 [geoDataService] 缺失日志'
        )
      }

      eventBus.emit(Events.DATA_LOADED, { type: 'countries', count: countries.value.length })

      // 异步加载类型统计数据（轻量 API），不阻塞国家列表渲染
      loadTypeStats()
    } catch (e) {
      console.error('[globeStore] 加载国家列表失败:', e)
      countries.value = []
      eventBus.emit(Events.DATA_LOADED, { type: 'countries', count: 0 })
    }
  }

  // ========== 方法：加载类型统计数据（轻量 API） ==========
  async function loadTypeStats() {
    try {
      const res = await equipmentApi.getStats()
      if (res.code === 200 && res.data) {
        const byType = res.data.byType || []
        const statsMap: Record<string, number> = {}
        for (const item of byType) {
          statsMap[item.type || 'Other'] = item.count || 0
        }
        _typeStatsFromApi.value = statsMap
        _totalFromApi.value = res.data.total || 0
        console.log('[globeStore] 类型统计加载完成，共', Object.keys(statsMap).length, '种类型，总计', _totalFromApi.value, '条')
      }
    } catch (e) {
      console.warn('[globeStore] 类型统计加载失败，回退到全量数据计算:', e)
    }
  }

  // ========== 方法：选择国家 ==========
  async function selectCountry(countryCode: string) {
    const country = countries.value.find(c => c.code === countryCode)
    if (!country) {
      console.warn('[globeStore] 未找到国家代码:', countryCode)
      return
    }

    console.log('[globeStore] 选择国家:', country.name, country.code, '坐标:', country.coord)
    eventBus.emit(Events.COUNTRY_SELECTED, country)

    try {
      // 找到所有 centersMap 中 code === countryCode 的 rawName（原始数据库country字段值）
      const rawNames: string[] = []
      centersMap.forEach((center, rawName) => {
        if (center.code === countryCode) {
          rawNames.push(rawName)
        }
      })

      if (rawNames.length === 0) {
        console.warn('[globeStore] 未找到国家对应的原始country字段:', countryCode)
        currentStats.value = { rawTotal: 0, total: 0, byType: {}, byYear: {}, topEquipment: [] }
        currentCountry.value = country
        eventBus.emit(Events.PANEL_OPEN, { country, stats: currentStats.value })
        return
      }

      console.log('[globeStore] 国家', country.name, '对应的原始country字段:', rawNames)

      // 对每个 rawName 调用 getCountryStats，然后合并结果
      const statsPromises = rawNames.map(rawName => equipmentApi.getCountryStats(rawName))
      const statsResults = await Promise.all(statsPromises)

      // 合并统计数据
      let rawTotal = 0
      const byType: Record<string, number> = {}
      const byYear: Record<string, number> = {}
      const topEquipmentList: any[] = []

      statsResults.forEach((res: any) => {
        const data = res.data || {}
        rawTotal += (data.total || 0)

        // 合并类型统计
        const typeStats = data.byType || []
        typeStats.forEach((item: any) => {
          const type = item.type || 'Other'
          byType[type] = (byType[type] || 0) + (item.count || 0)
        })

        // 合并年份统计
        const yearStats = data.byYear || []
        yearStats.forEach((item: any) => {
          const decade = item.decade || ''
          byYear[decade] = (byYear[decade] || 0) + (item.count || 0)
        })

        // 合并最新装备列表
        const topList = data.topEquipment || []
        topEquipmentList.push(...topList)
      })

      // 最新装备按年份排序，取 TOP 20
      const topEquipment = topEquipmentList
        .sort((a: any, b: any) => (b.year || 0) - (a.year || 0))
        .slice(0, 20)

      console.log('[globeStore] 国家', country.name, '统计完成: 总数', rawTotal, '条')

      const stats: EquipmentStats = {
        rawTotal: rawTotal,
        total: rawTotal, // 无筛选时 total = rawTotal
        byType,
        byYear,
        topEquipment
      }

      currentStats.value = stats
      currentCountry.value = country
      eventBus.emit(Events.PANEL_OPEN, { country, stats })

      console.log('[globeStore] 国家', country.name, '统计完成:', stats.total, '条装备,', Object.keys(byType).length, '种类型')
    } catch (error) {
      console.error('[globeStore] selectCountry 失败:', error)
      // 失败时显示空统计
      currentStats.value = { rawTotal: 0, total: 0, byType: {}, byYear: {}, topEquipment: [] }
      currentCountry.value = country
      eventBus.emit(Events.PANEL_OPEN, { country, stats: currentStats.value })
    }
  }

  // ========== 方法：设置类型筛选 ==========
  function setActiveType(type: string | null) {
    console.log('[globeStore] 类型筛选:', type || '全部', type ? `共 ${typeStats.value[type] || 0} 条` : '')
    activeType.value = type
    // 如果当前有选中国家，重新计算统计
    if (currentCountry.value) {
      selectCountry(currentCountry.value.code)
    }
  }

  // ========== 方法：设置年份范围 ==========
  function setYearRange(range: [number, number]) {
    console.log('[globeStore] 年份范围:', range)
    yearRange.value = range
    if (currentCountry.value) {
      selectCountry(currentCountry.value.code)
    }
  }

  // ========== 方法：重置视图 ==========
  function resetView() {
    console.log('[globeStore] 重置视图')
    currentCountry.value = null
    currentStats.value = null
    eventBus.emit(Events.RESET_VIEW)
    eventBus.emit(Events.PANEL_CLOSE)
  }

  // ========== 方法：清除缓存 ==========
  function clearCache() {
    allEquipmentCache.value = []
    cacheLoaded = false
    countries.value = []
    loadingPromise = null
    _typeStatsFromApi.value = {}
    _totalFromApi.value = 0
    console.log('[globeStore] 缓存已清除')
  }

  // ========== 监听数据更新事件，自动清除缓存 ==========

  // 监听数据导入完成事件 → 清除缓存
  eventBus.on(Events.DATA_IMPORTED, () => {
    console.log('[globeStore] 📦 数据导入完成，清除缓存')
    clearCache()
  })

  // 监听数据清空事件 → 清除缓存
  eventBus.on(Events.DATA_CLEARED, () => {
    console.log('[globeStore] 🗑️ 数据已清空，清除缓存')
    clearCache()
  })

  // 监听数据删除事件 → 清除缓存
  eventBus.on(Events.DATA_DELETED, () => {
    console.log('[globeStore] 🗑️ 数据已删除，清除缓存')
    clearCache()
  })

  // ========== 方法：定位参数动态化 ==========
  function calculateViewParams(
    coord: [number, number],
    bbox?: { minLon: number; maxLon: number; minLat: number; maxLat: number }
  ): { alpha: number; beta: number; distance: number } {
    const [lon, lat] = coord
    // [P0-2.9 修复] alpha = 经度, beta = 90 - 纬度（ECharts globe 定位公式）
    // beta 范围 0~180：0=北极, 90=赤道, 180=南极
    const alpha = lon
    const beta = 90 - lat
    let distance = 160
    if (bbox) {
      let lonSpan = bbox.maxLon - bbox.minLon
      if (lonSpan < 0) lonSpan = (180 - bbox.minLon) + (bbox.maxLon + 180) // 跨 180° 边界修正
      const areaDeg2 = lonSpan * (bbox.maxLat - bbox.minLat)
      distance = areaDeg2 < 400 ? 120 : areaDeg2 < 1200 ? 160 : areaDeg2 < 5000 ? 200 : 240
    }
    console.log('[calculateViewParams]', { coord, alpha, beta, distance })
    return { alpha, beta, distance }
  }

  return {
    countries,
    currentCountry,
    currentStats,
    isFlying,
    cameraState,
    activeType,
    yearRange,
    filteredCountries,
    displayCountries,
    totalCountries,
    totalEquipment,
    typeStats,
    countryCoords,
    countryNameMap,
    loadCountries,
    selectCountry,
    setActiveType,
    setYearRange,
    resetView,
    clearCache,
    fetchAllEquipment,
    calculateViewParams
  }
})
