import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 启动 Web Vitals 性能监控
import { quickStartMonitor } from './utils/performance/performance'

import '../configs/echarts'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import './styles/index'

quickStartMonitor()

// 解决 naive 的样式被覆盖的问题
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(MotionPlugin)
app.use(autoAnimatePlugin)
app.mount('#app')
