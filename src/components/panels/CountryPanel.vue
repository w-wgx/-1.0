<template>
  <aside
    v-if="store.currentCountry && store.currentStats"
    class="country-panel"
  >
      <div class="panel-header">
        <div class="country-title">
          <span class="country-flag">{{ getFlag(store.currentCountry.code) }}</span>
          <div>
            <h2 class="country-name">{{ store.currentCountry.name }}</h2>
            <span class="country-name-en">{{ store.currentCountry.nameEn }}</span>
          </div>
        </div>
        <button class="close-btn" @click="store.resetView" aria-label="关闭">✕</button>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card total">
          <span class="stat-number">{{ store.currentStats.rawTotal.toLocaleString() }}</span>
          <span class="stat-desc">装备总数</span>
        </div>
        <div class="stat-card rank">
          <span class="stat-number">#{{ rankInfo }}</span>
          <span class="stat-desc">全球排名</span>
        </div>
      </div>

      <!-- 装备类型分布 -->
      <div class="section-title">
        <span class="title-icon">◆</span>
        <span>装备类型分布</span>
      </div>
      <div class="type-list">
        <div v-for="(item, index) in typeList" :key="item.type" class="type-row">
          <span class="type-rank">{{ index + 1 }}</span>
          <span class="type-name">{{ getTypeLabel(item.type) }}</span>
          <div class="type-bar-bg">
            <div class="type-bar-fill" :style="{ width: item.percent + '%', background: getTypeColor(item.type) }"></div>
          </div>
          <span class="type-count">{{ item.count }}件</span>
        </div>
      </div>

      <!-- 年代分布 -->
      <div class="section-title">
        <span class="title-icon">◆</span>
        <span>年代分布</span>
      </div>
      <div class="decade-list">
        <div v-for="item in decadeList" :key="item.decade" class="decade-row">
          <span class="decade-label">{{ formatDecade(item.decade) }}</span>
          <div class="decade-bar-bg">
            <div class="decade-bar-fill" :style="{ width: item.percent + '%' }"></div>
          </div>
          <span class="decade-count">{{ item.count }}件</span>
        </div>
      </div>

      <!-- 最新装备列表 -->
      <div class="section-title">
        <span class="title-icon">◆</span>
        <span>装备列表</span>
        <span class="title-count">{{ store.currentStats.topEquipment.length }}</span>
      </div>
      <div class="equipment-list">
        <el-tooltip
          v-for="item in store.currentStats.topEquipment"
          :key="item.id"
          placement="left"
          :show-after="300"
          effect="dark"
          :disabled="!hasExtraInfo(item)"
        >
          <template #content>
            <div class="equip-tooltip">
              <div class="tooltip-row" v-if="item.subtitle">
                <span class="tooltip-label">副标题:</span>
                <span class="tooltip-value">{{ item.subtitle }}</span>
              </div>
              <div class="tooltip-row" v-if="item.manufacturer">
                <span class="tooltip-label">制造商:</span>
                <span class="tooltip-value">{{ item.manufacturer }}</span>
              </div>
              <div class="tooltip-row" v-if="item.height">
                <span class="tooltip-label">高度:</span>
                <span class="tooltip-value">{{ item.height }} m</span>
              </div>
              <div class="tooltip-row" v-if="item.engine">
                <span class="tooltip-label">引擎:</span>
                <span class="tooltip-value">{{ item.engine }}</span>
              </div>
              <div class="tooltip-row" v-if="item.source">
                <span class="tooltip-label">来源:</span>
                <span class="tooltip-value">{{ item.source }}</span>
              </div>
            </div>
          </template>
          <div class="equip-row">
            <span class="equip-year">{{ item.year || '-' }}</span>
            <span class="equip-name">{{ item.name }}</span>
            <span class="equip-type-badge" :style="{ color: getTypeColor(item.type), borderColor: getTypeColor(item.type) + '60' }">
              {{ getTypeLabel(item.type) }}
            </span>
          </div>
        </el-tooltip>
      </div>

      <div class="panel-actions">
        <button class="action-btn primary" @click="store.resetView">返回全球视图</button>
      </div>
    </aside>
</template>

<script setup lang="ts">
/**
 * CountryPanel.vue
 * 国家详情面板
 *
 * - 显示国家基础信息 + 装备总数 + 全球排名
 * - 装备类型分布（条形图）
 * - 年代分布（条形图）
 * - 装备列表（按最新年份排序）
 */
