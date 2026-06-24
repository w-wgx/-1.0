/**
 * cacheStore.ts
 * 页面数据缓存管理
 *
 * 功能：
 *  - 管理各页面的数据缓存状态
 *  - 提供缓存读取、更新、失效机制
 *  - 确保页面切换时的数据复用
 *  - 自动清除过期缓存
 *  - 数据导入/清空后自动失效所有缓存
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { eventBus, Events } from '@/utils/EventBus'

// 缓存有效期（毫秒）
const CACHE_EXPIRY_TIME = 5 * 60 * 1000 // 5分钟

/**
 * 页面缓存数据结构
 */
export interface PageCache<T = any> {
  data: T                  // 页面数据
  loading: boolean         // 是否正在加载
  loaded: boolean          // 是否已成功加载过
  timestamp: number        // 缓存时间戳（毫秒）
  error: string | null     // 错误信息
}

/**
 * 页面类型枚举
 */
export enum PageType {
  GLOBAL_OVERVIEW = 'global-overview',
  DATA_MANAGEMENT = 'data-management',
  EQUIPMENT_STATS = 'equipment-stats',
  EQUIPMENT_DETAIL = 'equipment-detail'
}

/**
 * 创建空缓存对象
 */
function createEmptyCache<T>(): PageCache<T> {
  return {
    data: null as T,
    loading: false,
    loaded: false,
    timestamp: 0,
    error: null
  }
}

/**
 * 判断缓存是否有效（已加载且未过期）
 */
function isCacheValid(cache: PageCache): boolean {
  if (!cache.loaded || !cache.timestamp) return false
  
  const now = Date.now()
  const elapsed = now - cache.timestamp
  
  return elapsed < CACHE_EXPIRY_TIME
}

