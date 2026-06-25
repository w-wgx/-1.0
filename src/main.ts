/**
 * Vue应用入口文件
 */

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { ElMessage } from 'element-plus'
import './assets/styles/global.scss'
import { mockApi } from './api/mock-api'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(createPinia())

// 如果是 Mock 模式，加载 Mock 数据
if (import.meta.env.VITE_USE_MOCK === 'true') {
  mockApi.loadMockData()
    .then(() => {
      console.log('Mock mode enabled')
      app.mount('#app')
    })
    .catch((error) => {
      console.error('Mock data loading failed:', error)
      ElMessage.error({
        message: '数据加载失败，请刷新页面重试',
        duration: 5000,
        showClose: true
      })
      // 即使数据加载失败，也挂载应用（避免白屏）
      app.mount('#app')
    })
} else {
  app.mount('#app')
}
