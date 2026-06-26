<template>
  <div class="data-management">
    <div class="cyber-grid"></div>
    <div class="scan-line"></div>

    <!-- 顶部导航栏 - 统一设计 -->
    <header class="top-nav">
      <div class="nav-left">
        <div class="nav-title-group">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <rect x="4.5" y="4.5" width="2" height="2" rx="0.5" fill="currentColor"/>
          </svg>
          <div class="nav-text">
            <span class="nav-title">数据管理</span>
            <span class="nav-subtitle">DATA MANAGEMENT</span>
          </div>
        </div>
      </div>

      <div class="nav-center">
        <!-- 统一的主导航标签 -->
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
        <router-link to="/data-management" class="nav-tab active">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <rect x="4.5" y="4.5" width="2" height="2" rx="0.5" fill="currentColor"/>
          </svg>
          <span>数据管理</span>
        </router-link>
        <router-link to="/equipment-stats" class="nav-tab">
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

    <div class="import-terminal">
      <div class="terminal-header">
        <div class="header-title">
          <span class="cyber-icon">⬡</span>
          <span class="title-text">数据导入终端</span>
          <span class="cyber-icon">⬡</span>
        </div>
        <div class="header-status">
          <span class="status-dot"></span>
          <span>数据已加载 · {{ totalItems.toLocaleString() }} 条记录</span>
        </div>
      </div>
      
      <div class="terminal-content">
        <div class="upload-zone"
             :class="{ 'drag-over': isDragOver }"
             @dragover.prevent="handleDragOver"
             @dragleave="handleDragLeave"
             @drop.prevent="handleDrop">
          
          <input type="file"
                 ref="fileInput"
                 accept=".csv"
                 style="display: none"
                 @change="handleFileSelect">
          
          <div class="upload-content" v-if="!selectedFile">
            <div class="upload-icon">📁</div>
            <div class="upload-text">
              <p class="main-text">拖拽CSV文件到此处</p>
              <p class="sub-text">或点击选择文件</p>
            </div>
            <div class="upload-info">
              <span>格式: .CSV</span>
              <span>最大: 100MB</span>
            </div>
            <button class="cyber-btn" @click="triggerFileSelect">
              <span>选择文件</span>
            </button>
          </div>
          
          <div class="file-preview" v-else>
            <div class="file-info">
              <span class="file-icon">📄</span>
              <div class="file-details">
                <p class="file-name">{{ selectedFile.name }}</p>
                <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
              <button class="remove-btn" @click="removeFile">✕</button>
            </div>
            
            <div class="preview-section" v-if="previewData.length > 0">
              <div class="preview-header">
                <span>预览（前20条记录）</span>
                <span class="preview-count">{{ previewData.length }} 行</span>
              </div>
              
              <!-- CSV 数据画像卡片 -->
              <div class="csv-profile" v-if="csvProfile">
                <div class="profile-header">
                  <span class="profile-icon">📊</span>
                  <span class="profile-title">数据画像</span>
                  <span class="profile-meta">
                    编码 {{ csvProfile.encoding.toUpperCase() }} ·
                    {{ csvProfile.types.length }} 类型 ·
                    {{ csvProfile.parseErrors }} 个错误
                  </span>
                </div>
                <div class="profile-grid">
                  <div class="profile-item">
                    <span class="profile-label">总条数</span>
                    <span class="profile-value highlight">{{ csvProfile.totalRows.toLocaleString() }}</span>
                  </div>
                  <div class="profile-item">
                    <span class="profile-label">类型分布</span>
                    <span class="profile-value">
                      <span v-for="t in csvProfile.types" :key="t.name" class="profile-tag">
                        {{ t.name }} {{ t.count.toLocaleString() }}
                      </span>
                    </span>
                  </div>
                  <div class="profile-item">
                    <span class="profile-label">国家</span>
                    <span class="profile-value">
                      {{ csvProfile.countries.total }} 国家 +
                      <span class="profile-tag warning" v-if="csvProfile.countries.empty">
                        (空) {{ csvProfile.countries.empty.toLocaleString() }}
                        ({{ (csvProfile.countries.emptyPct * 100).toFixed(1) }}%)
                      </span>
                      <span class="profile-sub" v-if="csvProfile.countries.top5.length">
                        Top5: {{ csvProfile.countries.top5.map(c => c.name).join(' / ') }}
                      </span>
                    </span>
                  </div>
                  <div class="profile-item">
                    <span class="profile-label">年份</span>
                    <span class="profile-value">
                      已知 {{ csvProfile.years.withYear.toLocaleString() }}
                      <span v-if="csvProfile.years.range">
                        ({{ csvProfile.years.range[0] }} - {{ csvProfile.years.range[1] }})
                      </span>
                      <span class="profile-tag warning" v-if="csvProfile.years.unknown">
                        year=0 {{ csvProfile.years.unknown.toLocaleString() }}
                        ({{ (csvProfile.years.unknownPct * 100).toFixed(1) }}%)
                      </span>
                    </span>
                  </div>
                  <div class="profile-item">
                    <span class="profile-label">图片</span>
                    <span class="profile-value">
                      有图 {{ csvProfile.images.withImage.toLocaleString() }} ·
                      <span class="profile-tag danger">
                        无图 {{ csvProfile.images.withoutImage.toLocaleString() }}
                        ({{ (csvProfile.images.withoutPct * 100).toFixed(1) }}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="preview-table">
                <table>
                  <thead>
                    <tr>
                      <th v-for="(col, index) in previewColumns" :key="index">{{ col }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in previewData.slice(0, 5)" :key="index">
                      <td v-for="(col, colIndex) in previewColumns" :key="colIndex">
                        {{ row[col] || '-' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div class="progress-section" v-if="isImporting">
          <div class="progress-header">
            <span>正在导入数据...</span>
            <span class="progress-percent">{{ importProgress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: importProgress + '%' }"></div>
          </div>
        </div>
        
        <div class="import-status" :class="'status-' + importStatus.type">
          <el-icon class="status-icon">
            <CircleCheck v-if="importStatus.type === 'success'" />
            <Warning v-else-if="importStatus.type === 'warning'" />
            <CircleClose v-else-if="importStatus.type === 'error'" />
            <Document v-else />
          </el-icon>
          <div class="status-content">
            <div class="status-title">
              <span v-if="importStatus.type === 'idle'">{{ importStatus.message }}</span>
              <span v-else-if="importStatus.inserted > 0 && importStatus.skipped === 0">
                导入成功
              </span>
              <span v-else-if="importStatus.inserted === 0 && importStatus.skipped > 0">
                无新数据
              </span>
              <span v-else>
                导入完成
              </span>
            </div>
            <div class="status-detail" v-if="importStatus.type !== 'idle'">
              <span v-if="importStatus.inserted > 0">
                新增 <b class="num-success">{{ importStatus.inserted.toLocaleString() }}</b> 条
              </span>
              <span v-if="importStatus.skipped > 0" :class="{ 'ml-8': importStatus.inserted > 0 }">
                跳过 <b class="num-warning">{{ importStatus.skipped.toLocaleString() }}</b> 条
              </span>
              <span class="status-elapsed">
                耗时 <b>{{ (importStatus.elapsed / 1000).toFixed(1) }}s</b>
              </span>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="cyber-btn primary"
                  @click="handleImport"
                  :disabled="!selectedFile || isImporting">
            <span v-if="!isImporting">⬆ 导入数据库</span>
            <span v-else>⏳ 导入中...</span>
          </button>
          
          <button class="cyber-btn danger"
                  @click="handleClear"
                  :disabled="isImporting">
            <span>🗑 清空数据库</span>
          </button>
          
          <button class="cyber-btn"
                  @click="handleRefresh"
                  :disabled="isImporting">
            <span>🔄 刷新</span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="data-list">
      <div class="list-header">
        <div class="header-title">
          <span class="cyber-icon">▣</span>
          <span class="title-text">数据库记录</span>
          <span class="cyber-icon">▣</span>
        </div>
        <div class="header-stats">
          <span class="stat-item">
            <span class="stat-label">总数:</span>
            <span class="stat-value">{{ totalItems }}</span>
          </span>
          <span class="stat-item">
            <span class="stat-label">页码:</span>
            <span class="stat-value">{{ currentPage }}/{{ totalPages }}</span>
          </span>
        </div>
      </div>

      <!-- 🆕 P0-2 工具栏：批量删除 / 导出 / 模板下载 -->
      <div class="toolbar-section">
        <button class="cyber-btn danger small"
                :disabled="selectedIds.size === 0"
                @click="handleBatchDelete">
          批量删除<span class="batch-delete-count" v-if="selectedIds.size">{{ selectedIds.size }}</span>
        </button>
        <button class="cyber-btn primary small"
                @click="handleExport">
          导出CSV
        </button>
        <button class="cyber-btn success small"
                @click="handleDownloadTemplate">
          下载模板
        </button>
      </div>
      
      <div class="search-section">
        <div class="search-item">
          <label>搜索:</label>
          <input type="text"
                 v-model="searchInput"
                 placeholder="搜索名称/描述/国家/类型">
        </div>
        <div class="search-item">
          <label>类型:</label>
          <select v-model="searchForm.type">
            <option value="">全部</option>
            <option v-for="item in typeOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
        <div class="search-item">
          <label>国家:</label>
          <select v-model="searchForm.country">
            <option value="">全部</option>
            <option v-for="item in countryOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
        <button class="cyber-btn small" @click="handleSearch">
          <span>🔍 搜索</span>
        </button>
        <button class="cyber-btn small" @click="handleReset">
          <span>↺ 重置</span>
        </button>
      </div>
      
      <div class="table-section" v-loading="isLoading">
        <div class="cyber-table">
          <table>
            <thead>
              <tr>
                <th class="check-col">
                  <input type="checkbox"
                         :checked="isAllSelected"
                         @change="toggleSelectAll">
                </th>
                <th class="image-col">图片</th>
                <th>ID</th>
                <th>名称</th>
                <th>类型</th>
                <th>国家</th>
                <th>年份</th>
                <th>长度</th>
                <th>宽度</th>
                <th>高度</th>
                <th>重量</th>
                <th>乘员</th>
                <th>来源</th>
                <th class="action-col">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.id" class="data-row" @click="handleViewDetail(item)">
                <td class="check-cell">
                  <input type="checkbox"
                         :checked="selectedIds.has(item.id)"
                         @change="toggleSelect(item.id)">
                </td>
                <td class="image-cell">
                  <el-tooltip
                    v-if="getImageUrl(item)"
                    placement="right"
                    :show-after="0"
                    effect="dark"
                    popper-class="equipment-image-tooltip"
                  >
                    <template #content>
                      <div class="image-preview">
                        <img :src="getImageUrl(item)" alt="装备图片" referrerpolicy="no-referrer" @error="handleImageError" />
                      </div>
                    </template>
                    <div class="image-indicator has-image"></div>
                  </el-tooltip>
                  <div v-else class="image-indicator no-image"></div>
                </td>
                <td class="num-cell">{{ item.id }}</td>
                <td>
                  <el-tooltip
                    v-if="item.subtitle"
                    placement="top"
                    :show-after="300"
                    effect="dark"
                  >
                    <template #content>
                      <span class="subtitle-tooltip">{{ item.subtitle }}</span>
                    </template>
                    <span class="name-cell">{{ item.name || '-' }}</span>
                  </el-tooltip>
                  <span v-else>{{ item.name || '-' }}</span>
                </td>
                <td>
                  <span class="type-tag">{{ item.type || '-' }}</span>
                </td>
                <td>{{ item.country || '-' }}</td>
                <td class="num-cell">{{ item.year || '-' }}</td>
                <td class="num-cell">{{ item.length ? item.length + ' m' : '-' }}</td>
                <td class="num-cell">{{ item.width ? item.width + ' m' : '-' }}</td>
                <td class="num-cell">{{ item.height ? item.height + ' m' : '-' }}</td>
                <td class="num-cell">{{ item.weight ? item.weight + ' kg' : '-' }}</td>
                <td class="num-cell">{{ item.crew || '-' }}</td>
                <td class="source-cell">
                  <el-tooltip
                    v-if="item.source && item.source.length > 10"
                    placement="top"
                    :show-after="300"
                    effect="dark"
                  >
                    <template #content>
                      <span>{{ item.source }}</span>
                    </template>
                    <span class="source-truncate">{{ item.source.slice(0, 10) + '...' }}</span>
                  </el-tooltip>
                  <span v-else>{{ item.source || '-' }}</span>
                </td>
                <td class="action-cell">
                  <button class="detail-btn" @click.stop="handleViewDetail(item)" title="查看装备详情">
                    详情
                  </button>
                  <button class="delete-btn" @click.stop="handleDelete(item)" title="删除此条数据">
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="empty-state" v-if="!isLoading && tableData.length === 0">
            <div class="empty-icon">∅</div>
            <p>暂无数据</p>
          </div>
        </div>
      </div>
      
      <div class="pagination-section">
        <button class="page-btn"
                @click="handlePageChange(1)"
                :disabled="currentPage === 1">
          ««
        </button>
        <button class="page-btn"
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage === 1">
          «
        </button>
        
        <span class="page-info">
          第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
        </span>

        <div class="page-jump">
          <input
            type="number"
            v-model.number="jumpPageInput"
            :min="1"
            :max="totalPages"
            @keyup.enter="handleJumpPage"
            placeholder="页码"
          />
          <button class="jump-btn" @click="handleJumpPage">跳转</button>
        </div>

        <button class="page-btn"
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage === totalPages">
          »
        </button>
        <button class="page-btn"
                @click="handlePageChange(totalPages)"
                :disabled="currentPage === totalPages">
          »»
        </button>
        
        <div class="page-size">
          <label>每页:</label>
          <select v-model="pageSize" @change="handlePageSizeChange">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 装备详情弹窗 -->
    <DetailDialog ref="detailDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, Warning, CircleClose, Document } from '@element-plus/icons-vue'
import { equipmentApi, Equipment } from '@/api/equipment'
import { parseCsvFile } from '@/utils/csvParser'
import { profileRows, type CsvProfile } from '@/utils/csvProfile'
import { useDebouncedRef } from '@/composables/useDebounce'
import { buildImageUrl } from '@/utils/imageUrl'
import { eventBus, Events } from '@/utils/EventBus'
import DetailDialog from '@/components/common/DetailDialog.vue'

const detailDialogRef = ref<InstanceType<typeof DetailDialog>>()

// 判断图片路径是否有效
function isValidImagePath(val: any): boolean {
  if (!val) return false
  const s = String(val).trim()
  if (!s) return false
  // 排除占位符和无效值
  if (s === '-' || s === 'null' || s === 'NULL' || s === 'N/A' || s === 'n/a') return false
  // 至少包含路径分隔符或协议标识
  return s.includes('/') || s.includes('\\') || s.includes('.')
}

// 获取图片 URL（兼容多种字段，通过 buildImageUrl 集中管理 URL 配置）
// 优先级：完整外链 > CDN 文件名 > 本地路径
function getImageUrl(item: any): string | null {
  // 1) 完整外网链接（最可靠，直接透传）
  if (isValidImagePath(item.imageLink)) {
    return String(item.imageLink).trim()
  }
  // 2) CDN 文件名（拼接基础 URL）
  if (isValidImagePath(item.imagePath)) {
    return buildImageUrl(item.imagePath)
  }
  // 3) 本地路径（仅当不以 http 开头时拼接；否则可能是外链兼容字段）
  if (isValidImagePath(item.localImagePath)) {
    return buildImageUrl(item.localImagePath)
  }
  return null
}

// 图片加载失败处理
function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  // 隐藏破图
  target.style.display = 'none'
  // 插入友好占位提示
  const parent = target.parentElement
  if (parent && !parent.querySelector('.image-error-placeholder')) {
    const placeholder = document.createElement('div')
    placeholder.className = 'image-error-placeholder'
    placeholder.textContent = '⚠ 图片加载失败'
    parent.appendChild(placeholder)
  }
  console.warn('图片加载失败:', target.src)
}

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isDragOver = ref(false)
const previewData = ref<any[]>([])
const previewColumns = ref<string[]>([])
const csvProfile = ref<CsvProfile | null>(null)

// 导入结果状态栏
const importStatus = ref<{
  type: 'idle' | 'success' | 'warning' | 'error'
  message: string
  total: number
  inserted: number
  skipped: number
  elapsed: number
}>({
  type: 'idle',
  message: '等待导入',
  total: 0, inserted: 0, skipped: 0, elapsed: 0
})

const isImporting = ref(false)
const importProgress = ref(0)
const importResult = ref<any>(null)

// P0-2 多选状态
const selectedIds = ref<Set<number>>(new Set())

const isAllSelected = computed(() => {
  return tableData.value.length > 0 && tableData.value.every(item => selectedIds.value.has(item.id))
})

// ========== 服务端分页数据加载 ==========
const tableData = ref<Equipment[]>([])
const totalItems = ref(0)
const isLoading = ref(false)
const currentPage = ref(1)
const jumpPageInput = ref<number | null>(null)
const pageSize = ref(20)

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

const searchForm = reactive({
  type: '',
  country: ''
})

// P1-1 防抖搜索：输入即时显示，过滤延迟 300ms
const [searchInput, debouncedKeyword] = useDebouncedRef('', 300)

const fetchTableData = async () => {
  isLoading.value = true
  try {
    const res = await equipmentApi.getList({
      current: currentPage.value,
      size: pageSize.value,
      name: debouncedKeyword.value || undefined,
      type: searchForm.type || undefined,
      country: searchForm.country || undefined
    })
    if (res.code === 200) {
      tableData.value = res.data.records || []
      totalItems.value = res.total || res.data.total || 0
    } else {
      throw new Error(res.message || '加载数据失败')
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    tableData.value = []
    totalItems.value = 0
  } finally {
    isLoading.value = false
  }
}

// 监听筛选条件变化，重新加载（重置到第一页）
watch([debouncedKeyword, () => searchForm.type, () => searchForm.country], () => {
  currentPage.value = 1
  fetchTableData()
})

// 初始化加载
onMounted(() => {
  fetchTableData()
})

const typeOptions = ref([
  'facility',
  'sensor',
  'weapon',
  'ship',
  'submarine',
  'aircraft',
  'land',
  'missile'
])

const countryOptions = ref([
  'China',
  'United States',
  'Russia',
  'France',
  'UK',
  'Germany',
  'Japan',
  'Korea',
  'India',
  'Israel',
  'Italy',
  'Sweden',
  'Yugoslavia',
  'Unknown',
  'Czech Republic',
  'Czech'
])

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file: File) => {
  if (!file.name.endsWith('.csv')) {
    ElMessage.error('只接受CSV格式文件')
    return
  }
  
  if (file.size > 100 * 1024 * 1024) {
    ElMessage.error('文件大小超过100MB限制')
    return
  }
  
  selectedFile.value = file
  importResult.value = null
  importStatus.value = {
    type: 'idle',
    message: '等待导入',
    total: 0, inserted: 0, skipped: 0, elapsed: 0
  }
  parseCSV(file)
}

const parseCSV = async (file: File) => {
  try {
    const result = await parseCsvFile(file)
    
    if (result.totalRows === 0) {
      ElMessage.error('CSV文件为空')
      return
    }
    
    // 🆕 一次 O(n) 扫描生成数据画像
    csvProfile.value = profileRows(result.rows, result.encoding, result.errors.length)
    
    previewColumns.value = result.headers
    previewData.value = result.rows.slice(0, 20)
    
    if (result.encoding === 'gbk') {
      ElMessage.warning('检测到 GBK 编码，已自动转码（建议另存为 UTF-8 提升性能）')
    }
    
    if (result.errors.length > 0) {
      const sample = result.errors.slice(0, 3).map(e => `第${e.line}行: ${e.message}`).join('\n')
      ElMessage.warning(`共 ${result.errors.length} 行解析异常（已尽力保留）：\n${sample}`)
    }
  } catch (error: any) {
    ElMessage.error('CSV文件解析失败: ' + (error.message || ''))
  }
}

const removeFile = () => {
  selectedFile.value = null
  previewData.value = []
  previewColumns.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (size: number): string => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const handleImport = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      '此操作将导入数据到数据库，是否继续？',
      '确认导入',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    isImporting.value = true
    importProgress.value = 0
    importResult.value = null
    
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    importProgress.value = 30
    
    const res = await equipmentApi.import(formData)
    
    importProgress.value = 100
    
    if (res.code === 200) {
      const data = res.data
      const seconds = (data.elapsed / 1000).toFixed(1)
      
      // 🆕 智能提示：根据场景显示不同消息
      if (data.inserted === 0 && data.skipped > 0) {
        // 场景 A：全部是重复
        ElMessage({
          type: 'warning',
          message: `无新数据：跳过 ${data.skipped} 条重复记录（数据库已存在）`,
          duration: 4000,
          showClose: true
        })
        importStatus.value = {
          type: 'warning',
          message: '无新数据',
          total: data.skipped,
          inserted: 0,
          skipped: data.skipped,
          elapsed: data.elapsed
        }
      } else if (data.inserted > 0 && data.skipped === 0) {
        // 场景 B：全部新增
        ElMessage({
          type: 'success',
          message: `导入成功：新增 ${data.inserted} 条，耗时 ${seconds}s`,
          duration: 4000,
          showClose: true
        })
        importStatus.value = {
          type: 'success',
          message: '导入成功',
          total: data.inserted,
          inserted: data.inserted,
          skipped: 0,
          elapsed: data.elapsed
        }
      } else {
        // 场景 C：混合
        ElMessage({
          type: 'success',
          message: `导入完成：新增 ${data.inserted} 条，跳过重复 ${data.skipped} 条，耗时 ${seconds}s`,
          duration: 5000,
          showClose: true
        })
        importStatus.value = {
          type: 'success',
          message: '导入完成',
          total: data.inserted + data.skipped,
          inserted: data.inserted,
          skipped: data.skipped,
          elapsed: data.elapsed
        }
      }
      
      importResult.value = {
        type: 'success',
        message: '导入成功',
        total: data.inserted + data.skipped,
        time: `${data.elapsed}ms`
      }
      
      selectedFile.value = null
      previewData.value = []
      previewColumns.value = []
      csvProfile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      currentPage.value = 1
      
      // 触发数据导入完成事件，清除所有页面缓存
      eventBus.emit(Events.DATA_IMPORTED)
      
      // 刷新当前页面数据
      fetchTableData()
    } else {
      throw new Error(res.message)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      importResult.value = {
        type: 'error',
        message: '导入失败: ' + (error.message || '未知错误')
      }
      ElMessage.error('导入失败')
    }
  } finally {
    isImporting.value = false
  }
}

const handleClear = async () => {
  try {
    await ElMessageBox.confirm(
      '此操作将删除所有数据，且无法恢复，是否继续？',
      '确认清空',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const res = await equipmentApi.clear()
    
    if (res.code === 200) {
      ElMessage.success('数据库已清空')
      tableData.value = []
      totalItems.value = 0
      currentPage.value = 1
      
      // 触发数据清空事件，清除所有页面缓存
      eventBus.emit(Events.DATA_CLEARED)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('清空数据库失败')
    }
  }
}

const handleRefresh = () => {
  fetchTableData()
  ElMessage.success('数据已刷新')
}

const handleDelete = async (item: Equipment) => {
  try {
    await ElMessageBox.confirm(
      `确认删除装备 "${item.name || 'ID:' + item.id}"？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-confirm-dialog'
      }
    )

    const res = await equipmentApi.delete(item.id)

    if (res.code === 200) {
      ElMessage.success('删除成功')
      // 刷新当前页数据
      await fetchTableData()
      // 如果当前页没有数据了，跳转到前一页
      if (tableData.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1
      }
      
      // 触发数据删除事件，清除相关页面缓存
      eventBus.emit(Events.DATA_DELETED)
    } else {
      throw new Error(res.message)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败: ' + (error.message || '未知错误'))
    }
  }
}

// 查看装备详情
const handleViewDetail = (item: Equipment) => {
  detailDialogRef.value?.open(item.id)
}

// ─── P0-2 多选 / 批量删除 / 导出 / 模板 ───

const toggleSelect = (id: number) => {
  const next = new Set(selectedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedIds.value = next
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(tableData.value.map(item => item.id))
  }
}

const handleBatchDelete = async () => {
  if (selectedIds.value.size === 0) return
  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedIds.value.size} 条装备记录？此操作不可恢复。`,
      '批量删除确认',
      { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' }
    )

    const res = await equipmentApi.batchDelete(Array.from(selectedIds.value))
    if (res.code === 200) {
      ElMessage.success(`已删除 ${res.data} 条记录`)
      selectedIds.value = new Set()
      
      // 触发数据删除事件，清除相关页面缓存
      eventBus.emit(Events.DATA_DELETED)
      
      // 刷新当前页面数据
      await fetchTableData()
    } else {
      throw new Error(res.message)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败: ' + (error.message || '未知错误'))
    }
  }
}

const handleExport = async () => {
  try {
    ElMessage.info('正在导出CSV，请稍候...')
    const blob = await equipmentApi.export({
      type: searchForm.type || undefined,
      country: searchForm.country || undefined,
      name: searchInput.value || undefined
    } as any)
    const url = URL.createObjectURL(blob as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `equipment_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error: any) {
    ElMessage.error('导出失败: ' + (error.message || ''))
  }
}

const handleDownloadTemplate = async () => {
  try {
    const blob = await equipmentApi.downloadTemplate()
    const url = URL.createObjectURL(blob as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'equipment_template.csv'
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success('模板已下载')
  } catch (error: any) {
    ElMessage.error('下载模板失败: ' + (error.message || ''))
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchTableData()
}

const handleReset = () => {
  searchInput.value = ''
  searchForm.type = ''
  searchForm.country = ''
  currentPage.value = 1
  fetchTableData()
}

const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchTableData()
}

// 跳转到指定页码
const handleJumpPage = () => {
  const page = jumpPageInput.value
  if (!page || page < 1) {
    jumpPageInput.value = null
    return
  }
  if (page > totalPages.value) {
    ElMessage.warning(`超出范围，最大页数为 ${totalPages.value}`)
    jumpPageInput.value = null
    return
  }
  currentPage.value = page
  jumpPageInput.value = null
  fetchTableData()
}

const handlePageSizeChange = () => {
  currentPage.value = 1
  jumpPageInput.value = null
  fetchTableData()
}

const pageImageCache = new Map<string, boolean>()

// 图片预加载缓存
watch(tableData, (newData) => {
  pageImageCache.clear()
  newData.forEach(item => {
    const url = getImageUrl(item)
    if (url) {
      const img = new Image()
      img.src = url
      pageImageCache.set(url, true)
    }
  })
}, { immediate: true })

</script>

<style scoped lang="scss">
.data-management {
  position: relative;
  min-height: 100vh;
  background: #0a0e17;
  padding: 20px;
  overflow-x: hidden;
}

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

.scan-line {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 212, 255, 0.5), 
    transparent);
  animation: scan 3s linear infinite;
  pointer-events: none;
  z-index: 999;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

// 顶部导航 - 统一设计
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

  // 顶部发光边框
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent,
      rgba(0, 212, 255, 0.5),
      rgba(0, 212, 255, 0.8),
      rgba(0, 212, 255, 0.5),
      transparent
    );
    border-radius: 6px 6px 0 0;
  }

  // 左侧：页面标题
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
      filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.5));
      flex-shrink: 0;
    }

    .nav-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-title {
      color: #00d4ff;
      font-size: 18px;
      font-weight: 700;
      font-family: 'Roboto Mono', 'Courier New', monospace;
      letter-spacing: 1px;
      text-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
    }

    .nav-subtitle {
      color: rgba(0, 212, 255, 0.6);
      font-size: 10px;
      letter-spacing: 2px;
      font-weight: 400;
      text-transform: uppercase;
    }
  }

  // 中间：主导航标签
  .nav-center {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    border: 1px solid rgba(0, 212, 255, 0.15);

    .nav-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: transparent;
      border: 1px solid transparent; // 固定边框占位，防止激活时尺寸变化
      border-radius: 4px;
      color: rgba(0, 212, 255, 0.7);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      font-family: 'Roboto Mono', 'Courier New', monospace;
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

      // 当前活动标签（高亮显示）
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

.import-terminal,
.data-list {
  position: relative;
  background: rgba(10, 14, 23, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 
    0 0 20px rgba(0, 212, 255, 0.1),
    inset 0 0 20px rgba(0, 212, 255, 0.05);
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(0, 212, 255, 0.8), 
      transparent);
  }
}

.terminal-header,
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  background: rgba(0, 212, 255, 0.05);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .cyber-icon {
    color: #00d4ff;
    font-size: 16px;
    animation: pulse 2s ease-in-out infinite;
  }
  
  .title-text {
    color: #00d4ff;
    font-size: 16px;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.image-col {
  width: 40px;
  text-align: center;
  font-size: 14px;
}

.image-cell {
  text-align: center;
  padding: 8px 4px;
}

.image-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 auto;
  cursor: pointer;
  
  &.has-image {
    background-color: #00ff88;
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.8);
    animation: image-pulse 2s infinite;
  }
  
  &.no-image {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

@keyframes image-pulse {
  0% { box-shadow: 0 0 4px rgba(0, 255, 136, 0.4); }
  50% { box-shadow: 0 0 12px rgba(0, 255, 136, 0.8); }
  100% { box-shadow: 0 0 4px rgba(0, 255, 136, 0.4); }
}

// 图片预览样式（:deep() 穿透 scoped，确保对 el-tooltip Teleport 内容生效）
:deep(.image-preview) {
  border: 1px solid rgba(0, 212, 255, 0.5) !important;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3) !important;
  background: rgba(10, 14, 23, 0.95);
  padding: 8px;
  border-radius: 6px;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  img {
    display: block !important;
    width: 280px !important;      // 固定宽度
    height: 200px !important;     // 固定高度
    object-fit: contain;          // 保持比例，居中显示
    border-radius: 4px;
  }
}

// 图片加载失败占位
:deep(.image-error-placeholder) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 100px;
  background: rgba(255, 170, 0, 0.1);
  border: 1px dashed rgba(255, 170, 0, 0.4);
  border-radius: 4px;
  color: #ffaa00;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #00d4ff;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  
  .status-dot {
    width: 8px;
    height: 8px;
    background: #00ff88;
    border-radius: 50%;
    animation: blink 1s ease-in-out infinite;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.header-stats {
  display: flex;
  gap: 20px;
  
  .stat-item {
    display: flex;
    gap: 5px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    
    .stat-label {
      color: rgba(0, 212, 255, 0.6);
    }
    
    .stat-value {
      color: #00d4ff;
      font-weight: bold;
    }
  }
}

.terminal-content {
  padding: 20px;
}

.upload-zone {
  border: 2px dashed rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s;
  background: rgba(0, 212, 255, 0.02);
  
  &.drag-over {
    border-color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  }
}

.upload-content {
  .upload-icon {
    font-size: 48px;
    margin-bottom: 20px;
    animation: float 3s ease-in-out infinite;
  }
  
  .upload-text {
    margin-bottom: 20px;
    
    .main-text {
      color: #00d4ff;
      font-size: 18px;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
      margin-bottom: 5px;
    }
    
    .sub-text {
      color: rgba(0, 212, 255, 0.6);
      font-size: 14px;
      font-family: 'Courier New', monospace;
    }
  }
  
  .upload-info {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
    font-size: 12px;
    color: rgba(0, 212, 255, 0.5);
    font-family: 'Courier New', monospace;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.cyber-btn {
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.5);
  color: #00d4ff;
  padding: 10px 20px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(0, 212, 255, 0.3), 
      transparent);
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled)::before {
    left: 100%;
  }
  
  &:hover:not(:disabled) {
    background: rgba(0, 212, 255, 0.2);
    border-color: #00d4ff;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.primary {
    background: rgba(0, 212, 255, 0.2);
    border-color: #00d4ff;
  }
  
  &.danger {
    background: rgba(255, 68, 68, 0.1);
    border-color: rgba(255, 68, 68, 0.5);
    color: #ff4444;
    
    &:hover:not(:disabled) {
      background: rgba(255, 68, 68, 0.2);
      border-color: #ff4444;
      box-shadow: 0 0 15px rgba(255, 68, 68, 0.5);
    }
  }
  
  &.small {
    padding: 6px 12px;
    font-size: 12px;
  }
}

.file-preview {
  .file-info {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(0, 212, 255, 0.05);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 4px;
    margin-bottom: 20px;
    
    .file-icon {
      font-size: 32px;
    }
    
    .file-details {
      flex: 1;
      text-align: left;
      
      .file-name {
        color: #00d4ff;
        font-size: 14px;
        font-family: 'Courier New', monospace;
        margin-bottom: 5px;
      }
      
      .file-size {
        color: rgba(0, 212, 255, 0.6);
        font-size: 12px;
        font-family: 'Courier New', monospace;
      }
    }
    
    .remove-btn {
      background: rgba(255, 68, 68, 0.2);
      border: 1px solid rgba(255, 68, 68, 0.5);
      color: #ff4444;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: rgba(255, 68, 68, 0.3);
        border-color: #ff4444;
      }
    }
  }
}

.preview-section {
  .preview-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: rgba(0, 212, 255, 0.05);
    border: 1px solid rgba(0, 212, 255, 0.2);
    margin-bottom: 10px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #00d4ff;
    
    .preview-count {
      color: #00ff88;
    }
  }
  
  .preview-table {
    max-height: 200px;
    overflow: auto;
    border: 1px solid rgba(0, 212, 255, 0.2);
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid rgba(0, 212, 255, 0.1);
        font-size: 12px;
        font-family: 'Courier New', monospace;
      }
      
      th {
        background: rgba(0, 212, 255, 0.1);
        color: #00d4ff;
        position: sticky;
        top: 0;
      }
      
      td {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.progress-section {
  margin: 20px 0;
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #00d4ff;
    
    .progress-percent {
      color: #00ff88;
      font-weight: bold;
    }
  }
  
  .progress-bar {
    height: 4px;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00d4ff, #00ff88);
      transition: width 0.3s;
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
    }
  }
}

.result-section {
  margin: 20px 0;
  
  .result-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border-radius: 4px;
    
    &.success {
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.3);
      
      .result-icon {
        color: #00ff88;
      }
    }
    
    &.error {
      background: rgba(255, 68, 68, 0.1);
      border: 1px solid rgba(255, 68, 68, 0.3);
      
      .result-icon {
        color: #ff4444;
      }
    }
    
    .result-icon {
      font-size: 32px;
      font-weight: bold;
    }
    
    .result-content {
      flex: 1;
      
      .result-title {
        color: #fff;
        font-size: 14px;
        font-family: 'Courier New', monospace;
        margin-bottom: 5px;
      }
      
      .result-details {
        display: flex;
        gap: 20px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        font-family: 'Courier New', monospace;
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.search-section {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  flex-wrap: wrap;
  
  .search-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    label {
      color: rgba(0, 212, 255, 0.6);
      font-size: 12px;
      font-family: 'Courier New', monospace;
    }
    
    input, select {
      background: rgba(0, 212, 255, 0.05);
      border: 1px solid rgba(0, 212, 255, 0.3);
      color: #00d4ff;
      padding: 6px 12px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      outline: none;
      transition: all 0.3s;
      
      &:focus {
        border-color: #00d4ff;
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
      }
      
      &::placeholder {
        color: rgba(0, 212, 255, 0.4);
      }
    }
    
    select {
      cursor: pointer;
      
      option {
        background: #0a0e17;
        color: #00d4ff;
      }
    }
  }
}

// 🆕 P0-2 工具栏按钮组
.toolbar-section {
  display: flex;
  gap: 10px;
  padding: 12px 20px;
  flex-wrap: wrap;
  
  .cyber-btn.small {
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 2px;
    transition: all 0.2s ease-out;
    
    // 基础通用样式：线框玻璃态 + 磨砂质感
    background: rgba(10, 14, 23, 0.7);
    backdrop-filter: blur(8px);
    border: 1px solid;
    text-shadow: none;
    
    // 文字渲染优化：亚像素渲染，边缘锐利清晰
    font-smooth: always;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    
    // 统一内阴影：顶部微高光折射，强化玻璃厚度感
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    
    // 批量删除（危险操作）- 低饱和警示红，对比度达标
    &.danger {
      border-color: #FF6B6B;
      color: #FF6B6B;
      background: rgba(10, 14, 23, 0.7);
      backdrop-filter: blur(8px);
      box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 8px rgba(255, 107, 107, 0.35);
      position: relative;
      
      // 极淡红色透明底叠加（与其他按钮填充透明度严格一致）
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255, 107, 107, 0.08);
        border-radius: 2px;
        z-index: -1;
      }
      
      &:hover:not(:disabled) {
        background: rgba(10, 14, 23, 0.7);
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.12),
          0 0 12px rgba(255, 107, 107, 0.45);
        color: #FF8A8A;
        border-color: #FF8A8A;
        
        &::before {
          background: rgba(255, 107, 107, 0.15);
        }
      }
      
      &:active:not(:disabled) {
        transform: translateY(1px);
        transition-duration: 0.1s;
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.06),
          0 0 6px rgba(255, 107, 107, 0.25);
        
        &::before {
          background: rgba(255, 107, 107, 0.2);
        }
      }
      
      &:disabled {
        opacity: 1;
        cursor: not-allowed;
        background: rgba(10, 14, 23, 0.5);
        box-shadow: none;
        border-color: rgba(255, 107, 107, 0.3);
        color: rgba(255, 107, 107, 0.3);
        backdrop-filter: none;
        
        &::before {
          background: transparent;
        }
      }
    }
    
    // 导出CSV（核心主操作）- 全局主青色，发光亮度轻微高于其他按钮
    &.primary {
      border-color: #00D9FF;
      color: #00D9FF;
      background: rgba(10, 14, 23, 0.7);
      backdrop-filter: blur(8px);
      box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 8px rgba(0, 217, 255, 0.35);
      position: relative;
      
      // 极淡青色透明底叠加（与其他按钮填充透明度严格一致）
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 217, 255, 0.08);
        border-radius: 2px;
        z-index: -1;
      }
      
      &:hover:not(:disabled) {
        background: rgba(10, 14, 23, 0.7);
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.12),
          0 0 12px rgba(0, 217, 255, 0.5);
        color: #33E5FF;
        border-color: #33E5FF;
        
        &::before {
          background: rgba(0, 217, 255, 0.15);
        }
      }
      
      &:active:not(:disabled) {
        transform: translateY(1px);
        transition-duration: 0.1s;
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.06),
          0 0 6px rgba(0, 217, 255, 0.25);
        
        &::before {
          background: rgba(0, 217, 255, 0.2);
        }
      }
    }
    
    // 下载模板（常规正向操作）- 低饱和薄荷绿，适配冷色调
    &.success {
      border-color: #36D399;
      color: #36D399;
      background: rgba(10, 14, 23, 0.7);
      backdrop-filter: blur(8px);
      box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 8px rgba(54, 211, 153, 0.3);
      position: relative;
      
      // 极淡绿色透明底叠加（与其他按钮填充透明度严格一致）
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(54, 211, 153, 0.08);
        border-radius: 2px;
        z-index: -1;
      }
      
      &:hover:not(:disabled) {
        background: rgba(10, 14, 23, 0.7);
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.12),
          0 0 12px rgba(54, 211, 153, 0.4);
        color: #5AE0B0;
        border-color: #5AE0B0;
        
        &::before {
          background: rgba(54, 211, 153, 0.15);
        }
      }
      
      &:active:not(:disabled) {
        transform: translateY(1px);
        transition-duration: 0.1s;
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.06),
          0 0 6px rgba(54, 211, 153, 0.2);
        
        &::before {
          background: rgba(54, 211, 153, 0.2);
        }
      }
    }
  }
  
  .batch-delete-count {
    display: inline-block;
    margin-left: 6px;
    padding: 1px 8px;
    background: rgba(255, 107, 107, 0.15);
    border-radius: 2px;
    font-size: 12px;
    font-weight: bold;
    color: #FF6B6B;
    min-width: 20px;
    text-align: center;
    border: 1px solid rgba(255, 107, 107, 0.25);
  }
}

.table-section {
  padding: 20px;
  min-height: 400px;
}

.cyber-table {
  border: 1px solid rgba(0, 212, 255, 0.2);
  overflow: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(0, 212, 255, 0.1);
      font-size: 13px;
      font-family: 'Courier New', monospace;
    }
    
    th {
      background: rgba(0, 212, 255, 0.1);
      color: #00d4ff;
      
      &.check-col {
        width: 40px;
        text-align: center;
        
        input[type="checkbox"] {
          cursor: pointer;
          accent-color: #00d4ff;
        }
      }
      position: sticky;
      top: 0;
      font-weight: bold;
      letter-spacing: 1px;
    }
    
    td {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .image-col {
      width: 40px;
      text-align: center;
    }
    
    .action-col {
      width: 60px;
      text-align: center;
    }
  }
  
  .data-row {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba(0, 212, 255, 0.08);
    }
  }
  
  .image-cell {
    text-align: center;
    
    .image-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: inline-block;
      
      &.has-image {
        background: #00ff88;
        box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
      }
      
      &.no-image {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }
  
  .check-cell {
    text-align: center;
    width: 40px;
    
    input[type="checkbox"] {
      cursor: pointer;
      accent-color: #00d4ff;
    }
  }
  
  .action-cell {
    text-align: center;
    display: flex;
    gap: 6px;
    justify-content: center;

    .detail-btn {
      background: rgba(0, 212, 255, 0.15);
      border: 1px solid rgba(0, 212, 255, 0.5);
      color: #00d4ff;
      padding: 5px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 1px;
      transition: all 0.3s;

      &:hover {
        background: rgba(0, 212, 255, 0.3);
        box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .delete-btn {
      background: rgba(255, 17, 68, 0.15);
      border: 1px solid rgba(255, 17, 68, 0.6);
      color: #ff1744;
      padding: 5px 14px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 1px;
      transition: all 0.3s;
      
      &:hover {
        background: rgba(255, 17, 68, 0.3);
        box-shadow: 0 0 12px rgba(255, 17, 68, 0.5);
        transform: scale(1.05);
        color: #ff5583;
      }
      
      &:active {
        transform: scale(0.95);
        background: rgba(255, 17, 68, 0.4);
      }
    }
  }
  
  .num-cell {
    color: #00ff88;
    font-weight: bold;
  }
  
  .type-tag {
    display: inline-block;
    padding: 2px 8px;
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 2px;
    font-size: 11px;
    color: #00d4ff;
  }

  .name-cell {
    cursor: help;
    color: #00d4ff;
    &:hover {
      text-decoration: underline;
      text-decoration-style: dotted;
    }
  }

  .source-cell {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
  }

  .source-truncate {
    cursor: help;
    color: rgba(0, 212, 255, 0.8);
    &:hover {
      color: #00d4ff;
    }
  }
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  
  .empty-icon {
    font-size: 48px;
    color: rgba(0, 212, 255, 0.3);
    margin-bottom: 20px;
  }
  
  p {
    color: rgba(0, 212, 255, 0.5);
    font-size: 14px;
    font-family: 'Courier New', monospace;
  }
}

.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid rgba(0, 212, 255, 0.2);
  
  .page-btn {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: #00d4ff;
    padding: 6px 12px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover:not(:disabled) {
      background: rgba(0, 212, 255, 0.2);
      border-color: #00d4ff;
    }
    
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
  
  .page-info {
    color: #00d4ff;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    padding: 0 15px;
  }

  .page-jump {
    display: flex;
    align-items: center;
    gap: 5px;

    input[type="number"] {
      width: 52px;
      padding: 4px 6px;
      background: rgba(0, 212, 255, 0.08);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 3px;
      color: #00d4ff;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      text-align: center;
      outline: none;
      transition: all 0.3s;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:focus {
        border-color: #00d4ff;
        box-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
        background: rgba(0, 212, 255, 0.12);
      }

      &::placeholder {
        color: rgba(0, 212, 255, 0.35);
        font-size: 11px;
      }
    }

    .jump-btn {
      padding: 4px 10px;
      background: rgba(0, 212, 255, 0.12);
      border: 1px solid rgba(0, 212, 255, 0.35);
      border-radius: 3px;
      color: #00d4ff;
      font-size: 11px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: rgba(0, 212, 255, 0.22);
        border-color: #00d4ff;
        box-shadow: 0 0 6px rgba(0, 212, 255, 0.25);
      }
    }
  }
  
  .page-size {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 20px;
    
    label {
      color: rgba(0, 212, 255, 0.6);
      font-size: 12px;
      font-family: 'Courier New', monospace;
    }
    
    select {
      background: rgba(0, 212, 255, 0.05);
      border: 1px solid rgba(0, 212, 255, 0.3);
      color: #00d4ff;
      padding: 4px 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      outline: none;
      cursor: pointer;
      
      option {
        background: #0a0e17;
        color: #00d4ff;
      }
    }
  }
}

// CSV 数据画像卡片样式
.csv-profile {
  margin: 12px 0;
  padding: 12px 16px;
  background: rgba(0, 50, 80, 0.25);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.7;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px dashed rgba(0, 212, 255, 0.2);
}
.profile-icon { font-size: 14px; }
.profile-title { color: #00d4ff; letter-spacing: 2px; font-weight: bold; font-size: 15px; }
.profile-meta { color: #00d4ff; opacity: 0.8; margin-left: auto; }

.profile-grid { display: grid; gap: 4px; }
.profile-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0;
  border-bottom: 1px dashed rgba(0, 212, 255, 0.1);
}
.profile-label {
  color: #00d4ff;
  font-size: 12px;
  letter-spacing: 1px;
  min-width: auto;
}
.profile-value {
  color: #e0f7fa;
  font-size: 14px;
  padding-left: 8px;
}
.profile-value.highlight {
  color: #00ff88;
  font-size: 20px;
  font-weight: bold;
}

.profile-tag {
  display: inline-block;
  padding: 2px 8px;
  margin: 2px 4px;
  border: 1px solid rgba(0, 212, 255, 0.4);
  border-radius: 2px;
  color: #00d4ff;
  font-size: 13px;
}
.profile-tag.warning {
  color: #ffaa00;
  border-color: rgba(255, 170, 0, 0.4);
  font-weight: bold;
  font-size: 14px;
}
.profile-tag.danger {
  color: #ff5252;
  border-color: rgba(255, 82, 82, 0.4);
  font-weight: bold;
  font-size: 14px;
}
.profile-sub { color: rgba(0, 212, 255, 0.5); margin-left: 8px; font-size: 11px; }

// 导入状态栏样式
.import-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid;
  transition: all 0.3s;
  font-size: 14px;
  margin: 12px 0;
  
  .status-icon { font-size: 24px; flex-shrink: 0; }
  .status-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .status-title { font-size: 15px; font-weight: bold; }
  .status-detail { font-size: 13px; opacity: 0.85; display: flex; gap: 16px; flex-wrap: wrap; }
  .num-success { color: #00ff88; font-weight: bold; }
  .num-warning { color: #ffaa00; font-weight: bold; }
  .ml-8 { margin-left: 0; }
  .status-elapsed { opacity: 0.7; }
  
  &.status-idle {
    background: rgba(0, 50, 80, 0.2);
    border-color: rgba(0, 212, 255, 0.3);
    color: rgba(0, 212, 255, 0.7);
  }
  &.status-success {
    background: rgba(0, 60, 30, 0.3);
    border-color: rgba(0, 255, 136, 0.5);
    color: #00ff88;
  }
  &.status-warning {
    background: rgba(80, 50, 0, 0.3);
    border-color: rgba(255, 170, 0, 0.5);
    color: #ffaa00;
  }
  &.status-error {
    background: rgba(80, 0, 0, 0.3);
    border-color: rgba(255, 100, 100, 0.5);
    color: #ff6464;
  }
}

:deep(.el-loading-mask) {
  background-color: rgba(10, 14, 23, 0.8);
}

:deep(.el-loading-spinner) {
  .circular {
    stroke: #00d4ff;
  }
  
  .el-loading-text {
    color: #00d4ff;
    font-family: 'Courier New', monospace;
  }
}

.subtitle-tooltip {
  display: block;
  max-width: 300px;
  word-wrap: break-word;
  font-size: 13px;
  line-height: 1.4;
}
</style>

<!-- 全局样式：图片预览统一尺寸 -->
<style>
/* 装备图片 tooltip 统一尺寸 */
.equipment-image-tooltip {
  border: 1px solid rgba(0, 212, 255, 0.6) !important;
  box-shadow: 0 0 25px rgba(0, 212, 255, 0.4), 0 8px 32px rgba(0, 0, 0, 0.5) !important;
  background: rgba(10, 14, 23, 0.98) !important;
  padding: 10px !important;
  border-radius: 8px !important;
  max-width: 320px !important; /* 固定容器宽度 */
}

.equipment-image-tooltip .image-preview {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 300px !important;      /* 固定宽度 */
  height: 220px !important;     /* 固定高度 */
  background: #000 !important;
  border-radius: 4px;
  overflow: hidden;
}

.equipment-image-tooltip .image-preview img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;   /* 保持比例，居中显示 */
  display: block !important;
}
</style>
