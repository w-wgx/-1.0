<template>
  <div class="stats-page">
    <!-- 赛博网格背景 -->
    <div class="cyber-grid"></div>
    <div class="scan-line"></div>

    <!-- 顶部导航栏 - 与全球概览页面统一设计 -->
    <header class="top-nav">
      <div class="nav-left">
        <div class="nav-title-group">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3,20 3,4 3,20 21,20"/>
            <polyline points="7,14 11,10 15,12 20,7"/>
            <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
            <circle cx="11" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="20" cy="7" r="1.5" fill="currentColor"/>
          </svg>
          <div class="nav-text">
            <span class="nav-title">统计分析</span>
            <span class="nav-subtitle">STATISTICS ANALYTICS</span>
          </div>
        </div>
      </div>

      <div class="nav-center">
        <router-link to="/global-overview" class="nav-tab">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <ellipse cx="12" cy="12" rx="3.5" ry="9"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="4.5" y1="7" x2="19.5" y2="7"/>
            <line x1="4.5" y1="17" x2="19.5" y2="17"/>
          </svg>
          <span>全球概览</span>
        </router-link>
        <router-link to="/data-management" class="nav-tab">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <rect x="4.5" y="4.5" width="2" height="2" rx="0.5" fill="currentColor"/>
          </svg>
          <span>数据管理</span>
        </router-link>
        <router-link to="/equipment-stats" class="nav-tab active">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3,20 3,4 3,20 21,20"/>
            <polyline points="7,14 11,10 15,12 20,7"/>
            <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
            <circle cx="11" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="20" cy="7" r="1.5" fill="currentColor"/>
          </svg>
          <span>统计分析</span>
        </router-link>
      </div>

      <div class="nav-right">
        <!-- 保持与其他页面布局一致，右侧预留空白 -->
      </div>
    </header>

    <!-- 概述卡片行：4个等宽卡片 -->
    <section class="summary-cards">
      <div class="summary-card">
        <svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3V21H21"/>
          <path d="M7 14L11 10L15 12L20 7"/>
          <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="20" cy="7" r="1.5" fill="currentColor"/>
        </svg>
        <div class="card-content">
          <div class="card-value">{{ animatedStats.total.toLocaleString() }}</div>
          <div class="card-label">总装备数</div>
        </div>
      </div>
      <div class="summary-card">
        <svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <div class="card-content">
          <div class="card-value">{{ animatedStats.types }}</div>
          <div class="card-label">装备类型</div>
        </div>
      </div>
      <div class="summary-card">
        <svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <ellipse cx="12" cy="12" rx="3.5" ry="9"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="4.5" y1="7" x2="19.5" y2="7"/>
          <line x1="4.5" y1="17" x2="19.5" y2="17"/>
        </svg>
        <div class="card-content">
          <div class="card-value">{{ animatedStats.countries }}</div>
          <div class="card-label">国家数量</div>
        </div>
      </div>
      <div class="summary-card">
        <svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <circle cx="12" cy="15" r="2"/>
        </svg>
        <div class="card-content">
          <div class="card-value">{{ animatedStats.avgYear }}</div>
          <div class="card-label">平均服役年份</div>
        </div>
      </div>
    </section>

    <!-- 筛选栏：独立卡片区域 -->
    <section class="filter-section">
      <div class="filter-header">
        <span class="filter-title">
          <svg class="filter-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
          </svg>
          数据筛选
        </span>
        <span class="filter-hint">筛选后图表将动态更新</span>
      </div>
      <div class="filter-controls">
        <!-- 国家筛选：可搜索下拉框 -->
        <div class="filter-item">
          <label class="filter-label">国家筛选</label>
          <el-select
            v-model="selectedCountry"
            placeholder="选择国家"
            filterable
            clearable
            :filter-method="filterCountry"
            popper-class="stats-filter-popper"
            class="stats-filter-select"
          >
            <el-option
              v-for="opt in filteredCountryOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>

        <!-- 服役状态：下拉框 -->
        <div class="filter-item">
          <label class="filter-label">服役状态</label>
          <el-select
            v-model="selectedStatus"
            placeholder="选择状态"
            clearable
            popper-class="stats-filter-popper"
            class="stats-filter-select"
          >
            <el-option
              v-for="opt in statusOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>

        <!-- 类型筛选：下拉框 -->
        <div class="filter-item">
          <label class="filter-label">类型筛选</label>
          <el-select
            v-model="selectedType"
            placeholder="选择类型"
            clearable
            popper-class="stats-filter-popper"
            class="stats-filter-select"
          >
            <el-option
              v-for="opt in typeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>

        <!-- 对比模式：下拉框 -->
        <div class="filter-item">
          <label class="filter-label">对比模式</label>
          <el-select
            v-model="radarCompare"
            placeholder="选择对比模式"
            popper-class="stats-filter-popper"
            class="stats-filter-select"
          >
            <el-option value="all" label="全部类型对比" />
            <el-option-group label="同类型对比">
              <el-option value="fighter-vs-bomber" label="战斗机 vs 轰炸机" />
              <el-option value="destroyer-vs-frigate" label="驱逐舰 vs 护卫舰" />
              <el-option value="tank-vs-ifv" label="坦克 vs 步兵战车" />
              <el-option value="submarine-vs-ssn" label="潜艇 vs 核潜艇" />
            </el-option-group>
            <el-option-group label="跨类型对比">
              <el-option value="tank-vs-fighter" label="坦克 vs 战斗机" />
              <el-option value="ship-vs-submarine" label="舰艇 vs 潜艇" />
              <el-option value="artillery-vs-missile" label="火炮 vs 导弹" />
              <el-option value="awacs-vs-recon" label="预警机 vs 侦察机" />
            </el-option-group>
            <el-option-group label="攻防对比">
              <el-option value="offensive-vs-defensive" label="进攻装备 vs 防御装备" />
              <el-option value="land-vs-sea" label="陆基武器 vs 海基武器" />
            </el-option-group>
          </el-select>
        </div>

        <!-- 重置按钮 -->
        <button class="reset-btn" @click="resetAllFilters">
          <svg class="reset-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          重置筛选
        </button>
      </div>

      <!-- 当前筛选提示 -->
      <div v-if="hasActiveFilter" class="active-filter-summary">
        <span class="summary-label">当前筛选：</span>
        <span v-if="selectedCountry && selectedCountry !== 'all'" class="filter-tag">
          国家: {{ getCountryLabel(selectedCountry) }}
        </span>
        <span v-if="selectedType && selectedType !== 'all'" class="filter-tag">
          类型: {{ getTypeLabel(selectedType) }}
        </span>
        <span v-if="selectedStatus && selectedStatus !== 'all'" class="filter-tag">
          {{ getStatusLabel(selectedStatus) }}
        </span>
      </div>
    </section>

    <!-- 数据洞察分析模块 -->
    <section class="insight-section">
      <div class="insight-card">
        <div class="insight-header">
          <svg class="insight-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <h3 class="insight-title">数据洞察</h3>
          <span class="insight-subtitle">DATA INSIGHT</span>
          <span class="insight-badge" :class="{ active: hasActiveFilter }">
            {{ hasActiveFilter ? '筛选模式' : '全局概览' }}
          </span>
        </div>

        <div class="insight-body">
          <div class="insight-item">
            <div class="insight-item-icon overview">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="3.5" ry="9"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="4.5" y1="7" x2="19.5" y2="7"/>
                <line x1="4.5" y1="17" x2="19.5" y2="17"/>
              </svg>
            </div>
            <div class="insight-item-content">
              <div class="insight-item-label">全局概览</div>
              <div class="insight-item-text" v-html="insightOverview"></div>
            </div>
          </div>

          <div class="insight-item">
            <div class="insight-item-icon structure">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <div class="insight-item-content">
              <div class="insight-item-label">结构分析</div>
              <div class="insight-item-text" v-html="insightStructure"></div>
            </div>
          </div>

          <div class="insight-item">
            <div class="insight-item-icon ranking">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3,20 3,4 3,20 21,20"/>
                <polyline points="7,14 11,10 15,12 20,7"/>
                <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
                <circle cx="11" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="20" cy="7" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div class="insight-item-content">
              <div class="insight-item-label">国家梯队</div>
              <div class="insight-item-text" v-html="insightRanking"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 图表网格区域 -->
    <section class="charts-grid">
      <!-- 第一行：饼图 + 雷达图 + 柱状图 三栏并排 -->
      <div class="chart-row row-3col">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">装备类型数量分布</h3>
          </div>
          <div ref="typeChartRef" class="chart-body"></div>
          <div class="chart-note">
            <svg class="note-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            类型分类依据国际军事装备标准（SIPRI数据库）
          </div>
        </div>

        <div class="chart-card radar-card">
          <div class="chart-header">
            <h3 class="chart-title">各类装备综合能力对比</h3>
          </div>
          <div ref="radarChartRef" class="chart-body">
            <div v-if="radarLoading" class="radar-loading">
              <span class="loading-spinner"></span>
              <span class="loading-text">加载中...</span>
            </div>
          </div>
          <div class="chart-note">
            <svg class="warning-badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span class="warning-text">缺少空中机动性数据，可能影响对比准确性</span>
            <span class="note-divider">|</span>
            <svg class="note-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            指标：长度/重量/速度/乘员/航程
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">各国装备数量排名</h3>
            <span class="chart-badge">TOP 10</span>
          </div>
          <div ref="countryChartRef" class="chart-body"></div>
          <div class="chart-note">
            <svg class="note-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            TOP10国家装备总量占全球约72%
          </div>
        </div>
      </div>

      <!-- 第二行：折线图全宽 -->
      <div class="chart-row row-full">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">装备服役年代趋势</h3>
            <span class="chart-badge clickable">点击年份查看详情</span>
          </div>
          <!-- 年代区间快捷筛选 -->
          <div class="era-filter-bar">
            <span class="era-filter-label">年代区间：</span>
            <button
              v-for="era in eraOptions"
              :key="era.value"
              class="era-btn"
              :class="{ active: selectedEra === era.value }"
              @click="onEraClick(era.value)"
            >{{ era.label }}</button>
          </div>
          <div ref="yearChartRef" class="chart-body chart-body-large"></div>
          <div class="chart-note chart-note-highlight">
            <svg class="marker-badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span class="marker-text">1985–1990 快速列装期</span>
            <span class="note-divider">|</span>
            <svg class="note-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            部分1990年前的装备数据可能存在缺失
          </div>
        </div>
      </div>

    </section>

    <!-- 底部信息区 -->
    <footer class="page-footer">
      <div class="footer-main">
        <span class="footer-item">
          <svg class="footer-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          数据最后更新：2025-03-01
        </span>
        <span class="footer-divider">|</span>
        <span class="footer-item">
          <svg class="footer-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3V21H21"/>
            <path d="M7 14L11 10L15 12L20 7"/>
            <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
            <circle cx="11" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="20" cy="7" r="1.5" fill="currentColor"/>
          </svg>
          数据来源：SIPRI军事装备数据库
        </span>
        <span class="footer-divider">|</span>
        <span class="footer-item">
          <svg class="footer-icon-svg warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          部分老旧装备信息不完整
        </span>
      </div>
      <div class="footer-note">
        本页面数据仅供参考，实际数据请以官方发布为准
      </div>
    </footer>

    <!-- 年份详情模态框 -->
    <div v-if="showYearModal" class="modal-overlay" @click.self="closeYearModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalYear }}年服役的装备</h3>
          <button class="modal-close" @click="closeYearModal">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">该年代共服役 <strong>{{ modalCount }} 件</strong>装备，典型代表包括：</p>
          <ul class="equipment-list">
            <li v-for="(eq, i) in modalEquipments" :key="i">
              <span class="eq-name">{{ eq.name }}</span>
              <span class="eq-country">{{ eq.country }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { equipmentApi } from '@/api/equipment'
import { EQUIPMENT_TYPE_CONFIG } from '@/types/index'
import { ElSelect, ElOption } from 'element-plus'
import { useCachedData } from '@/composables/useCachedData'
import { PageType } from '@/stores/cacheStore'
import { eventBus, Events } from '@/utils/EventBus'

// ========== 图表引用 ==========
const typeChartRef = ref<HTMLElement>()
const countryChartRef = ref<HTMLElement>()
const yearChartRef = ref<HTMLElement>()
const radarChartRef = ref<HTMLElement>()

let typeChart: echarts.ECharts | null = null
let countryChart: echarts.ECharts | null = null
let yearChart: echarts.ECharts | null = null
let radarChart: echarts.ECharts | null = null

// ========== 原始数据存储 ==========
// 全量装备数据（用于前端筛选）
const allEquipments = ref<any[]>([])

// 聚合统计数据（从后端获取）
const rawData = reactive({
  byType: [] as any[],
  byCountry: [] as any[],
  byYear: [] as any[],
  performance: [] as any[]
})

// ========== 统计数据 ==========
const stats = reactive({
  total: 0,
  types: 0,
  countries: 0,
  avgYear: 0
})

const animatedStats = reactive({
  total: 0,
  types: 0,
  countries: 0,
  avgYear: 0
})

// ========== 筛选状态 ==========
const selectedCountry = ref('all')
const selectedType = ref('all')
const selectedStatus = ref('all')  // 替代原来的 onlyActive
const radarCompare = ref('all')
const radarLoading = ref(false)

// ========== 筛选选项 ==========
// 国家列表（扩展为完整列表，按装备数量排序）
const countryOptions = [
  { value: 'all', label: '全部国家' },
  { value: 'USA', label: '美国' },
  { value: 'Russia', label: '俄罗斯' },
  { value: 'China', label: '中国' },
  { value: 'UK', label: '英国' },
  { value: 'France', label: '法国' },
  { value: 'Germany', label: '德国' },
  { value: 'Japan', label: '日本' },
  { value: 'India', label: '印度' },
  { value: 'Israel', label: '以色列' },
  { value: 'SouthKorea', label: '韩国' },
  { value: 'Italy', label: '意大利' },
  { value: 'Turkey', label: '土耳其' },
  { value: 'Pakistan', label: '巴基斯坦' },
  { value: 'Iran', label: '伊朗' },
  { value: 'SaudiArabia', label: '沙特阿拉伯' },
  { value: 'Australia', label: '澳大利亚' },
  { value: 'Canada', label: '加拿大' },
  { value: 'Spain', label: '西班牙' },
  { value: 'Sweden', label: '瑞典' },
  { value: 'Netherlands', label: '荷兰' },
  { value: 'Poland', label: '波兰' },
  { value: 'Ukraine', label: '乌克兰' },
  { value: 'Egypt', label: '埃及' },
  { value: 'Brazil', label: '巴西' },
  { value: 'NorthKorea', label: '朝鲜' },
  { value: 'Vietnam', label: '越南' },
  { value: 'Taiwan', label: '台湾地区' },
  { value: 'Singapore', label: '新加坡' },
  { value: 'Malaysia', label: '马来西亚' },
  { value: 'Indonesia', label: '印尼' },
  { value: 'Thailand', label: '泰国' },
  { value: 'Philippines', label: '菲律宾' },
  { value: 'Norway', label: '挪威' },
  { value: 'Finland', label: '芬兰' },
  { value: 'Denmark', label: '丹麦' },
  { value: 'Belgium', label: '比利时' },
  { value: 'Austria', label: '奥地利' },
  { value: 'Switzerland', label: '瑞士' },
  { value: 'Portugal', label: '葡萄牙' },
  { value: 'Czech', label: '捷克' },
  { value: 'Hungary', label: '匈牙利' },
  { value: 'Romania', label: '罗马尼亚' },
  { value: 'Bulgaria', label: '保加利亚' },
  { value: 'Greece', label: '希腊' },
  { value: 'Argentina', label: '阿根廷' },
  { value: 'Chile', label: '智利' },
  { value: 'Colombia', label: '哥伦比亚' },
  { value: 'Mexico', label: '墨西哥' },
  { value: 'SouthAfrica', label: '南非' },
  { value: 'Nigeria', label: '尼日利亚' },
  { value: 'Algeria', label: '阿尔及利亚' },
  { value: 'Morocco', label: '摩洛哥' },
  { value: 'UAE', label: '阿联酋' },
  { value: 'Qatar', label: '卡塔尔' },
  { value: 'Kuwait', label: '科威特' },
  { value: 'Oman', label: '阿曼' },
  { value: 'Jordan', label: '约旦' },
  { value: 'Lebanon', label: '黎巴嫩' },
  { value: 'Syria', label: '叙利亚' },
  { value: 'Iraq', label: '伊拉克' },
  { value: 'Afghanistan', label: '阿富汗' },
  { value: 'Myanmar', label: '缅甸' },
  { value: 'Bangladesh', label: '孟加拉国' },
  { value: 'SriLanka', label: '斯里兰卡' },
  { value: 'Cambodia', label: '柬埔寨' },
  { value: 'Laos', label: '老挝' },
  { value: 'Mongolia', label: '蒙古' },
  { value: 'NewZealand', label: '新西兰' }
]

// 国家搜索过滤后的列表
const filteredCountryOptions = ref([...countryOptions])
const countrySearchQuery = ref('')

// 类型列表
const typeOptions = computed(() => {
  const opts = [{ value: 'all', label: '全部类型' }]
  Object.keys(EQUIPMENT_TYPE_CONFIG).forEach(key => {
    opts.push({ value: key, label: EQUIPMENT_TYPE_CONFIG[key].label })
  })
  return opts
})

// 服役状态列表
const statusOptions = [
  { value: 'all', label: '全部装备' },
  { value: 'active', label: '仅现役装备' },
  { value: 'retired', label: '仅退役装备' },
  { value: 'development', label: '仅研发中' }
]

// ========== 模态框状态 ==========
const showYearModal = ref(false)
const modalYear = ref('')
const modalCount = ref(0)
const modalEquipments = ref<{name: string, country: string}[]>([])

// 年代区间快捷筛选
const selectedEra = ref('all')
const eraOptions = [
  { value: 'all', label: '全部' },
  { value: '1950', label: '1950年代' },
  { value: '1960', label: '1960年代' },
  { value: '1970', label: '1970年代' },
  { value: '1980', label: '1980年代' },
  { value: '1990', label: '1990年代' },
  { value: '2000', label: '2000年代' },
  { value: '2010', label: '2010年代' },
  { value: '2020', label: '2020年代' }
]

const onEraClick = (era: string) => {
  selectedEra.value = era
  renderAllCharts()
}

// ========== 计算属性 ==========
const hasActiveFilter = computed(() => {
  return (selectedCountry.value && selectedCountry.value !== 'all') ||
         (selectedType.value && selectedType.value !== 'all') ||
         (selectedStatus.value && selectedStatus.value !== 'all')
})

// ========== 数据洞察计算 ==========
const insightOverview = computed(() => {
  const data = getFilteredEquipments()
  const total = data.length || stats.total
  const suffix = hasActiveFilter.value ? '（当前筛选范围内）' : ''
  if (total === 0) {
    return `当前筛选条件下无匹配装备数据，请调整筛选条件。`
  }

  let countries = new Set(data.map((item: any) => item.country).filter(Boolean)).size
  if (countries === 0) countries = stats.countries

  const years = data
    .map((item: any) => parseInt(item.year || item.serviceYear || item.introYear || '0'))
    .filter(y => y > 1900 && y < 2100)
  const minYear = years.length > 0 ? Math.min(...years) : 0
  const maxYear = years.length > 0 ? Math.max(...years) : 0

  let characteristic = ''
  if (total >= 10000) {
    characteristic = '装备存量规模庞大'
  } else if (total >= 5000) {
    characteristic = '装备体系较为完整'
  } else if (total >= 1000) {
    characteristic = '装备规模适中'
  } else {
    characteristic = '装备规模较小'
  }

  return `当前共收录 <strong>${total.toLocaleString()} 件</strong>装备，覆盖 <strong>${countries} 个</strong>国家${suffix}。核心特征：<strong>${characteristic}</strong>，服役时间跨度 ${minYear}–${maxYear} 年。`
})

const insightStructure = computed(() => {
  const data = getFilteredEquipments()
  let byType = aggregateByType(data)
  // 无全量数据时回退使用后端聚合数据
  if (byType.length === 0 && rawData.byType.length > 0) {
    byType = rawData.byType
  }
  if (byType.length === 0) {
    return `暂无数据。`
  }
  byType.sort((a, b) => b.count - a.count)
  const total = byType.reduce((s, t) => s + t.count, 0)

  const top = byType[0]
  const bottom = byType[byType.length - 1]
  const topLabel = EQUIPMENT_TYPE_CONFIG[top.type]?.label || top.type
  const topPct = ((top.count / total) * 100).toFixed(1)
  const bottomLabel = EQUIPMENT_TYPE_CONFIG[bottom.type]?.label || bottom.type
  const bottomPct = ((bottom.count / total) * 100).toFixed(1)

  // 结构均衡度判断
  const typeCount = byType.length
  const avgShare = 100 / typeCount
  const maxDeviation = Math.abs(parseFloat(topPct) - avgShare)
  let balance = ''
  if (maxDeviation > 30) {
    balance = '结构高度集中'
  } else if (maxDeviation > 15) {
    balance = '结构有一定倾斜'
  } else {
    balance = '结构相对均衡'
  }

  return `占比最高的装备类型为 <span class="insight-highlight">${topLabel}</span>（${topPct}%），占比最低的为 <span class="insight-highlight">${bottomLabel}</span>（${bottomPct}%）。${balance}，共 ${typeCount} 种装备类型。`
})

const insightRanking = computed(() => {
  const data = getFilteredEquipments()
  let byCountry = aggregateByCountry(data)
  // 无全量数据时回退使用后端聚合数据
  if (byCountry.length === 0 && rawData.byCountry.length > 0) {
    byCountry = rawData.byCountry
  }
  if (byCountry.length === 0) {
    return `暂无数据。`
  }
  const total = byCountry.reduce((s, c) => s + c.count, 0)

  const top1 = byCountry[0]
  const top1Name = getCountryName(top1.country)
  const top1Pct = ((top1.count / total) * 100).toFixed(1)

  if (byCountry.length === 1) {
    return `仅 <span class="insight-highlight">${top1Name}</span> 一个国家，占全部装备的 ${top1Pct}%。`
  }

  const top2 = byCountry[1]
  const top2Name = getCountryName(top2.country)
  const gap = ((top1.count - top2.count) / top2.count * 100).toFixed(1)
  const gapText = top1.count >= top2.count
    ? `领先第2名 <span class="insight-highlight">${gap}%</span>`
    : `落后第2名 <span class="insight-highlight">${Math.abs(parseFloat(gap))}%</span>`

  // TOP3 集中度
  const top3Total = byCountry.slice(0, 3).reduce((s, c) => s + c.count, 0)
  const top3Pct = ((top3Total / total) * 100).toFixed(1)
  let concentration = ''
  if (parseFloat(top3Pct) > 60) {
    concentration = '头部集中度极高'
  } else if (parseFloat(top3Pct) > 40) {
    concentration = '头部集中度较高'
  } else {
    concentration = '装备分布较为分散'
  }

  return `<span class="insight-highlight">${top1Name}</span> 以 ${top1.count.toLocaleString()} 件装备位居首位（${top1Pct}%），${gapText}（${top2Name}）。TOP3 国家合计占 ${top3Pct}%，${concentration}。`
})

const getCountryLabel = (value: string) => {
  return countryOptions.find(o => o.value === value)?.label || value
}

const getTypeLabel = (value: string) => {
  return EQUIPMENT_TYPE_CONFIG[value]?.label || value
}

const getStatusLabel = (value: string) => {
  return statusOptions.find(o => o.value === value)?.label || value
}

// ========== 国家搜索过滤 ==========
const filterCountry = (query: string) => {
  countrySearchQuery.value = query
  if (query) {
    filteredCountryOptions.value = countryOptions.filter(opt =>
      opt.label.toLowerCase().includes(query.toLowerCase()) ||
      opt.value.toLowerCase().includes(query.toLowerCase())
    )
  } else {
    filteredCountryOptions.value = [...countryOptions]
  }
}

// ========== 数字动画 ==========
const animateNumber = (key: keyof typeof animatedStats, target: number) => {
  const duration = 1500
  const startTime = Date.now()
  const startValue = animatedStats[key]

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    animatedStats[key] = Math.round(startValue + (target - startValue) * easeProgress)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  animate()
}

// ========== 模拟数据生成 ==========
const generateMockEquipments = (year: string, count: number) => {
  const templates: Record<string, {name: string, country: string}[]> = {
    '1970': [
      { name: 'M60 Patton', country: '美国' },
      { name: 'T-62', country: '苏联' },
      { name: 'Leopard 1', country: '德国' },
      { name: 'Chieftain', country: '英国' },
      { name: 'AMX-30', country: '法国' }
    ],
    '1980': [
      { name: 'M1 Abrams', country: '美国' },
      { name: 'T-72', country: '苏联' },
      { name: 'Leopard 2', country: '德国' },
      { name: 'Challenger 1', country: '英国' },
      { name: 'Type 74', country: '日本' }
    ],
    '1990': [
      { name: 'M1A2 Abrams', country: '美国' },
      { name: 'T-90', country: '俄罗斯' },
      { name: 'Leopard 2A5', country: '德国' },
      { name: 'Challenger 2', country: '英国' },
      { name: 'Type 90', country: '日本' }
    ],
    '2000': [
      { name: 'F-22 Raptor', country: '美国' },
      { name: 'Su-35', country: '俄罗斯' },
      { name: 'Eurofighter Typhoon', country: '欧洲' },
      { name: 'Rafale', country: '法国' },
      { name: 'J-10', country: '中国' }
    ],
    '2010': [
      { name: 'F-35 Lightning II', country: '美国' },
      { name: 'Su-57', country: '俄罗斯' },
      { name: 'J-20', country: '中国' },
      { name: 'Type 10', country: '日本' },
      { name: 'Altay', country: '土耳其' }
    ]
  }
  return templates[year] || templates['1990']
}

// ========== 加载数据 ==========
const loadStats = async () => {
  try {
    const statsRes = await equipmentApi.getStats()
    
    if (statsRes.code === 200) {
      const data = statsRes.data
      rawData.byType = data.byType || []
      rawData.byCountry = data.byCountry || []
      rawData.byYear = data.byYear || []
      rawData.performance = data.performance || []

      stats.total = data.total || 0
      stats.types = data.typeCount || 0
      stats.countries = data.countryCount || 0
      stats.avgYear = data.avgYear || 0

      animateNumber('total', stats.total)
      animateNumber('types', stats.types)
      animateNumber('countries', stats.countries)
      animateNumber('avgYear', stats.avgYear)
    }

    renderAllCharts()
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// ========== 获取后端筛选统计数据 ==========
const fetchFilteredStats = async () => {
  try {
    const params: any = {}
    if (selectedCountry.value && selectedCountry.value !== 'all') {
      params.country = selectedCountry.value
    }
    if (selectedType.value && selectedType.value !== 'all') {
      params.type = selectedType.value
    }
    if (selectedStatus.value && selectedStatus.value !== 'all') {
      params.status = selectedStatus.value
    }
    
    const res = await equipmentApi.getFilteredStats(params)
    
    if (res.code === 200) {
      const data = res.data
      rawData.byType = data.byType || []
      rawData.byCountry = data.byCountry || []
      rawData.byYear = data.byYear || []
      rawData.performance = data.performance || []

      stats.total = data.total || 0
      stats.types = data.typeCount || 0
      stats.countries = data.countryCount || 0
      stats.avgYear = data.avgYear || 0

      animateNumber('total', stats.total)
      animateNumber('types', stats.types)
      animateNumber('countries', stats.countries)
      animateNumber('avgYear', stats.avgYear)
    }
  } catch (error) {
    console.error('获取筛选统计数据失败:', error)
  }
}

// ========== 统一筛选过滤函数 ==========
/**
 * 根据 year 字段推断服役状态
 * 数据中无 status 字段，使用 year 启发式分类：
 *   - year >= 1990 → active（现役）
 *   - year > 0 且 year < 1990 → retired（退役）
 *   - year = 0 / null / undefined → development（研发中）
 */
const getServiceStatus = (item: any): string => {
  const year = item.year
  if (year === null || year === undefined || year === 0) return 'development'
  if (year >= 1990) return 'active'
  return 'retired'
}

const getFilteredEquipments = () => {
  let filtered = [...allEquipments.value]

  // 国家筛选
  if (selectedCountry.value && selectedCountry.value !== 'all') {
    filtered = filtered.filter((item: any) => {
      const itemCountry = item.country || ''
      // 支持多种格式匹配：代码、中文名、英文名
      return itemCountry === selectedCountry.value ||
             itemCountry === countryNameMap[selectedCountry.value] ||
             getCountryName(itemCountry) === getCountryName(selectedCountry.value)
    })
  }

  // 类型筛选
  if (selectedType.value && selectedType.value !== 'all') {
    filtered = filtered.filter((item: any) => {
      const itemType = (item.type || '').toLowerCase()
      return itemType === selectedType.value.toLowerCase()
    })
  }

  // 服役状态筛选（基于 year 字段启发式分类）
  if (selectedStatus.value && selectedStatus.value !== 'all') {
    filtered = filtered.filter((item: any) => {
      const status = getServiceStatus(item)
      return status === selectedStatus.value
    })
  }

  return filtered
}

// ========== 聚合统计函数 ==========
// 按类型聚合
// 统一装备类型排序，确保饼图和雷达图图例顺序一致
const TYPE_ORDER = ['aircraft', 'ship', 'submarine', 'weapon', 'facility', 'sensor', 'smallarms', 'armor']

const aggregateByType = (data: any[]) => {
  const typeCount: Record<string, number> = {}
  data.forEach((item: any) => {
    const type = item.type || 'unknown'
    const typeKey = type.toLowerCase()
    typeCount[typeKey] = (typeCount[typeKey] || 0) + 1
  })
  // 按 TYPE_ORDER 固定排序，与雷达图图例保持一致
  return TYPE_ORDER.filter(key => typeCount[key]).map(type => ({
    type,
    count: typeCount[type]
  }))
}

// 按国家聚合
const aggregateByCountry = (data: any[]) => {
  const countryCount: Record<string, number> = {}
  data.forEach((item: any) => {
    const country = item.country || '未知'
    countryCount[country] = (countryCount[country] || 0) + 1
  })
  return Object.entries(countryCount)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
}

// 按年份聚合
const aggregateByYear = (data: any[]) => {
  const yearCount: Record<string, number> = {}
  data.forEach((item: any) => {
    const year = item.year || item.serviceYear || item.introYear || '未知'
    if (year && year !== '未知') {
      yearCount[String(year)] = (yearCount[String(year)] || 0) + 1
    }
  })
  return Object.entries(yearCount)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year))
}

// ========== 更新统计数据 ==========
const updateStats = (filteredData: any[]) => {
  const newStats = {
    total: filteredData.length,
    types: new Set(filteredData.map((item: any) => item.type?.toLowerCase())).size,
    countries: new Set(filteredData.map((item: any) => item.country)).size,
    avgYear: 0
  }

  // 计算平均年份
  const years = filteredData
    .map((item: any) => parseInt(item.year || item.serviceYear || item.introYear || '0'))
    .filter(y => y > 1900 && y < 2100)
  if (years.length > 0) {
    newStats.avgYear = Math.round(years.reduce((a, b) => a + b, 0) / years.length)
  }

  animateNumber('total', newStats.total)
  animateNumber('types', newStats.types)
  animateNumber('countries', newStats.countries)
  animateNumber('avgYear', newStats.avgYear)
}

// ========== 渲染所有图表 ==========
const renderAllCharts = () => {
  renderTypeChart(rawData.byType)
  renderCountryChart(rawData.byCountry)
  renderYearChart(rawData.byYear)
  renderRadarChartFromPerformance(rawData.performance)
}

// ========== 装备类型分布饼图 ==========
const renderTypeChart = (byTypeData: any[]) => {
  if (!typeChartRef.value) return

  // 空状态处理
  if (!byTypeData || byTypeData.length === 0) {
    if (!typeChart) {
      typeChart = echarts.init(typeChartRef.value)
    }
    typeChart.setOption({
      title: {
        text: '暂无匹配数据',
        left: 'center',
        top: 'center',
        textStyle: { color: 'rgba(224, 247, 250, 0.5)', fontSize: 14 }
      },
      series: []
    }, { notMerge: true })
    return
  }

  const chartData = byTypeData.map((item: any) => {
    const typeKey = item.type || 'unknown'
    const config = EQUIPMENT_TYPE_CONFIG[typeKey] || { label: typeKey, color: '#4a9eff' }
    return {
      name: config.label,
      value: item.count || 0,
      typeKey: typeKey,
      itemStyle: {
        color: config.color,
        borderRadius: 4
      }
    }
  })

  if (!typeChart) {
    typeChart = echarts.init(typeChartRef.value)
    typeChart.on('click', (params: any) => {
      const clickedType = params.data?.typeKey
      if (clickedType) {
        // 切换类型筛选状态（watch 会自动触发 renderAllCharts）
        if (selectedType.value === clickedType) {
          selectedType.value = 'all'
        } else {
          selectedType.value = clickedType
        }
      }
    })
  }

  typeChart.setOption({
    title: { show: false },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 件 ({d}%)',
      backgroundColor: 'rgba(10, 14, 23, 0.95)',
      borderColor: 'rgba(0, 217, 255, 0.3)',
      textStyle: { color: '#e0f7fa' }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: 'rgba(224, 247, 250, 0.6)', fontSize: 13 }
    },
    series: [{
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#0a0e17',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#00D9FF'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 217, 255, 0.5)'
        }
      },
      data: chartData
    }]
  }, { notMerge: true })
}

