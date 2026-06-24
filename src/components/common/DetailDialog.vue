<template>
  <el-dialog
    v-model="visible"
    :title="equipment?.name || '装备详情'"
    width="800px"
    class="detail-dialog"
    :close-on-click-modal="false"
  >
    <div class="detail-content" v-if="equipment">
      <!-- 基本信息区 -->
      <div class="info-section">
        <div class="section-title">
          <span class="cyber-icon">▣</span>
          <span>基本信息</span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">ID:</span>
            <span class="value">{{ equipment.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">名称:</span>
            <span class="value highlight">{{ equipment.name || '-' }}</span>
          </div>
          <div class="info-item" v-if="equipment.subtitle">
            <span class="label">副标题:</span>
            <span class="value">{{ equipment.subtitle }}</span>
          </div>
          <div class="info-item">
            <span class="label">类型:</span>
            <span class="value type-tag">{{ equipment.type || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">类别:</span>
            <span class="value">{{ equipment.category || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">国家:</span>
            <span class="value">{{ equipment.country || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">服役年份:</span>
            <span class="value">{{ equipment.year || '-' }}</span>
          </div>
          <div class="info-item" v-if="equipment.manufacturer">
            <span class="label">制造商:</span>
            <span class="value">{{ equipment.manufacturer }}</span>
          </div>
          <div class="info-item" v-if="equipment.totalProduction">
            <span class="label">总产量:</span>
            <span class="value">{{ equipment.totalProduction.toLocaleString() }} 架</span>
          </div>
        </div>
      </div>

      <!-- 性能参数区 -->
      <div class="info-section">
        <div class="section-title">
          <span class="cyber-icon">▣</span>
          <span>性能参数</span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">长度:</span>
            <span class="value">{{ equipment.length ? `${equipment.length} m` : '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">宽度:</span>
            <span class="value">{{ equipment.width ? `${equipment.width} m` : '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">高度:</span>
            <span class="value">{{ equipment.height ? `${equipment.height} m` : '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">重量:</span>
            <span class="value">{{ equipment.weight ? `${equipment.weight} kg` : '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">最大速度:</span>
            <span class="value">{{ equipment.maxSpeed ? `${equipment.maxSpeed} km/h` : '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">乘员数:</span>
            <span class="value">{{ equipment.crew || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">探测范围:</span>
            <span class="value">{{ equipment.detectionRange ? `${equipment.detectionRange} km` : '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">最大航程:</span>
            <span class="value">{{ equipment.maxRange ? `${equipment.maxRange} km` : '-' }}</span>
          </div>
          <div class="info-item" v-if="equipment.ceiling">
            <span class="label">升限:</span>
            <span class="value">{{ equipment.ceiling }}</span>
          </div>
          <div class="info-item" v-if="equipment.engine">
            <span class="label">引擎:</span>
            <span class="value">{{ equipment.engine }}</span>
          </div>
        </div>
      </div>

      <!-- 图片展示区 -->
      <div class="image-section" v-if="equipment.imagePath">
        <div class="section-title">
          <span class="cyber-icon">▣</span>
          <span>装备图片</span>
        </div>
        <div class="image-container">
          <img
            :src="equipImageUrl"
            :alt="equipment.name"
            referrerpolicy="no-referrer"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- 描述信息区 -->
      <div class="desc-section" v-if="equipment.description">
        <div class="section-title">
          <span class="cyber-icon">▣</span>
          <span>描述信息</span>
        </div>
        <div class="desc-content">
          {{ equipment.description }}
        </div>
      </div>

      <!-- 来源链接区 -->
      <div class="link-section" v-if="equipment.sourceLink || equipment.imageLink || equipment.detailUrl">
        <div class="section-title">
          <span class="cyber-icon">▣</span>
          <span>相关链接</span>
        </div>
        <div class="link-list">
          <a
            v-if="equipment.sourceLink"
            :href="equipment.sourceLink"
            target="_blank"
            class="cyber-link"
          >
            📎 数据来源
          </a>
          <a
            v-if="equipment.imageLink"
            :href="equipment.imageLink"
            target="_blank"
            class="cyber-link"
          >
            🖼 图片来源
          </a>
          <a
            v-if="equipment.detailUrl"
            :href="equipment.detailUrl"
            target="_blank"
            class="cyber-link"
          >
            🔗 详情链接
          </a>
        </div>
      </div>

      <!-- 扩展信息区 -->
      <div class="info-section" v-if="equipment.source || equipment.operators || equipment.variants">
        <div class="section-title">
          <span class="cyber-icon">▣</span>
          <span>扩展信息</span>
        </div>
        <div class="info-grid">
          <div class="info-item full-width" v-if="equipment.source">
            <span class="label">数据来源:</span>
            <span class="value">{{ equipment.source }}</span>
          </div>
          <div class="info-item full-width" v-if="equipment.operators">
            <span class="label">使用方:</span>
            <span class="value">{{ equipment.operators }}</span>
          </div>
          <div class="info-item full-width" v-if="equipment.variants">
            <span class="label">变体型号:</span>
            <span class="value">{{ equipment.variants }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-state" v-else-if="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <button class="cyber-btn" @click="visible = false">
          <span>关闭</span>
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { equipmentApi, Equipment } from '@/api/equipment'
import { buildImageUrl } from '@/utils/imageUrl'

const visible = ref(false)
const loading = ref(false)
const equipment = ref<Equipment | null>(null)

const equipImageUrl = computed(() => {
  if (!equipment.value) return ''
  // 优先使用完整链接
  if (equipment.value.imageLink) return equipment.value.imageLink
  // 其次拼接本地路径
  return buildImageUrl(equipment.value.imagePath) || ''
})

const open = async (id: number | string) => {
  visible.value = true
  loading.value = true
  equipment.value = null

  try {
    const res = await equipmentApi.getDetail(id)
    if (res.code === 200) {
      equipment.value = res.data
    }
  } catch (error) {
    console.error('加载详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
}

defineExpose({ open })
</script>

<style scoped lang="scss">
// ============== 赛博HUD军事终端配色系统 ==============
$font-mono: 'Roboto Mono', 'JetBrains Mono', 'Courier New', monospace;

// 核心颜色定义
$color-primary: #00d4ff;      // 主色调：青蓝色
$color-highlight: #00ff88;    // 高亮色：绿色
$color-text: #ffffff;         // 主文字：纯白
$color-label: #80d0ff;        // 标签色：浅蓝
$color-empty: #60a0ff;        // 空值色：中蓝
$color-desc: #a0e0ff;         // 描述色：淡蓝
$color-warning: #ff9900;      // 警告色：橙色

// ============== 1. 弹窗容器核心配色（液态玻璃基底） ==============
.detail-dialog {
  :deep(.el-dialog) {
    // 液态玻璃基底
    background: rgba(10, 14, 23, 0.22) !important;
    backdrop-filter: blur(18px) saturate(120%) !important;
    -webkit-backdrop-filter: blur(18px) saturate(120%) !important;
    
    // 边框与外发光
    border: 1px solid rgba(0, 212, 255, 0.35) !important;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.7),
      0 0 20px rgba(0, 212, 255, 0.18) !important;
    
    // 军事风格锐利边角
    border-radius: 6px !important;
    overflow: hidden;
    
    // 淡入+轻微缩放动画
    animation: dialog-appear 0.3s ease-out;

    // 极淡扫描线纹理叠加
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 212, 255, 0.03) 2px,
        rgba(0, 212, 255, 0.03) 4px
      );
      pointer-events: none;
      z-index: 0;
    }
  }

  // ============== 顶部标题栏 ==============
  :deep(.el-dialog__header) {
    position: relative;
    background: rgba(0, 212, 255, 0.08);
    border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    padding: 15px 20px;
    z-index: 1;

    // 顶部渐变发光边框
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, #00d4ff, #00ff88, #00d4ff);
      opacity: 1;
    }

    // 主标题（装备名称）
    .el-dialog__title {
      color: $color-highlight;
      font-family: $font-mono;
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 1px;
      text-shadow: 1px 1px 2px rgba(0, 255, 136, 0.3);
      opacity: 1;
    }

    // 关闭按钮
    .el-dialog__headerbtn {
      .el-dialog__close {
        color: $color-label;
        font-size: 20px;
        transition: all 0.3s;
        opacity: 1;

        &:hover {
          color: $color-primary;
          text-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
        }
      }
    }
  }

  :deep(.el-dialog__body) {
    position: relative;
    padding: 20px;
    color: $color-text;
    z-index: 1;
  }

  :deep(.el-dialog__footer) {
    position: relative;
    background: rgba(0, 212, 255, 0.05);
    border-top: 1px solid rgba(0, 212, 255, 0.2);
    padding: 15px 20px;
    z-index: 1;
  }
}

@keyframes dialog-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

// ============== 3. 内部模块与输入框配色 ==============
.info-section,
.image-section,
.desc-section,
.link-section {
  // 次级液态玻璃
  background: rgba(0, 212, 255, 0.09) !important;
  border: 1px solid rgba(0, 212, 255, 0.22) !important;
  border-radius: 4px;
  padding: 15px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(0, 212, 255, 0.12) !important;
    border-color: rgba(0, 212, 255, 0.3) !important;
    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.1);
  }
}

// ============== 2. 全局文字系统配色 ==============
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;

  // 模块标题
  color: #00d4ff !important;
  font-family: 'Roboto Mono', 'JetBrains Mono', 'Courier New', monospace;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  opacity: 1;

  .cyber-icon {
    color: #00d4ff !important;
    font-size: 16px;
    animation: icon-pulse 2s ease-in-out infinite;
  }
}

@keyframes icon-pulse {
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 4px rgba(0, 212, 255, 0.3);
  }
  50% {
    opacity: 0.8;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.info-item {
  display: flex;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(0, 212, 255, 0.06) !important; // 次级液态玻璃
  border: 1px solid transparent;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.12) !important;
    border-color: rgba(0, 212, 255, 0.2) !important;
  }

  // 全宽显示（用于扩展信息）
  &.full-width {
    grid-column: 1 / -1;
  }

  // 参数标签
  .label {
    color: #80d0ff !important;
    font-size: 13px;
    font-weight: 500;
    min-width: 80px;
    text-align: right;
    font-family: 'Roboto Mono', 'JetBrains Mono', 'Courier New', monospace;
    letter-spacing: 0.5px;
    opacity: 1;
  }

  // 参数值
  .value {
    color: #ffffff !important;
    font-size: 14px;
    font-weight: 400;
    font-family: 'Roboto Mono', 'JetBrains Mono', 'Courier New', monospace;
    opacity: 1;
    flex: 1;

    // 高亮参数值（装备名称）
    &.highlight {
      color: #00ff88 !important;
      font-weight: 700;
      text-shadow: 1px 1px 2px rgba(0, 255, 136, 0.3);
    }

    // 类型标签（facility）
    &.type-tag {
      background: rgba(255, 153, 0, 0.2) !important;
      border: 1px solid rgba(255, 153, 0, 0.5) !important;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      color: #ff9900 !important;
    }
  }
}

// ============== 4. 图片与交互区域配色 ==============
.image-container {
  text-align: center;
  padding: 15px;
  background: rgba(0, 212, 255, 0.06) !important; // 次级液态玻璃
  border: 1px solid rgba(0, 212, 255, 0.3) !important;
  border-radius: 4px;
  box-shadow: inset 0 0 12px rgba(0, 212, 255, 0.1) !important;
  position: relative;

  // 扫描线动画
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00d4ff, transparent);
    animation: scan-line 3s linear infinite;
    opacity: 0.5;
  }

  img {
    max-width: 100%;
    max-height: 300px;
    border: 1px solid rgba(0, 212, 255, 0.3) !important;
    border-radius: 4px;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
  }
}

@keyframes scan-line {
  0% {
    top: 0;
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

// 描述信息/备注
.desc-content {
  color: #a0e0ff !important;
  line-height: 1.6;
  white-space: pre-wrap;
  font-size: 13px;
  font-family: 'Roboto Mono', 'JetBrains Mono', 'Courier New', monospace;
  opacity: 1;
  padding: 10px;
  background: rgba(0, 212, 255, 0.06) !important; // 次级液态玻璃
  border-radius: 4px;
  max-height: 220px;          // 最大高度限制
  overflow-y: auto;           // 超出部分可滚动

  // 自定义滚动条样式（赛博风）
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 212, 255, 0.05);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 212, 255, 0.35);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 212, 255, 0.55);
    }
  }

  // Firefox 滚动条
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.35) rgba(0, 212, 255, 0.05);
}

.link-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

// 按钮（图片来源）
.cyber-link {
  color: #00d4ff !important;
  text-decoration: none;
  padding: 8px 15px;
  background: rgba(0, 212, 255, 0.12) !important;
  border: 1px solid rgba(0, 212, 255, 0.3) !important;
  border-radius: 4px;
  font-family: 'Roboto Mono', 'JetBrains Mono', 'Courier New', monospace;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  opacity: 1;

  &:hover {
    background: rgba(0, 212, 255, 0.2) !important;
    border-color: #00d4ff !important;
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.25) !important;
    text-shadow: 0 0 5px rgba(0, 212, 255, 0.5) !important;
    transform: translateY(-2px);
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: $color-primary;
  font-family: $font-mono;

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 212, 255, 0.2);
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }

  p {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    opacity: 1;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

// 关闭按钮
.cyber-btn {
  background: rgba(0, 212, 255, 0.12) !important;
  border: 1px solid rgba(0, 212, 255, 0.3) !important;
  color: #00d4ff !important;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Roboto Mono', 'JetBrains Mono', 'Courier New', monospace;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  opacity: 1;

  &:hover {
    background: rgba(0, 212, 255, 0.2) !important;
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.25) !important;
    text-shadow: 0 0 5px rgba(0, 212, 255, 0.5) !important;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>

<!-- 全局样式覆盖（非scoped，强制覆盖Element Plus默认样式） -->
<style lang="scss">
/* ========================================
   赛博HUD军事终端 - 装备详情弹窗全局样式
   强制覆盖 Element Plus Dialog 默认白色样式
   ======================================== */

// 弹窗遮罩层
.el-overlay {
  background-color: rgba(0, 0, 0, 0.75) !important;
}

// 装备详情弹窗容器 - 最高优先级选择器
.detail-dialog {
  // 核心弹窗 - 彻底移除白色背景 + 白色边框
  .el-dialog {
    background-color: rgb(10, 14, 23) !important; // 使用不透明深色
    backdrop-filter: blur(18px) saturate(120%) !important;
    -webkit-backdrop-filter: blur(18px) saturate(120%) !important;

    // 关键：彻底移除所有默认边框
    border: none !important;
    outline: none !important;

    // 使用 box-shadow 创建青蓝色发光边框（无法被 border 覆盖）
    box-shadow:
      0 0 0 2px rgba(0, 212, 255, 0.8),      // 青蓝色主边框（2px粗）
      0 0 25px rgba(0, 212, 255, 0.4),         // 外发光效果
      0 10px 40px rgba(0, 0, 0, 0.95) !important; // 深色投影

    border-radius: 6px !important;
    overflow: hidden;
    position: relative;

    // 扫描线纹理
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 212, 255, 0.03) 2px,
        rgba(0, 212, 255, 0.03) 4px
      );
      pointer-events: none;
      z-index: 0;
    }
  }

  // 顶部标题栏 - 深色背景 + 渐变发光边框
  .el-dialog__header {
    background-color: rgb(0, 15, 30) !important; // 纯深色
    border-bottom: 1px solid rgba(0, 212, 255, 0.3) !important;
    padding: 16px 20px;
    margin-right: 0 !important;
    position: relative;

    // 顶部渐变发光线
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #00d4ff, #00ff88, #00d4ff);
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }

    // 主标题 - 绿色高亮
    .el-dialog__title {
      color: #00ff88 !important;
      font-family: 'Roboto Mono', 'JetBrains Mono', 'Courier New', monospace !important;
      font-weight: 700 !important;
      font-size: 18px !important;
      letter-spacing: 1px;
      text-shadow: 1px 1px 2px rgba(0, 255, 136, 0.4), 0 0 8px rgba(0, 255, 136, 0.2);
    }

    // 关闭按钮
    .el-dialog__headerbtn {
      top: 16px;
      right: 16px;

      .el-dialog__close {
        color: #80d0ff !important;
        font-size: 20px;

        &:hover {
          color: #00d4ff !important;
          text-shadow: 0 0 8px rgba(0, 212, 255, 0.7);
        }
      }
    }
  }

  // 内容区域 - 深色背景（关键修复！）
  .el-dialog__body {
    padding: 20px;
    background-color: rgb(10, 14, 23) !important; // 与弹窗同色
    color: #ffffff !important;
  }

  // 底部区域 - 深色背景
  .el-dialog__footer {
    background-color: rgb(0, 15, 30) !important; // 纯深色
    border-top: 1px solid rgba(0, 212, 255, 0.25) !important;
    padding: 14px 20px;
  }
}

/* 内部模块样式 - 强制深色背景 */
.detail-content {
  position: relative;
  z-index: 1;
}

// 信息模块卡片 - 深色液态玻璃
.info-section,
.image-section,
.desc-section,
.link-section {
  background-color: rgb(0, 25, 50) !important; // 纯深蓝
  border: 1px solid rgba(0, 212, 255, 0.3) !important;
  border-radius: 4px;
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(0, 35, 70) !important;
    border-color: rgba(0, 212, 255, 0.4) !important;
    box-shadow: 0 4px 16px rgba(0, 212, 255, 0.12);
  }
}

// 模块标题 - 青蓝色
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  color: #00d4ff !important;
  font-family: 'Roboto Mono', 'JetBrains Mono', monospace;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;

  .cyber-icon {
    color: #00d4ff !important;
    font-size: 16px;
  }
}

// 信息项网格
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

// 单个信息项 - 深色背景（关键！）
.info-item {
  display: flex;
  gap: 10px;
  padding: 9px 12px;
  background-color: rgb(5, 18, 35) !important; // 纯深蓝黑
  border: 1px solid transparent;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(10, 30, 55) !important;
    border-color: rgba(0, 212, 255, 0.3) !important;
  }

  // 参数标签 - 浅蓝色
  .label {
    color: #80d0ff !important;
    font-size: 13px;
    font-weight: 500;
    min-width: 80px;
    text-align: right;
    font-family: 'Roboto Mono', 'JetBrains Mono', monospace;
    letter-spacing: 0.5px;
  }

  // 参数值 - 纯白色，清晰可读
  .value {
    color: #ffffff !important;
    font-size: 14px;
    font-weight: 400;
    font-family: 'Roboto Mono', 'JetBrains Mono', monospace;
    flex: 1;

    // 高亮值（装备名称）- 绿色发光
    &.highlight {
      color: #00ff88 !important;
      font-weight: 700;
      text-shadow: 1px 1px 2px rgba(0, 255, 136, 0.4), 0 0 8px rgba(0, 255, 136, 0.2);
    }

    // 类型标签 - 橙色警告
    &.type-tag {
      background-color: rgba(255, 153, 0, 0.2) !important;
      border: 1px solid rgba(255, 153, 0, 0.6) !important;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      color: #ff9900 !important;
    }
  }
}

// 图片容器 - 深色边框 + 内阴影
.image-container {
  text-align: center;
  padding: 16px;
  background-color: rgb(5, 18, 35) !important; // 纯深蓝黑
  border: 1px solid rgba(0, 212, 255, 0.3) !important;
  border-radius: 4px;
  box-shadow: inset 0 0 15px rgba(0, 212, 255, 0.08);

  img {
    max-width: 100%;
    max-height: 300px;
    border: 1px solid rgba(0, 212, 255, 0.25) !important;
    border-radius: 4px;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.4);
  }
}

// 描述内容 - 淡蓝色文字
.desc-content {
  color: #a0e0ff !important;
  line-height: 1.65;
  white-space: pre-wrap;
  font-size: 13px;
  font-family: 'Roboto Mono', 'JetBrains Mono', monospace;
  padding: 12px;
  background-color: rgb(5, 18, 35) !important; // 纯深蓝黑
  border-radius: 4px;
}

// 链接按钮 - 青蓝色
.cyber-link {
  color: #00d4ff !important;
  text-decoration: none;
  padding: 9px 18px;
  background-color: rgba(0, 212, 255, 0.12) !important;
  border: 1px solid rgba(0, 212, 255, 0.4) !important;
  border-radius: 4px;
  font-family: 'Roboto Mono', 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(0, 212, 255, 0.22) !important;
    border-color: #00d4ff !important;
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
    transform: translateY(-2px);
  }
}

// 关闭按钮
.cyber-btn {
  background-color: rgba(0, 212, 255, 0.12) !important;
  border: 1px solid rgba(0, 212, 255, 0.4) !important;
  color: #00d4ff !important;
  padding: 9px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Roboto Mono', 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: rgba(0, 212, 255, 0.22) !important;
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
    transform: translateY(-1px);
  }
}

// 加载状态
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  color: #00d4ff !important;
  font-family: 'Roboto Mono', 'JetBrains Mono', monospace;

  p {
    color: #00d4ff !important;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>