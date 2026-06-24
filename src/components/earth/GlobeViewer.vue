<template>
  <div style="position: relative; width: 100%; height: 100%;">
    <div
      ref="container"
      class="globe-container"
      style="width: 100%; height: 100%;"
    >
      <div v-show="loading" class="globe-loading">
        <div class="loading-ring"></div>
        <div class="loading-text">INITIALIZING GLOBAL TACTICAL GRID</div>
      </div>
    </div>
    <!-- 引导线叠加层：作为 globe-container 的兄弟元素，避免被 ECharts 初始化覆盖 -->
    <div class="guideline-layer">
      <div
        v-if="guideLine.visible"
        class="guideline-line"
        :style="guideLine.lineStyle"
      >
        <div class="guideline-dot"></div>
      </div>
      <div
        v-if="guideLine.cardVisible"
        class="guideline-card"
        :style="guideLine.cardStyle"
        @mouseenter="pauseAutoRotate"
        @mouseleave="resumeAutoRotate"
      >
        <!-- HUD 四角装饰 -->
        <div class="hud-corner hud-corner-tl"></div>
        <div class="hud-corner hud-corner-tr"></div>
        <div class="hud-corner hud-corner-bl"></div>
        <div class="hud-corner hud-corner-br"></div>
        
        <!-- 国家名称（居中，顶部） -->
        <div class="card-country-name">{{ guideLine.countryName }}</div>
        
        <!-- 核心数据 -->
        <div class="card-core-data">
          <div class="card-equip-count">装备总数 {{ formatNumber(guideLine.equipCount) }}</div>
          <div class="card-rank">全球排名 #{{ guideLine.rank }}</div>
        </div>
        
        <!-- 分隔线 -->
        <div class="separator-line"></div>
        
        <!-- 军备分类数据（带进度条） -->
        <div class="category-section">
          <div class="category-row">
            <span class="category-label">空军</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getTypePercent('aircraft') + '%' }"></div>
            </div>
            <span class="category-value">{{ formatNumber(getTypeCount('aircraft')) }}</span>
          </div>
          <div class="category-row">
            <span class="category-label">陆军</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: (getTypePercent('armor') + getTypePercent('weapon')) + '%' }"></div>
            </div>
            <span class="category-value">{{ formatNumber(getTypeCount('armor') + getTypeCount('weapon')) }}</span>
          </div>
          <div class="category-row">
            <span class="category-label">海军</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: (getTypePercent('ship') + getTypePercent('submarine')) + '%' }"></div>
            </div>
            <span class="category-value">{{ formatNumber(getTypeCount('ship') + getTypeCount('submarine')) }}</span>
          </div>
        </div>
        
        <!-- 分隔线 -->
        <div class="separator-line"></div>
        
        <!-- 代表装备 -->
        <div class="weapons-section">
          <span class="weapons-label">代表装备：</span>
          <div class="weapons-list">
            <template v-for="(equip, index) in getTopEquipment()" :key="index">
              <span class="weapon-item">{{ equip.name }}</span>
            </template>
          </div>
        </div>
        
        <!-- 分隔线 -->
        <div class="separator-line"></div>
        
        <!-- 军力等级 -->
        <div class="rank-section">
          <span class="rank-label">军力等级：</span>
          <span class="rank-badge" :class="'rank-' + getMilitaryRank()">{{ getMilitaryRank() }}</span>
        </div>
        
        <!-- 查看详情按钮（默认半透明，悬停时完全可见） -->
        <div class="view-detail-btn" @click.stop="handleViewDetail">查看详情 →</div>
      </div>

      <!-- 二级引导线（连接一级卡片和二级面板） -->
      <div
        v-if="guideLine.secondaryLineVisible"
        class="secondary-guideline"
        :style="guideLine.secondaryLineStyle"
      ></div>

      <!-- 二级全息面板 -->
      <div
        v-if="detailPanelVisible"
        class="detail-panel"
        :style="detailPanelStyle"
        @mouseenter="pauseAutoRotate"
        @mouseleave="resumeAutoRotate"
      >
        <!-- HUD 四角装饰 -->
        <div class="hud-corner hud-corner-tl"></div>
        <div class="hud-corner hud-corner-tr"></div>
        <div class="hud-corner hud-corner-bl"></div>
        <div class="hud-corner hud-corner-br"></div>
        
        <!-- 顶部扫描线 -->
        <div class="scan-line"></div>
        
        <!-- 头部区域（国家名称 + 军力等级 + 关闭按钮） -->
        <div class="detail-panel-header">
          <div class="title-area">
            <span class="country-name">{{ guideLine.countryName }}</span>
            <span class="rank-badge" :class="'rank-' + getMilitaryRank()">{{ getMilitaryRank() }}</span>
          </div>
          <button class="close-btn" @click.stop="closeDetailPanel">✕</button>
        </div>
        
        <!-- 核心指标区域（三列等宽卡片） -->
        <div class="core-metrics">
          <div class="metric-card">
            <div class="metric-value">{{ formatNumber(guideLine.equipCount) }}<span class="metric-unit">件</span></div>
            <div class="metric-label">装备总数</div>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-card">
            <div class="metric-value">#{{ guideLine.rank }}</div>
            <div class="metric-label">全球排名</div>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-card">
            <div class="metric-value trend-up">↑ 5%</div>
            <div class="metric-label">近5年趋势</div>
          </div>
        </div>
        
        <!-- 分隔线 -->
        <div class="separator-line"></div>
        
        <!-- 三军分类数据（两列网格布局） -->
        <div class="category-section">
          <div class="category-title">三军分类</div>
          <div class="category-grid">
            <!-- 空军 -->
            <div class="category-block">
              <div class="block-header">空军</div>
              <div class="block-items">
                <div class="item-row">
                  <span class="item-label">战斗机</span>
                  <span class="item-value">{{ getTypeCount('aircraft') }}</span>
                </div>
                <div class="item-row">
                  <span class="item-label">直升机</span>
                  <span class="item-value">{{ Math.floor(getTypeCount('aircraft') * 0.3) }}</span>
                </div>
              </div>
            </div>
            <!-- 陆军 -->
            <div class="category-block">
              <div class="block-header">陆军</div>
              <div class="block-items">
                <div class="item-row">
                  <span class="item-label">坦克</span>
                  <span class="item-value">{{ getTypeCount('armor') }}</span>
                </div>
                <div class="item-row">
                  <span class="item-label">火炮</span>
                  <span class="item-value">{{ getTypeCount('weapon') }}</span>
                </div>
              </div>
            </div>
            <!-- 海军 -->
            <div class="category-block">
              <div class="block-header">海军</div>
              <div class="block-items">
                <div class="item-row">
                  <span class="item-label">舰艇</span>
                  <span class="item-value">{{ getTypeCount('ship') }}</span>
                </div>
                <div class="item-row">
                  <span class="item-label">潜艇</span>
                  <span class="item-value">{{ getTypeCount('submarine') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分隔线 -->
        <div class="separator-line"></div>
        
        <!-- 代表装备区域（类型标识 + 型号名称） -->
        <div class="weapons-section">
          <div class="weapons-title">代表装备</div>
          <div class="weapons-list">
            <template v-if="getTopEquipment().length > 0">
              <div v-for="(equip, index) in getTopEquipment().slice(0, 5)" :key="index" class="weapon-item">
                <span class="weapon-text">{{ formatEquipmentDisplay(equip) }}</span>
              </div>
            </template>
            <div v-else class="weapon-empty">暂无代表装备</div>
          </div>
        </div>
        
        <!-- 分隔线 -->
        <div class="separator-line"></div>
        
        <!-- 装备数量趋势图（Canvas） -->
        <div class="trend-chart-section">
          <div class="chart-title">装备数量趋势</div>
          <div class="chart-container">
            <canvas
              ref="trendChartCanvas"
              class="trend-canvas"
              @mousemove="handleTrendChartMouseMove"
              @mouseleave="handleTrendChartMouseLeave"
            ></canvas>
          </div>
          <div class="chart-note">模拟数据，仅供参考</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * GlobeViewer.vue
 * 3D 地球视图组件（核心渲染）
 *
 * 生命周期策略：由父组件 GlobalOverviewView 通过 :key 控制重建
 * onUnmounted 完整清理 ECharts 实例、事件监听、定时器
 */
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import { useGlobeStore } from '@/stores/globeStore'
import { storeToRefs } from 'pinia'
import { eventBus, Events } from '@/utils/EventBus'
import type { Country } from '@/types'

// ========== 粒子系统类定义 ==========

// 粒子类
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  life: number
  maxLife: number

  constructor() {
    this.reset(0, 0)
  }

  reset(x: number, y: number) {
    this.x = x
    this.y = y
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 2
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.size = 2 + Math.random() * 4
    this.alpha = 0.7 + Math.random() * 0.3
    this.color = `hsl(${180 + Math.random() * 30}, 100%, 60%)`
    this.life = 1.0
    this.maxLife = 60 + Math.random() * 30
  }

  update(): boolean {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.98
    this.vy *= 0.98
    this.life -= 1 / this.maxLife
    this.alpha = this.life * 0.8
    this.size = this.size * this.life
    return this.life > 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.shadowBlur = this.size * 2
    ctx.shadowColor = '#00D9FF'
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// 粒子池类
class ParticlePool {
  private pool: Particle[] = []
  private active: Particle[] = []

  get(x: number, y: number): Particle {
    let p = this.pool.pop()
    if (!p) p = new Particle()
    p.reset(x, y)
    this.active.push(p)
    return p
  }

  updateAndDraw(ctx: CanvasRenderingContext2D) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const p = this.active[i]
      const alive = p.update()
      if (alive) p.draw(ctx)
      else {
        this.active.splice(i, 1)
        this.pool.push(p)
      }
    }
  }

  clear() {
    this.active = []
    this.pool = []
  }

  getCount(): number {
    return this.active.length
  }
}

const store = useGlobeStore()
const { countryCoords, countryNameMap, currentStats } = storeToRefs(store)
const container = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
const loading = ref(true)
let isUnmounted = false

// ============== 状态变量 ==============
let geoJsonData: any[] = []
let countryBBoxes: Array<{
  code: string; minLon: number; maxLon: number; minLat: number; maxLat: number; polygons: number[][][]
}> = []
let borderLinesCache: any[] = []
let breathingTimer: number | null = null
let selectedCountryCode: string | null = null
let resizeHandler: (() => void) | null = null
let resizeObserver: ResizeObserver | null = null  // 容器级尺寸监听（ResizeObserver）
let resizeDebounceTimer: number | null = null    // 防抖定时器
const isFlying = ref(false) // 定位动画进行中标记
const isHoveringCard = ref(false) // 悬停卡片标记（防止引导线消失）
const borderCache = new Map<string, any[]>() // 边界线预渲染缓存

// ========== 状态锁定机制：防止引导线闪烁问题 ==========
let isShowingGuideLine = false  // 正在显示引导线标记
let guideLineLock = false       // 引导线锁定标记（防止竞争条件）
let borderShownSuccessfully = false // 修复印度闪烁问题：标记边界是否成功显示

// ============== 引导线状态 ==============
const guideLineLayer = ref<HTMLDivElement | null>(null)
const guideLine = reactive({
  visible: false,
  cardVisible: false,
  countryName: '',
  equipCount: 0,
  rank: 0,
  lineStyle: {} as Record<string, string>,
  cardStyle: {} as Record<string, string>,
  secondaryLineVisible: false,
  secondaryLineStyle: {} as Record<string, string>
})
let guideLineTimer: number | null = null
let guideLineCleanupTimer: number | null = null
let showGuideLineCardTimer: number | null = null  // showGuideLine内部的setTimeout（显示卡片）
let hideGuideLineDomTimer: number | null = null   // hideGuideLine内部的setTimeout（隐藏DOM）
let hideGuideLineCleanupTimer: number | null = null  // hideGuideLine内部的setTimeout（彻底清理）
let hideGuideLineDelayTimer: number | null = null  // hideGuideLine延迟执行的setTimeout

// ============== 引导线实时同步机制 ==============
let guideLineSyncFrameId: number | null = null  // requestAnimationFrame ID
let lastGuideLineUpdateTime = 0  // 上次更新时间戳（节流用）

/**
 * 将经纬度坐标转换为屏幕像素坐标（ECharts GL convertToPixel API）
 * @param lon 经度
 * @param lat 纬度
 * @returns 屏幕像素坐标 [x, y] 或 null（转换失败时）
 */
// 记录 convertToPixel 连续失败次数，超过阈值后停止尝试（避免控制台刷屏）
let convertToPixelFailCount = 0
const CONVERT_TO_PIXEL_MAX_FAIL = 3

function convertGeoToPixel(lon: number, lat: number): [number, number] | null {
  if (!chart || !container.value) {
    return null
  }

  // 如果连续失败次数已达上限，直接返回 null 不再尝试（防止控制台刷屏）
  if (convertToPixelFailCount >= CONVERT_TO_PIXEL_MAX_FAIL) {
    return null
  }

  try {
    // 检查 globe 坐标系是否已就绪
    const globeModel = (chart as any)?._model?.getComponent?.('globe')
    if (!globeModel) {
      convertToPixelFailCount++
      return null
    }

    // 使用 ECharts GL 的 convertToPixel 将 globe 坐标系下的经纬度转换为屏幕像素
    const pixel = chart.convertToPixel('globe', [lon, lat]) as [number, number]

    if (!pixel || !Array.isArray(pixel) || pixel.length < 2) {
      convertToPixelFailCount++
      return null
    }

    // 成功时重置失败计数
    convertToPixelFailCount = 0
    return pixel
  } catch (e) {
    convertToPixelFailCount++
    return null
  }
}

/**
 * 获取当前国家的屏幕像素坐标（带缓存和回退机制）
 * @returns 屏幕像素坐标 [x, y]
 */
function getCurrentCountryPixelCoord(): [number, number] {
  // 优先从 store 获取当前选中国家的经纬度
  if (store.currentCountry && store.currentCountry.coord) {
    const [lon, lat] = store.currentCountry.coord
    const pixel = convertGeoToPixel(lon, lat)

    if (pixel) {
      return pixel
    }
  }

  // 回退方案：使用屏幕中心（保持原有行为）
  if (container.value) {
    const rect = container.value.getBoundingClientRect()
    return [rect.width / 2, rect.height / 2]
  }

  return [0, 0]
}

/**
 * 实时更新引导线位置（在地球旋转/定位动画期间调用）
 * 使用 requestAnimationFrame 实现平滑同步，添加节流减少 ECharts 警告
 */
function updateGuideLinePosition() {
  // 仅在引导线可见且组件未卸载时执行
  if (!guideLine.visible || isUnmounted || !chart) {
    guideLineSyncFrameId = null
    return
  }

  // 节流：每 50ms 最多更新一次，减少 ECharts 警告频率
  const now = Date.now()
  if (now - lastGuideLineUpdateTime < 50) {
    guideLineSyncFrameId = requestAnimationFrame(updateGuideLinePosition)
    return
  }
  lastGuideLineUpdateTime = now

  // 获取当前国家的实际屏幕坐标
  const [startX, startY] = getCurrentCountryPixelCoord()

  // 重新计算引导线终点（基于新起点）
  if (container.value) {
    const rect = container.value.getBoundingClientRect()
    const { angle, length } = calculateGuideLine(rect.width, rect.height)

    const angleRad = angle * (Math.PI / 180)
    const endX = startX + length * Math.cos(angleRad)
    const endY = startY + length * Math.sin(angleRad)

    // 卡片尺寸常量
    const cardW = 200
    const cardH = 280

    // 引导线终点偏移量（延伸到卡片内部）
    const offsetDistance = cardW * 0.3

    // 更新引导线起点和终点（无动画，直接设置）
    guideLine.lineStyle = {
      ...guideLine.lineStyle,
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${length + offsetDistance}px`
    }

    // 更新卡片位置（跟随引导线终点移动）
    if (guideLine.cardVisible) {
      guideLine.cardStyle = {
        ...guideLine.cardStyle,
        left: `${endX - cardW / 2}px`,
        top: `${endY - cardH / 2}px`
      }
    }
  }

  // 继续下一帧更新（实现持续同步）
  guideLineSyncFrameId = requestAnimationFrame(updateGuideLinePosition)
}

/**
 * 启动引导线实时同步（在显示引导线后调用）
 */
function startGuideLineSync() {
  // 先停止之前的同步循环
  stopGuideLineSync()

  // 启动新的同步循环
  guideLineSyncFrameId = requestAnimationFrame(updateGuideLinePosition)
}

/**
 * 停止引导线实时同步
 */
function stopGuideLineSync() {
  if (guideLineSyncFrameId !== null) {
    cancelAnimationFrame(guideLineSyncFrameId)
    guideLineSyncFrameId = null
  }
}

// ============== 窗口尺寸变化处理机制（双层监听） ==============

/**
 * 处理容器/窗口尺寸变化
 * - 强制更新 ECharts GL 画布尺寸与内部投影矩阵
 * - 重新计算引导线坐标（基于最新画布尺寸）
 * - 使用防抖避免高频触发（200ms）
 */
function handleContainerResize() {
  // 清除之前的防抖定时器
  if (resizeDebounceTimer !== null) {
    clearTimeout(resizeDebounceTimer)
  }

  // 防抖处理：200ms 后执行实际更新
  resizeDebounceTimer = window.setTimeout(() => {
    resizeDebounceTimer = null

    if (!chart || isUnmounted) return

    console.log('[Resize] 📐 容器尺寸变化，执行坐标重算')

    try {
      // 第一步：强制更新 ECharts GL 画布尺寸
      chart.resize()

      // 第二步：如果当前有激活的引导线，立即重新计算坐标
      if (guideLine.visible && store.currentCountry) {
        console.log('[Resize] 🔄 重新计算引导线位置')

        // 使用最新的画布尺寸重新计算国家屏幕坐标
        const [newStartX, newStartY] = getCurrentCountryPixelCoord()

        if (container.value) {
          const rect = container.value.getBoundingClientRect()
          const { angle, length } = calculateGuideLine(rect.width, rect.height)

          // 重新计算终点坐标
          const angleRad = angle * (Math.PI / 180)
          const endX = newStartX + length * Math.cos(angleRad)
          const endY = newStartY + length * Math.sin(angleRad)

          // 卡片尺寸常量
          const cardW = 200
          const cardH = 280
          const offsetDistance = cardW * 0.3

          // 立即更新引导线位置（无动画，直接设置）
          guideLine.lineStyle = {
            ...guideLine.lineStyle,
            left: `${newStartX}px`,
            top: `${newStartY}px`,
            width: `${length + offsetDistance}px`
          }

          // 更新卡片位置
          if (guideLine.cardVisible) {
            guideLine.cardStyle = {
              ...guideLine.cardStyle,
              left: `${endX - cardW / 2}px`,
              top: `${endY - cardH / 2}px`
            }
          }

          console.log('[Resize] ✅ 引导线坐标已更新:', {
            startPoint: [newStartX, newStartY],
            endPoint: [endX, endY]
          })
        }
      }

      // 第三步：延迟一帧后再次校准（确保 ECharts GL 渲染完成）
      requestAnimationFrame(() => {
        if (guideLine.visible && !isUnmounted) {
          const [finalX, finalY] = getCurrentCountryPixelCoord()
          if (container.value) {
            const rect = container.value.getBoundingClientRect()
            const { angle, length } = calculateGuideLine(rect.width, rect.height)
            const angleRad = angle * (Math.PI / 180)
            const endX = finalX + length * Math.cos(angleRad)
            const endY = finalY + length * Math.sin(angleRad)

            const cardW = 200
            const cardH = 280
            const offsetDistance = cardW * 0.3

            guideLine.lineStyle = {
              ...guideLine.lineStyle,
              left: `${finalX}px`,
              top: `${finalY}px`,
              width: `${length + offsetDistance}px`
            }

            if (guideLine.cardVisible) {
              guideLine.cardStyle = {
                ...guideLine.cardStyle,
                left: `${endX - cardW / 2}px`,
                top: `${endY - cardH / 2}px`
              }
            }

            console.log('[Resize] ✅ 渲染完成后二次校准完成')
          }
        }
      })
    } catch (e) {
      console.error('[Resize] ❌ 尺寸变化处理异常:', e)
    }
  }, 200) as unknown as number
}

/**
 * 初始化双层尺寸监听机制
 * - 第一层：window.resize 事件（窗口级）
 * - 第二层：ResizeObserver（容器级，覆盖侧边栏展开等非窗口resize场景）
 */
function initResizeListeners() {
  // ========== 第一层：窗口级监听 ==========
  resizeHandler = () => handleContainerResize()
  window.addEventListener('resize', resizeHandler)
  console.log('[Resize] ✅ 已注册窗口级 resize 监听')

  // ========== 第二层：容器级监听（ResizeObserver 兜底） ==========
  if (container.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        console.log('[Resize] 📦 容器尺寸变化检测:', { width, height })
        handleContainerResize()
      }
    })

    resizeObserver.observe(container.value)
    console.log('[Resize] ✅ 已注册 ResizeObserver 容器级监听')
  }
}

/**
 * 清理所有尺寸监听资源
 */
function cleanupResizeListeners() {
  // 清除防抖定时器
  if (resizeDebounceTimer !== null) {
    clearTimeout(resizeDebounceTimer)
    resizeDebounceTimer = null
  }

  // 移除窗口级监听
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
    console.log('[Resize] ⏹️ 已移除窗口级 resize 监听')
  }

  // 移除容器级监听
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
    console.log('[Resize] ⏹️ 已移除 ResizeObserver 容器级监听')
  }
}

// ============== 二级面板状态 ==============
const detailPanelVisible = ref(false)
const detailPanelStyle = reactive({
  top: '50%',
  left: '0px',
  transform: 'translateY(-50%)'
})
let detailPanelCloseTimer: number | null = null

// ============== Canvas趋势图相关 ==============
const trendChartCanvas = ref<HTMLCanvasElement | null>(null)
const trendChartData = reactive({
  data: [] as number[],
  labels: [] as string[],
  hoveredIndex: -1
})

// 生成模拟趋势数据（基于当前装备总数）
function generateTrendData(currentTotal: number): number[] {
  // 生成过去5年的模拟数据（同比正相关）
  const baseValue = currentTotal * 0.9 // 5年前的基础值
  const growthRate = 0.05 // 年增长率约5%
  
  const data: number[] = []
  for (let i = 0; i < 5; i++) {
    const yearValue = Math.round(baseValue * Math.pow(1 + growthRate, i))
    // 添加随机波动（±2%）
    const fluctuation = yearValue * (0.98 + Math.random() * 0.04)
    data.push(Math.round(fluctuation))
  }
  // 最后一年为当前值
  data.push(currentTotal)
  
  return data
}

// 绘制Canvas趋势图
function drawTrendChart() {
  if (!trendChartCanvas.value) return
  
  const canvas = trendChartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // 设置canvas尺寸
  const rect = canvas.parentElement?.getBoundingClientRect()
  if (!rect) return
  
  canvas.width = rect.width
  canvas.height = 120
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制网格线
  ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = (canvas.height - 20) * (i / 5) + 10
    ctx.beginPath()
    ctx.moveTo(40, y)
    ctx.lineTo(canvas.width - 20, y)
    ctx.stroke()
  }
  
  // 获取数据
  const data = trendChartData.data
  if (data.length === 0) return
  
  // 计算坐标
  const padding = 40
  const chartWidth = canvas.width - padding - 20
  const chartHeight = canvas.height - 20
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const valueRange = maxValue - minValue || 1
  
  const points: { x: number; y: number }[] = []
  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = chartHeight - ((value - minValue) / valueRange) * (chartHeight - 20) + 10
    points.push({ x, y })
  })
  
  // 绘制面积填充
  ctx.beginPath()
  ctx.moveTo(points[0].x, chartHeight)
  points.forEach(point => {
    ctx.lineTo(point.x, point.y)
  })
  ctx.lineTo(points[points.length - 1].x, chartHeight)
  ctx.closePath()
  
  const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight)
  gradient.addColorStop(0, 'rgba(0, 217, 255, 0.3)')
  gradient.addColorStop(1, 'rgba(0, 217, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fill()
  
  // 绘制折线
  ctx.beginPath()
  ctx.strokeStyle = '#00D9FF'
  ctx.lineWidth = 2
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.stroke()
  
  // 绘制数据点
  points.forEach((point, index) => {
    const isHovered = trendChartData.hoveredIndex === index
    const radius = isHovered ? 6 : 3
    
    // 外圈（白色边框）
    ctx.beginPath()
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 内圈（青蓝色填充）
    ctx.beginPath()
    ctx.arc(point.x, point.y, radius - 1, 0, Math.PI * 2)
    ctx.fillStyle = '#00D9FF'
    ctx.fill()
    
    // 悬停时显示数值
    if (isHovered) {
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '12px Roboto Mono'
      ctx.textAlign = 'center'
      ctx.fillText(data[index].toLocaleString(), point.x, point.y - 15)
    }
  })
  
  // 绘制坐标轴标签
  ctx.fillStyle = '#8899AA'
  ctx.font = '10px Roboto Mono'
  ctx.textAlign = 'center'
  
  // X轴标签（年份）
  const years = ['2020', '2021', '2022', '2023', '2024', '2025']
  years.forEach((year, index) => {
    const x = padding + (chartWidth / (years.length - 1)) * index
    ctx.fillText(year, x, canvas.height - 5)
  })
  
  // 绘制趋势箭头和百分比
  const firstValue = data[0]
  const lastValue = data[data.length - 1]
  const changePercent = ((lastValue - firstValue) / firstValue * 100).toFixed(1)
  const trendArrow = lastValue > firstValue ? '↑' : lastValue < firstValue ? '↓' : '→'
  const trendColor = lastValue > firstValue ? '#00FF88' : lastValue < firstValue ? '#FF4444' : '#8899AA'
  
  ctx.fillStyle = trendColor
  ctx.font = 'bold 14px Roboto Mono'
  ctx.textAlign = 'right'
  ctx.fillText(`${trendArrow} ${Math.abs(parseFloat(changePercent))}%`, canvas.width - 20, 20)
  
  // 图例
  ctx.fillStyle = '#00D9FF'
  ctx.font = '10px Roboto Mono'
  ctx.textAlign = 'left'
  ctx.fillText('装备总数', padding, 20)
}

// Canvas鼠标交互
function handleTrendChartMouseMove(e: MouseEvent) {
  if (!trendChartCanvas.value) return
  
  const canvas = trendChartCanvas.value
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const data = trendChartData.data
  if (data.length === 0) return
  
  const padding = 40
  const chartWidth = canvas.width - padding - 20
  
  // 计算最近的数据点索引
  const relativeX = x - padding
  const index = Math.round((relativeX / chartWidth) * (data.length - 1))
  
  if (index >= 0 && index < data.length) {
    trendChartData.hoveredIndex = index
    drawTrendChart()
  }
}

function handleTrendChartMouseLeave() {
  trendChartData.hoveredIndex = -1
  drawTrendChart()
}

// ============== 数据处理辅助函数 ==============
// 格式化数字（千位分隔符）
function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN')
}

// 获取指定类型的装备数量
function getTypeCount(type: string): number {
  if (!currentStats.value?.byType) return 0
  return currentStats.value.byType[type] || 0
}

// 获取指定类型的装备百分比
function getTypePercent(type: string): number {
  if (!currentStats.value?.byType || !guideLine.equipCount) return 0
  const count = currentStats.value.byType[type] || 0
  return Math.round((count / guideLine.equipCount) * 100)
}



// 获取代表装备（前3个最新装备）
function getTopEquipment(): Array<{ name: string; type: string }> {
  if (!currentStats.value?.topEquipment) return []
  return currentStats.value.topEquipment.slice(0, 3)
}

// 推断装备类型（根据型号名称关键词）
function inferEquipmentType(name: string): { label: string; icon: string } {
  // 战斗机关键词
  if (/MiG|Su-|F-|J-|Typhoon|Gripen|Rafale|Fighter/i.test(name)) {
    return { label: '战斗机', icon: '✈' }
  }
  // 直升机关键词
  if (/Ka-|Mi-\d|AH-|UH-|CH-|Helicopter|Heli/i.test(name)) {
    return { label: '直升机', icon: '🚁' }
  }
  // 舰艇关键词
  if (/Pr\.|舰|Destroyer|Frigate|Cruiser|Carrier|Submarine|Laika|Seawolf/i.test(name)) {
    return { label: '舰艇', icon: '🚢' }
  }
  // 坦克关键词
  if (/T-|M1|Leopard|Armata|Tank|MBT|Abrams/i.test(name)) {
    return { label: '坦克', icon: '🛡' }
  }
  // 火炮关键词
  if (/Artillery|Gun|Howitzer|Cannon|Mortar|MLRS/i.test(name)) {
    return { label: '火炮', icon: '💥' }
  }
  // 潜艇关键词
  if (/Submarine|Sub|U-|Kilo|Akula|Typhoon/i.test(name)) {
    return { label: '潜艇', icon: '⬇' }
  }
  // 默认类型
  return { label: '装备', icon: '⚙' }
}

// 格式化代表装备显示（类型：型号）
function formatEquipmentDisplay(equip: { name: string; type: string }): string {
  const inferred = inferEquipmentType(equip.name)
  return `${inferred.icon} ${inferred.label}：${equip.name}`
}

// 计算军力等级（S/A/B/C/D）
function getMilitaryRank(): string {
  const total = guideLine.equipCount
  if (total >= 5000) return 'S'
  if (total >= 2000) return 'A'
  if (total >= 500) return 'B'
  if (total >= 100) return 'C'
  return 'D'
}

// 查看详情按钮点击处理
function handleViewDetail() {
  const countryName = guideLine.countryName
  const countryCode = selectedCountryCode || 'Unknown'
  const equipCount = guideLine.equipCount

  console.log(`[GlobeViewer] 查看详情按钮点击: ${countryName} (${countryCode}), 装备总数: ${equipCount}`)

  // 计算二级面板位置（主卡片右侧 20px）
  const cardRect = guideLine.cardStyle
  if (cardRect.left) {
    const cardLeft = parseFloat(cardRect.left) || 0
    detailPanelStyle.left = `${cardLeft + 220}px` // 主卡片宽度 200px + 间距 20px
  }

  // 显示二级引导线（连接一级卡片和二级面板）
  if (cardRect.left && cardRect.top) {
    const cardLeft = parseFloat(cardRect.left) || 0
    const cardTop = parseFloat(cardRect.top) || 0
    const cardWidth = 200  // 一级卡片宽度
    const cardHeight = 280 // 一级卡片高度（估算）

    // 二级面板位置
    const panelLeft = cardLeft + cardWidth + 20
    const panelTop = parseFloat(detailPanelStyle.top) || 0

    // 二级引导线：从一级卡片右侧中心到二级面板左侧中心
    guideLine.secondaryLineStyle = {
      left: `${cardLeft + cardWidth}px`,
      top: `${cardTop + cardHeight / 2}px`,
      width: '20px', // 间距宽度
      height: '2px',
      background: 'linear-gradient(to right, rgba(0, 217, 255, 0.6) 0%, rgba(0, 217, 255, 0.3) 100%)',
      boxShadow: '0 0 6px rgba(0, 217, 255, 0.4)',
      opacity: '0.8'
    }
    guideLine.secondaryLineVisible = true
  }

  // 生成趋势数据
  trendChartData.data = generateTrendData(equipCount)
  trendChartData.labels = ['2020', '2021', '2022', '2023', '2024', '2025']
  trendChartData.hoveredIndex = -1

  // 打开二级面板
  detailPanelVisible.value = true

  // 暂停地球自动旋转
  pauseAutoRotate()

  // 在DOM更新后绘制趋势图
  nextTick(() => {
    setTimeout(() => {
      drawTrendChart()
    }, 100)
  })
}

// 关闭二级面板
function closeDetailPanel(immediate: boolean = false) {
  if (immediate) {
    // 无动画直接关闭
    detailPanelVisible.value = false
  } else {
    // 带动画关闭（后续可添加退场动画）
    detailPanelVisible.value = false
  }
  
  // 恢复地球自动旋转
  resumeAutoRotate()
}

// ============== 地形与高度常量 ==============
// 1:1 复刻旧项目：边界线 z = 0.01，散点隐藏在球内部
const BORDER_Z = 0.01  // 旧项目边界线高度

// setOption 安全包装：防重入 + try-catch + 延迟重置
// 1:1 复刻旧项目：第三个参数 lazyUpdate 用于 viewControl 动画
let setOptionPending = false
let setOptionPendingTimer: number | null = null
function safeSetOption(option: any, notMerge?: boolean, lazyUpdate?: boolean) {
  if (!chart || isUnmounted) return
  if (setOptionPending) {
    console.warn('[GlobeViewer] ⚠️ safeSetOption 被锁跳过 setOptionPending=true')
    return
  }
  setOptionPending = true
  // 清除旧的重置定时器，防止旧 timeout 意外解锁
  if (setOptionPendingTimer !== null) {
    clearTimeout(setOptionPendingTimer)
    setOptionPendingTimer = null
  }
  try {
    chart.setOption(option, notMerge, lazyUpdate)
  } catch (e) {
    // 忽略渲染期间冲突
  }
  // 延迟重置，给 ECharts 渲染足够时间
  setOptionPendingTimer = window.setTimeout(() => {
    setOptionPending = false
    setOptionPendingTimer = null
  }, 50) as unknown as number
}

// 散点更新防抖
let scatterUpdateTimer: number | null = null
function debouncedUpdateScatter() {
  if (scatterUpdateTimer !== null) clearTimeout(scatterUpdateTimer)
  scatterUpdateTimer = window.setTimeout(() => {
    updateCountryScatter()
  }, 100) as unknown as number
}

// ============== 纹理检测与生成 ==============
async function checkTextureExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

function generateBlueMarbleTexture(): string {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height)
  ocean.addColorStop(0, '#0a2540')
  ocean.addColorStop(0.5, '#1e5b94')
  ocean.addColorStop(1, '#0a2540')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const continents: Array<[number, number, number, number, string]> = [
    [400, 300, 200, 180, '#3d6b3d'], [450, 550, 150, 200, '#2d5a3d'],
    [1000, 280, 250, 200, '#4a7a4a'], [1100, 480, 200, 220, '#5a8a3d'],
    [1020, 600, 120, 180, '#3d6b3d'], [1450, 700, 180, 100, '#5a7a3d'],
    [1700, 200, 250, 100, '#dfe8f0']
  ]
  continents.forEach(([x, y, w, h, color]) => {
    const grad = ctx.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, w)
    grad.addColorStop(0, color)
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  const atmos = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width * 0.4,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.55
  )
  atmos.addColorStop(0, 'transparent')
  atmos.addColorStop(0.8, 'rgba(100, 180, 255, 0.3)')
  atmos.addColorStop(1, 'rgba(150, 220, 255, 0.8)')
  ctx.fillStyle = atmos
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg', 0.85)
}

// ============== 加载 GeoJSON ==============
async function loadLocalGeoJson(): Promise<boolean> {
  try {
    const res = await fetch('/data/countries.geo.json')
    if (!res.ok) {
      console.warn('[GlobeViewer] GeoJSON 加载失败，将使用简化坐标')
      return false
    }
    const data = await res.json()
    geoJsonData = data.features || []
    buildBoundingBoxes()
    return true
  } catch (e) {
    console.warn('[GlobeViewer] GeoJSON 加载异常:', e)
    return false
  }
}

function buildBoundingBoxes() {
  countryBBoxes = []
  for (const feature of geoJsonData) {
    const name: string = feature.properties?.name || feature.properties?.NAME || ''
    const code = findCountryCodeByName(name)
    if (!code) continue

    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity
    const polygons: number[][][] = []

    function traverse(coords: any) {
      if (typeof coords[0] === 'number') {
        const lon = coords[0], lat = coords[1]
        if (lon < minLon) minLon = lon
        if (lon > maxLon) maxLon = lon
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      } else {
        for (const c of coords) traverse(c)
      }
    }

    if (feature.geometry?.coordinates) {
      traverse(feature.geometry.coordinates)
      if (feature.geometry.type === 'Polygon') {
        polygons.push(feature.geometry.coordinates[0] as number[][])
      } else if (feature.geometry.type === 'MultiPolygon') {
        for (const poly of feature.geometry.coordinates) {
          polygons.push(poly[0] as number[][])
        }
      }
    }

    countryBBoxes.push({ code, minLon, maxLon, minLat, maxLat, polygons })
  }
  console.log('[GlobeViewer] 边界框构建完成，共', countryBBoxes.length, '个国家')
}

function findCountryCodeByName(name: string): string | null {
  for (const code in countryNameMap.value) {
    if (countryNameMap.value[code] === name) return code
  }
  return null
}

// ============== 边界高亮 ==============
function extractCountryBorders(countryCode: string): any[] {
  const name = countryNameMap.value[countryCode]
  if (!name) return []
  const feature = geoJsonData.find(f => f.properties?.name === name)
  if (!feature) return []

  const lines: any[] = []
  function processCoords(coords: any) {
    if (typeof coords[0] === 'number') return
    if (typeof coords[0][0] === 'number') {
      for (let i = 0; i < coords.length - 1; i++) {
        lines.push({
          coords: [
            [coords[i][0], coords[i][1]],
            [coords[i + 1][0], coords[i + 1][1]]
          ]
        })
      }
    } else {
      for (const c of coords) processCoords(c)
    }
  }

  if (feature.geometry?.coordinates) {
    processCoords(feature.geometry.coordinates)
  }
  return lines
}

function showCountryBorder(countryCode: string) {
  const borderStartTime = performance.now()
  // ========== 重置边界显示标记 ==========
  borderShownSuccessfully = false
  
  if (borderLinesCache.length > 0) {
    hideCountryBorder()
  }

  if (!geoJsonData.length) {
    console.warn('[GlobeViewer] GeoJSON 数据未加载，无法显示边界')
    // ========== 边界数据缺失时，标记为失败 ==========
    borderShownSuccessfully = false
    return
  }

  // 从缓存读取，没有则计算并缓存
  const wasCached = borderCache.has(countryCode)
  if (!wasCached) {
    const rawLines = extractCountryBorders(countryCode)
    if (rawLines.length === 0) {
      const geoName = countryNameMap.value[countryCode]
      const availableNames = geoJsonData.slice(0, 10).map((f: any) => f.properties?.name || f.properties?.NAME)
      console.warn('[GlobeViewer] 未找到边界数据:', countryCode, '期望名称:', geoName, 'GeoJSON前10:', availableNames)
      // ========== 边界数据缺失时，标记为失败 ==========
      borderShownSuccessfully = false
      return
    }
    // 边界线高度 BORDER_Z = 0.01（1:1 复刻旧项目）
    const elevatedLines = rawLines.map(line => ({
      coords: line.coords.map((coord: number[]) => [coord[0], coord[1], BORDER_Z])
    }))
    borderCache.set(countryCode, elevatedLines)
  }

  borderLinesCache = borderCache.get(countryCode)!
  if (!borderLinesCache.length) {
    // ========== 边界数据缺失时，标记为失败 ==========
    borderShownSuccessfully = false
    return
  }

  // ========== 边界成功显示时，标记为成功 ==========
  borderShownSuccessfully = true
  const borderElapsed = performance.now() - borderStartTime
  console.log(`[GlobeViewer] 边界高亮显示成功: ${countryCode} 共 ${borderLinesCache.length} 条线段  耗时: ${borderElapsed.toFixed(1)}ms (${wasCached ? '缓存命中' : '首次计算'})`)
  safeSetOption({
    series: [{
      id: 'country-border-lines',
      type: 'lines3D',
      coordinateSystem: 'globe',
      data: borderLinesCache,
      lineStyle: { color: '#00D9FF', width: 3, opacity: 1 },
      blendMode: 'lighter',
      depthTest: false, // 关闭深度测试，永远显示在最上层
      silent: true,
      zlevel: 10
    }]
  }, false)
  startBreathingAnimation()
}

function hideCountryBorder() {
  stopBreathingAnimation()
  if (!chart) return

  // 直接瞬间消失，不做渐变动画（避免打断 autoRotate）
  safeSetOption({
    series: [{
      id: 'country-border-lines',
      type: 'lines3D',
      coordinateSystem: 'globe',
      data: [],           // 清空数据
      lineStyle: { opacity: 0, width: 2 }
    }]
  }, false, false)  // lazyUpdate=false，立即执行但不触发动画

  borderLinesCache = []
}

// 1:1 复刻旧项目呼吸动画：2 态切换（明 1.0 / 暗 0.5），周期 2000ms
const BREATHING_PERIOD = 2000     // 1:1 复刻旧项目 BORDER_CONFIG.breathingPeriod
const BREATHING_OPACITY_MAX = 1.0 // 1:1 复刻旧项目 BORDER_CONFIG.opacityMax
const BREATHING_OPACITY_MIN = 0.5 // 1:1 复刻旧项目 BORDER_CONFIG.opacityMin

function startBreathingAnimation() {
  stopBreathingAnimation()

  // 旧项目：setInterval 1000ms 切换一次状态（半周期）
  let isLight = true  // 初始为亮态
  function animate() {
    if (!chart || isUnmounted) return
    isLight = !isLight
    const opacity = isLight ? BREATHING_OPACITY_MAX : BREATHING_OPACITY_MIN
    safeSetOption({
      series: [{
        id: 'country-border-lines',
        lineStyle: { opacity }
      }]
    }, false)
    breathingTimer = window.setTimeout(animate, BREATHING_PERIOD / 2) as unknown as number
  }
  breathingTimer = window.setTimeout(animate, BREATHING_PERIOD / 2) as unknown as number
}

function stopBreathingAnimation() {
  if (breathingTimer !== null) {
    clearTimeout(breathingTimer)
    breathingTimer = null
  }
}

// ============== 点击处理（1:1 复刻旧项目：球体射线 + pointInPolygon） ==============
// 完全移除"点击 scatter 触发定位"路径（scatter 已 silent: true，不再触发 click）
// 改用 ECharts 原生 click 事件 + params.event 鼠标坐标 → screenToGeo → findCountryByPoint
// 这样点击球体上任意位置（陆地/海洋）都能准确定位到国家

function handleSeriesClick(params: any) {
  if (isUnmounted) return

  // 1) 兜底：如果点击的是 scatter（理论上不会发生，因 scatter.silent=true），仍然支持
  if (params.componentType === 'series' && params.seriesId === 'country-scatter') {
    const code = params.data?.code
    if (code) {
      handleCountryClicked(code)
      return
    }
  }

  // 2) 主路径：1:1 复刻旧项目，将鼠标坐标转换为经纬度并匹配国家
  if (!params.event || !container.value) return
  const e = params.event as MouseEvent
  const rect = container.value.getBoundingClientRect()
  const x = e.offsetX ?? (e.clientX - rect.left)
  const y = e.offsetY ?? (e.clientY - rect.top)
  const w = rect.width
  const h = rect.height

  const geo = screenToGeo(x, y, w, h)
  if (!geo) return  // 点击在球体投影圆外（空白区域）

  const [lon, lat] = geo
  const countryCode = findCountryByPoint(lon, lat)
  if (!countryCode) return  // 点击在海洋或无数据区域

  console.log('[GlobeViewer] 球体点击 → 国家:', countryCode, `[${lon.toFixed(2)}, ${lat.toFixed(2)}]`)
  handleCountryClicked(countryCode)
}

// ============== 经纬度反算（屏幕坐标 → 球面坐标）==============
// 1:1 复刻旧项目 screenToGeo：将 canvas 上的像素位置映射到 [lon, lat]
//   - 将屏幕坐标投影到虚拟球体表面（r = min(w,h) * 0.38，对应 ECharts globe 渲染半径）
//   - 球内：反算 lon = atan2(dx, z)，lat = -asin(dy / r)
//   - 球外：返回 null（点击空白处，不响应）
function screenToGeo(x: number, y: number, w: number, h: number): [number, number] | null {
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.38
  const dx = x - cx
  const dy = y - cy
  const distSq = dx * dx + dy * dy
  if (distSq > r * r) return null  // 球外空白
  const z = Math.sqrt(Math.max(0, r * r - distSq))
  const lon = Math.atan2(dx, z) * (180 / Math.PI)
  const lat = -Math.asin(dy / r) * (180 / Math.PI)
  return [lon, lat]
}

// ============== 射线法：判断点是否在多边形内 ==============
function pointInRing(px: number, py: number, ring: number[][]): boolean {
  let inside = false
  const n = ring.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = ring[i][0], yi = ring[i][1]
    const xj = ring[j][0], yj = ring[j][1]
    const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

// ============== 经纬度 → 国家（point-in-polygon） ==============
// 1:1 复刻旧项目 findCountryByPoint：先用 bounding box 粗筛，再做精确 pointInRing
function findCountryByPoint(lon: number, lat: number): string | null {
  for (const bbox of countryBBoxes) {
    if (lon < bbox.minLon || lon > bbox.maxLon || lat < bbox.minLat || lat > bbox.maxLat) {
      continue
    }

    const feature = geoJsonData.find(f => {
      const name: string = f.properties?.name || f.properties?.NAME || ''
      const mappedCode = findCountryCodeByName(name)
      return mappedCode === bbox.code
    })
    if (!feature || !feature.geometry?.coordinates) continue

    const coords = feature.geometry.coordinates
    // 处理 MultiPolygon / Polygon 两种结构
    if (feature.geometry.type === 'Polygon') {
      for (const ring of coords) {
        if (pointInRing(lon, lat, ring)) return bbox.code
      }
    } else if (feature.geometry.type === 'MultiPolygon') {
      for (const polygon of coords) {
        for (const ring of polygon) {
          if (pointInRing(lon, lat, ring)) return bbox.code
        }
      }
    }
  }
  return null
}

// ============== 飞行到国家 ==============
// 1:1 复刻旧项目：点击国家立即定位，无任何视觉死区
//   t=0     : 清理上一定时器 + hideCountryBorder + stopBreathing + isFlying=true + 立即 setOption
//   t=1500ms: showCountryBorder（边界高亮）
//   t=3000ms: hideCountryBorder + resumeAutoRotate
let borderDisplayTimer: number | null = null  // 边界显示延迟定时器
let autoRotateTimer: number | null = null     // 自动旋转恢复定时器
const BORDER_DISPLAY_DURATION = 5000          // 边界显示总时长（引导线可见约3秒）

// ============== 引导线核心函数 ==============

/**
 * 计算引导线的方向和长度
 *
 * 核心逻辑：
 * - 地球渲染半径 R = min(w, h) * 0.38（与 screenToGeo 中的 r 一致）
 * - 国家定位后在屏幕中心 (cx, cy)
 * - 引导线从中心向外延伸 R + margin，确保卡片完全在地球外围空白区
 * - 方向：默认正上方(-90°)，右侧面板打开时偏左上(-135°)
 * - 线条使用水平 div + transformOrigin: 'left center' + rotate(angle)
 *   （水平线自左向右，绕左端旋转 angle° 即指向 math 坐标系中的 angle 方向）
 */
function calculateGuideLine(
  containerWidth: number,
  containerHeight: number
): { angle: number; length: number } {
  const isRightPanelOpen = store.currentStats !== null

  // 方向：正上方优先，右侧面板打开时偏左上避让
  const angle = isRightPanelOpen ? -135 : -90

  // 地球渲染半径（与 screenToGeo 函数一致）
  const globeRadius = Math.min(containerWidth, containerHeight) * 0.38

  // 线条总长 = 地球半径 + 额外边距，确保卡片完全落在球外空白区
  const margin = containerWidth < 1024 ? 50 : 80
  const length = globeRadius + margin

  return { angle, length }
}

/**
 * 创建并显示引导线 + 信息卡片
 *
 * 线条结构：一个水平 div（width=长度, height=2px），
 * 左端锚定在国家中心 (cx,cy)，绕左端旋转 angle° 指向终点方向。
 * 渐变从左（起点，靠近国家）到右（终点，靠近卡片）：淡化消失的效果。
 */
function showGuideLine() {
  // ========== 状态锁定：防止竞争条件 ==========
  if (isShowingGuideLine || guideLineLock) {
    return
  }
  
  guideLineLock = true
  isShowingGuideLine = true

  if (!container.value || !store.currentCountry || !store.currentStats) {
    guideLineLock = false
    isShowingGuideLine = false
    return
  }

  const rect = container.value.getBoundingClientRect()

  // ========== 核心修复：使用 ECharts GL convertToPixel API 获取国家实际屏幕坐标 ==========
  // 原问题：引导线起点固定在屏幕中心 (rect.width/2, rect.height/2)，
  //        未考虑地球旋转/定位动画过程中国家实际位置的偏移
  // 修复方案：动态计算国家经纬度对应的屏幕像素坐标，确保引导线起点精准锚定地球表面国家中心点
  const [cx, cy] = getCurrentCountryPixelCoord()

  const { angle, length } = calculateGuideLine(rect.width, rect.height)

  // 终点坐标（标准数学坐标系：0°=右, -90°=上, -135°=左上）
  const angleRad = angle * (Math.PI / 180)
  const endX = cx + length * Math.cos(angleRad)
  const endY = cy + length * Math.sin(angleRad)

  // 排名
  const rank = store.displayCountries.findIndex(c => c.code === store.currentCountry!.code) + 1

  guideLine.countryName = store.currentCountry.name
  guideLine.equipCount = store.currentStats.total
  guideLine.rank = rank > 0 ? rank : 0

  // 引导线：水平 div，左端在 (cx, cy)，向右延伸 length px，
  // 绕左端旋转 angle°，使其指向正确的数学方向。
  // transformOrigin: 'left center' → 旋转轴在 div 左边缘中点
  
  // ========== 引导线终点优化：从卡片内部引出 ==========
  // 原方案：引导线终点在卡片中心，显得线条"悬空"
  // 新方案：引导线终点从卡片内部引出（延伸到卡片内部，从"装备总数"或"全球排名"旁边）
  // 具体实现：延长引导线长度，让终点落在卡片内部
  
  // 卡片尺寸（用于计算引导线终点偏移）
  const cardW = 200  // 一级卡片宽度（与CSS一致）
  const cardH = 280  // 一级卡片高度（估算值，实际高度由内容决定）
  
  // 引导线终点偏移量：从卡片中心向内部延伸，让终点落在卡片内部
  // 偏移方向：根据引导线角度计算（正上方-90°时，向卡片内部下方延伸；左上-135°时，向卡片内部右下延伸）
  const offsetDistance = cardW * 0.3  // 延伸距离：卡片宽度的30%（约60px）
  
  // 引导线样式（延长引导线，使其延伸到卡片内部）
  guideLine.lineStyle = {
    left: `${cx}px`,
    top: `${cy}px`,
    width: `${length + offsetDistance}px`,  // 延长引导线长度，使其延伸到卡片内部
    height: '2px',
    transform: `rotate(${angle}deg)`,
    transformOrigin: 'left center',
    background: 'linear-gradient(to right, #00D9FF 0%, rgba(0, 217, 255, 0.6) 50%, rgba(0, 217, 255, 0.3) 80%, transparent 100%)',
    boxShadow: '0 0 8px rgba(0, 217, 255, 0.5)',
    opacity: '0.9'
  }

  // 卡片定位：以原终点为参考，卡片中心对齐终点（保持不变）
  guideLine.cardStyle = {
    left: `${endX - cardW / 2}px`,
    top: `${endY - cardH / 2}px`,
    width: `${cardW}px`,
    padding: '12px',
    // background/boxShadow 由 CSS 控制，不在此设置
    textAlign: 'center',
    opacity: '0',
    transform: 'scale(0.5)',
    transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
  }

  // 阶段A：先显示引导线
  guideLine.visible = true

  // ========== 启动引导线实时同步机制 ==========
  // 在地球旋转/定位动画期间，持续更新引导线起点位置，确保全程无错位、无脱节
  startGuideLineSync()

  // 阶段B：300ms 后显示卡片（入场动画）
  showGuideLineCardTimer = window.setTimeout(() => {
    guideLine.cardVisible = true
    requestAnimationFrame(() => {
      guideLine.cardStyle = {
        ...guideLine.cardStyle,
        opacity: '1',
        transform: 'scale(1)'
      }
      // ========== 释放锁定：显示完成 ==========
      guideLineLock = false
      isShowingGuideLine = false  // 重置显示标记，防止hideGuideLine延迟
    })
  }, 300) as unknown as number
}

/**
 * 隐藏引导线（带动画）
 */
function hideGuideLine() {
  // ========== 立即停止引导线实时同步 ==========
  stopGuideLineSync()

  // ========== 状态锁定：如果正在显示，延迟隐藏 ==========
  if (isShowingGuideLine) {
    hideGuideLineDelayTimer = window.setTimeout(() => {
      isShowingGuideLine = false
      hideGuideLine()
    }, 100) as unknown as number
    return
  }

  // ========== 清理二级引导线 ==========
  guideLine.secondaryLineVisible = false
  guideLine.secondaryLineStyle.opacity = '0'
  
  // 卡片退场动画
  guideLine.cardStyle = {
    ...guideLine.cardStyle,
    opacity: '0',
    transform: 'scale(0.8)',
    transition: 'opacity 0.2s ease-in, transform 0.2s ease-in'
  }

  // 立即关闭二级面板（无动画）
  if (detailPanelVisible.value) {
    closeDetailPanel(true)
  }

  // 200ms 后隐藏 DOM
  hideGuideLineDomTimer = window.setTimeout(() => {
    guideLine.visible = false
    guideLine.cardVisible = false
  }, 200) as unknown as number

  // 500ms 后彻底清理
  hideGuideLineCleanupTimer = window.setTimeout(() => {
    destroyGuideLine()
  }, 500) as unknown as number
}

/**
 * 暂停自动旋转（鼠标悬停卡片时）
 * 同时取消阶段3定时器，防止引导线消失
 */
function pauseAutoRotate() {
  if (!chart) return
  console.log('[GlobeViewer] ⏸️ 暂停自动旋转（悬停卡片）')
  isHoveringCard.value = true
  
  // 取消阶段3定时器，防止引导线消失
  if (autoRotateTimer !== null) {
    clearTimeout(autoRotateTimer)
    autoRotateTimer = null
    console.log('[GlobeViewer] ⏸️ 取消阶段3定时器，引导线将保持显示')
  }
  
  // 标记飞行结束，允许后续操作
  isFlying.value = false
  
  safeSetOption({
    globe: {
      viewControl: {
        autoRotate: false
      }
    }
  }, false, false)
}

/**
 * 恢复自动旋转（鼠标离开卡片时）
 * 重新设置阶段3定时器，引导线将在2秒后消失
 */
function resumeAutoRotate() {
  if (!chart || isFlying.value) return
  console.log('[GlobeViewer] ▶️ 恢复自动旋转（离开卡片）')
  isHoveringCard.value = false
  
  // 重新设置阶段3定时器（2秒后消失）
  autoRotateTimer = window.setTimeout(() => {
    console.log('[GlobeViewer] 🔔 阶段3 定时器触发（离开卡片后）')
    if (!chart || isUnmounted) {
      isFlying.value = false
      return
    }
    hideCountryBorder()
    hideGuideLine()
    setOptionPending = false
    safeSetOption({
      globe: {
        viewControl: {
          autoRotate: true,
          autoRotateSpeed: 1.5
        }
      }
    }, false, true)
    isFlying.value = false
    console.log('[GlobeViewer] ✅ 阶段3 完成（离开卡片后）')
  }, 2000) as unknown as number
  
  safeSetOption({
    globe: {
      viewControl: {
        autoRotate: true,
        autoRotateSpeed: 1.5
      }
    }
  }, false, false)
}

/**
 * 立即销毁引导线（无动画，用于拖拽/缩放中断）
 */
function destroyGuideLine() {
  // ========== 立即停止引导线实时同步 ==========
  stopGuideLineSync()

  // 清理所有定时器
  if (guideLineTimer !== null) {
    clearTimeout(guideLineTimer)
    guideLineTimer = null
  }
  if (guideLineCleanupTimer !== null) {
    clearTimeout(guideLineCleanupTimer)
    guideLineCleanupTimer = null
  }
  if (showGuideLineCardTimer !== null) {
    clearTimeout(showGuideLineCardTimer)
    showGuideLineCardTimer = null
  }
  if (hideGuideLineDomTimer !== null) {
    clearTimeout(hideGuideLineDomTimer)
    hideGuideLineDomTimer = null
  }
  if (hideGuideLineCleanupTimer !== null) {
    clearTimeout(hideGuideLineCleanupTimer)
    hideGuideLineCleanupTimer = null
  }
  if (hideGuideLineDelayTimer !== null) {
    clearTimeout(hideGuideLineDelayTimer)
    hideGuideLineDelayTimer = null
  }
  
  // 重置所有状态
  guideLine.visible = false
  guideLine.cardVisible = false
  guideLine.secondaryLineVisible = false
  guideLineLock = false
  isShowingGuideLine = false
  
  // 关闭二级面板
  if (detailPanelVisible.value) {
    closeDetailPanel(true)
  }
  
  guideLine.lineStyle = {}
  guideLine.cardStyle = {}
}

function flyToCountry(countryCode: string) {
  const flyStartTime = performance.now()
  console.log(`[GlobeViewer] 🛫 flyToCountry 被调用: ${countryCode}`)
  // 重置 convertToPixel 失败计数，允许新一轮尝试
  convertToPixelFailCount = 0
  const coord = countryCoords.value[countryCode]
  if (!coord || !chart) {
    console.warn(`[GlobeViewer] flyToCountry 取消: coord=${coord} chart=${!!chart}`)
    return
  }

  // ============ [P0-2.8 修复] 动态计算定位参数 ============
  const bbox = countryBBoxes.find(b => b.code === countryCode)
  const viewParams = store.calculateViewParams(
    coord,
    bbox ? { minLon: bbox.minLon, maxLon: bbox.maxLon, minLat: bbox.minLat, maxLat: bbox.maxLat } : undefined
  )
  // 防御性检查：避免 calculateViewParams 返回异常导致后续抛错
  if (!viewParams) {
    console.error('[GlobeViewer] calculateViewParams 返回空，飞行取消:', countryCode)
    return
  }

  // ========== 清理所有定时器（防止定时器冲突） ==========
  console.log('[GuideLine] 🧹 flyToCountry 清理所有定时器', {
    timestamp: Date.now(),
    borderDisplayTimer: borderDisplayTimer !== null,
    autoRotateTimer: autoRotateTimer !== null,
    guideLineTimer: guideLineTimer !== null,
    guideLineCleanupTimer: guideLineCleanupTimer !== null,
    showGuideLineCardTimer: showGuideLineCardTimer !== null,
    hideGuideLineDomTimer: hideGuideLineDomTimer !== null,
    hideGuideLineCleanupTimer: hideGuideLineCleanupTimer !== null,
    hideGuideLineDelayTimer: hideGuideLineDelayTimer !== null
  })
  
  if (borderDisplayTimer !== null) { clearTimeout(borderDisplayTimer); borderDisplayTimer = null }
  if (autoRotateTimer !== null) { clearTimeout(autoRotateTimer); autoRotateTimer = null }
  if (guideLineTimer !== null) { clearTimeout(guideLineTimer); guideLineTimer = null }
  if (guideLineCleanupTimer !== null) { clearTimeout(guideLineCleanupTimer); guideLineCleanupTimer = null }
  if (showGuideLineCardTimer !== null) { clearTimeout(showGuideLineCardTimer); showGuideLineCardTimer = null }
  if (hideGuideLineDomTimer !== null) { clearTimeout(hideGuideLineDomTimer); hideGuideLineDomTimer = null }
  if (hideGuideLineCleanupTimer !== null) { clearTimeout(hideGuideLineCleanupTimer); hideGuideLineCleanupTimer = null }
  if (hideGuideLineDelayTimer !== null) { clearTimeout(hideGuideLineDelayTimer); hideGuideLineDelayTimer = null }

  // 隐藏上一次边界
  hideCountryBorder()
  stopBreathingAnimation()

  // 清理上一次引导线
  destroyGuideLine()

  // 先解除上一次的锁定，允许快速切换国家
  store.isFlying = false

  // 立即标记为飞行中（防止 store.currentCountry watch 双触发 flyToCountry）
  isFlying.value = true
  console.log('[GlobeViewer] Flying to:', coord, countryCode, 'viewParams:', viewParams)

  // ============ 阶段1：拉远 + 转向（动画 1000ms）============
  // [修复] 使用 targetCoord 直接定位到经纬度（ECharts globe 推荐方式）
  // targetCoord 会自动计算 alpha/beta，比手动计算更准确
  console.log(`[GlobeViewer] ⏩ 阶段1: 拉远+定位  targetCoord=${coord}  distance=250  距点击: ${(performance.now() - flyStartTime).toFixed(1)}ms`)
  // 强制解除 safeSetOption 锁：hideCountryBorder 在上方设置了 setOptionPending=true，
  // 导致阶段1的 setOption 被静默跳过，地球不旋转。这里手动重置确保 viewControl 更新生效。
  setOptionPending = false
  safeSetOption({
    globe: {
      viewControl: {
        autoRotate: false,
        distance: 250,        // 先拉远到 250（动画起点）
        targetCoord: coord    // 直接定位到经纬度 [lon, lat]
      }
    }
  }, false, false)  // lazyUpdate=false，触发 1000ms 动画
  console.log('[GlobeViewer] ✅ 阶段1 setOption 已执行')

  // ============ 1000ms 后：拉近到目标距离 + 显示边界 ============
  console.log('[GlobeViewer] ⏰ 设置阶段2定时器（1000ms后）')
  borderDisplayTimer = window.setTimeout(() => {
    console.log(`[GlobeViewer] 🔔 阶段2 定时器触发 chart=${!!chart} isUnmounted=${isUnmounted}  距点击: ${(performance.now() - flyStartTime).toFixed(1)}ms`)
    if (!chart || isUnmounted) {
      console.warn(`[GlobeViewer] ❌ 阶段2 跳过: chart=${!!chart} isUnmounted=${isUnmounted}`)
      return
    }
    console.log(`[GlobeViewer] ⏩ 阶段2: 拉近到目标距离  distance=180 + 显示边界`)
    // 强制解除 safeSetOption 锁：阶段1的 setOption 设置了 setOptionPending=true，
    // 导致阶段2的 setOption 和 showCountryBorder 被锁跳过。这里手动重置。
    setOptionPending = false
    safeSetOption({
      globe: {
        viewControl: {
          distance: 180  // 固定距离，所有国家定位后地球大小一致
        }
      }
    }, false, false)  // lazyUpdate=false，触发动画
    // 再次解锁：上面的 safeSetOption 会重新锁定，导致 showCountryBorder 被锁跳过
    setOptionPending = false
    showCountryBorder(countryCode)
    console.log(`[GlobeViewer] ✅ 阶段2 setOption 已执行  distance=180`)

    // 定位动画完成后（再等 1000ms），显示引导线
    guideLineTimer = window.setTimeout(() => {
      if (!chart || isUnmounted) return
      showGuideLine()
    }, 1000) as unknown as number
  }, 1000) as unknown as number

  // ============ 3000ms 后：隐藏边界 + 恢复自动旋转 ============
  autoRotateTimer = window.setTimeout(() => {
    console.log(`[GlobeViewer] 🔔 阶段3 定时器触发 chart=${!!chart} isUnmounted=${isUnmounted} isHoveringCard=${isHoveringCard.value} borderShownSuccessfully=${borderShownSuccessfully}`)
    if (!chart || isUnmounted) {
      console.warn(`[GlobeViewer] ❌ 阶段3 跳过: chart=${!!chart} isUnmounted=${isUnmounted}`)
      isFlying.value = false
      return
    }
    
    // 如果正在悬停卡片，跳过隐藏引导线，只恢复自动旋转
    if (isHoveringCard.value) {
      console.log('[GlobeViewer] ⏸️ 用户正在悬停卡片，跳过隐藏引导线')
      hideCountryBorder()
      setOptionPending = false
      safeSetOption({
        globe: {
          viewControl: {
            autoRotate: false  // 保持暂停状态
          }
        }
      }, false, true)
      isFlying.value = false
      return
    }
    
    // ========== 如果边界数据缺失，跳过隐藏引导线 ==========
    if (!borderShownSuccessfully) {
      console.log('[GlobeViewer] ⏸️ 边界数据缺失（如印度），跳过隐藏引导线，保持卡片显示')
      hideCountryBorder()
      setOptionPending = false
      safeSetOption({
        globe: {
          viewControl: {
            autoRotate: false  // 保持暂停状态
          }
        }
      }, false, true)
      isFlying.value = false
      return
    }
    
    console.log('[GlobeViewer] ⏩ 阶段3: 隐藏边界并恢复自动旋转')
    hideCountryBorder()

    // 隐藏引导线
    hideGuideLine()

    // 强制解锁：hideCountryBorder 内部 safeSetOption 会设置 setOptionPending=true，
    // 导致后续 autoRotate setOption 被跳过，这里手动重置
    setOptionPending = false
    safeSetOption({
      globe: {
        viewControl: {
          autoRotate: true
        }
        // 1:1 复刻旧项目：无 postEffect / bloom
      }
    }, false, true)   // lazyUpdate=true
    isFlying.value = false
    console.log('[GlobeViewer] ✅ 阶段3 完成，国家定位流程结束，已恢复自动旋转')
  }, BORDER_DISPLAY_DURATION) as unknown as number

  console.log(`[GlobeViewer] 🛬 flyToCountry 完成调度: 3个定时器已设置  borderDisplayTimer=${!!borderDisplayTimer}  autoRotateTimer=${!!autoRotateTimer}`)
}

function handleCountryClicked(countryCode: string) {
  console.log(`[GlobeViewer] 👆 用户点击国家: ${countryCode}`)
  if (isUnmounted) {
    console.log(`[GlobeViewer] 点击忽略: isUnmounted=${isUnmounted}`)
    return
  }
  // 允许重复点击同一国家（重新触发定位动画）
  selectedCountryCode = countryCode
  // 立即触发定位（无 100ms 死区）；边界在 flyToCountry 的 1500ms setTimeout 中显示
  flyToCountry(countryCode)
  store.selectCountry(countryCode)
}

// ============== 散点数据同步 ==============
// 2026-06-07 P1-3.5c: 散点完全隐藏（用户原意"散点不应出现"）
// 历史：z=-0.05 被 depthTest:false 覆盖 → 改成 z=0.001 贴地 → 用户要求"不可见"
//       show:false 在 ECharts merge 场景失效 → 改为函数 no-op（彻底不渲染）
function updateCountryScatter() {
  // P1-3.5c: 空函数，散点系列不渲染
  // 保留函数签名和位置以兼容 onMounted 等调用方
  return
}

// ============== 重置视图 ==============
// 1:1 复刻旧项目 handleResetView：clearAutoRotateTimer + hideCountryBorder + resumeAutoRotate
function handleResetView() {
  // 清理所有正在飞行的定时器（避免定时器到点后又触发显示）
  if (borderDisplayTimer !== null) { clearTimeout(borderDisplayTimer); borderDisplayTimer = null }
  if (autoRotateTimer !== null) { clearTimeout(autoRotateTimer); autoRotateTimer = null }

  hideCountryBorder()
  destroyGuideLine()
  selectedCountryCode = null
  isFlying.value = false

  // resumeAutoRotate: 仅恢复 autoRotate，不修改 distance/targetCoord
  safeSetOption({
    globe: {
      viewControl: {
        autoRotate: true
      }
      // 1:1 复刻旧项目：无 postEffect / bloom
    }
  }, false, true)  // lazyUpdate=true
  console.log('[GlobeViewer] Reset to auto-rotate')
}

// ============== store 监听 ==============
watch(
  () => store.displayCountries,
  () => { debouncedUpdateScatter() },
  { deep: true }
)

watch(
  () => store.currentCountry,
  newVal => {
    console.log('[GlobeViewer] 👁️ currentCountry watch触发:', newVal?.code, 'chart=', !!chart, 'isUnmounted=', isUnmounted)
    if (newVal) {
      selectedCountryCode = newVal.code
      // 不在此调用 showCountryBorder，由 flyToCountry 的阶段2统一处理
      flyToCountry(newVal.code)
    } else {
      hideCountryBorder()
      selectedCountryCode = null
    }
  }
)

// ========== 调试日志已禁用（减少控制台输出） ==========

// ============== 唯一入口：onMounted 初始化 ==============
onMounted(async () => {
  console.log('[GlobeViewer] 组件初始化开始')

  await nextTick()

  if (isUnmounted || !container.value) {
    console.warn('[GlobeViewer] 组件已卸载或容器不存在，初始化终止')
    return
  }

  // 等待 DOM 完全渲染
  await new Promise(resolve => setTimeout(resolve, 100))

  if (isUnmounted || !container.value) {
    console.warn('[GlobeViewer] 等待后组件已卸载，初始化终止')
    return
  }

  try {
    // 第一步：先加载 GeoJSON 边界数据
    const geoOk = await loadLocalGeoJson()
    if (isUnmounted) return

    // 第二步：初始化 ECharts
    chart = echarts.init(container.value)
    console.log('[GlobeViewer] ECharts实例创建成功')

    // 检测纹理
    const [hasBaseTex, hasHeightTex] = await Promise.all([
      checkTextureExists('/data/earth-blue-marble.jpg'),
      checkTextureExists('/data/earth-topology.png')
    ])

    if (isUnmounted) {
      chart?.dispose()
      chart = null
      return
    }

    const baseTexture: string = hasBaseTex
      ? '/data/earth-blue-marble.jpg'
      : generateBlueMarbleTexture()

    // 地球配置 —— 1:1 复刻旧项目外观
    chart.setOption({
      backgroundColor: '#000',  // 1:1 复刻旧项目：黑色背景
      globe: {
        baseTexture,
        // 1:1 复刻旧项目：heightTexture + heightScale（不是 displacementScale）
        heightTexture: hasHeightTex ? '/data/earth-topology.png' : undefined,
        heightScale: 0.1,  // 关键：旧项目用 heightScale，不是 displacementScale
        // 1:1 复刻旧项目 shading: 'lambert'
        shading: 'lambert',
        // 1:1 复刻旧项目 light 配置
        light: {
          ambient: { intensity: 0.5 },
          main: { intensity: 0.6, shadow: true }  // 旧项目固定 shadow: true
        },
        // 1:1 复刻旧项目 viewControl 参数
        viewControl: {
          autoRotate: true,
          autoRotateSpeed: 1.5,
          distance: 150,
          minDistance: 100,
          maxDistance: 300,
          animationDurationUpdate: 1000,  // [修复] 改为 1000ms 与 setTimeout 一致，消除顿挫感
          animationEasingUpdate: 'cubicInOut'
        }
      },
      // [P1-3.10 修复] 预声明 country-border-lines series
      // 避免首次 showCountryBorder 时 ECharts 懒创建导致边界显示失败
      series: [{
        id: 'country-border-lines',
        type: 'lines3D',
        coordinateSystem: 'globe',
        data: [],
        lineStyle: { color: '#00D9FF', width: 3, opacity: 0 },
        blendMode: 'lighter',
        depthTest: false,
        silent: true,
        zlevel: 10
      }]
    })
    console.log('[GlobeViewer] 地球配置应用完成')
    console.log('[GlobeViewer] 地球交互已开启：旋转/拖拽/缩放')

    // 点击事件
    chart.on('click', handleSeriesClick)

    // 监听拖拽/缩放中断引导线
    chart.on('mousedown', () => {
      if (guideLine.visible) destroyGuideLine()
    })
    container.value?.addEventListener('wheel', () => {
      if (guideLine.visible) destroyGuideLine()
    }, { passive: true })

    // ========== 双层尺寸监听机制（修复窗口变化导致引导线错位） ==========
    // 替代原有的简单 resize 监听，新增 ResizeObserver 容器级监听
    initResizeListeners()

    // ESC 键关闭二级面板
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && detailPanelVisible.value) {
        closeDetailPanel()
      }
    }
    window.addEventListener('keydown', handleEscKey)
    
    // 全局点击关闭二级面板（点击地球空白区域）
    const handleGlobalClick = (e: MouseEvent) => {
      if (!detailPanelVisible.value) return
      
      // 判断点击目标是否在二级面板或主卡片内
      const target = e.target as HTMLElement
      const panel = document.querySelector('.detail-panel')
      const card = document.querySelector('.guideline-card')
      
      if (panel && !panel.contains(target) && card && !card.contains(target)) {
        // 点击在面板和卡片外部，关闭面板
        closeDetailPanel()
      }
    }
    window.addEventListener('click', handleGlobalClick)

    loading.value = false
    await nextTick()

    if (isUnmounted) return

    // 第三步：加载装备数据（如果 store 还没有加载过）
    if (store.countries.length === 0) {
      await store.loadCountries()
    }

    if (isUnmounted) return

    // 重建边界框：loadCountries 完成后 countryNameMap 才有数据
    if (geoJsonData.length > 0) {
      buildBoundingBoxes()
    }

    // 渲染散点
    updateCountryScatter()

    // ========== 预热：消除首次点击卡顿 ==========
    // 等待 nextTick 确保 countryNameMap 等 computed 属性已更新
    await nextTick()

    // 1. 预缓存热门国家的边界数据（避免首次点击时 extractCountryBorders 计算耗时）
    // 2. 预触发 convertToPixel（初始化 ECharts GL 内部投影矩阵）
    // 3. 预渲染一次 lines3D（编译 WebGL shader + 创建缓冲区）
    console.log('[GlobeViewer] 准备启动预热，chart=', !!chart, 'isUnmounted=', isUnmounted)

    // 使用 requestAnimationFrame + setTimeout 双保险，确保在下一帧渲染后执行
    // 直接同步执行预缓存（不依赖定时器），convertToPixel 和 shader 预编译延后一帧
    const preheatBorderCache = () => {
      if (!chart || isUnmounted) return
      console.log('[GlobeViewer] 🔥 预热开始（边界预缓存）')
      const preheatStart = performance.now()
      // 预缓存热门国家边界（US/RU/CN/GB/FR — 使用store中的国家代码）
      const hotCountries = ['US', 'RU', 'CN', 'GB', 'FR']
      for (const code of hotCountries) {
        if (!borderCache.has(code)) {
          const rawLines = extractCountryBorders(code)
          if (rawLines.length > 0) {
            const elevatedLines = rawLines.map(line => ({
              coords: line.coords.map((coord: number[]) => [coord[0], coord[1], BORDER_Z])
            }))
            borderCache.set(code, elevatedLines)
            console.log(`[GlobeViewer] 🔥 预缓存边界: ${code} (${elevatedLines.length} 条线)`)
          }
        }
      }
      const preheatEnd = performance.now()
      console.log(`[GlobeViewer] 🔥 边界预缓存完成，耗时: ${(preheatEnd - preheatStart).toFixed(1)}ms`)
    }

    // 同步执行边界预缓存（不依赖定时器，确保一定执行）
    preheatBorderCache()

    // 输出预缓存结果摘要
    console.log(`[GlobeViewer] 🔥 边界缓存状态: ${borderCache.size} 个国家已缓存, keys=[${Array.from(borderCache.keys()).join(',')}]`)
    console.log(`[GlobeViewer] 🔥 countryNameMap 样例: US=${countryNameMap.value['US']}, RU=${countryNameMap.value['RU']}, CN=${countryNameMap.value['CN']}`)
    console.log(`[GlobeViewer] 🔥 geoJsonData 数量: ${geoJsonData.length}, 前5个名称: ${geoJsonData.slice(0, 5).map((f: any) => f.properties?.name).join(',')}`)

    // 延后执行 convertToPixel 和 shader 预编译（需要globe坐标系就绪）
    const preheatWebGL = () => {
      if (!chart || isUnmounted) return
      console.log('[GlobeViewer] 🔥 WebGL预热开始')
      // 预触发 convertToPixel，初始化投影矩阵
      try {
        chart.convertToPixel('globe', [0, 0])
        console.log('[GlobeViewer] 🔥 convertToPixel 预触发成功')
      } catch (e) { console.warn('[GlobeViewer] 🔥 convertToPixel 预触发失败:', e) }
      // 预渲染一次 lines3D，触发 WebGL shader 编译
      const preRenderData = borderCache.get('US') || []
      if (preRenderData.length > 0) {
        console.log('[GlobeViewer] 🔥 预渲染 lines3D shader...')
        safeSetOption({
          series: [{
            id: 'country-border-lines',
            type: 'lines3D',
            coordinateSystem: 'globe',
            data: preRenderData.slice(0, 5),
            lineStyle: { color: '#00D9FF', width: 3, opacity: 0 },
            blendMode: 'lighter',
            depthTest: false,
            silent: true,
            zlevel: 10
          }]
        }, false, false)
        // 立即清除预渲染数据
        setTimeout(() => {
          if (!chart || isUnmounted) return
          safeSetOption({
            series: [{
              id: 'country-border-lines',
              type: 'lines3D',
              coordinateSystem: 'globe',
              data: [],
              lineStyle: { color: '#00D9FF', width: 3, opacity: 0 }
            }]
          }, false, false)
        }, 100)
      }
      console.log('[GlobeViewer] 🔥 WebGL预热完成')
    }

    // 使用 requestAnimationFrame 确保 globe 坐标系已就绪
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        preheatWebGL()
      })
    })

    // 外部重置事件
    eventBus.on(Events.RESET_VIEW, handleResetView)

    if (!geoOk) {
      console.warn('[GlobeViewer] GeoJSON 未加载，仅显示基础地球')
    }

    console.log('[GlobeViewer] 初始化成功')
  } catch (error) {
    if (!isUnmounted) {
      console.error('[GlobeViewer] 初始化失败:', error)
    }
  }
})

// 组件卸载：彻底清理
onUnmounted(() => {
  console.log('[GlobeViewer] 组件已销毁')
  isUnmounted = true

  // 停止呼吸动画
  stopBreathingAnimation()

  // 清理引导线
  destroyGuideLine()

  // 停止飞行 3 阶段定时器（1:1 复刻旧项目清理）
  if (borderDisplayTimer !== null) { clearTimeout(borderDisplayTimer); borderDisplayTimer = null }
  if (autoRotateTimer !== null) { clearTimeout(autoRotateTimer); autoRotateTimer = null }

  // 停止散点更新防抖
  if (scatterUpdateTimer !== null) {
    clearTimeout(scatterUpdateTimer)
    scatterUpdateTimer = null
  }

  // ========== 清理双层尺寸监听机制 ==========
  cleanupResizeListeners()

  // 移除事件总线监听
  eventBus.off(Events.RESET_VIEW, handleResetView)

  // 销毁 ECharts 实例
  if (chart) {
    try {
      chart.off('click', handleSeriesClick)
      chart.dispose()
    } catch (e) {
      // ignore
    }
    chart = null
  }
})
</script>

<style scoped lang="scss">
.globe-container {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #050a14 0%, #000000 100%);
  overflow: hidden;
}

.globe-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;

  .loading-ring {
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-top-color: #00e5ff;
    border-right-color: #00e5ff;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
  }

  .loading-text {
    margin-top: 16px;
    font-family: 'Orbitron', 'Courier New', monospace;
    font-size: 12px;
    color: #00e5ff;
    letter-spacing: 3px;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// ============== 引导线叠加层 ==============
.guideline-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  overflow: visible;
}

.guideline-line {
  position: absolute;
  pointer-events: none;

  // 扫描线脉冲效果
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 217, 255, 0.1) 20%,
      rgba(0, 217, 255, 0.8) 50%,
      rgba(0, 217, 255, 0.1) 80%,
      transparent 100%
    );
    animation: scan-pulse 1.5s ease-in-out infinite;
  }

  .guideline-dot {
    position: absolute;
    right: -6px;      // 位于引导线终点（右端）
    top: -5px;        // 垂直居中微调
    width: 12px;      // 增大圆点尺寸，增强视觉连贯性
    height: 12px;     // 增大圆点尺寸
    border-radius: 50%;
    background: radial-gradient(circle, #ffffff 0%, #00D9FF 50%, transparent 100%);  // 渐变效果
    box-shadow:
      0 0 12px rgba(0, 217, 255, 1),      // 增强发光
      0 0 24px rgba(0, 217, 255, 0.6),
      0 0 48px rgba(0, 217, 255, 0.3);    // 增强发光
    animation: dot-pulse-enhanced 2s ease-in-out infinite;  // 脉冲动画
  }
}

.guideline-card {
  position: absolute;
  pointer-events: auto;
  
  // ========== 字体渲染优化（强制清晰） ==========
  font-family:
    "Inter",
    "Roboto",
    "Noto Sans SC",
    "PingFang SC",
    "Microsoft YaHei",
    "Helvetica Neue",
    sans-serif;
  font-weight: 400;
  
  // 强制所有子元素使用最佳字体渲染
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-text-stroke: 0.02em transparent;
    transform: translateZ(0);
    backface-visibility: hidden;
  }
  
  // 新规范：尺寸、背景、边框、发光
  width: 200px;
  min-width: 200px;
  box-sizing: border-box;
  background: rgba(10, 14, 23, 0.95);
  border: 1px solid #00D9FF;
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(0, 217, 255, 0.4);
  cursor: pointer;
  
  // 内边距
  padding: 12px;
  
  // 内部网格背景（降低透明度避免干扰文字）
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 217, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 217, 255, 0.05) 1px, transparent 1px);
    background-size: 15px 15px;
    opacity: 0.2;
    pointer-events: none;
    z-index: -1;
  }
  
  // 呼吸光效动画（轻量化）
  animation: breathe-light 2s ease-in-out infinite;
  
  // 悬停效果：增强发光 + 按钮完全可见
  &:hover {
    border-color: rgba(0, 255, 255, 0.9);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
    animation: none;
    
    // 悬停时"查看详情"按钮完全可见并发光
    .view-detail-btn {
      opacity: 1;
      background: rgba(0, 217, 255, 0.25);
      box-shadow: 0 0 8px rgba(0, 217, 255, 0.5);
    }
  }
  
  // 国家名称（居中，顶部）- 移除 text-shadow
  .card-country-name {
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 24px;
    text-align: center;
    margin-bottom: 8px;
  }
  
  // 核心数据区
  .card-core-data {
    margin-bottom: 8px;
    
    .card-equip-count {
      font-size: 14px;
      font-weight: 600;
      color: #00D9FF;
      line-height: 20px;
      text-align: left;
    }
    
    .card-rank {
      font-size: 14px;
      font-weight: 600;
      color: #00D9FF;
      line-height: 20px;
      text-align: left;
    }
  }
  
  // 分隔线（增强对比度）
  .separator-line {
    height: 1.5px;
    background: rgba(0, 217, 255, 0.2);
    margin: 8px 0;
  }
  
  // 军备分类数据
  .category-section {
    margin-bottom: 8px;
    
    .category-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 18px;
      margin-bottom: 2px;
      
      .category-label {
        font-size: 14px;
        font-weight: 500;
        color: #8899AA;
        min-width: 40px;
      }
      
      // 进度条（增强对比度）
      .progress-bar {
        flex: 1;
        height: 4px;
        background: rgba(0, 217, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
        margin: 0 8px;
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg,
            rgba(0, 217, 255, 0.4) 0%,
            rgba(0, 217, 255, 0.9) 100%);
          border-radius: 2px;
          transition: width 0.3s ease-out;
        }
      }
      
      .category-value {
        font-size: 14px;
        font-weight: 500;
        color: #8899AA;
        min-width: 50px;
        text-align: right;
      }
    }
  }
  
  // 代表装备区
  .weapons-section {
    margin-bottom: 8px;
    
    .weapons-label {
      font-size: 12px;
      font-weight: 400;
      color: #667788;
      line-height: 16px;
      display: block;
      margin-bottom: 4px;
    }
    
    .weapons-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 8px;
      
      .weapon-item {
        font-size: 12px;
        font-weight: 400;
        color: #8899AA;
        line-height: 16px;
      }
    }
  }
  
  // 军力等级区
  .rank-section {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
    
    .rank-label {
      font-size: 12px;
      font-weight: 400;
      color: #667788;
      line-height: 16px;
    }
    
    .rank-badge {
      font-size: 14px;
      font-weight: 600;
      color: #00D9FF;
      padding: 2px 6px;
      border: 1px solid #00D9FF;
      border-radius: 2px;
      
      &.rank-S {
        color: #FFD700;
        border-color: #FFD700;
      }
      
      &.rank-A {
        color: #00FF88;
        border-color: #00FF88;
      }
      
      &.rank-B {
        color: #00D9FF;
        border-color: #00D9FF;
      }
      
      &.rank-C {
        color: #8899AA;
        border-color: #8899AA;
      }
      
      &.rank-D {
        color: #667788;
        border-color: #667788;
      }
    }
  }
  
  // 查看详情按钮（默认半透明，悬停时完全可见并发光）
  .view-detail-btn {
    font-size: 12px;
    font-weight: 600;
    color: #00D9FF;
    text-align: center;
    padding: 6px 0;
    border: 1px solid #00D9FF;
    border-radius: 2px;
    background: rgba(0, 217, 255, 0.15);
    opacity: 0.6;
    transition: opacity 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    margin-top: 4px;
  }
  
  // HUD 四角装饰（简化）
  .hud-corner {
    position: absolute;
    width: 8px;
    height: 8px;
    pointer-events: none;
    border: 1px solid transparent;
  }
  
  .hud-corner-tl {
    top: -1px;
    left: -1px;
    border-top-color: #00D9FF;
    border-left-color: #00D9FF;
  }
  
  .hud-corner-tr {
    top: -1px;
    right: -1px;
    border-top-color: #00D9FF;
    border-right-color: #00D9FF;
  }
  
  .hud-corner-bl {
    bottom: -1px;
    left: -1px;
    border-bottom-color: #00D9FF;
    border-left-color: #00D9FF;
  }
  
  .hud-corner-br {
    bottom: -1px;
    right: -1px;
    border-bottom-color: #00D9FF;
    border-right-color: #00D9FF;
  }
}

// ============== 二级引导线（连接一级卡片和二级面板） ==============
.secondary-guideline {
  position: absolute;
  pointer-events: none;

  // 呼吸光效动画（与一级引导线同步）
  animation: breathe-light 2s ease-in-out infinite;

  // 悬停时增强发光（可选）
  &:hover {
    animation: none;
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
  }
}

// ============== 二级全息面板 ==============
.detail-panel {
  position: absolute;
  pointer-events: auto;
  width: 360px;
  max-height: 500px; // 最大高度限制
  overflow-y: auto; // 超出部分可滚动（纵向）
  overflow-x: hidden; // 移除横向滚动条（内容宽度未超出容器）
  box-sizing: border-box;
  
  // ========== 边框同步（继承一级卡片样式） ==========
  // 一级卡片：border: 1px solid #00D9FF; border-radius: 2px;
  border: 1px solid #00D9FF;
  border-radius: 4px; // 微调圆角（一级卡片为2px，二级卡片为4px）
  
  // 一级卡片：box-shadow: 0 0 12px rgba(0, 217, 255, 0.4);
  // 二级卡片优化：增加微悬浮感 + 内发光
  box-shadow: 
    0 0 12px rgba(0, 217, 255, 0.4), // 继承一级卡片外发光
    0 4px 12px rgba(0, 0, 0, 0.05), // 微悬浮感（新增）
    inset 0 0 20px rgba(0, 217, 255, 0.1); // 内发光（保留）
  
  // 一级卡片：background: rgba(10, 14, 23, 0.95);
  // 二级卡片优化：轻量渐变背景
  background: linear-gradient(
    135deg,
    rgba(10, 14, 23, 0.95) 0%,
    rgba(15, 20, 30, 0.95) 100%
  );
  backdrop-filter: blur(16px);
  cursor: default;
  padding: 16px;
  
  // ========== 内边界强调（新增） ==========
  // 顶部 accent 色条（2px，使用品牌色）
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(0, 217, 255, 0.8) 0%,
      rgba(0, 217, 255, 0.4) 50%,
      rgba(0, 217, 255, 0.8) 100%
    );
    border-radius: 4px 4px 0 0;
    pointer-events: none;
    z-index: 1;
  }
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 217, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 217, 255, 0.5);
    border-radius: 2px;
    
    &:hover {
      background: rgba(0, 217, 255, 0.7);
    }
  }
  
  // 入场动画
  animation: panel-enter 0.3s ease-out forwards;
  
  // 内部网格背景
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    pointer-events: none;
    z-index: -1;
  }
  
  // 移除悬停效果（面板本身就是详情视图，不需要悬停高亮）
  // &:hover {
  //   border-color: rgba(0, 255, 255, 0.9);
  //   box-shadow: 
  //     0 0 30px rgba(0, 255, 255, 0.6),
  //     inset 0 0 30px rgba(0, 255, 255, 0.15);
  //   animation: none;
  // }
  
  // HUD 四角装饰（放大）
  .hud-corner {
    position: absolute;
    width: 12px;
    height: 12px;
    pointer-events: none;
    border: 2px solid transparent;
  }
  
  .hud-corner-tl {
    top: -1px;
    left: -1px;
    border-top-color: #00D9FF;
    border-left-color: #00D9FF;
  }
  
  .hud-corner-tr {
    top: -1px;
    right: -1px;
    border-top-color: #00D9FF;
    border-right-color: #00D9FF;
  }
  
  .hud-corner-bl {
    bottom: -1px;
    left: -1px;
    border-bottom-color: #00D9FF;
    border-left-color: #00D9FF;
  }
  
  .hud-corner-br {
    bottom: -1px;
    right: -1px;
    border-bottom-color: #00D9FF;
    border-right-color: #00D9FF;
  }
  
  // 顶部扫描线
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(0, 217, 255, 0.3) 20%,
      rgba(0, 217, 255, 1) 50%,
      rgba(0, 217, 255, 0.3) 80%,
      transparent 100%
    );
    animation: scan-move 2s linear infinite;
  }
  
  // 头部区域（国家名称 + 军力等级 + 关闭按钮）
  .detail-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 217, 255, 0.3);
    width: 100%; // 确保宽度不超出容器
    box-sizing: border-box; // 包含padding在内的宽度计算
    
    .title-area {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1; // 占据剩余空间
      min-width: 0; // 防止flex子元素溢出
      
      .country-name {
        font-size: 24px;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 28px;
        overflow-wrap: break-word; // 防止长文本溢出
      }
      
      .rank-badge {
        font-size: 18px;
        font-weight: 700;
        padding: 4px 12px;
        border: 2px solid;
        border-radius: 4px;
        flex-shrink: 0; // 防止徽章被压缩
        box-sizing: border-box; // 包含padding在内的宽度计算
        
        &.rank-S {
          color: #FFD700;
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.1);
        }
        
        &.rank-A {
          color: #00FF88;
          border-color: #00FF88;
          background: rgba(0, 255, 136, 0.1);
        }
        
        &.rank-B {
          color: #00D9FF;
          border-color: #00D9FF;
          background: rgba(0, 217, 255, 0.1);
        }
        
        &.rank-C {
          color: #8899AA;
          border-color: #8899AA;
          background: rgba(136, 153, 170, 0.1);
        }
        
        &.rank-D {
          color: #667788;
          border-color: #667788;
          background: rgba(102, 119, 136, 0.1);
        }
      }
    }
    
    // 关闭按钮（圆形背景，悬停发光）
    .close-btn {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(0, 217, 255, 0.5);
      border-radius: 50%;
      width: 28px;
      height: 28px;
      min-width: 32px; // 触屏友好
      min-height: 32px;
      cursor: pointer;
      color: #00D9FF;
      font-size: 16px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0; // 防止按钮被压缩
      box-sizing: border-box; // 包含border在内的宽度计算
      
      &:hover {
        background: rgba(0, 217, 255, 0.2);
        border-color: rgba(0, 217, 255, 0.8);
        box-shadow: 0 0 8px rgba(0, 217, 255, 0.6);
      }
    }
  }
  
  // 核心指标区域（三列等宽卡片）
  .core-metrics {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 12px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    width: 100%; // 确保宽度不超出容器
    box-sizing: border-box; // 包含padding在内的宽度计算
    
    .metric-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 0; // 防止flex子元素溢出
      
      .metric-value {
        font-size: 20px;
        font-weight: 700;
        color: #FFFFFF;
        line-height: 24px;
        overflow-wrap: break-word; // 防止长文本溢出
        
        .metric-unit {
          font-size: 14px;
          font-weight: 400;
          color: #8899AA;
          margin-left: 4px;
        }
        
        &.trend-up {
          color: #00FF88;
        }
        
        &.trend-down {
          color: #FF4444;
        }
      }
      
      .metric-label {
        font-size: 12px;
        font-weight: 400;
        color: #00D9FF;
        line-height: 16px;
        margin-top: 4px;
        overflow-wrap: break-word; // 防止长文本溢出
      }
    }
    
    .metric-divider {
      width: 1px;
      height: 40px;
      background: rgba(0, 217, 255, 0.3);
      margin: 0 8px;
    }
  }
  
  // 分隔线
  .separator-line {
    height: 1.5px;
    background: rgba(0, 217, 255, 0.2);
    margin: 12px 0;
    width: 100%; // 确保宽度不超出容器
  }
  
  // 三军分类数据（两列网格布局）
  .category-section {
    margin-bottom: 12px;
    width: 100%; // 确保宽度不超出容器
    box-sizing: border-box; // 包含margin在内的宽度计算
    
    .category-title {
      font-size: 12px;
      font-weight: 600;
      color: #00D9FF;
      line-height: 16px;
      margin-bottom: 8px;
      letter-spacing: 1px;
      text-transform: uppercase;
      overflow-wrap: break-word; // 防止长文本溢出
    }
    
    .category-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 100%; // 确保网格宽度不超出容器
      box-sizing: border-box; // 包含gap在内的宽度计算
      
      .category-block {
        background: rgba(0, 217, 255, 0.05);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 4px;
        padding: 8px;
        box-sizing: border-box; // 包含padding在内的宽度计算
        
        .block-header {
          font-size: 14px;
          font-weight: 600;
          color: #00D9FF;
          line-height: 18px;
          margin-bottom: 8px;
          padding-left: 8px;
          border-left: 2px solid #00D9FF;
          overflow-wrap: break-word; // 防止长文本溢出
        }
        
        .block-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
          
          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%; // 确保宽度不超出容器
            
            .item-label {
              font-size: 12px;
              font-weight: 400;
              color: #8899AA;
              line-height: 16px;
              overflow-wrap: break-word; // 防止长文本溢出
            }
            
            .item-value {
              font-size: 12px;
              font-weight: 500;
              color: #00D9FF;
              line-height: 16px;
              overflow-wrap: break-word; // 防止长文本溢出
            }
          }
        }
      }
    }
  }
  
  // 代表装备区域（类型标识 + 型号名称）
  .weapons-section {
    margin-bottom: 12px;
    width: 100%; // 确保宽度不超出容器
    box-sizing: border-box; // 包含margin在内的宽度计算
    
    .weapons-title {
      font-size: 12px;
      font-weight: 600;
      color: #00D9FF;
      line-height: 16px;
      margin-bottom: 8px;
      letter-spacing: 1px;
      text-transform: uppercase;
      overflow-wrap: break-word; // 防止长文本溢出
    }
    
    .weapons-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%; // 确保宽度不超出容器
      box-sizing: border-box; // 包含gap在内的宽度计算
      
      .weapon-item {
        display: flex;
        align-items: center;
        padding: 6px 8px;
        background: rgba(0, 217, 255, 0.05);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 2px;
        width: 100%; // 确保宽度不超出容器
        box-sizing: border-box; // 包含padding在内的宽度计算
        
        .weapon-text {
          font-size: 12px;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 16px;
          overflow-wrap: break-word; // 防止长文本溢出
        }
      }
      
      .weapon-empty {
        font-size: 12px;
        font-weight: 400;
        color: #8899AA;
        line-height: 16px;
        text-align: center;
        font-style: italic;
        padding: 12px;
        overflow-wrap: break-word; // 防止长文本溢出
      }
    }
  }
  
  // 装备数量趋势图（Canvas）
  .trend-chart-section {
    margin-bottom: 8px;
    width: 100%; // 确保宽度不超出容器
    box-sizing: border-box; // 包含margin在内的宽度计算
    
    .chart-title {
      font-size: 12px;
      font-weight: 600;
      color: #00D9FF;
      line-height: 16px;
      margin-bottom: 8px;
      letter-spacing: 1px;
      text-transform: uppercase;
      overflow-wrap: break-word; // 防止长文本溢出
    }
    
    .chart-container {
      background: rgba(0, 217, 255, 0.05);
      border: 1px solid rgba(0, 217, 255, 0.2);
      border-radius: 4px;
      padding: 8px;
      width: 100%; // 确保宽度不超出容器
      box-sizing: border-box; // 包含padding在内的宽度计算
      
      .trend-canvas {
        display: block;
        width: 100%;
        height: 120px;
        cursor: crosshair;
      }
    }
    
    .chart-note {
      font-size: 10px;
      font-weight: 400;
      color: #667788;
      line-height: 14px;
      text-align: center;
      margin-top: 4px;
      font-style: italic;
      overflow-wrap: break-word; // 防止长文本溢出
    }
  }
}

// 二级面板入场动画
@keyframes panel-enter {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0) scale(1);
  }
}

// 扫描线移动动画
@keyframes scan-move {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

// 轻量化呼吸光效动画
@keyframes breathe-light {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 14px rgba(0, 217, 255, 0.5);
  }
}

@keyframes dot-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(0, 217, 255, 0.8); }
  50%      { box-shadow: 0 0 16px rgba(0, 217, 255, 1); }
}

@keyframes scan-pulse {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

@keyframes dot-pulse-enhanced {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 217, 255, 1), 0 0 20px rgba(0, 217, 255, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 15px rgba(0, 217, 255, 1), 0 0 30px rgba(0, 217, 255, 0.8);
    transform: scale(1.2);
  }
}

@keyframes card-scan-line {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(60px); opacity: 0; }
}
</style>