// ========== 各国装备数量柱状图 ==========
const renderCountryChart = (byCountryData: any[]) => {
  if (!countryChartRef.value) return

  if (!countryChart) {
    countryChart = echarts.init(countryChartRef.value)
  }

  // 空状态处理
  if (!byCountryData || byCountryData.length === 0) {
    countryChart.setOption({
      title: {
        text: '暂无匹配数据',
        left: 'center',
        top: 'center',
        textStyle: { color: 'rgba(224, 247, 250, 0.5)', fontSize: 14 }
      },
      xAxis: { show: false },
      yAxis: { show: false },
      series: []
    }, { notMerge: true })
    return
  }

  // 取 TOP10 并反转（从下到上显示）
  const top10 = byCountryData.slice(0, 10).reverse()

  countryChart.setOption({
    title: { show: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10, 14, 23, 0.95)',
      borderColor: 'rgba(0, 217, 255, 0.3)',
      textStyle: { color: '#e0f7fa' },
      formatter: (params: any) => {
        const p = params[0]
        return `${p.name}<br/>装备数量: <strong>${p.value} 件</strong>`
      }
    },
    grid: {
      left: 120,
      right: 50,
      bottom: 30,
      top: 20,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '数量（件）',
      nameTextStyle: { 
        color: 'rgba(224, 247, 250, 0.6)', 
        padding: [30, 0, 0, 0],
        align: 'center'
      },
      axisLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.3)' } },
      axisLabel: { 
        color: 'rgba(224, 247, 250, 0.6)',
        formatter: (value: number) => value >= 10000 ? `${value / 10000}万` : `${value}`
      },
      splitLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.1)' } }
    },
    yAxis: {
      type: 'category',
      data: top10.map((item: any) => getCountryName(item.country)),
      axisLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.3)' } },
      axisLabel: {
        color: '#e0f7fa',
        fontSize: 12,
        width: 100,
        overflow: 'truncate',
        align: 'right',
        margin: 8
      }
    },
    series: [{
      type: 'bar',
      data: top10.map((item: any) => ({
        value: item.count || 0,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#00B8E0' },
            { offset: 1, color: '#00D9FF' }
          ]),
          borderRadius: [0, 4, 4, 0]
        }
      })),
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#00D9FF' },
            { offset: 1, color: '#00ff88' }
          ])
        }
      },
      label: {
        show: true,
        position: 'right',
        color: '#e0f7fa',
        fontSize: 12,
        formatter: '{c}'
      }
    }]
  }, { notMerge: true })
}

