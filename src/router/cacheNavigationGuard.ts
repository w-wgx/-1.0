/**
 * cacheNavigationGuard.ts
 * 路由切换缓存判断逻辑
 *
 * 功能：
 *  - 在路由切换前判断目标页面缓存状态
 *  - 如果缓存有效，直接使用缓存数据，不触发页面重新加载
 *  - 如果缓存无效，触发页面数据加载
 *  - 提供强制刷新机制
 */
import type { Router, RouteLocationNormalized } from 'vue-router'
import { useCacheStore, PageType } from '@/stores/cacheStore'
import { eventBus, Events } from '@/utils/EventBus'

/**
 * 路由名称到页面类型的映射
 */
const ROUTE_TO_PAGE_TYPE: Record<string, PageType> = {
  'GlobalOverview': PageType.GLOBAL_OVERVIEW,
  'DataManagement': PageType.DATA_MANAGEMENT,
  'EquipmentStats': PageType.EQUIPMENT_STATS,
  'EquipmentDetail': PageType.EQUIPMENT_DETAIL
}

/**
 * 安装缓存导航守卫
 * @param router Vue Router 实例
 */
export function setupCacheNavigationGuard(router: Router): void {
  // ========== 全局前置守卫：判断缓存状态 ==========

  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
    const cacheStore = useCacheStore()
    const targetPageType = ROUTE_TO_PAGE_TYPE[to.name as string]

    // 如果目标页面不在缓存管理范围内，直接放行
    if (!targetPageType) {
      console.log(`[CacheGuard] ⚠️ 页面不在缓存管理范围: ${to.name}`)
      next()
      return
    }

    // 判断缓存是否有效
    const cachedData = cacheStore.getCache(targetPageType)

    if (cachedData) {
      console.log(`[CacheGuard] ✅ 使用缓存数据，跳过加载: ${to.name}`)
      
      // 触发缓存数据就绪事件（页面组件监听此事件直接渲染）
      eventBus.emit(Events.DATA_LOADED, {
        pageType: targetPageType,
        data: cachedData,
        fromCache: true
      })
      
      // 设置路由元信息，标记数据来自缓存
      to.meta.fromCache = true
      to.meta.cacheTimestamp = cacheStore.getCacheTimeFormatted(targetPageType)
    } else {
      console.log(`[CacheGuard] ⏳ 缓存无效，需要加载: ${to.name}`)
      
      // 设置加载状态
      cacheStore.setLoading(targetPageType, true)
      
      // 设置路由元信息，标记需要加载
      to.meta.fromCache = false
      to.meta.needsLoad = true
    }

    next()
  })

  // ========== 全局后置守卫：记录路由切换 ==========

  router.afterEach((to: RouteLocationNormalized) => {
    const targetPageType = ROUTE_TO_PAGE_TYPE[to.name as string]

    if (targetPageType) {
      console.log(`[CacheGuard] 📍 路由切换完成: ${to.name}, 缓存状态: ${to.meta.fromCache ? '有效' : '无效'}`)
    }
  })
}

/**
 * 强制刷新当前页面缓存
 * @param router Vue Router 实例
 */
export function forceRefreshCurrentPage(router: Router): void {
  const cacheStore = useCacheStore()
  const currentRoute = router.currentRoute.value
  const currentPageType = ROUTE_TO_PAGE_TYPE[currentRoute.name as string]

  if (currentPageType) {
    console.log(`[CacheGuard] 🔄 强制刷新当前页面: ${currentRoute.name}`)
    
    // 清除缓存
    cacheStore.forceRefresh(currentPageType)
    
    // 触发刷新事件（页面组件监听此事件重新加载）
    eventBus.emit(Events.DATA_REFRESH_NEEDED, {
      pageType: currentPageType,
      force: true
    })
  }
}

/**
 * 获取当前页面缓存状态
 * @param router Vue Router 实例
 * @returns 缓存状态信息
 */
export function getCurrentPageCacheStatus(router: Router): {
  valid: boolean
  age: number
  timestamp: string
} {
  const cacheStore = useCacheStore()
  const currentRoute = router.currentRoute.value
  const currentPageType = ROUTE_TO_PAGE_TYPE[currentRoute.name as string]

  if (!currentPageType) {
    return { valid: false, age: Infinity, timestamp: '未管理' }
  }

  return {
    valid: cacheStore.isCacheValid(cacheStore.pageCaches[currentPageType]),
    age: cacheStore.getCacheAge(currentPageType),
    timestamp: cacheStore.getCacheTimeFormatted(currentPageType)
  }
}