import { computed, watch } from 'vue'
import { useGlobeStore } from '@/stores/globeStore'
import { EQUIPMENT_TYPE_CONFIG } from '@/types'

const store = useGlobeStore()

// 国旗 emoji 映射
const FLAG_MAP: Record<string, string> = {
  CN: '🇨🇳', US: '🇺🇸', RU: '🇷🇺', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', JP: '🇯🇵',
  KR: '🇰🇷', IN: '🇮🇳', AU: '🇦🇺', CA: '🇨🇦', BR: '🇧🇷', IT: '🇮🇹', ES: '🇪🇸',
  IL: '🇮🇱', SU: '☭', UA: '🇺🇦', TR: '🇹🇷', IR: '🇮🇷', PK: '🇵🇰', EG: '🇪🇬',
  SA: '🇸🇦', TW: '🇹🇼', NK: '🇰🇵', ZA: '🇿🇦', SE: '🇸🇪', NL: '🇳🇱', PL: '🇵🇱',
  NO: '🇳🇴', GR: '🇬🇷', CZ: '🇨🇿', CH: '🇨🇭', BE: '🇧🇪', AT: '🇦🇹', PT: '🇵🇹',
  FI: '🇫🇮', DK: '🇩🇰', TH: '🇹🇭', VN: '🇻🇳', ID: '🇮🇩', MY: '🇲🇾', SG: '🇸🇬',
  PH: '🇵🇭', MX: '🇲🇽', AR: '🇦🇷', CL: '🇨🇱', CO: '🇨🇴', NG: '🇳🇬', KE: '🇰🇪'
}

function getFlag(code: string): string {
  return FLAG_MAP[code] || '🏳️'
}

function getTypeIcon(type: string): string {
  return EQUIPMENT_TYPE_CONFIG[type]?.icon || '●'
}

function getTypeLabel(type: string): string {
  return EQUIPMENT_TYPE_CONFIG[type]?.label || type || 'Other'
}

function getTypeColor(type: string): string {
  return EQUIPMENT_TYPE_CONFIG[type]?.color || '#90a4ae'
}

// 判断装备是否有额外信息（用于控制 tooltip 是否显示）
function hasExtraInfo(item: any): boolean {
  return !!(item.subtitle || item.manufacturer || item.height || item.engine || item.source)
}

const rankInfo = computed(() => {
  if (!store.currentCountry) return '-'
  const sorted = [...store.countries].sort((a, b) => b.equipmentCount - a.equipmentCount)
  const idx = sorted.findIndex(c => c.code === store.currentCountry!.code)
  return idx >= 0 ? idx + 1 : '-'
})

// 类型分布列表
const typeList = computed(() => {
  if (!store.currentStats) return []
  const byType = store.currentStats.byType
  const total = store.currentStats.total || 1
  return Object.entries(byType)
    .map(([type, count]) => ({
      type,
      count,
      percent: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count)
})

// 年代分布列表
const decadeList = computed(() => {
  if (!store.currentStats) return []
  const byYear = store.currentStats.byYear
  const maxCount = Math.max(...Object.values(byYear), 1)
  return Object.entries(byYear)
    .filter(([decade]) => {
      const num = parseInt(decade)
      // 过滤掉无效年代（year=0）和1900年以前的不合理数据
      return !isNaN(num) && num > 0 && num >= 1900
    })
    .map(([decade, count]) => ({
      decade,
      count,
      percent: Math.round((count / maxCount) * 100)
    }))
    .sort((a, b) => Number(a.decade) - Number(b.decade))
})

// 格式化年代显示：后端返回 "1990年" 或纯数字 "1990"，统一显示为 "1990年"
const formatDecade = (decade: string) => {
  const num = parseInt(decade)
  if (isNaN(num) || num <= 0) return '未知'
  return `${num}年`
}

// 面板打开/装备列表更新日志
watch(
  () => store.currentCountry,
  (country) => {
    if (country) {
      console.log('[CountryPanel] 面板打开:', country.name, country.code)
    }
  }
)

watch(
  () => store.currentStats?.topEquipment?.length,
  (len) => {
    if (len !== undefined) {
      console.log('[CountryPanel] 装备列表更新，共', len, '条')
    }
  }
)

watch(
  () => store.activeType,
  (type) => {
    console.log('[CountryPanel] 筛选条件变化，类型:', type || '全部')
  }
)
</script>

<style scoped lang="scss">
.country-panel {
  width: 380px;
  max-height: calc(100vh - 84px);
  background: rgba(10, 14, 23, 0.92);
  backdrop-filter: blur(12px);
  border-left: 1px solid rgba(0, 229, 255, 0.3);
  border-right: 1px solid rgba(0, 229, 255, 0.15);
  padding: 16px;
  color: #e0f7fa;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(0, 229, 255, 0.1);
  overflow-y: auto;
  z-index: 100;
  font-family: 'Roboto Mono', 'Courier New', monospace;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 229, 255, 0.05);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 229, 255, 0.3);
    border-radius: 2px;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  margin-bottom: 12px;
}

