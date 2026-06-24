/**
 * Axios请求封装
 * 统一处理请求拦截、响应拦截、错误处理
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    // blob 响应（文件下载/导出）直接透传，不检查 code
    if (response.config.responseType === 'blob') {
      return response.data as any
    }

    const res = response.data
    
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5000
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res as any
  },
  (error) => {
    console.error('响应错误：', error)
    
    let message = '网络错误'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data.message || '请求失败'
      }
    } else if (error.request) {
      message = '网络异常，请检查网络连接'
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 5000
    })
    
    return Promise.reject(error)
  }
)

export default service