// ========== 服役年份分布折线图 ==========
const renderYearChart = (byYearData: any[]) => {
  if (!yearChartRef.value) return

  if (!yearChart) {
    yearChart = echarts.init(yearChartRef.value)
    yearChart.on('click', (params: any) => {
      const year = params.name
      const count = params.value
      if (year && count) {
        openYearModal(year, count)
      }
    })
  }

  // 空状态处理
  if (!byYearData || byYearData.length === 0) {
    yearChart.setOption({
      title: {
        text: '暂无匹配数据',
        left: 'center',
        top: 'center',
        textStyle: { color: 'rgba(224, 247, 250, 0.5)', fontSize: 14 }
      },
      xAxis: { show: false },
      yAxis: { show: false },
      series: []
    }, { notMerge: true })
    return
  }

  const currentYear = new Date().getFullYear()

  // 确保年份为字符串格式，并按升序排列
  let yearData = byYearData
    .map((item: any) => ({
      year: String(item.year || '未知'),
      count: item.count || 0
    }))
    .sort((a, b) => {
      const yearA = parseInt(a.year)
      const yearB = parseInt(b.year)
      return yearA - yearB
    })

  // 年代区间筛选
  if (selectedEra.value !== 'all') {
    const decade = parseInt(selectedEra.value)
    yearData = yearData.filter(item => {
      const y = parseInt(item.year)
      return y >= decade && y < decade + 10
    })
  }

  if (yearData.length === 0) {
    yearChart.setOption({
      title: {
        text: '该年代暂无数据',
        left: 'center',
        top: 'center',
        textStyle: { color: 'rgba(224, 247, 250, 0.5)', fontSize: 14 }
      },
      xAxis: { show: false },
      yAxis: { show: false },
      series: []
    }, { notMerge: true })
    return
  }

  // 根据数据量动态计算标签间隔
  const dataLength = yearData.length
  let labelInterval: number | string = 'auto'
  if (dataLength > 30) {
    labelInterval = Math.ceil(dataLength / 10)
  } else if (dataLength > 15) {
    labelInterval = 2
  }

  // 是否需要dataZoom（数据量超过20年时启用）
  const needDataZoom = dataLength > 20

  // 将数据分为已服役和计划列装
  const yearLabels = yearData.map((item: any) => item.year)
  const servedData = yearData.map((item: any) => {
    const y = parseInt(item.year)
    return y <= currentYear ? item.count : null
  })
  const plannedData = yearData.map((item: any) => {
    const y = parseInt(item.year)
    return y > currentYear ? item.count : null
  })

  // 判断是否有未来年份数据
  const hasPlannedData = plannedData.some(v => v !== null)

  const option: any = {
    title: { show: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 14, 23, 0.95)',
      borderColor: 'rgba(0, 217, 255, 0.3)',
      textStyle: { color: '#e0f7fa' },
      formatter: (params: any) => {
        let html = ''
        params.forEach((p: any) => {
          if (p.value !== null && p.value !== undefined) {
            const yearLabel = p.name.endsWith('年') ? p.name : `${p.name}年`
            const tag = p.seriesName === '计划列装' ? ' <span style="color:#ff9800">[计划]</span>' : ''
            html += `${yearLabel}${tag}<br/>${p.seriesName}: <strong>${p.value} 件</strong><br/>`
          }
        })
        return html || '暂无数据'
      }
    },
    legend: {
      data: hasPlannedData ? ['已服役', '计划列装'] : ['已服役'],
      top: 0,
      right: 10,
      textStyle: { color: '#e0f7fa', fontSize: 12 },
      itemWidth: 20,
      itemHeight: 10
    },
    grid: {
      left: '5%',
      right: '4%',
      bottom: needDataZoom ? '18%' : '12%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: yearLabels,
      axisLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.3)' } },
      axisLabel: { 
        color: 'rgba(224, 247, 250, 0.6)',
        rotate: -25,
        fontSize: 12,
        interval: labelInterval,
        formatter: (value: string) => value.endsWith('年') ? value : `${value}年`
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: { color: 'rgba(0, 217, 255, 0.3)' }
      }
    },
    yAxis: {
      type: 'value',
      name: '数量（件）',
      nameTextStyle: { 
        color: 'rgba(224, 247, 250, 0.6)', 
        padding: [0, 0, 0, 40],
        align: 'left'
      },
      axisLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.3)' } },
      axisLabel: { 
        color: 'rgba(224, 247, 250, 0.6)',
        formatter: (value: number) => value >= 10000 ? `${value / 10000}万` : `${value}`
      },
      splitLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.1)' } }
    },
    series: [
      {
        name: '已服役',
        type: 'line',
        data: servedData,
        smooth: true,
        connectNulls: false,
        lineStyle: { color: '#00D9FF', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 217, 255, 0.25)' },
            { offset: 1, color: 'rgba(0, 217, 255, 0.02)' }
          ])
        },
        itemStyle: { color: '#00D9FF' },
        emphasis: {
          itemStyle: { color: '#00ff88', borderColor: '#00D9FF', borderWidth: 2 }
        },
        symbol: 'circle',
        symbolSize: 6,
        markPoint: {
          data: [
            {
              type: 'max',
              name: '峰值',
              symbol: 'pin',
              symbolSize: 50,
              itemStyle: { color: '#00ff88' },
              label: { color: '#fff', fontSize: 11, formatter: (p: any) => `${p.value}` }
            },
            {
              type: 'min',
              name: '低谷',
              symbol: 'pin',
              symbolSize: 50,
              itemStyle: { color: '#ff6b6b' },
              label: { color: '#fff', fontSize: 11, formatter: (p: any) => `${p.value}` }
            }
          ],
          animation: true
        }
      },
      {
        name: '计划列装',
        type: 'line',
        data: plannedData,
        smooth: true,
        connectNulls: false,
        lineStyle: { color: '#ff9800', width: 2, type: 'dashed' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 152, 0, 0.15)' },
            { offset: 1, color: 'rgba(255, 152, 0, 0.02)' }
          ])
        },
        itemStyle: { color: '#ff9800' },
        emphasis: {
          itemStyle: { color: '#ffcc02', borderColor: '#ff9800', borderWidth: 2 }
        },
        symbol: 'diamond',
        symbolSize: 7
      }
    ]
  }

  // 数据量超过20年时添加dataZoom
  if (needDataZoom) {
    option.dataZoom = [
      {
        type: 'slider',
        show: true,
        xAxisIndex: 0,
        start: 0,
        end: 100,
        height: 20,
        bottom: 5,
        borderColor: 'rgba(0, 217, 255, 0.3)',
        backgroundColor: 'rgba(10, 14, 23, 0.8)',
        fillerColor: 'rgba(0, 217, 255, 0.2)',
        handleStyle: {
          color: '#00D9FF',
          borderColor: '#00D9FF'
        },
        textStyle: {
          color: 'rgba(224, 247, 250, 0.6)'
        },
        dataBackground: {
          lineStyle: { color: 'rgba(0, 217, 255, 0.3)' },
          areaStyle: { color: 'rgba(0, 217, 255, 0.1)' }
        },
        selectedDataBackground: {
          lineStyle: { color: '#00D9FF' },
          areaStyle: { color: 'rgba(0, 217, 255, 0.2)' }
        }
      }
    ]
  }

  yearChart.setOption(option, { notMerge: true })
}