export const useCacheStore = defineStore('cache', () => {
  // ========== 状态 ==========

  // 各页面缓存（使用 PageType 作为 key）
  const pageCaches = ref<Record<string, PageCache>>({
    [PageType.GLOBAL_OVERVIEW]: createEmptyCache(),
    [PageType.DATA_MANAGEMENT]: createEmptyCache(),
    [PageType.EQUIPMENT_STATS]: createEmptyCache(),
    [PageType.EQUIPMENT_DETAIL]: createEmptyCache()
  })

  // 全局数据版本号（每次数据更新时递增）
  const dataVersion = ref(0)

  // ========== 计算属性 ==========

  /**
   * 获取所有缓存状态概览
   */
  const cacheOverview = computed(() => {
    const overview: Record<string, { valid: boolean; age: number; loaded: boolean }> = {}
    
    for (const [pageType, cache] of Object.entries(pageCaches.value)) {
      overview[pageType] = {
        valid: isCacheValid(cache),
        age: cache.timestamp ? Date.now() - cache.timestamp : 0,
        loaded: cache.loaded
      }
    }
    
    return overview
  })

  // ========== 方法 ==========

  /**
   * 获取页面缓存（如果有效）
   * @param pageType 页面类型
   * @returns 缓存数据或 null
   */
  function getCache<T>(pageType: PageType): T | null {
    const cache = pageCaches.value[pageType] as PageCache<T>
    
    if (isCacheValid(cache)) {
      console.log(`[CacheStore] ✅ 使用缓存数据: ${pageType}, 年龄: ${Date.now() - cache.timestamp}ms`)
      return cache.data
    }
    
    console.log(`[CacheStore] ⚠️ 缓存无效或过期: ${pageType}`)
    return null
  }

  /**
   * 设置页面缓存
   * @param pageType 页面类型
   * @param data 数据
   */
  function setCache<T>(pageType: PageType, data: T): void {
    const cache = pageCaches.value[pageType] as PageCache<T>
    
    cache.data = data
    cache.loaded = true
    cache.timestamp = Date.now()
    cache.loading = false
    cache.error = null
    
    console.log(`[CacheStore] ✅ 缓存已更新: ${pageType}, 时间戳: ${cache.timestamp}`)
    
    // 触发缓存更新事件
    eventBus.emit(Events.CACHE_UPDATED, { pageType, timestamp: cache.timestamp })
  }

  /**
   * 设置页面加载状态
   * @param pageType 页面类型
   * @param loading 是否正在加载
   */
  function setLoading(pageType: PageType, loading: boolean): void {
    const cache = pageCaches.value[pageType]
    cache.loading = loading
    
    if (loading) {
      console.log(`[CacheStore] ⏳ 开始加载: ${pageType}`)
    }
  }

  /**
   * 设置页面错误状态
   * @param pageType 页面类型
   * @param error 错误信息
   */
  function setError(pageType: PageType, error: string): void {
    const cache = pageCaches.value[pageType]
    cache.error = error
    cache.loading = false
    
    console.error(`[CacheStore] ❌ 加载失败: ${pageType}, 错误: ${error}`)
  }

  /**
   * 清除单个页面缓存
   * @param pageType 页面类型
   */
  function clearCache(pageType: PageType): void {
    const cache = pageCaches.value[pageType]
    
    cache.data = null
    cache.loaded = false
    cache.timestamp = 0
    cache.loading = false
    cache.error = null
    
    console.log(`[CacheStore] 🗑️ 缓存已清除: ${pageType}`)
    
    // 触发缓存清除事件
    eventBus.emit(Events.CACHE_CLEARED, { pageType })
  }

  /**
   * 清除所有页面缓存（数据导入/清空后调用）
   */
  function clearAllCaches(): void {
    for (const pageType of Object.keys(pageCaches.value)) {
      clearCache(pageType as PageType)
    }
    
    // 递增数据版本号
    dataVersion.value++
    
    console.log(`[CacheStore] 🗑️ 所有缓存已清除，数据版本: ${dataVersion.value}`)
    
    // 触发全局缓存清除事件
    eventBus.emit(Events.ALL_CACHES_CLEARED, { version: dataVersion.value })
  }

  /**
   * 强制刷新页面缓存（用户主动刷新）
   * @param pageType 页面类型
   */
  function forceRefresh(pageType: PageType): void {
    clearCache(pageType)
    console.log(`[CacheStore] 🔄 强制刷新: ${pageType}`)
  }

  /**
   * 检查缓存是否需要更新
   * @param pageType 页面类型
   * @returns 是否需要更新
   */
  function needsUpdate(pageType: PageType): boolean {
    const cache = pageCaches.value[pageType]
    
    // 未加载、正在加载、已过期、有错误 → 需要更新
    if (!cache.loaded || cache.loading || !isCacheValid(cache) || cache.error) {
      return true
    }
    
    return false
  }

  /**
   * 获取缓存年龄（毫秒）
   * @param pageType 页面类型
   * @returns 缓存年龄
   */
  function getCacheAge(pageType: PageType): number {
    const cache = pageCaches.value[pageType]
    
    if (!cache.timestamp) return Infinity
    
    return Date.now() - cache.timestamp
  }

  /**
   * 获取缓存更新时间（格式化）
   * @param pageType 页面类型
   * @returns 格式化的时间字符串
   */
  function getCacheTimeFormatted(pageType: PageType): string {
    const cache = pageCaches.value[pageType]
    
    if (!cache.timestamp) return '未加载'
    
    const date = new Date(cache.timestamp)
    return date.toLocaleString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  /**
   * 批量更新缓存（用于初始化）
   * @param updates 批量更新数据
   */
  function batchUpdateCaches(updates: Array<{ pageType: PageType; data: any }>): void {
    for (const { pageType, data } of updates) {
      setCache(pageType, data)
    }
    
    console.log(`[CacheStore] ✅ 批量缓存更新完成，共 ${updates.length} 个页面`)
  }

  // ========== 监听数据更新事件 ==========

  // 监听数据导入完成事件 → 清除所有缓存
  eventBus.on(Events.DATA_IMPORTED, () => {
    console.log('[CacheStore] 📦 数据导入完成，清除所有缓存')
    clearAllCaches()
  })

  // 监听数据清空事件 → 清除所有缓存
  eventBus.on(Events.DATA_CLEARED, () => {
    console.log('[CacheStore] 🗑️ 数据已清空，清除所有缓存')
    clearAllCaches()
  })

  // 监听数据删除事件 → 清除相关缓存
  eventBus.on(Events.DATA_DELETED, () => {
    console.log('[CacheStore] 🗑️ 数据已删除，清除相关缓存')
    clearCache(PageType.DATA_MANAGEMENT)
    clearCache(PageType.EQUIPMENT_STATS)
    clearCache(PageType.GLOBAL_OVERVIEW)
  })

  // ========== 返回 ==========

  return {
    // 状态
    pageCaches,
    dataVersion,
    
    // 计算属性
    cacheOverview,
    
    // 方法
    getCache,
    setCache,
    setLoading,
    setError,
    clearCache,
    clearAllCaches,
    forceRefresh,
    needsUpdate,
    getCacheAge,
    getCacheTimeFormatted,
    batchUpdateCaches,
    
    // 工具函数
    isCacheValid
  }
})