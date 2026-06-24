/**
 * 图片 URL 工具
 * 优先级：环境变量 VITE_IMAGE_BASE_URL > 默认值
 */
const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://cmano-db.com/images/DB3000/'

/**
 * 拼接完整装备图片 URL
 * @param path 数据库存的文件名（如 "100.jpg"）或相对路径
 * @returns 完整 URL，空值返回 null
 */
export function buildImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  const s = String(path).trim()
  if (!s) return null
  // 已是完整 URL → 直接返回
  if (/^https?:\/\//.test(s)) return s
  // 本地文件名 → 拼接基础 URL
  return BASE_URL.replace(/\/+$/, '') + '/' + s.replace(/^\/+/, '')
}

/**
 * 当前图片基础 URL（调试用）
 */
export function getImageBaseUrl(): string {
  return BASE_URL
}