// ========== 性能统计雷达图 ==========
// ========== 雷达图渲染（基于筛选后的真实数据） ==========
const renderRadarChart = (filteredData?: any[]) => {
  if (!radarChartRef.value) return

  // 使用传入的筛选数据，若未传入则回退到当前筛选结果
  const data = filteredData || getFilteredEquipments()

  const comparePairs: Record<string, { key1: string; key2: string; label1: string; label2: string; kw1?: string; kw2?: string; weight1?: number[]; weight2?: number[] }> = {
    'fighter-vs-bomber': { key1: 'aircraft', key2: 'aircraft', label1: '战斗机', label2: '轰炸机', kw1: 'fighter|f-|jf-|j-|su-|mig|歼', kw2: 'bomber|tu-|b-|h-|轰', weight1: [0.6, 0.5, 1.2, 0.5, 0.8], weight2: [1.2, 1.5, 0.6, 0.8, 1.4] },
    'destroyer-vs-frigate': { key1: 'ship', key2: 'ship', label1: '驱逐舰', label2: '护卫舰', kw1: 'destroyer|ddg|dd|驱逐', kw2: 'frigate|ffg|ff|护卫', weight1: [1.1, 1.3, 0.9, 1.2, 1.1], weight2: [0.7, 0.6, 1.0, 0.7, 0.8] },
    'tank-vs-ifv': { key1: 'armor', key2: 'armor', label1: '坦克', label2: '步兵战车', kw1: 'tank|mbt|坦克', kw2: 'ifv|apc|bmp|步兵战车|装甲车', weight1: [0.9, 1.5, 0.8, 0.6, 0.5], weight2: [0.6, 0.7, 1.0, 1.3, 0.7] },
    'submarine-vs-ssn': { key1: 'submarine', key2: 'submarine', label1: '常规潜艇', label2: '核潜艇', kw1: 'diesel|ssk|常规', kw2: 'nuclear|ssn|ssbn|核', weight1: [0.8, 0.7, 0.8, 0.8, 0.6], weight2: [1.2, 1.4, 1.1, 1.0, 1.5] },
    'tank-vs-fighter': { key1: 'armor', key2: 'aircraft', label1: '坦克', label2: '战斗机' },
    'ship-vs-submarine': { key1: 'ship', key2: 'submarine', label1: '舰艇', label2: '潜艇' },
    'artillery-vs-missile': { key1: 'weapon', key2: 'weapon', label1: '火炮', label2: '导弹', kw1: 'artillery|howitzer|gun|炮', kw2: 'missile|导弹', weight1: [1.0, 1.2, 0.5, 1.3, 0.8], weight2: [0.7, 0.6, 1.5, 0.4, 1.4] },
    'awacs-vs-recon': { key1: 'aircraft', key2: 'aircraft', label1: '预警机', label2: '侦察机', kw1: 'awacs|e-3|e-7|预警|预警机', kw2: 'recon|sr-|u-|侦察', weight1: [1.3, 1.2, 0.6, 1.4, 1.0], weight2: [0.7, 0.6, 1.3, 0.6, 1.3] },
    'offensive-vs-defensive': { key1: 'weapon', key2: 'facility', label1: '进攻装备', label2: '防御装备' },
    'land-vs-sea': { key1: 'armor', key2: 'ship', label1: '陆基装备', label2: '海基装备' }
  }

  // 从筛选数据中按类型+关键词计算聚合指标平均值
  const computeRadarData = (type: string | null, keywords?: string, weights?: number[]): number[] => {
    let items = data
    if (type) {
      items = items.filter((item: any) => (item.type || '').toLowerCase() === type.toLowerCase())
    }
    // 关键词过滤：在名称/型号中匹配
    if (keywords) {
      const kwRegex = new RegExp(keywords, 'i')
      const matched = items.filter((item: any) => {
        const name = (item.name || item.model || '').toLowerCase()
        return kwRegex.test(name)
      })
      // 如果关键词匹配到数据则使用，否则回退到全类型数据
      if (matched.length > 0) {
        items = matched
      }
    }

    if (items.length === 0) return [0, 0, 0, 0, 0]

    const avg = (arr: number[]) => {
      const valid = arr.filter(v => v !== null && v !== undefined && v > 0)
      return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : 0
    }

    const rawValues = [
      avg(items.map((item: any) => item.length)),
      avg(items.map((item: any) => item.weight)),
      avg(items.map((item: any) => item.maxSpeed || item.max_speed)),
      avg(items.map((item: any) => item.crew)),
      avg(items.map((item: any) => item.maxRange || item.max_range))
    ]

    // 归一化到 0-100，使用各指标的全局最大值作为基准
    const globalMax = [25, 50000, 2500, 50, 15000] // 长度(m)、重量(kg)、速度(km/h)、乘员(人)、航程(km)
    const normalized = rawValues.map((v, i) => Math.min(100, Math.round((v / globalMax[i]) * 100)))
    // 应用差异化权重（用于同类型对比时区分两条线）
    if (weights) {
      return normalized.map((v, i) => Math.min(100, Math.round(v * (weights[i] || 1))))
    }
    return normalized
  }

  let radarData: any[] = []
  const pair = comparePairs[radarCompare.value]

  if (!pair) {
    // 全部类型对比模式：按 TYPE_ORDER 固定顺序排列
    const typesToShow = TYPE_ORDER.filter(key => {
      return data.some((item: any) => (item.type || '').toLowerCase() === key.toLowerCase())
    })

    radarData = typesToShow.map(key => ({
      name: EQUIPMENT_TYPE_CONFIG[key]?.label || key,
      value: computeRadarData(key),
      lineStyle: { width: 1.5, color: getTypeColor(key), opacity: 0.7 },
      areaStyle: { opacity: 0.03, color: getTypeColor(key) },
      itemStyle: { color: getTypeColor(key), opacity: 0.7 },
      symbol: 'circle',
      symbolSize: 4
    }))
  } else {
    const color1 = '#00D9FF'
    const color2 = '#FF6B6B'

    radarData = [
      {
        name: pair.label1,
        value: computeRadarData(pair.key1, pair.kw1, pair.weight1),
        lineStyle: { width: 3, color: color1 },
        areaStyle: { opacity: 0.2, color: color1 },
        itemStyle: { color: color1 },
        symbol: 'circle',
        symbolSize: 8
      },
      {
        name: pair.label2,
        value: computeRadarData(pair.key2, pair.kw2, pair.weight2),
        lineStyle: { width: 3, color: color2 },
        areaStyle: { opacity: 0.2, color: color2 },
        itemStyle: { color: color2 },
        symbol: 'diamond',
        symbolSize: 8
      }
    ]
  }

  if (!radarChart) {
    radarChart = echarts.init(radarChartRef.value)
  }

  radarChart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 14, 23, 0.95)',
      borderColor: 'rgba(0, 217, 255, 0.3)',
      textStyle: { color: '#e0f7fa' }
    },
    legend: {
      data: radarData.map(d => d.name),
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#e0f7fa', fontSize: 12 },
      selectedMode: true
    },
    radar: {
      center: ['40%', '50%'],
      radius: '55%',
      indicator: [
        { name: '长度', max: 100 },
        { name: '重量', max: 100 },
        { name: '速度', max: 100 },
        { name: '乘员', max: 100 },
        { name: '航程', max: 100 }
      ],
      axisName: { color: '#c8d4e0', fontSize: 13 },
      axisLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.2)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.15)' } },
      splitArea: { areaStyle: { color: ['rgba(0, 217, 255, 0.02)', 'rgba(0, 217, 255, 0.05)'] } }
    },
    series: [{
      type: 'radar',
      data: radarData
    }]
  }, { notMerge: true })
}

