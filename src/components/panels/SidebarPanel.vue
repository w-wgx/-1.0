<template>
  <div class="sidebar-panel">
    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-item">
        <span class="stat-label">国家</span>
        <span class="stat-value">{{ store.totalCountries }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">装备</span>
        <span class="stat-value">{{ store.totalEquipment.toLocaleString() }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">类型</span>
        <span class="stat-value">{{ Object.keys(store.typeStats).length }}</span>
      </div>
    </div>

    <!-- 装备类型筛选 -->
    <div class="section-title">
      <span class="title-icon">◆</span>
      <span>装备类型</span>
    </div>
    <div class="type-filter">
      <button
        v-for="(config, type) in EQUIPMENT_TYPE_CONFIG"
        :key="type"
        :class="['type-btn', store.activeType === type ? 'active' : '']"
        @click="handleTypeClick(type as string)"
      >
        <!-- 纯单色线性SVG图标 -->
        <svg class="type-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <!-- 飞机：侧视战斗机极简轮廓 -->
          <template v-if="type === 'aircraft'">
            <path d="M4 15 L12 3 L20 15 M12 3 L12 21 M4 15 L8 15 L12 21 L16 15 L20 15"/>
          </template>
          <!-- 舰船：侧视军舰极简轮廓 -->
          <template v-else-if="type === 'ship'">
            <path d="M3 16 L21 16 L19 12 L5 12 L3 16 M7 12 L7 8 L17 8 L17 12 M10 8 L10 5 L14 5 L14 8"/>
          </template>
          <!-- 潜艇：侧视潜艇极简轮廓 -->
          <template v-else-if="type === 'submarine'">
            <path d="M3 14 L21 14 L21 10 L3 10 L3 14 M12 10 L12 6 L14 6 L14 10 M6 14 L6 16 M18 14 L18 16"/>
          </template>
          <!-- 设施：工业建筑极简轮廓 -->
          <template v-else-if="type === 'facility'">
            <path d="M4 20 L4 10 L8 10 L8 6 L12 6 L12 10 L16 10 L16 20 L4 20 M10 6 L10 3 L11 3 L11 6"/>
          </template>
          <!-- 武器：导弹侧视极简轮廓 -->
          <template v-else-if="type === 'weapon'">
            <path d="M12 2 L12 18 M8 18 L12 22 L16 18 M6 8 L12 2 L18 8 M6 8 L6 12 L18 12 L18 8"/>
          </template>
          <!-- 传感器：雷达扫描极简轮廓 -->
          <template v-else-if="type === 'sensor'">
            <path d="M12 20 L12 12 M8 16 L12 12 L16 16 M6 20 L12 12 L18 20 M4 20 L4 4 L20 4"/>
          </template>
          <!-- 轻武器：步枪侧视极简轮廓 -->
          <template v-else-if="type === 'smallarms'">
            <path d="M3 14 L21 14 M21 14 L21 10 L18 10 L18 14 M6 14 L6 18 L10 18 L10 14 M3 14 L3 12"/>
          </template>
          <!-- 装甲车辆：坦克侧视极简轮廓 -->
          <template v-else-if="type === 'armor'">
            <path d="M4 16 L20 16 L20 12 L4 12 L4 16 M8 12 L8 8 L16 8 L16 12 M12 8 L12 4 L14 4 L14 8"/>
          </template>
        </svg>
        <span class="type-name">{{ config.label }}</span>
        <span class="type-count">{{ store.typeStats[type as string] || 0 }}</span>
      </button>
      <!-- 全部按钮 -->
      <button
        :class="['type-btn', !store.activeType ? 'active' : '']"
        @click="handleTypeClick(null)"
      >
        <svg class="type-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="8"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>
        <span class="type-name">全部</span>
        <span class="type-count">{{ store.totalEquipment.toLocaleString() }}</span>
      </button>
    </div>

    <!-- 年份范围 -->
    <div class="section-title">
      <span class="title-icon">◆</span>
      <span>年份范围</span>
    </div>
    <div class="year-range">
      <div class="year-slider">
        <input
          type="range"
          :min="1940"
          :max="2030"
          :step="10"
          :value="yearRange[0]"
          class="range-input range-min"
          @input="handleMinYearChange"
        />
        <input
          type="range"
          :min="1940"
          :max="2030"
          :step="10"
          :value="yearRange[1]"
          class="range-input range-max"
          @input="handleMaxYearChange"
        />
      </div>
      <div class="year-display">
        <span class="year-val">{{ yearRange[0] }}</span>
        <span class="year-sep">—</span>
        <span class="year-val">{{ yearRange[1] }}</span>
      </div>
    </div>

    <!-- 国家列表 -->
    <div class="section-title">
      <span class="title-icon">◆</span>
      <span>国家列表</span>
      <span class="title-count">{{ store.displayCountries.length }}</span>
    </div>
    <div class="country-list">
      <div
        v-for="country in store.displayCountries"
        :key="country.code"
        :class="['country-item', store.currentCountry?.code === country.code ? 'active' : '']"
        @click="handleCountryClick(country.code)"
      >
        <span class="country-flag">{{ country.flag }}</span>
        <span class="country-name">{{ country.code }} {{ country.name }}</span>
        <span class="country-count">{{ country.equipmentCount.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useGlobeStore } from '@/stores/globeStore'
import { EQUIPMENT_TYPE_CONFIG } from '@/types'

const store = useGlobeStore()
const yearRange = ref<[number, number]>([1940, 2030])

onMounted(() => {
  console.log('[SidebarPanel] 组件挂载')
})

watch(
  () => store.yearRange,
  (range) => {
    yearRange.value = [...range] as [number, number]
  },
  { immediate: true }
)

function handleTypeClick(type: string | null) {
  console.log('[SidebarPanel] 类型筛选点击:', type || '全部')
  store.setActiveType(type)
}

function handleMinYearChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  if (val <= yearRange.value[1]) {
    yearRange.value = [val, yearRange.value[1]]
    store.setYearRange(yearRange.value)
  }
}

function handleMaxYearChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  if (val >= yearRange.value[0]) {
    yearRange.value = [yearRange.value[0], val]
    store.setYearRange(yearRange.value)
  }
}

function handleCountryClick(code: string) {
  console.log('[SidebarPanel] 点击国家:', code)
  store.selectCountry(code)
}
</script>

<style scoped lang="scss">
.sidebar-panel {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: rgba(10, 14, 23, 0.92);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(0, 229, 255, 0.2);
  color: #e0f7fa;
  font-family: 'Roboto Mono', 'Courier New', monospace;
  overflow: hidden;
}

// ============== 统计概览 ==============
.stats-overview {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  padding: 12px 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 0;

  & + .stat-item {
    border-left: 1px solid rgba(0, 229, 255, 0.15);
  }
}

.stat-label {
  font-size: 10px;
  color: #80deea;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #00e5ff;
  font-family: 'Orbitron', monospace;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
}

// ============== 分区标题 ==============
.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px 6px;
  font-size: 11px;
  color: #80deea;
  letter-spacing: 1px;
  text-transform: uppercase;
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

// ============== 类型筛选 ==============
.type-filter {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  padding: 0 10px 10px;
  width: 100%;
  box-sizing: border-box;
}

.type-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 8px 8px;
  background: rgba(10, 14, 23, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 2px;
  color: #88E8FF;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
  transition: all 0.2s ease-out;
  position: relative;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: visible;
  
  // 文字渲染优化
  font-smooth: always;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  
  // 顶部微高光折射
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);

  &:hover {
    background: rgba(10, 14, 23, 0.7);
    border-color: rgba(0, 217, 255, 0.5);
    color: #00D9FF;
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 6px rgba(0, 217, 255, 0.25);
  }

  &.active {
    background: rgba(10, 14, 23, 0.8);
    border-color: #00D9FF;
    color: #00D9FF;
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 0 8px rgba(0, 217, 255, 0.4);
  }
}