.country-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.country-flag {
  font-size: 32px;
  line-height: 1;
}

.country-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
}

.country-name-en {
  font-size: 10px;
  color: #80deea;
  letter-spacing: 1px;
}

.close-btn {
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid rgba(0, 229, 255, 0.4);
  color: #00e5ff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 229, 255, 0.15);
    box-shadow: 0 0 12px rgba(0, 229, 255, 0.4);
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-card {
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  &.total {
    border-color: rgba(255, 109, 0, 0.4);
    background: rgba(255, 109, 0, 0.06);
  }

  &.rank {
    border-color: rgba(118, 255, 3, 0.4);
    background: rgba(118, 255, 3, 0.06);
  }
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #00e5ff;
  font-family: 'Orbitron', 'Courier New', monospace;
}

.stat-desc {
  font-size: 11px;
  color: #80deea;
  letter-spacing: 1px;
}

// ============== 分区标题 ==============
.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0 4px;
  font-size: 11px;
  color: #80deea;
  letter-spacing: 1px;
}

.title-icon {
  color: #00e5ff;
  font-size: 8px;
}

.title-count {
  margin-left: auto;
  color: #00e5ff;
  font-family: 'Orbitron', monospace;
  font-size: 10px;
}

// ============== 类型分布 ==============
.type-list {
  margin-bottom: 4px;
  // 字体渲染优化 - 解决深色背景下文字发虚问题
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-optical-sizing: auto;
}

.type-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.type-rank {
  width: 14px;
  font-size: 10px;
  color: #90a4ae;
  text-align: right;
  font-family: 'Orbitron', monospace;
  font-variant-numeric: tabular-nums;
}

.type-name {
  font-size: 11px;
  color: #cfd8dc;
  width: 56px;
  font-weight: 500;
}

.type-bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.type-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.type-count {
  font-size: 11px;
  color: #00e5ff;
  font-family: 'Orbitron', monospace;
  min-width: 36px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

// ============== 年代分布 ==============
.decade-list {
  margin-bottom: 4px;
}

.decade-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
}

.decade-label {
  font-size: 11px;
  color: #b0bec5;
  font-family: 'Orbitron', monospace;
  min-width: 42px;
  flex-shrink: 0;
}

.decade-bar-bg {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.decade-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00e5ff, #76ff03);
  border-radius: 2px;
  transition: width 0.3s;
}

.decade-count {
  font-size: 11px;
  color: #80deea;
  font-family: 'Orbitron', monospace;
  min-width: 32px;
  text-align: right;
  flex-shrink: 0;
}

// ============== 装备列表 ==============
.equipment-list {
  margin-bottom: 8px;
}

.equip-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 6px;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.06);

  &:hover {
    background: rgba(0, 229, 255, 0.04);
  }
}

.equip-year {
  font-size: 11px;
  color: #90a4ae;
  font-family: 'Orbitron', monospace;
  min-width: 36px;
}

.equip-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #cfd8dc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.equip-type-badge {
  font-size: 10px;
  padding: 2px 6px;
  border: 1px solid;
  border-radius: 3px;
  white-space: nowrap;
}

// ============== 装备 Tooltip 样式 ==============
.equip-tooltip {
  max-width: 280px;
  font-size: 12px;

  .tooltip-row {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .tooltip-label {
    color: #80deea;
    min-width: 50px;
    font-size: 11px;
  }

  .tooltip-value {
    color: #ffffff;
    font-size: 12px;
    flex: 1;
    word-break: break-all;
  }
}

// ============== 操作按钮 ==============
.panel-actions {
  padding-top: 8px;
}

.action-btn {
  width: 100%;
  padding: 8px;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.4);
  color: #00e5ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 1px;
  font-family: inherit;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 229, 255, 0.2);
    box-shadow: 0 0 12px rgba(0, 229, 255, 0.3);
  }
}

// 面板动画（替代 Transition）
.country-panel {
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
