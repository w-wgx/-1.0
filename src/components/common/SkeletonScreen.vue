<template>
  <div class="skeleton-screen">
    <!-- 顶部导航栏骨架 -->
    <div class="skeleton-nav">
      <div class="skeleton-nav-left">
        <div class="skeleton-icon"></div>
        <div class="skeleton-title"></div>
      </div>
      <div class="skeleton-nav-center">
        <div class="skeleton-tab"></div>
        <div class="skeleton-tab"></div>
        <div class="skeleton-tab"></div>
        <div class="skeleton-tab"></div>
      </div>
      <div class="skeleton-nav-right">
        <div class="skeleton-stat"></div>
        <div class="skeleton-stat"></div>
      </div>
    </div>

    <!-- 主内容区域骨架 -->
    <div class="skeleton-content">
      <!-- 统计卡片骨架 -->
      <div class="skeleton-stats-bar">
        <div class="skeleton-stat-card"></div>
        <div class="skeleton-stat-card"></div>
        <div class="skeleton-stat-card"></div>
        <div class="skeleton-stat-card"></div>
      </div>

      <!-- 篮选栏骨架 -->
      <div class="skeleton-filter-bar">
        <div class="skeleton-input"></div>
        <div class="skeleton-select"></div>
        <div class="skeleton-select"></div>
        <div class="skeleton-button"></div>
      </div>

      <!-- 表格骨架 -->
      <div class="skeleton-table">
        <div class="skeleton-table-header">
          <div class="skeleton-cell"></div>
          <div class="skeleton-cell"></div>
          <div class="skeleton-cell"></div>
          <div class="skeleton-cell"></div>
          <div class="skeleton-cell"></div>
        </div>
        <div class="skeleton-table-body">
          <div class="skeleton-row">
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
          </div>
          <div class="skeleton-row">
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
          </div>
          <div class="skeleton-row">
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
          </div>
          <div class="skeleton-row">
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
          </div>
          <div class="skeleton-row">
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
          </div>
        </div>
      </div>

      <!-- 分页骨架 -->
      <div class="skeleton-pagination">
        <div class="skeleton-page-button"></div>
        <div class="skeleton-page-info"></div>
        <div class="skeleton-page-button"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * SkeletonScreen.vue
 * 骨架屏组件
 *
 * 用于页面首次加载或刷新时显示占位内容，避免白屏
 */
</script>

<style scoped lang="scss">
.skeleton-screen {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%);
  overflow: hidden;
  position: relative;
}

/* ========== 导航栏骨架 ========== */
.skeleton-nav {
  height: 60px;
  background: rgba(10, 14, 26, 0.95);
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.skeleton-nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skeleton-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.1) 25%, rgba(0, 212, 255, 0.2) 50%, rgba(0, 212, 255, 0.1) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title {
  width: 150px;
  height: 20px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.1) 25%, rgba(0, 212, 255, 0.2) 50%, rgba(0, 212, 255, 0.1) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-nav-center {
  display: flex;
  gap: 15px;
}

.skeleton-tab {
  width: 100px;
  height: 32px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.1) 50%, rgba(0, 212, 255, 0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 6px;
}

.skeleton-nav-right {
  display: flex;
  gap: 12px;
}

.skeleton-stat {
  width: 80px;
  height: 40px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.1) 25%, rgba(0, 212, 255, 0.2) 50%, rgba(0, 212, 255, 0.1) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

/* ========== 主内容区域骨架 ========== */
.skeleton-content {
  padding: 20px;
  height: calc(100vh - 60px);
  overflow: hidden;
}

/* ========== 统计卡片骨架 ========== */
.skeleton-stats-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.skeleton-stat-card {
  width: 200px;
  height: 80px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.1) 50%, rgba(0, 212, 255, 0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.1);
}

/* ========== 篮选栏骨架 ========== */
.skeleton-filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.skeleton-input {
  width: 200px;
  height: 36px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.1) 50%, rgba(0, 212, 255, 0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 6px;
}

.skeleton-select {
  width: 150px;
  height: 36px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.1) 50%, rgba(0, 212, 255, 0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 6px;
}

.skeleton-button {
  width: 100px;
  height: 36px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.1) 25%, rgba(0, 212, 255, 0.2) 50%, rgba(0, 212, 255, 0.1) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 6px;
}

/* ========== 表格骨架 ========== */
.skeleton-table {
  background: rgba(10, 14, 26, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-table-header {
  display: flex;
  background: rgba(0, 212, 255, 0.05);
  padding: 12px 0;
}

.skeleton-table-body {
  padding: 0;
}

.skeleton-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 212, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
}

.skeleton-cell {
  flex: 1;
  height: 20px;
  margin: 0 10px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.1) 50%, rgba(0, 212, 255, 0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

/* ========== 分页骨架 ========== */
.skeleton-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.skeleton-page-button {
  width: 80px;
  height: 36px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.1) 50%, rgba(0, 212, 255, 0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 6px;
}

.skeleton-page-info {
  width: 120px;
  height: 20px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.1) 50%, rgba(0, 212, 255, 0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

/* ========== 动画 ========== */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>