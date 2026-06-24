/**
 * useCachedData.ts
 * 可复用的缓存数据加载 Hook
 *
 * 功能：
 *  - 自动判断缓存状态，决定是否重新加载
 *  - 提供加载状态、错误处理
 *  - 自动更新缓存
 *  - 支持强制刷新
 *  - 监听数据更新事件，自动清除缓存
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCacheStore, PageType } from '@/stores/cacheStore'
import { eventBus, Events } from '@/utils/EventBus'

/**
 * 缓存数据加载选项
 */
export interface UseCachedDataOptions<T> {
  pageType: PageType                    // 页面类型
  fetchFunction: () => Promise<T>       // 数据获取函数
  autoLoad?: boolean                    // 是否自动加载（默认 true）
  cacheExpiry?: number                  // 缓存有效期（毫秒，默认 5分钟）
}

/**
 * 缓存数据加载返回值
 */
export interface UseCachedDataReturn<T> {
  data: any                             // 数据
  loading: boolean                      // 加载状态
  error: string | null                  // 错误信息
  fromCache: boolean                    // 是否来自缓存
  cacheTimestamp: string                // 缓存时间戳
  refresh: () => Promise<void>          // 强制刷新
  load: () => Promise<void>             // 手动加载
}

/**
 * 使用缓存数据的 Hook
 * @param options 配置选项
 * @returns 缓存数据加载返回值
 */
export function useCachedData<T>(options: UseCachedDataOptions<T>): UseCachedDataReturn<T> {
  const {
    pageType,
    fetchFunction,
    autoLoad = true,
    cacheExpiry = 5 * 60 * 1000 // 5分钟
  } = options

  const cacheStore = useCacheStore()
  const route = useRoute()

  // ========== 状态 ==========

  const data = ref<T | null>(null) as any
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fromCache = ref(false)
  const cacheTimestamp = ref('')

  // ========== 方法 ==========

  /**
   * 加载数据（优先使用缓存）
   */
  async function load(): Promise<void> {
    // 检查缓存是否有效
    const cachedData = cacheStore.getCache<T>(pageType)

    if (cachedData) {
      console.log(`[useCachedData] ✅ 使用缓存数据: ${pageType}`)
      
      data.value = cachedData
      fromCache.value = true
      loading.value = false
      error.value = null
      cacheTimestamp.value = cacheStore.getCacheTimeFormatted(pageType)
      
      return
    }

    // 缓存无效，开始加载
    console.log(`[useCachedData] ⏳ 开始加载: ${pageType}`)
    
    loading.value = true
    error.value = null
    fromCache.value = false
    cacheStore.setLoading(pageType, true)

    try {
      const result = await fetchFunction()
      
      data.value = result
      loading.value = false
      error.value = null
      
      // 更新缓存
      cacheStore.setCache(pageType, result)
      cacheTimestamp.value = cacheStore.getCacheTimeFormatted(pageType)
      
      console.log(`[useCachedData] ✅ 加载完成: ${pageType}`)
    } catch (err: any) {
      loading.value = false
      error.value = err.message || '加载失败'
      
      cacheStore.setError(pageType, error.value)
      
      console.error(`[useCachedData] ❌ 加载失败: ${pageType}`, err)
    }
  }

  /**
   * 强制刷新（清除缓存后重新加载）
   */
  async function refresh(): Promise<void> {
    console.log(`[useCachedData] 🔄 强制刷新: ${pageType}`)
    
    // 清除缓存
    cacheStore.forceRefresh(pageType)
    
    // 重新加载
    await load()
  }

  // ========== 监听事件 ==========

  // 监听数据刷新事件
  const handleRefreshNeeded = (eventData: any) => {
    if (eventData.pageType === pageType) {
      console.log(`[useCachedData] 📢 收到刷新事件: ${pageType}`)
      refresh()
    }
  }

  // 监听缓存清除事件
  const handleCacheCleared = (eventData: any) => {
    if (eventData.pageType === pageType) {
      console.log(`[useCachedData] 📢 收到缓存清除事件: ${pageType}`)
      fromCache.value = false
      cacheTimestamp.value = ''
    }
  }

  // 监听所有缓存清除事件
  const handleAllCachesCleared = () => {
    console.log(`[useCachedData] 📢 收到全局缓存清除事件`)
    fromCache.value = false
    cacheTimestamp.value = ''
    
    // 如果当前页面需要数据，自动重新加载
    if (autoLoad && route.name === getPageRouteName(pageType)) {
      load()
    }
  }

  // 监听路由变化（切换回当前页面时检查缓存）
  watch(() => route.name, (newRouteName) => {
    if (newRouteName === getPageRouteName(pageType)) {
      console.log(`[useCachedData] 📍 路由切换到: ${pageType}`)
      
      // 检查缓存是否有效
      if (cacheStore.needsUpdate(pageType)) {
        load()
      }
    }
  })

  // ========== 生命周期 ==========

  onMounted(() => {
    // 注册事件监听
    eventBus.on(Events.DATA_REFRESH_NEEDED, handleRefreshNeeded)
    eventBus.on(Events.CACHE_CLEARED, handleCacheCleared)
    eventBus.on(Events.ALL_CACHES_CLEARED, handleAllCachesCleared)
    
    // 自动加载
    if (autoLoad) {
      load()
    }
  })

  onUnmounted(() => {
    // 移除事件监听
    eventBus.off(Events.DATA_REFRESH_NEEDED, handleRefreshNeeded)
    eventBus.off(Events.CACHE_CLEARED, handleCacheCleared)
    eventBus.off(Events.ALL_CACHES_CLEARED, handleAllCachesCleared)
  })

  // ========== 返回 ==========

  return {
    data,
    loading,
    error,
    fromCache,
    cacheTimestamp,
    refresh,
    load
  }
}

/**
 * 页面类型到路由名称的映射
 */
function getPageRouteName(pageType: PageType): string {
  const mapping: Record<PageType, string> = {
    [PageType.GLOBAL_OVERVIEW]: 'GlobalOverview',
    [PageType.DATA_MANAGEMENT]: 'DataManagement',
    [PageType.EQUIPMENT_STATS]: 'EquipmentStats',
    [PageType.EQUIPMENT_DETAIL]: 'EquipmentDetail'
  }
  
  return mapping[pageType]
}