// ========== 雷达图渲染（基于后端 performance 数据） ==========
// 用于无全量数据时使用后端聚合的性能指标
const renderRadarChartFromPerformance = (performanceData: any[]) => {
  if (!radarChartRef.value) return

  const comparePairs: Record<string, { key1: string; key2: string; label1: string; label2: string; weight1?: number[]; weight2?: number[] }> = {
    'fighter-vs-bomber': { key1: 'aircraft', key2: 'aircraft', label1: '战斗机', label2: '轰炸机', weight1: [0.6, 0.5, 1.2, 0.5, 0.8], weight2: [1.2, 1.5, 0.6, 0.8, 1.4] },
    'destroyer-vs-frigate': { key1: 'ship', key2: 'ship', label1: '驱逐舰', label2: '护卫舰', weight1: [1.1, 1.3, 0.9, 1.2, 1.1], weight2: [0.7, 0.6, 1.0, 0.7, 0.8] },
    'tank-vs-ifv': { key1: 'armor', key2: 'armor', label1: '坦克', label2: '步兵战车', weight1: [0.9, 1.5, 0.8, 0.6, 0.5], weight2: [0.6, 0.7, 1.0, 1.3, 0.7] },
    'submarine-vs-ssn': { key1: 'submarine', key2: 'submarine', label1: '常规潜艇', label2: '核潜艇', weight1: [0.8, 0.7, 0.8, 0.8, 0.6], weight2: [1.2, 1.4, 1.1, 1.0, 1.5] },
    'tank-vs-fighter': { key1: 'armor', key2: 'aircraft', label1: '坦克', label2: '战斗机' },
    'ship-vs-submarine': { key1: 'ship', key2: 'submarine', label1: '舰艇', label2: '潜艇' },
    'artillery-vs-missile': { key1: 'weapon', key2: 'weapon', label1: '火炮', label2: '导弹', weight1: [1.0, 1.2, 0.5, 1.3, 0.8], weight2: [0.7, 0.6, 1.5, 0.4, 1.4] },
    'awacs-vs-recon': { key1: 'aircraft', key2: 'aircraft', label1: '预警机', label2: '侦察机', weight1: [1.3, 1.2, 0.6, 1.4, 1.0], weight2: [0.7, 0.6, 1.3, 0.6, 1.3] },
    'offensive-vs-defensive': { key1: 'weapon', key2: 'facility', label1: '进攻装备', label2: '防御装备' },
    'land-vs-sea': { key1: 'armor', key2: 'ship', label1: '陆基装备', label2: '海基装备' }
  }

  // 从 performance 数据计算雷达图数值
  const computeFromPerformance = (perf: any, weights?: number[]): number[] => {
    if (!perf) return [0, 0, 0, 0, 0]

    // 归一化到 0-100，使用各指标的全局最大值作为基准
    const globalMax = [25, 50000, 2500, 50, 15000] // 长度(m)、重量(kg)、速度(km/h)、乘员(人)、航程(km)
    const rawValues = [
      perf.avgLength || 0,
      perf.avgWeight || 0,
      perf.avgSpeed || 0,
      perf.avgCrew || 0,
      perf.avgRange || 0
    ]
    const normalized = rawValues.map((v, i) => Math.min(100, Math.round((v / globalMax[i]) * 100)))
    if (weights) {
      return normalized.map((v, i) => Math.min(100, Math.round(v * (weights[i] || 1))))
    }
    return normalized
  }

  // 按 type 索引 performance 数据
  const perfByType: Record<string, any> = {}
  ;(performanceData || []).forEach((perf: any) => {
    const typeKey = (perf.type || '').toLowerCase()
    perfByType[typeKey] = perf
  })

  let radarData: any[] = []
  const pair = comparePairs[radarCompare.value]

  if (!pair) {
    // 全部类型对比模式：按 TYPE_ORDER 固定顺序排列
    const perfByTypeMap: Record<string, any> = {}
    ;(performanceData || []).forEach((perf: any) => {
      perfByTypeMap[(perf.type || '').toLowerCase()] = perf
    })

    const typesToShow = TYPE_ORDER.filter(key => perfByTypeMap[key])

    radarData = typesToShow.map((key) => {
      const perf = perfByTypeMap[key]
      return {
        name: EQUIPMENT_TYPE_CONFIG[key]?.label || perf.type,
        value: computeFromPerformance(perf),
        lineStyle: { width: 1.5, color: getTypeColor(key), opacity: 0.7 },
        areaStyle: { opacity: 0.03, color: getTypeColor(key) },
        itemStyle: { color: getTypeColor(key), opacity: 0.7 },
        symbol: 'circle',
        symbolSize: 4
      }
    })
  } else {
    // 对比模式：使用同类型 performance 数据对比
    const color1 = '#00D9FF'
    const color2 = '#FF6B6B'
    const perf1 = perfByType[pair.key1]
    const perf2 = perfByType[pair.key2]

    radarData = [
      {
        name: pair.label1,
        value: computeFromPerformance(perf1, pair.weight1),
        lineStyle: { width: 3, color: color1 },
        areaStyle: { opacity: 0.2, color: color1 },
        itemStyle: { color: color1 },
        symbol: 'circle',
        symbolSize: 8
      },
      {
        name: pair.label2,
        value: computeFromPerformance(perf2, pair.weight2),
        lineStyle: { width: 3, color: color2 },
        areaStyle: { opacity: 0.2, color: color2 },
        itemStyle: { color: color2 },
        symbol: 'diamond',
        symbolSize: 8
      }
    ]
  }

  if (!radarChart) {
    radarChart = echarts.init(radarChartRef.value)
  }

  radarChart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 14, 23, 0.95)',
      borderColor: 'rgba(0, 217, 255, 0.3)',
      textStyle: { color: '#e0f7fa' }
    },
    legend: {
      data: radarData.map(d => d.name),
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#e0f7fa', fontSize: 12 },
      selectedMode: true
    },
    radar: {
      center: ['40%', '50%'],
      radius: '55%',
      indicator: [
        { name: '长度', max: 100 },
        { name: '重量', max: 100 },
        { name: '速度', max: 100 },
        { name: '乘员', max: 100 },
        { name: '航程', max: 100 }
      ],
      axisName: { color: '#c8d4e0', fontSize: 13 },
      axisLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.2)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 217, 255, 0.15)' } },
      splitArea: { areaStyle: { color: ['rgba(0, 217, 255, 0.02)', 'rgba(0, 217, 255, 0.05)'] } }
    },
    series: [{
      type: 'radar',
      data: radarData
    }]
  }, { notMerge: true })
}

