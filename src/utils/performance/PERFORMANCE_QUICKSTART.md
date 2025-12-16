# Web Vitals 快速开始 🚀

## ✅ 已完成集成

项目已经自动集成了 Web Vitals 性能监控！无需任何配置即可开始使用。

---

## 📊 查看性能监控

### 方法 1：查看浏览器控制台（推荐）

1. 运行项目：`pnpm dev`
2. 打开浏览器开发者工具（F12）
3. 在 Console 中会看到性能指标日志：

```
[Web Vitals] ✅ LCP: 1234ms
评级: good
导航类型: navigate

[Web Vitals] ✅ CLS: 0.05
评级: good
导航类型: navigate
```

### 方法 2：访问性能监控页面

访问 `http://localhost:5173/#/performance` 可以看到可视化的性能监控面板。

---

## 🎯 性能指标说明

| 指标     | 含义         | 目标值  | 评级标准                                 |
| -------- | ------------ | ------- | ---------------------------------------- |
| **LCP**  | 最大内容绘制 | < 2.5s  | 🟢 < 2.5s / 🟡 2.5-4s / 🔴 > 4s          |
| **CLS**  | 累积布局偏移 | < 0.1   | 🟢 < 0.1 / 🟡 0.1-0.25 / 🔴 > 0.25       |
| **FCP**  | 首次内容绘制 | < 1.8s  | 🟢 < 1.8s / 🟡 1.8-3s / 🔴 > 3s          |
| **TTFB** | 首字节时间   | < 800ms | 🟢 < 800ms / 🟡 800-1800ms / 🔴 > 1800ms |
| **INP**  | 交互到绘制   | < 200ms | 🟢 < 200ms / 🟡 200-500ms / 🔴 > 500ms   |

---

## 🔧 自定义配置

### 修改配置

编辑 `src/main.ts`：

```typescript
// 当前配置（开发环境打印日志，生产环境上报）
quickStartMonitor();

// 自定义配置
setupPerformanceMonitor({
  enableLog: true, // 是否打印日志
  enableReport: true, // 是否上报数据
  reportUrl: "/api/performance", // 上报地址
  customHandler: (metric) => {
    // 自定义处理逻辑
    console.log("收到指标:", metric);
  },
});
```

### 在组件中使用

```vue
<script setup lang="ts">
import { getPerformanceMonitor } from "@/utils/performance";

const monitor = getPerformanceMonitor();

// 获取所有指标
const metrics = monitor?.getMetrics();

// 获取单个指标
const lcp = monitor?.getMetric("LCP");

// 获取综合评分 (0-100)
const score = monitor?.getScore();
</script>
```

---

## 📤 生产环境上报

### 1. 修改上报地址

```typescript
// src/main.ts
quickStartMonitor("/api/your-endpoint");
```

### 2. 服务端接收数据

```typescript
// 数据格式
{
  name: "LCP",
  value: 1234.5,
  rating: "good",
  url: "https://example.com",
  userAgent: "...",
  timestamp: 1699999999999
}
```

---

## 🎨 添加性能监控面板到你的页面

```vue
<script setup lang="ts">
import PerformanceMonitor from "@/components/performance-monitor.vue";
</script>

<template>
  <div>
    <performance-monitor />
  </div>
</template>
```

---

## 📚 更多信息

- 详细文档：`src/utils/PERFORMANCE_EXAMPLE.md`
- 组件源码：`src/components/performance-monitor.vue`
- 工具源码：`src/utils/performance.ts`
- 示例页面：`src/views/performance/index.vue`

---

## 🐛 常见问题

**Q: 为什么没有看到所有指标？**

A: 某些指标需要特定的用户交互才会触发，例如 INP 需要用户点击页面。

**Q: 如何在生产环境禁用日志？**

A: `quickStartMonitor()` 会自动在生产环境禁用日志，只启用上报。

**Q: 指标评级是什么标准？**

A: 遵循 Google 的 Core Web Vitals 标准，详见 [web.dev/vitals](https://web.dev/vitals/)。

---

**开始监控你的应用性能吧！** ⚡
