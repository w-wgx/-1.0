<template>
  <div class="global-overview">
    <!-- HUD背景层 - 与其他页面保持一致 -->
    <div class="hud-background">
      <div class="cyber-grid"></div>
      <div class="scan-line"></div>
      <div class="hud-vignette"></div>
    </div>

    <!-- 顶部导航栏 - 统一设计 -->
    <header class="top-nav">
      <div class="nav-left">
        <div class="nav-title-group">
          <span class="nav-icon">🌍</span>
          <div class="nav-text">
            <span class="nav-title">全球概览</span>
            <span class="nav-subtitle">GLOBAL OVERVIEW</span>
          </div>
        </div>
      </div>

      <div class="nav-center">
        <!-- 统一的主导航标签 -->
        <router-link to="/global-overview" class="nav-tab active">
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

    <!-- 三栏布局 -->
    <div class="main-container">
      <!-- 左侧栏 -->
      <aside class="sidebar">
        <SidebarPanel />
      </aside>

      <!-- 中间地球 -->
      <main class="globe-container">
        <GlobeViewer :key="globeKey" />
      </main>

      <!-- 右侧面板 -->
      <aside :class="['panel-container', { open: store.currentCountry }]">
        <CountryPanel />
      </aside>
    </div>

    <!-- 底部 HUD 状态条 -->
    <footer class="hud-bottom">
      <div class="hud-hint">
        <span class="hint-icon">◉</span>
        <span>拖拽旋转 / 滚轮缩放 / 点击国家查看详情</span>
      </div>
      <div class="hud-data-status">
        <span class="data-label">数据源</span>
        <span class="data-value">实时 ({{ store.totalCountries }} 个国家)</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * GlobalOverviewView.vue
 * 全球概览页面 - 三栏布局
 *
 * - 左侧：SidebarPanel（装备类型筛选、国家列表、年份滑块、统计概览）
 * - 中间：GlobeViewer（3D 地球）
 * - 右侧：CountryPanel（国家装备列表）
 * - 顶部/底部 HUD 状态栏
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GlobeViewer from '@/components/earth/GlobeViewer.vue'
import CountryPanel from '@/components/panels/CountryPanel.vue'
import SidebarPanel from '@/components/panels/SidebarPanel.vue'
import { useGlobeStore } from '@/stores/globeStore'
import { equipmentApi } from '@/api/equipment'

const store = useGlobeStore()
const currentTime = ref('')
const globeKey = ref(Date.now())


let timer: number | null = null

function updateTime() {
  const now = new Date()
  currentTime.value = now.toISOString().slice(11, 19) + ' UTC'
}


onMounted(async () => {
  console.log('[GlobalOverview] 组件挂载')
  updateTime()
  timer = window.setInterval(updateTime, 1000)

  // 加载国家数据
  await store.loadCountries()

  console.log('[GlobalOverview] 数据加载完成，共', store.countries.length, '个国家')
  console.log('[GlobalOverview] 左侧国家列表渲染完成')
})

onBeforeUnmount(() => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped lang="scss">
.global-overview {
  position: relative;
  height: 100vh;
  background: #0a0e17;
  padding: 20px;
  overflow: hidden;
  color: #e0f7fa;
  font-family: 'Roboto Mono', 'Courier New', monospace;
  display: flex;
  flex-direction: column;
}

// ============== HUD背景层 ==============
.hud-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.cyber-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent);
  animation: scan 3s linear infinite;
}

.hud-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%);
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

// ============== 顶部 HUD ==============
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
      rgba(0, 229, 255, 0.5),
      rgba(100, 200, 255, 0.8),
      rgba(0, 229, 255, 0.5),
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
      font-size: 24px;
      filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.5));
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

  // 中间：主导航标签
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
        background: rgba(0, 229, 255, 0.1);
        color: #00e5ff;

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

// ============== 三栏布局 ==============
.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  overflow: hidden;
  z-index: 10;
}

.globe-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.panel-container {
  width: 0;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;

  &.open {
    width: 380px;
  }
}

// ============== 底部 HUD ==============
.hud-bottom {
  flex-shrink: 0;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(0deg, rgba(0, 229, 255, 0.08) 0%, rgba(0, 229, 255, 0.02) 100%);
  border-top: 1px solid rgba(0, 229, 255, 0.3);
  z-index: 50;
  font-size: 11px;
  letter-spacing: 1px;
}

.hud-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #80deea;
}

.hint-icon {
  color: #00e5ff;
}

.hud-data-status {
  display: flex;
  gap: 6px;
}

.data-label {
  color: #80deea;
}

.data-value {
  color: #76ff03;
  font-weight: 700;
  text-shadow: 0 0 6px rgba(118, 255, 3, 0.4);
}
</style>
