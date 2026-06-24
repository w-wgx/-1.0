/**
 * Vue应用入口文件
 */

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/styles/global.scss'
import { mockApi } from './api/mock-api'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(createPinia())

// 如果是 Mock 模式，加载 Mock 数据
if (import.meta.env.VITE_USE_MOCK === 'true') {
  mockApi.loadMockData().then(() => {
    console.log('Mock mode enabled')
    app.mount('#app')
  })
} else {
  app.mount('#app')
}
