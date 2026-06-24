/**
 * 核心类型定义
 *
 * 注意：当前类型为「迁移阶段临时占位」
 * - Country / EquipmentStats 仅保留基础字段，避免旧数据图表报错
 * - 后续会按 `表结构设计说明.md` 重新对齐字段
 */

// ============== 国家 ==============
export interface Country {
  /** 国家代码（ISO 2位 或 自定义） */
  code: string
  /** 国家中文名 */
  name: string
  /** 国家英文名 */
  nameEn?: string
  /** 经纬度坐标 */
  coord: [number, number]
  /** 装备数量 */
  equipmentCount: number
  /** 国旗 emoji（可选） */
  flag?: string
  /** 是否为组织/联盟（EU/NATO/Pirates 等），列表显示但不参与地图定位 */
  isOrganization?: boolean
}

// ============== 装备 ==============
/**
 * 当前为临时简化版本
 * 后续需按 equipment 表结构扩展：
 *   length / weight / max_speed / crew / detection_range / max_range / description 等
 */
export interface Equipment {
  id: string | number
  name: string
  type: string
  country?: string
  countryCode?: string
  year?: number
  [key: string]: any
}

// ============== 装备统计 ==============
/**
 * 临时简化：byType / byYear 留空对象，避免 CountryPanel 图表报错
 */
export interface EquipmentStats {
  rawTotal: number // 原始数据总数（未筛选）
  total: number // 筛选后的数据总数
  byType: Record<string, number>
  byYear: Record<string, number>
  topEquipment: Equipment[]
}

// ============== 装备类型配置 ==============
export const EQUIPMENT_TYPE_CONFIG: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  aircraft: { label: '飞机', color: '#00e5ff', icon: '✈' },
  ship: { label: '舰船', color: '#76ff03', icon: '🚢' },
  submarine: { label: '潜艇', color: '#ffd600', icon: '⬇' },
  facility: { label: '设施', color: '#ff6d00', icon: '🏭' },
  weapon: { label: '武器', color: '#ff1744', icon: '🚀' },
  sensor: { label: '传感器', color: '#e040fb', icon: '📡' },
  smallarms: { label: '轻武器', color: '#9c27b0', icon: '🔫' },
  armor: { label: '装甲车辆', color: '#ff9800', icon: '🛡' }
}

// 注意：Events 枚举已迁移至 utils/EventBus.ts
