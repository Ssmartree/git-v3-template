# Web Vitals 性能监控使用指南

## 📊 什么是 Web Vitals？

**Web Vitals** 是 Google 提出的一套统一的网页性能指标标准，用于衡量用户体验的关键方面。

### Core Web Vitals (核心指标)

| 指标 | 含义 | 目标值 | 影响 |
|------|------|--------|------|
| **LCP** | 最大内容绘制 | < 2.5s | 加载性能 |
| **FID** | 首次输入延迟 | < 100ms | 交互性能 |
| **CLS** | 累积布局偏移 | < 0.1 | 视觉稳定性 |

### Other Vitals (其他指标)

| 指标 | 含义 | 目标值 |
|------|------|--------|
| **FCP** | 首次内容绘制 | < 1.8s |
| **TTFB** | 首字节时间 | < 800ms |
| **INP** | 交互到下一次绘制 | < 200ms |

---

## 🚀 快速开始

### 1. 基础用法（已自动启用）

项目已经在 `main.ts` 中自动启用了性能监控：

```typescript
import { quickStartMonitor } from './utils/performance'

// 开发环境：打印日志到控制台
// 生产环境：上报到服务器
quickStartMonitor()
```

打开浏览器控制台，你会看到类似这样的输出：

```
[Web Vitals] ✅ LCP: 1234ms
评级: good
导航类型: navigate

[Web Vitals] ✅ FID: 45ms
评级: good
导航类型: navigate

[Web Vitals] ⚠️ CLS: 0.15
评级: needs-improvement
导航类型: navigate
```

### 2. 自定义配置

```typescript
import { setupPerformanceMonitor } from '@/utils/performance'

const monitor = setupPerformanceMonitor({
  enableLog: true,           // 是否打印日志
  enableReport: true,        // 是否上报
  reportUrl: '/api/performance', // 上报地址
  customHandler: (metric) => {
    // 自定义处理逻辑
    console.log('收到指标:', metric)
    
    // 例如：发送到第三方分析平台
    if (metric.rating === 'poor') {
      // 性能较差时发送告警
      sendAlert(`性能指标 ${metric.name} 较差: ${metric.value}`)
    }
  },
})
```

### 3. 在组件中使用

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getPerformanceMonitor } from '@/utils/performance'

const performanceScore = ref(0)

onMounted(() => {
  const monitor = getPerformanceMonitor()
  
  if (monitor) {
    // 获取所有指标
    const metrics = monitor.getMetrics()
    console.log('所有指标:', metrics)
    
    // 获取单个指标
    const lcp = monitor.getMetric('LCP')
    if (lcp) {
      console.log('LCP 值:', lcp.value)
      console.log('LCP 评级:', lcp.rating)
    }
    
    // 获取综合评分 (0-100)
    performanceScore.value = monitor.getScore()
  }
})
</script>
```

---

## 📱 展示性能监控面板

我们提供了一个可视化组件 `performance-monitor.vue`：

### 在路由中使用

```typescript
// router/index.ts
{
  path: '/performance',
  component: () => import('@/components/performance-monitor.vue'),
  meta: { title: '性能监控' },
}
```

### 在页面中使用

```vue
<template>
  <div>
    <h1>我的应用</h1>
    <PerformanceMonitor />
  </div>
</template>

<script setup lang="ts">
import PerformanceMonitor from '@/components/performance-monitor.vue'
</script>
```

---

## 📤 数据上报

### 服务端接口示例

```typescript
// Node.js + Express
app.post('/api/performance', (req, res) => {
  const {
    name,      // 指标名称
    value,     // 指标值
    rating,    // 评级
    url,       // 页面 URL
    userAgent, // 用户代理
    timestamp, // 时间戳
  } = req.body

  // 存储到数据库
  await db.collection('performance').insertOne({
    name,
    value,
    rating,
    url,
    userAgent,
    timestamp,
    date: new Date(),
  })

  res.json({ success: true })
})
```

### 上报数据格式

```json
{
  "name": "LCP",
  "value": 1234.5,
  "rating": "good",
  "delta": 0,
  "id": "v3-1234567890-1234567890",
  "navigationType": "navigate",
  "url": "https://example.com/page",
  "userAgent": "Mozilla/5.0...",
  "timestamp": 1699999999999
}
```

---

## 🎯 性能优化建议

### LCP 优化（最大内容绘制）

**问题：**页面最大元素加载慢

**解决方案：**
- ✅ 使用 CDN 加速资源加载
- ✅ 优化图片（使用 WebP 格式、压缩、懒加载）
- ✅ 移除阻塞渲染的资源
- ✅ 预加载关键资源 `<link rel="preload">`
- ✅ 使用服务端渲染 (SSR)

```html
<!-- 预加载关键图片 -->
<link rel="preload" as="image" href="hero.jpg">

