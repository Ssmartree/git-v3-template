<template>
  <div class="performance-monitor">
    <h2>🚀 Web Vitals 性能监控</h2>
    
    <div v-if="score !== null" class="score-card" :class="scoreClass">
      <div class="score-value">{{ score }}</div>
      <div class="score-label">性能评分</div>
    </div>

    <div class="metrics-grid">
      <!-- LCP - 最大内容绘制 -->
      <div v-if="metrics.LCP" class="metric-card" :class="getRatingClass(metrics.LCP.rating)">
        <div class="metric-icon">🎨</div>
        <div class="metric-name">LCP</div>
        <div class="metric-desc">最大内容绘制</div>
        <div class="metric-value">{{ formatValue(metrics.LCP.value, 'LCP') }}ms</div>
        <div class="metric-rating">{{ getRatingText(metrics.LCP.rating) }}</div>
        <div class="metric-threshold">目标: &lt; 2500ms</div>
      </div>

      <!-- CLS - 累积布局偏移 -->
      <div v-if="metrics.CLS" class="metric-card" :class="getRatingClass(metrics.CLS.rating)">
        <div class="metric-icon">📐</div>
        <div class="metric-name">CLS</div>
        <div class="metric-desc">累积布局偏移</div>
        <div class="metric-value">{{ formatValue(metrics.CLS.value, 'CLS') }}</div>
        <div class="metric-rating">{{ getRatingText(metrics.CLS.rating) }}</div>
        <div class="metric-threshold">目标: &lt; 0.1</div>
      </div>

      <!-- FCP - 首次内容绘制 -->
      <div v-if="metrics.FCP" class="metric-card" :class="getRatingClass(metrics.FCP.rating)">
        <div class="metric-icon">🎭</div>
        <div class="metric-name">FCP</div>
        <div class="metric-desc">首次内容绘制</div>
        <div class="metric-value">{{ formatValue(metrics.FCP.value, 'FCP') }}ms</div>
        <div class="metric-rating">{{ getRatingText(metrics.FCP.rating) }}</div>
        <div class="metric-threshold">目标: &lt; 1800ms</div>
      </div>

      <!-- TTFB - 首字节时间 -->
      <div v-if="metrics.TTFB" class="metric-card" :class="getRatingClass(metrics.TTFB.rating)">
        <div class="metric-icon">🌐</div>
        <div class="metric-name">TTFB</div>
        <div class="metric-desc">首字节时间</div>
        <div class="metric-value">{{ formatValue(metrics.TTFB.value, 'TTFB') }}ms</div>
        <div class="metric-rating">{{ getRatingText(metrics.TTFB.rating) }}</div>
        <div class="metric-threshold">目标: &lt; 800ms</div>
      </div>

      <!-- INP - 交互到下一次绘制 -->
      <div v-if="metrics.INP" class="metric-card" :class="getRatingClass(metrics.INP.rating)">
        <div class="metric-icon">👆</div>
        <div class="metric-name">INP</div>
        <div class="metric-desc">交互到绘制</div>
        <div class="metric-value">{{ formatValue(metrics.INP.value, 'INP') }}ms</div>
        <div class="metric-rating">{{ getRatingText(metrics.INP.rating) }}</div>
        <div class="metric-threshold">目标: &lt; 200ms</div>
      </div>
    </div>

    <div class="tips">
      <h3>💡 性能优化建议</h3>
      <ul>
        <li v-if="metrics.LCP?.rating !== 'good'">
          <strong>LCP 优化：</strong>优化图片加载、使用 CDN、启用懒加载
        </li>
        <li v-if="metrics.INP?.rating !== 'good'">
          <strong>INP 优化：</strong>拆分长任务、使用 Web Worker、减少 JavaScript 执行时间
        </li>
        <li v-if="metrics.CLS?.rating !== 'good'">
          <strong>CLS 优化：</strong>为图片和视频设置尺寸、避免在现有内容上方插入内容
        </li>
        <li v-if="metrics.TTFB?.rating !== 'good'">
          <strong>TTFB 优化：</strong>使用 CDN、启用 HTTP/2、优化服务器响应时间
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getPerformanceMonitor } from '../utils/performance/performance'
import type { PerformanceData } from '../utils/performance/performance'

const metrics = ref<Record<string, PerformanceData>>({})
const score = ref<number | null>(null)

const scoreClass = computed(() => {
  if (score.value === null)
    return ''
  if (score.value >= 80)
    return 'score-good'
  if (score.value >= 50)
    return 'score-medium'
  return 'score-poor'
})

function updateMetrics() {
  const monitor = getPerformanceMonitor()
  if (!monitor)
    return

  const allMetrics = monitor.getMetrics()
  metrics.value = Object.fromEntries(allMetrics)
  score.value = monitor.getScore()
}

function getRatingClass(rating: string) {
  return `rating-${rating}`
}

function getRatingText(rating: string) {
  const textMap: Record<string, string> = {
    'good': '✅ 优秀',
    'needs-improvement': '⚠️ 待改进',
    'poor': '❌ 较差',
  }
  return textMap[rating] || rating
}

function formatValue(value: number, name: string) {
  if (name === 'CLS') {
    return value.toFixed(3)
  }
  return Math.round(value)
}

onMounted(() => {
  // 初始更新
  updateMetrics()

  // 定期更新指标（某些指标可能延迟上报）
  const timer = setInterval(updateMetrics, 1000)

  // 5秒后停止更新
  setTimeout(() => {
    clearInterval(timer)
  }, 5000)
})
</script>

<style scoped lang="scss">
/* stylelint-disable */
.performance-monitor {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
}

.score-card {
  width: 150px;
  height: 150px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 6px solid;
  
  &.score-good {
    border-color: #0cce6b;
    color: #0cce6b;
  }

  &.score-medium {
    border-color: #ffa400;
    color: #ffa400;
  }

  &.score-poor {
    border-color: #ff4e42;
    color: #ff4e42;
  }

  .score-value {
    font-size: 48px;
    font-weight: bold;
  }

  .score-label {
    font-size: 14px;
    margin-top: 5px;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  padding: 20px;
  border-radius: 12px;
  border: 2px solid;
  background: #fff;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  &.rating-good {
    border-color: #0cce6b;
  }

  &.rating-needs-improvement {
    border-color: #ffa400;
  }

  &.rating-poor {
    border-color: #ff4e42;
  }

  .metric-icon {
    font-size: 32px;
    margin-bottom: 10px;
  }

  .metric-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .metric-desc {
    font-size: 12px;
    color: #666;
    margin-bottom: 15px;
  }

  .metric-value {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .metric-rating {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .metric-threshold {
    font-size: 12px;
    color: #999;
  }
}

.tips {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;

  h3 {
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: bold;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;

      &:last-child {
        border-bottom: none;
      }

      strong {
        color: #333;
      }
    }
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .metric-card {
    background: #1a1a1a;
    color: #fff;
  }

  .metric-desc {
    color: #999 !important;
  }

  .tips {
    background: #1a1a1a;
    color: #fff;
  }
}
</style>