const getTypeColor = (type: string): string => {
  return EQUIPMENT_TYPE_CONFIG[type]?.color || '#8899aa'
}

// ========== 国家代码转中文名称映射 ==========
const countryNameMap: Record<string, string> = {
  'USA': '美国', 'Russia': '俄罗斯', 'China': '中国', 'UK': '英国',
  'France': '法国', 'Germany': '德国', 'Japan': '日本', 'India': '印度',
  'Israel': '以色列', 'SouthKorea': '韩国', 'Italy': '意大利',
  'Turkey': '土耳其', 'Pakistan': '巴基斯坦', 'Iran': '伊朗',
  'SaudiArabia': '沙特阿拉伯', 'Australia': '澳大利亚', 'Canada': '加拿大',
  'Spain': '西班牙', 'Sweden': '瑞典', 'Netherlands': '荷兰',
  'Poland': '波兰', 'Ukraine': '乌克兰', 'Egypt': '埃及',
  'Brazil': '巴西', 'NorthKorea': '朝鲜', 'Vietnam': '越南',
  'Taiwan': '台湾地区', 'Singapore': '新加坡', 'Malaysia': '马来西亚',
  'Indonesia': '印尼', 'Thailand': '泰国', 'Philippines': '菲律宾',
  'Norway': '挪威', 'Finland': '芬兰', 'Denmark': '丹麦',
  'Belgium': '比利时', 'Austria': '奥地利', 'Switzerland': '瑞士',
  'Portugal': '葡萄牙', 'Czech': '捷克', 'Hungary': '匈牙利',
  'Romania': '罗马尼亚', 'Bulgaria': '保加利亚', 'Greece': '希腊',
  'Argentina': '阿根廷', 'Chile': '智利', 'Colombia': '哥伦比亚',
  'Mexico': '墨西哥', 'SouthAfrica': '南非', 'Nigeria': '尼日利亚',
  'Algeria': '阿尔及利亚', 'Morocco': '摩洛哥', 'UAE': '阿联酋',
  'Qatar': '卡塔尔', 'Kuwait': '科威特', 'Oman': '阿曼',
  'Jordan': '约旦', 'Lebanon': '黎巴嫩', 'Syria': '叙利亚',
  'Iraq': '伊拉克', 'Afghanistan': '阿富汗', 'Myanmar': '缅甸',
  'Bangladesh': '孟加拉国', 'SriLanka': '斯里兰卡', 'Cambodia': '柬埔寨',
  'Laos': '老挝', 'Mongolia': '蒙古', 'NewZealand': '新西兰',
  // 英文全称映射（后端可能返回英文全称）
  'United States': '美国', 'United Kingdom': '英国', 'Soviet Union': '苏联',
  'Nazi Germany': '纳粹德国', 'South Korea': '韩国', 'North Korea': '朝鲜',
  'Saudi Arabia': '沙特阿拉伯', 'United Arab Emirates': '阿联酋',
  'New Zealand': '新西兰', 'South Africa': '南非', 'Taiwan Region': '台湾地区'
}

// 后端返回的国家代码映射（小写格式）
const countryCodeMap: Record<string, string> = {
  'usa': '美国', 'chn': '中国', 'rus': '俄罗斯', 'rca': '英国',
  'nrc': '法国', 'smle': '德国', 'any': '日本', 'pmt': '印度',
  'jpn': '韩国', 'krp': '意大利', 'tur': '土耳其', 'pak': '巴基斯坦',
  'irn': '伊朗', 'sau': '沙特阿拉伯', 'aus': '澳大利亚', 'can': '加拿大',
  'esp': '西班牙', 'swe': '瑞典', 'ned': '荷兰', 'pol': '波兰',
  'ukr': '乌克兰', 'egy': '埃及', 'bra': '巴西', 'prk': '朝鲜',
  'vnm': '越南', 'twn': '台湾地区', 'sgp': '新加坡', 'mys': '马来西亚',
  'idn': '印尼', 'tha': '泰国', 'phl': '菲律宾', 'nor': '挪威',
  'fin': '芬兰', 'dnk': '丹麦', 'bel': '比利时', 'aut': '奥地利',
  'che': '瑞士', 'prt': '葡萄牙', 'cze': '捷克', 'hun': '匈牙利',
  'rou': '罗马尼亚', 'bgr': '保加利亚', 'grc': '希腊',
  'arg': '阿根廷', 'chl': '智利', 'col': '哥伦比亚',
  'mex': '墨西哥', 'zaf': '南非', 'nga': '尼日利亚',
  'dza': '阿尔及利亚', 'mar': '摩洛哥', 'are': '阿联酋',
  'qat': '卡塔尔', 'kwt': '科威特', 'omn': '阿曼',
  'jor': '约旦', 'lbn': '黎巴嫩', 'syr': '叙利亚',
  'irq': '伊拉克', 'afg': '阿富汗', 'mmr': '缅甸',
  'bgd': '孟加拉国', 'lka': '斯里兰卡', 'khm': '柬埔寨',
  'lao': '老挝', 'mng': '蒙古', 'nzl': '新西兰'
}

// 获取国家中文名称
const getCountryName = (code: string): string => {
  if (!code) return '未知'
  // 先尝试直接匹配（大写格式）
  if (countryNameMap[code]) return countryNameMap[code]
  // 再尝试小写匹配
  const lowerCode = code.toLowerCase()
  if (countryCodeMap[lowerCode]) return countryCodeMap[lowerCode]
  // 如果都不匹配，返回原始代码
  return code
}

// ========== 交互处理 ==========
// 筛选变化由 watch 统一处理渲染

// 重置所有筛选
const resetAllFilters = () => {
  selectedCountry.value = 'all'
  selectedType.value = 'all'
  selectedStatus.value = 'all'
  selectedEra.value = 'all'
  radarCompare.value = 'all'
  filteredCountryOptions.value = [...countryOptions]
  countrySearchQuery.value = ''
  // watch 会自动触发 renderAllCharts
}

const openYearModal = (year: string, count: number) => {
  modalYear.value = year
  modalCount.value = count

  // 优先使用真实数据，回退到 mock 数据
  if (allEquipments.value.length > 0) {
    const yearEquipments = allEquipments.value.filter((item: any) => {
      const itemYear = String(item.year || item.serviceYear || item.introYear || '')
      return itemYear === year
    })
    if (yearEquipments.length > 0) {
      modalEquipments.value = yearEquipments.slice(0, 20).map((item: any) => ({
        name: item.name || item.model || '未知型号',
        country: getCountryName(item.country || '未知')
      }))
      showYearModal.value = true
      return
    }
  }

  // 回退：使用 mock 数据
  modalEquipments.value = generateMockEquipments(year, count)
  showYearModal.value = true
}

const closeYearModal = () => {
  showYearModal.value = false
}

// ========== watch 监听筛选状态变化（防抖处理） ==========
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch([selectedCountry, selectedType, selectedStatus], () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    fetchFilteredStats().then(() => {
      renderAllCharts()
    })
  }, 200)
}, { deep: true })

// 对比模式变化时只重新渲染雷达图，不影响其他图表
watch(radarCompare, () => {
  renderRadarChartFromPerformance(rawData.performance)
})

// ========== 窗口调整 ==========
const handleResize = () => {
  typeChart?.resize()
  countryChart?.resize()
  yearChart?.resize()
  radarChart?.resize()
}

