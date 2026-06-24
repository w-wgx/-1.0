/**
 * 全局事件总线
 *
 * 用于组件间解耦通信
 * - GlobeViewer → 发送 COUNTRY_SELECTED
 * - CountryPanel → 监听 PANEL_OPEN / CLOSE
 */
type EventCallback = (...args: any[]) => void

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map()

  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback)
  }

  emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(...args)
        } catch (err) {
          console.error(`[EventBus] 事件 ${event} 回调执行错误:`, err)
        }
      })
    }
  }

  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }
}

export const eventBus = new EventBus()
export default eventBus

// ============== 事件类型枚举 ==============
export enum Events {
  COUNTRY_SELECTED = 'country:selected',
  PANEL_OPEN = 'panel:open',
  PANEL_CLOSE = 'panel:close',
  DATA_LOADING = 'data:loading',
  DATA_LOADED = 'data:loaded',
  DATA_REFRESH_NEEDED = 'data:refresh',
  TEMP_DATA_CHANGED = 'tempData:changed',
  COMPARE_ADD = 'compare:add',
  COMPARE_REMOVE = 'compare:remove',
  RESET_VIEW = 'view:reset',
  FILTER_CHANGE = 'filter:change',
  
  // ========== 缓存管理事件 ==========
  CACHE_UPDATED = 'cache:updated',           // 单个页面缓存更新
  CACHE_CLEARED = 'cache:cleared',           // 单个页面缓存清除
  ALL_CACHES_CLEARED = 'cache:allCleared',   // 所有缓存清除
  DATA_IMPORTED = 'data:imported',           // 数据导入完成
  DATA_CLEARED = 'data:cleared',             // 数据清空完成
  DATA_DELETED = 'data:deleted'              // 数据删除完成
}