.type-icon-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: inherit;
  transition: color 0.2s ease-out;
}

.type-name {
  font-size: 11px;
  font-weight: 500;
  color: inherit;
  flex: 0 1 auto;
  white-space: nowrap;
  overflow: visible;
  transition: color 0.2s ease-out;
}

.type-count {
  font-size: 10px;
  font-weight: 400;
  font-family: 'Orbitron', 'Roboto Mono', monospace;
  font-variant-numeric: tabular-nums;
  color: #5A7B8C;
  flex-shrink: 0;
  margin-left: 6px;
  text-align: right;
  transition: color 0.2s ease-out;
}

.type-btn.active .type-count {
  color: #00D9FF;
}

// ============== 年份范围 ==============
.year-range {
  padding: 0 14px 10px;
}

.year-slider {
  position: relative;
  height: 20px;
}

.range-input {
  position: absolute;
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
  top: 8px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #00e5ff;
    border: 2px solid #0a1a2a;
    cursor: pointer;
    pointer-events: all;
    box-shadow: 0 0 6px rgba(0, 229, 255, 0.6);
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #00e5ff;
    border: 2px solid #0a1a2a;
    cursor: pointer;
    pointer-events: all;
    box-shadow: 0 0 6px rgba(0, 229, 255, 0.6);
  }
}

.year-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}

.year-val {
  font-family: 'Orbitron', monospace;
  font-size: 12px;
  color: #00e5ff;
}

.year-sep {
  color: #546e7a;
}

// ============== 国家列表 ==============
.country-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 6px 6px;

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

.country-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(0, 229, 255, 0.08);
  }

  &.active {
    background: rgba(0, 229, 255, 0.15);
    border-left: 2px solid #00e5ff;
  }
}

.country-flag {
  font-size: 16px;
  line-height: 1;
}

.country-name {
  flex: 1;
  font-size: 12px;
  color: #b0bec5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.country-item.active .country-name {
  color: #00e5ff;
}

.country-count {
  font-family: 'Orbitron', monospace;
  font-size: 11px;
  color: #90a4ae;
  min-width: 36px;
  text-align: right;
}

.country-item.active .country-count {
  color: #00e5ff;
}
</style>