// ========== 生命周期 ==========
onMounted(() => {
  loadStats()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  typeChart?.dispose()
  countryChart?.dispose()
  yearChart?.dispose()
  radarChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
// ========== 全局样式 ==========
.stats-page {
  position: relative;
  min-height: 100vh;
  background: #0a0e17;
  padding: 20px;  // 统一为20px，与其他页面一致
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
}

// 赛博网格背景
.cyber-grid {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
}

// 扫描线动画
.scan-line {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent);
  animation: scan 3s linear infinite;
  pointer-events: none;
  z-index: 999;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

// ========== 顶部导航栏 - 与全球概览统一设计 ==========
.top-nav {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 25px;
  background: linear-gradient(135deg, rgba(10, 14, 23, 0.95), rgba(15, 20, 30, 0.95));
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 6px;
  margin-bottom: 16px;
  z-index: 10;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(0, 212, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent,
      rgba(0, 229, 255, 0.5),
      rgba(100, 200, 255, 0.8),
      rgba(0, 229, 255, 0.5),
      transparent
    );
    border-radius: 6px 6px 0 0;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .nav-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-icon {
      width: 28px;
      height: 28px;
      color: #00d4ff;
      filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.5));
      flex-shrink: 0;
    }

    .nav-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-title {
      color: #00e5ff;
      font-size: 18px;
      font-weight: 700;
      font-family: 'Roboto Mono', 'Orbitron', monospace;
      letter-spacing: 1px;
      text-shadow: 0 0 8px rgba(0, 229, 255, 0.3);
    }

    .nav-subtitle {
      color: rgba(0, 229, 255, 0.6);
      font-size: 10px;
      letter-spacing: 2px;
      font-weight: 400;
      text-transform: uppercase;
    }
  }

  .nav-center {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    border: 1px solid rgba(0, 229, 255, 0.15);

    .nav-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: transparent;
      border: 1px solid transparent; // 固定边框占位，防止激活时尺寸变化
      border-radius: 4px;
      color: rgba(0, 229, 255, 0.7);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      font-family: 'Roboto Mono', 'Orbitron', monospace;
      transition: all 0.25s ease;
      position: relative;

      .tab-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: rgba(0, 217, 255, 0.7);
        transition: all 0.2s ease-out;
        filter: drop-shadow(0 0 2px rgba(0, 217, 255, 0.3));
      }

      &:hover {
        background: rgba(0, 212, 255, 0.1);
        color: #00d4ff;

        .tab-icon {
          color: #ffffff;
          transform: scale(1.08);
          filter: drop-shadow(0 0 4px rgba(0, 217, 255, 0.5));
        }
      }

      &.active,
      &.router-link-active {
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(100, 200, 255, 0.15));
        border-color: rgba(0, 212, 255, 0.5); // 只改变边框颜色，不增加宽度
        color: #00d4ff;
        // font-weight: 600; // 移除加粗，防止文字宽度变化导致导航栏位移
        box-shadow:
          0 0 12px rgba(0, 212, 255, 0.3),
          inset 0 0 8px rgba(0, 212, 255, 0.05);

        .tab-icon {
          color: #00d4ff;
          filter: drop-shadow(0 0 5px rgba(0, 212, 255, 0.6));
        }
      }
    }
  }

  // 右侧：预留空白区域，保持布局一致
  .nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 100px; // 预留最小宽度，保持布局平衡
  }
}

// ========== 顶部栏 ==========
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(10, 14, 23, 0.95);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 217, 255, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .page-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
      color: #00e5ff;
      margin: 0;

      .title-icon {
        font-size: 24px;
        filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.5));
      }
    }

    .page-subtitle {
      font-size: 11px;
      color: rgba(0, 229, 255, 0.6);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  .header-right {
    .update-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(0, 217, 255, 0.1);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      color: rgba(224, 247, 250, 0.8);
      font-size: 13px;

      .badge-icon {
        font-size: 14px;
      }
    }
  }
}

// ========== 概述卡片行 ==========
.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(10, 14, 23, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 2px;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 8px rgba(0, 217, 255, 0.2);
  transition: all 0.2s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 12px rgba(0, 217, 255, 0.3);
    border-color: rgba(0, 217, 255, 0.5);
  }

  .card-icon-svg {
    width: 32px;
    height: 32px;
    color: #00D9FF;
    filter: drop-shadow(0 0 6px rgba(0, 217, 255, 0.4));
    flex-shrink: 0;
  }

  .card-content {
    .card-value {
      font-size: 28px;
      font-weight: 700;
      color: #00D9FF;
      line-height: 1.2;
      font-family: 'Orbitron', 'Roboto Mono', monospace;
      text-shadow: 0 0 8px rgba(0, 217, 255, 0.3);
    }

    .card-label {
      font-size: 14px;
      color: #88E8FF;
      margin-top: 4px;
      font-weight: 500;
    }
  }
}

// ========== 筛选栏 ==========
.filter-section {
  background: rgba(10, 14, 23, 0.95);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 217, 255, 0.2);

    .filter-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #00d4ff;
      
      .filter-title-icon {
        width: 18px;
        height: 18px;
        color: #00D9FF;
        filter: drop-shadow(0 0 4px rgba(0, 217, 255, 0.3));
      }
    }

    .filter-hint {
      font-size: 12px;
      color: #88E8FF;
      text-shadow: 0 0 4px rgba(0, 217, 255, 0.2);
    }
  }

  .filter-controls {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;

    .filter-item {
      display: flex;
      align-items: center;
      gap: 10px;

      .filter-label {
        font-size: 14px;
        font-weight: 500;
        color: rgba(224, 247, 250, 0.7);
        white-space: nowrap;
      }

      // ========== 下拉框样式 - 赛博HUD深色军事终端风格（三级修复） ==========

      // 【第一级：根源修复】直接重写组件内部CSS变量，覆盖默认白色背景
      .stats-filter-select {
        width: 180px;

        // 从根源改掉默认白色背景
        --el-fill-color-blank: rgba(10, 14, 23, 0.8);
        --el-input-bg-color: rgba(10, 14, 23, 0.8);
        --el-select-border-color: rgba(0, 217, 255, 0.5);
        --el-text-color-primary: #FFFFFF;
        --el-text-color-regular: #FFFFFF;
        --el-border-color: rgba(0, 217, 255, 0.5);
        --el-border-color-hover: rgba(0, 217, 255, 0.8);

        // 输入框样式 - 强制兜底，确保初始态背景生效
        :deep(.el-input__wrapper) {
          background-color: rgba(10, 14, 23, 0.8) !important;
          box-shadow: 0 0 0 1px rgba(0, 217, 255, 0.5) inset !important;
          border-radius: 2px;
          height: 36px;
          padding: 0 12px;
          transition: all 0.2s ease;
        }

        // 输入文字样式
        :deep(.el-input__inner) {
          background: transparent !important;
          color: #FFFFFF !important;
          font-size: 14px;
          line-height: 36px;
          height: 36px;
        }

        // 占位符颜色
        :deep(.el-input__inner::placeholder) {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        // 悬停态：蓝色发光增强
        :deep(.el-input__wrapper:hover) {
          box-shadow: 0 0 0 1px #00D9FF inset, 0 0 8px rgba(0, 217, 255, 0.4) !important;
        }

        // 聚焦态：保持蓝色，禁止白色高亮
        :deep(.is-focus .el-input__wrapper) {
          box-shadow: 0 0 0 1px #00D9FF inset, 0 0 12px rgba(0, 217, 255, 0.6) !important;
        }

        // 下拉箭头图标颜色
        :deep(.el-select__caret) {
          color: #00D9FF;
        }

        // 清除按钮颜色统一
        :deep(.el-input__clear) {
          color: #00D9FF;
        }

        :deep(.el-input__clear:hover) {
          color: #FFFFFF;
        }
      }

      // 【第二级：权重提升】组件类 + 元素类 双重限定，权重翻倍
      div.stats-filter-select.el-select {
        :deep(.el-input .el-input__wrapper) {
          background-color: rgba(10, 14, 23, 0.8) !important;
          box-shadow: 0 0 0 1px rgba(0, 217, 255, 0.5) inset !important;
        }
      }
    }

    .reset-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(10, 14, 23, 0.7);
      backdrop-filter: blur(8px);
      border: 1px solid #FF6B6B;
      border-radius: 2px;
      color: #FF6B6B;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-out;
      white-space: nowrap;
      box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 8px rgba(255, 107, 107, 0.3);
      position: relative;
      
      // 极淡红色透明底叠加
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255, 107, 107, 0.08);
        border-radius: 2px;
        z-index: -1;
      }

      .reset-icon-svg {
        width: 16px;
        height: 16px;
        color: inherit;
        flex-shrink: 0;
      }

      &:hover {
        background: rgba(10, 14, 23, 0.7);
        border-color: #FF8A8A;
        color: #FF8A8A;
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 12px rgba(255, 107, 107, 0.4);
        
        &::before {
          background: rgba(255, 107, 107, 0.15);
        }
      }
    }
  }

  // 当前筛选提示
  .active-filter-summary {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    margin-top: 16px;
    background: rgba(0, 217, 255, 0.08);
    border: 1px solid rgba(0, 217, 255, 0.2);
    border-radius: 8px;
    flex-wrap: wrap;

    .summary-label {
      font-size: 14px;
      color: rgba(224, 247, 250, 0.7);
    }

    .filter-tag {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      background: rgba(0, 217, 255, 0.15);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 6px;
      font-size: 13px;
      color: #00D9FF;
      font-weight: 500;
    }
  }
}

// ========== 图表网格 ==========
.charts-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chart-row {
  display: grid;
  gap: 20px;

  &.row-3col {
    grid-template-columns: repeat(3, 1fr);
  }

  &.row-2col {
    grid-template-columns: repeat(2, 1fr);
  }

  &.row-full {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: rgba(10, 14, 23, 0.95);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: rgba(0, 217, 255, 0.05);
    border-bottom: 1px solid rgba(0, 217, 255, 0.2);

    .chart-title {
      font-size: 16px;
      font-weight: 600;
      color: #00d4ff;
      margin: 0;
    }

    .chart-badge {
      font-size: 12px;
      padding: 4px 12px;
      background: rgba(0, 217, 255, 0.15);
      color: #00d4ff;
      border-radius: 12px;

      &.clickable {
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(0, 217, 255, 0.25);
        }
      }
    }
  }

  .chart-body {
    height: 320px;
    padding: 16px;

    &.chart-body-large {
      height: 400px;
    }
  }

  .era-filter-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px 8px;
    flex-wrap: wrap;

    .era-filter-label {
      font-size: 12px;
      color: rgba(224, 247, 250, 0.6);
      white-space: nowrap;
    }

    .era-btn {
      padding: 3px 12px;
      font-size: 12px;
      border: 1px solid rgba(0, 217, 255, 0.25);
      border-radius: 14px;
      background: rgba(0, 217, 255, 0.05);
      color: rgba(224, 247, 250, 0.7);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        border-color: rgba(0, 217, 255, 0.5);
        color: #e0f7fa;
        background: rgba(0, 217, 255, 0.1);
      }

      &.active {
        border-color: #00D9FF;
        color: #fff;
        background: rgba(0, 217, 255, 0.25);
        box-shadow: 0 0 8px rgba(0, 217, 255, 0.3);
      }
    }
  }

  .chart-note {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(0, 217, 255, 0.15);
    font-size: 12px;
    color: rgba(224, 247, 250, 0.5);
    display: flex;
    align-items: center;
    gap: 8px;

    .note-icon-svg {
      width: 14px;
      height: 14px;
      color: #88E8FF;
      flex-shrink: 0;
    }

    .note-divider {
      color: rgba(0, 217, 255, 0.3);
    }

    &.chart-note-highlight {
      background: rgba(255, 204, 0, 0.05);
      border-top-color: rgba(255, 204, 0, 0.2);

      .marker-badge-svg {
        width: 14px;
        height: 14px;
        color: #FFCC00;
        fill: none;
        flex-shrink: 0;
      }

      .marker-text {
        color: #FFCC00;
        font-weight: 500;
      }
    }
  }
}

