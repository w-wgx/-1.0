<template>
  <div id="app">
    <!-- 全局导航已移除 - 各页面自行管理导航 -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: #000;
  color: #e0f7fa;
  font-family: 'Roboto Mono', 'Courier New', monospace;
}

.app-main {
  flex: 1;
  position: relative;
}
</style>

<style lang="scss">
/* 全局样式：确保滚动条始终占位，防止页面宽度变化导致导航栏位移 */
html {
  overflow-y: scroll; /* 滚动条始终显示，即使内容不足以触发滚动 */
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 防止水平滚动条 */
}
</style>