<!-- 使用现代图片格式 -->
<picture>
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero" loading="lazy">
</picture>
```

### FID 优化（首次输入延迟）

**问题：**用户点击后响应慢

**解决方案：**
- ✅ 拆分长任务（超过 50ms）
- ✅ 使用 Web Worker 处理耗时计算
- ✅ 延迟加载第三方脚本
- ✅ 使用 `requestIdleCallback`

```typescript
// 拆分长任务
async function processLargeData(data) {
  const chunkSize = 100
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize)
    processChunk(chunk)
    
    // 让出主线程
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}

// 使用 Web Worker
const worker = new Worker('./worker.js')
worker.postMessage(heavyData)
worker.onmessage = (e) => {
  console.log('结果:', e.data)
}
```

### CLS 优化（累积布局偏移）

**问题：**页面元素移动导致误点击

**解决方案：**
- ✅ 为图片和视频设置宽高
- ✅ 为动态内容预留空间
- ✅ 避免在现有内容上方插入内容
- ✅ 使用 `transform` 而非位置属性做动画

```vue
<template>
  <!-- ❌ 错误：没有设置尺寸 -->
  <img src="photo.jpg" alt="Photo">

  <!-- ✅ 正确：设置宽高 -->
  <img src="photo.jpg" alt="Photo" width="800" height="600">

  <!-- ✅ 正确：使用 aspect-ratio -->
  <img src="photo.jpg" alt="Photo" style="aspect-ratio: 16/9; width: 100%;">
</template>

<style>
/* ✅ 为广告位预留空间 */
.ad-container {
  min-height: 250px;
  background: #f0f0f0;
}
</style>
```

### TTFB 优化（首字节时间）

**问题：**服务器响应慢

**解决方案：**
- ✅ 使用 CDN
- ✅ 启用 HTTP/2 或 HTTP/3
- ✅ 优化服务器配置
- ✅ 使用缓存策略
- ✅ 减少重定向

```typescript
// Vite 配置示例
export default defineConfig({
  server: {
    // 启用 HTTP/2
    https: true,
  },
  build: {
    // 启用压缩
    minify: 'terser',
  },
})
```

### INP 优化（交互到下一次绘制）

**问题：**交互响应延迟

**解决方案：**
- ✅ 优化事件处理函数
- ✅ 使用防抖和节流
- ✅ 避免在交互中执行长任务
- ✅ 使用虚拟滚动

```typescript
// 防抖
import { useDebounceFn } from '@vueuse/core'

const debouncedSearch = useDebounceFn((query) => {
  search(query)
}, 300)

// 节流
import { useThrottleFn } from '@vueuse/core'

const throttledScroll = useThrottleFn(() => {
  handleScroll()
}, 100)
```

---

## 🔍 监控最佳实践

### 1. 分环境监控

```typescript
// 开发环境：打印详细日志
if (import.meta.env.DEV) {
  setupPerformanceMonitor({
    enableLog: true,
    enableReport: false,
  })
}

// 生产环境：上报到服务器
if (import.meta.env.PROD) {
  setupPerformanceMonitor({
    enableLog: false,
    enableReport: true,
    reportUrl: '/api/performance',
  })
}
```

### 2. 采样上报（减少服务器压力）

```typescript
setupPerformanceMonitor({
  enableReport: true,
  reportUrl: '/api/performance',
  customHandler: (metric) => {
    // 只上报 10% 的用户数据
    if (Math.random() < 0.1) {
      // 执行上报
      return true
    }
    // 不上报
    return false
  },
})
```

### 3. 设置告警

```typescript
import { PERFORMANCE_THRESHOLDS } from '@/utils/performance'

setupPerformanceMonitor({
  customHandler: (metric) => {
    const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS]
    
    if (threshold && metric.value > threshold.poor) {
      // 发送告警
      sendAlert({
        type: 'performance',
        metric: metric.name,
        value: metric.value,
        threshold: threshold.poor,
        url: location.href,
      })
    }
  },
})
```

---

## 📚 参考资源

- [Web Vitals 官方文档](https://web.dev/vitals/)
- [web-vitals npm 包](https://github.com/GoogleChrome/web-vitals)
- [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 🎉 总结

通过集成 Web Vitals，你可以：

1. ✅ **实时监控**页面性能
2. ✅ **量化评估**用户体验
3. ✅ **及时发现**性能问题
4. ✅ **数据驱动**优化决策

记住：**好的性能是好的用户体验的基础！** 🚀

