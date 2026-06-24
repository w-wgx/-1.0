/**
 * Vue Router 路由配置
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupCacheNavigationGuard } from './cacheNavigationGuard'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/global-overview'
  },
  {
    path: '/global-overview',
    name: 'GlobalOverview',
    component: () => import('@/views/GlobalOverviewView.vue'),
    meta: {
      title: '全球军备态势总览',
      fromCache: false,        // 是否来自缓存
      cacheTimestamp: '',      // 缓存时间戳
      needsLoad: false         // 是否需要加载
    }
  },
  {
    path: '/data-management',
    name: 'DataManagement',
    component: () => import('@/views/DataManagement.vue'),
    meta: {
      title: '数据管理终端',
      fromCache: false,
      cacheTimestamp: '',
      needsLoad: false
    }
  },
  {
    path: '/equipment-stats',
    name: 'EquipmentStats',
    component: () => import('@/views/EquipmentStats.vue'),
    meta: {
      title: '数据统计分析',
      fromCache: false,
      cacheTimestamp: '',
      needsLoad: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ========== 安装缓存导航守卫 ==========
setupCacheNavigationGuard(router)

router.beforeEach((to: any, _: any, next: any) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