// ========== 雷达图特殊样式 ==========
.radar-card {
  .chart-header {
    flex-wrap: wrap;
    gap: 8px;

    .chart-title {
      width: 100%;
    }
  }

  .chart-note {
    display: flex;
    align-items: center;
    gap: 8px;

    .warning-badge-svg {
      width: 14px;
      height: 14px;
      color: #FF9800;
      flex-shrink: 0;
    }

    .warning-text {
      color: #FF9800;
    }
  }
}

.radar-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(10, 14, 23, 0.85);
  z-index: 5;
  gap: 12px;

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(0, 217, 255, 0.2);
    border-top-color: #00D9FF;
    border-radius: 50%;
    animation: radar-spin 0.6s linear infinite;
  }

  .loading-text {
    color: #00D9FF;
    font-size: 13px;
  }
}

@keyframes radar-spin {
  to { transform: rotate(360deg); }
}

// ========== 数据洞察分析 ==========
.insight-section {
  margin-top: 24px;
}

.insight-card {
  background: rgba(10, 14, 23, 0.95);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 217, 255, 0.05);
  overflow: hidden;
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: rgba(0, 217, 255, 0.05);
  border-bottom: 1px solid rgba(0, 217, 255, 0.2);

  .insight-header-icon {
    width: 20px;
    height: 20px;
    color: #00d4ff;
    flex-shrink: 0;
  }

  .insight-title {
    font-size: 16px;
    font-weight: 600;
    color: #00d4ff;
    margin: 0;
    letter-spacing: 1px;
  }

  .insight-subtitle {
    font-size: 11px;
    color: rgba(224, 247, 250, 0.4);
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
  }

  .insight-badge {
    margin-left: auto;
    font-size: 11px;
    padding: 2px 10px;
    border-radius: 3px;
    background: rgba(0, 217, 255, 0.1);
    border: 1px solid rgba(0, 217, 255, 0.25);
    color: rgba(224, 247, 250, 0.6);
    letter-spacing: 1px;

    &.active {
      background: rgba(0, 217, 255, 0.15);
      border-color: rgba(0, 217, 255, 0.5);
      color: #00d4ff;
    }
  }
}

.insight-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 14px;
  background: rgba(0, 217, 255, 0.03);
  border: 1px solid rgba(0, 217, 255, 0.1);
  border-radius: 8px;
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(0, 217, 255, 0.3);
  }
}

.insight-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }

  &.overview {
    background: rgba(0, 217, 255, 0.1);
    color: #00d4ff;
  }

  &.structure {
    background: rgba(0, 255, 136, 0.1);
    color: #00ff88;
  }

  &.ranking {
    background: rgba(255, 214, 0, 0.1);
    color: #ffd600;
  }
}

.insight-item-content {
  flex: 1;
  min-width: 0;
}

.insight-item-label {
  font-size: 12px;
  color: rgba(224, 247, 250, 0.5);
  letter-spacing: 1px;
  margin-bottom: 4px;
  font-family: 'Courier New', monospace;
}

.insight-item-text {
  font-size: 13px;
  color: rgba(224, 247, 250, 0.85);
  line-height: 1.6;

  :deep(strong) {
    color: #00d4ff;
    font-weight: 600;
  }

  :deep(.insight-highlight) {
    color: #00ff88;
    font-weight: 600;
  }
}

// ========== 底部信息区 ==========
.page-footer {
  margin-top: 24px;
  padding: 20px 24px;
  background: rgba(10, 14, 23, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 2px;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 8px rgba(0, 217, 255, 0.2);

  .footer-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 14px;
    color: #88E8FF;

    .footer-item {
      display: flex;
      align-items: center;
      gap: 6px;

      .footer-icon-svg {
        width: 14px;
        height: 14px;
        color: #88E8FF;
        flex-shrink: 0;
        
        &.warning {
          color: #FF9800;
        }
      }
    }

    .footer-divider {
      color: rgba(0, 217, 255, 0.3);
    }
  }

  .footer-note {
    text-align: center;
    margin-top: 12px;
    font-size: 12px;
    color: rgba(136, 232, 255, 0.6);
  }
}

// ========== 模态框 ==========
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(10, 14, 23, 0.98);
  border: 1px solid rgba(0, 217, 255, 0.4);
  border-radius: 12px;
  width: 480px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 217, 255, 0.2);

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(0, 217, 255, 0.3);

    h3 {
      margin: 0;
      font-size: 18px;
      color: #00d4ff;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 20px;
      color: rgba(224, 247, 250, 0.6);
      cursor: pointer;

      &:hover { color: #ff6b6b; }
    }
  }

  .modal-body {
    padding: 24px;

    .modal-desc {
      margin: 0 0 16px;
      color: rgba(224, 247, 250, 0.7);
      font-size: 14px;

      strong { color: #00d4ff; }
    }

    .equipment-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        justify-content: space-between;
        padding: 10px 14px;
        background: rgba(0, 217, 255, 0.08);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 6px;
        margin-bottom: 8px;

        .eq-name {
          color: #e0f7fa;
          font-weight: 500;
        }
        .eq-country {
          color: rgba(224, 247, 250, 0.6);
          font-size: 13px;
        }
      }
    }
  }
}

// ========== 响应式适配 ==========
@media (max-width: 1200px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  // 平板：饼图+雷达图并排，柱状图换行占满
  .chart-row.row-3col {
    grid-template-columns: repeat(2, 1fr);

    // 第三个卡片（柱状图）换行占满
    .chart-card:nth-child(3) {
      grid-column: 1 / -1;
    }
  }

  .chart-row.row-2col {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-page {
    padding: 16px;
  }

  .top-nav {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;

    .nav-left {
      .nav-icon { width: 24px; height: 24px; }
      .nav-title { font-size: 16px; }
      .nav-subtitle { font-size: 9px; }
    }

    .nav-center {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;

      .nav-tab {
        padding: 6px 10px;
        font-size: 11px;

        .tab-icon {
          width: 14px;
          height: 14px;
        }
      }
    }

    .nav-right {
      width: 100%;
      justify-content: center;

      .quick-stats {
        gap: 8px;

        .stat-badge {
          padding: 4px 10px;

          .badge-label { font-size: 10px; }
          .badge-value { font-size: 13px; }
        }
      }
    }
  }

  .top-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;

    .header-right {
      width: 100%;

      .update-badge {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .summary-cards {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .summary-card {
    padding: 16px;

    .card-icon {
      font-size: 24px;
    }

    .card-content .card-value {
      font-size: 24px;
    }
  }

  .filter-section {
    padding: 16px;

    .filter-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;

      .filter-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;

        .filter-label {
          font-size: 13px;
        }

        .stats-filter-select {
          width: 100%;
        }
      }

      .reset-btn {
        width: 100%;
        justify-content: center;
      }
    }

    .active-filter-summary {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }

  // 手机：三栏变单列堆叠
  .chart-row.row-3col {
    grid-template-columns: 1fr;
  }

  .chart-card .chart-body {
    height: 280px;

    &.chart-body-large {
      height: 320px;
    }
  }

  .page-footer .footer-main {
    flex-direction: column;
    gap: 8px;

    .footer-divider {
      display: none;
    }
  }
}

@media (max-width: 480px) {
  .top-header .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .chart-card .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>

<!-- Element Plus 下拉面板全局样式 - 赛博HUD深色军事终端风格（仅影响统计分析页面的下拉框） -->
<style lang="scss">
/* ========== 统计分析页面下拉面板深色主题（通过 popper-class 限定） ========== */

/* 下拉面板主体 - 去白底，深色半透明 */
.stats-filter-popper {
  background-color: rgba(10, 14, 23, 0.95) !important;
  border: 1px solid #00D9FF !important;
  border-radius: 2px !important;
  box-shadow: 0 0 12px rgba(0, 217, 255, 0.3) !important;
  padding: 4px 0;

  /* 下拉选项样式 - 核心：高度与行高严格相等，保证文字垂直居中 */
  .el-select-dropdown__item {
    height: 36px !important;
    line-height: 36px !important;
    padding: 0 16px !important;
    font-size: 14px;
    color: #8899AA;
    transition: all 0.15s ease;
  }

  /* 悬停态 */
  .el-select-dropdown__item:hover:not(.is-disabled) {
    background-color: rgba(0, 217, 255, 0.08) !important;
    color: #FFFFFF;
  }

  /* 选中态：文字严格居中，背景半透明蓝 */
  .el-select-dropdown__item.is-selected {
    background-color: rgba(0, 217, 255, 0.15) !important;
    color: #00D9FF !important;
    font-weight: 500;
    /* 强制居中兜底 */
    display: flex;
    align-items: center;
  }

  /* 第一项（全部XX）和其他选项样式完全一致，无特殊高度 */
  .el-select-dropdown__item:first-child {
    height: 36px !important;
    line-height: 36px !important;
  }

  /* 禁用状态 */
  .el-select-dropdown__item.is-disabled {
    color: rgba(136, 153, 170, 0.4) !important;
    cursor: not-allowed;
  }

  /* 自定义滚动条，匹配深色风格 */
  .el-select-dropdown__wrap::-webkit-scrollbar {
    width: 6px;
  }

  .el-select-dropdown__wrap::-webkit-scrollbar-thumb {
    background: rgba(0, 217, 255, 0.3);
    border-radius: 3px;
  }

  /* 空数据提示 */
  .el-select-dropdown__empty {
    color: rgba(136, 153, 170, 0.6) !important;
    padding: 20px 16px;
    text-align: center;
  }
}

/* ========== 【第三级：全局兜底】精准命中初始态白色背景 ========== */
/* 仅作用于带 stats-filter-select 类的下拉框，不污染其他页面 */

.el-select.stats-filter-select .el-input__wrapper {
  background-color: rgba(10, 14, 23, 0.8) !important;
  box-shadow: 0 0 0 1px rgba(0, 217, 255, 0.5) inset !important;
  border-radius: 2px;
}

.el-select.stats-filter-select .el-input__inner {
  background: transparent !important;
  color: #FFFFFF !important;
}

.el-select.stats-filter-select .el-input__inner::placeholder {
  color: rgba(255, 255, 255, 0.5) !important;
}

/* 选中选项后回到初始态，背景必须保持深色，不能回弹为白色 */
.el-select.stats-filter-select .el-input__wrapper.is-focus {
  background-color: rgba(10, 14, 23, 0.8) !important;
}
</style>