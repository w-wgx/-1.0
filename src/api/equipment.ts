/**
 * 装备数据API接口封装
 * 严格遵循前后端分离原则：前端只负责调用接口，不做任何数据处理
 * 支持Mock模式（生产环境使用静态JSON数据）
 */

import request from './request'
import { mockApi } from './mock-api'

// 是否使用 Mock 模式
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 装备数据接口
 */
export const equipmentApi = {
  /**
   * 批量导入装备数据
   * @param file CSV文件
   * @returns 导入结果
   */
  import(file: FormData): Promise<any> {
    if (USE_MOCK) {
      // Mock 模式不支持导入
      return Promise.resolve({
        code: 200,
        message: 'Mock mode: import disabled',
        data: null
      })
    }
    return request.post('/equipment/import', file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000
    })
  },

  /**
   * 分页查询装备数据列表
   * @param params 查询参数
   * @returns 分页数据
   */
  getList(params: {
    current: number
    size: number
    name?: string
    type?: string
    country?: string
  }, timeout?: number): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve(mockApi.getList(params))
    }
    return request.get('/equipment/list', { params, timeout: timeout || 30000 })
  },

  /**
   * 获取所有去重后的国家列表
   * 用于全球概览的 GeoJSON 动态匹配（替代硬编码 COUNTRY_COORDS）
   * @returns { code: 200, data: ["中国", "美国", "Russia", ...], total: N }
   */
  getDistinctCountries(): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve(mockApi.getDistinctCountries())
    }
    return request.get('/equipment/distinct-countries')
  },

  /**
   * 获取所有装备数据（不分页）
   * 用于全球概览一次性加载，支持自定义超时
   * @param timeout 超时时间（毫秒），默认 60000
   */
  getAll(timeout?: number): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve(mockApi.getAll())
    }
    return request.get('/equipment/all', { timeout: timeout || 60000 })
  },

  /**
   * 获取国家装备数量摘要（轻量，仅 country + count）
   * 用于全球概览页面，替代 getAll，大幅减少传输量
   */
  getCountriesSummary(): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve(mockApi.getCountriesSummary())
    }
    return request.get('/equipment/countries-summary')
  },

  /**
   * 获取装备轻量数据（仅筛选和图表所需字段）
   * 用于统计分析页面，替代 getAll，大幅减少传输量
   */
  getLightweight(): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve(mockApi.getLightweight())
    }
    return request.get('/equipment/lightweight')
  },

  /**
   * 按国家查询装备统计数据
   * 返回该国家的总数、类型统计、年份统计、最新装备列表
   * 用于全球概览页面点击国家时的快速响应（替代 fetchAllEquipment）
   * @param country 国家名称（原始country字段值）
   */
  getCountryStats(country: string): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve(mockApi.getCountryStats(country))
    }
    return request.get('/equipment/country-stats', { params: { country }, timeout: 30000 })
  },

  /**
   * 清空所有数据
   * @returns 操作结果
   */
  clear(): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve({
        code: 200,
        message: 'Mock mode: clear disabled',
        data: null
      })
    }
    return request.delete('/equipment/clear')
  },

  /**
   * 获取统计数据
   * @returns 统计结果
   */
  getStats(): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve(mockApi.getStats())
    }
    return request.get('/equipment/stats')
  },

  /**
   * 获取单条装备详情
   * @param id 装备ID
   * @returns 装备详情
   */
  getDetail(id: number | string): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve(mockApi.getDetail(id))
    }
    return request.get(`/equipment/${id}`)
  },

  /**
   * 导出数据
   * @param params 筛选参数（可选）
   * @returns 文件下载
   */
  export(params?: {
    name?: string
    type?: string
    country?: string
  }): Promise<any> {
    if (USE_MOCK) {
      // Mock 模式不支持导出
      return Promise.resolve({
        code: 200,
        message: 'Mock mode: export disabled',
        data: null
      })
    }
    return request.get('/equipment/export', {
      params,
      responseType: 'blob'
    })
  },

  /**
   * 批量删除
   * @param ids 装备ID数组
   * @returns 操作结果
   */
  batchDelete(ids: number[]): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve({
        code: 200,
        message: 'Mock mode: delete disabled',
        data: null
      })
    }
    return request.delete('/equipment/batch', { data: { ids } })
  },

  /**
   * 删除单条装备数据
   * @param id 装备ID
   * @returns 操作结果
   */
  delete(id: number): Promise<any> {
    if (USE_MOCK) {
      return Promise.resolve({
        code: 200,
        message: 'Mock mode: delete disabled',
        data: null
      })
    }
    return request.delete(`/equipment/${id}`)
  },

  /**
   * 下载导入模板（双语表头）
   * @returns Blob
   */
  downloadTemplate(): Promise<Blob> {
    if (USE_MOCK) {
      return Promise.resolve(new Blob())
    }
    return request.get('/equipment/template', { responseType: 'blob' })
  }
}

/**
 * 统一响应结构
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  total?: number
}

/**
 * 分页数据结构
 */
export interface PageData<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages?: number
}

/**
 * 装备数据结构
 */
export interface Equipment {
  id: number
  name: string
  type: string
  category?: string
  country?: string
  year?: number
  length?: number
  width?: number
  weight?: number
  maxSpeed?: number
  crew?: number
  imagePath?: string
  detectionRange?: number
  maxRange?: number
  description?: string
  sourceLink?: string
  imageLink?: string
  localImagePath?: string
  hasImage?: number
  imageCount?: number
  collectTime?: string
  createTime?: string
}
