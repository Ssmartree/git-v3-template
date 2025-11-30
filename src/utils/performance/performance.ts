/**
 * Web Vitals 性能监控工具
 *
 * Core Web Vitals (核心 Web 指标):
 * - LCP (Largest Contentful Paint) - 最大内容绘制
 * - FID (First Input Delay) - 首次输入延迟
 * - CLS (Cumulative Layout Shift) - 累积布局偏移
 *
 * Other Vitals (其他指标):
 * - FCP (First Contentful Paint) - 首次内容绘制
 * - TTFB (Time to First Byte) - 首字节时间
 * - INP (Interaction to Next Paint) - 交互到下一次绘制
 */

import type { CLSMetric, FCPMetric, INPMetric, LCPMetric, Metric, TTFBMetric } from 'web-vitals'
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

/**
 * 性能指标数据
 */
export interface PerformanceData {
  name: string // 指标名称
  value: number // 指标值
  rating: 'good' | 'needs-improvement' | 'poor' // 评级
  delta: number // 变化量
  id: string // 唯一标识
  navigationType?: string // 导航类型
}

/**
 * 性能监控配置
 */
export interface PerformanceConfig {
  reportUrl?: string // 上报地址
  enableLog?: boolean // 是否打印日志
  enableReport?: boolean // 是否上报
  customHandler?: (metric: PerformanceData) => void // 自定义处理函数
}

/**
 * 性能监控类
 */
export class PerformanceMonitor {
  private config: PerformanceConfig
  private metrics: Map<string, PerformanceData> = new Map()

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enableLog: true,
      enableReport: false,
      ...config,
    }
  }

  /**
   * 启动性能监控
   */
  start() {
    // 监控 LCP - 最大内容绘制（应 < 2.5s）
    onLCP(this.handleMetric.bind(this))

    // 监控 CLS - 累积布局偏移（应 < 0.1）
    onCLS(this.handleMetric.bind(this))

    // 监控 FCP - 首次内容绘制（应 < 1.8s）
    onFCP(this.handleMetric.bind(this))

    // 监控 TTFB - 首字节时间（应 < 800ms）
    onTTFB(this.handleMetric.bind(this))

    // 监控 INP - 交互到下一次绘制（应 < 200ms）
    onINP(this.handleMetric.bind(this))
  }

  /**
   * 处理性能指标
   */
  private handleMetric(metric: Metric) {
    const data: PerformanceData = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    }

    // 保存指标
    this.metrics.set(metric.name, data)

    // 打印日志
    if (this.config.enableLog) {
      this.logMetric(data)
    }

    // 自定义处理
    if (this.config.customHandler) {
      this.config.customHandler(data)
    }

    // 上报数据
    if (this.config.enableReport && this.config.reportUrl) {
      this.reportMetric(data)
    }
  }

  /**
   * 打印性能指标
   */
  private logMetric(data: PerformanceData) {
    const emoji = this.getRatingEmoji(data.rating)
    const color = this.getRatingColor(data.rating)
    const unit = this.getMetricUnit(data.name)
    const formattedValue = this.formatValue(data.value, data.name)

    console.log(
      `%c[Web Vitals] ${emoji} ${data.name}: ${formattedValue}${unit}`,
      `color: ${color}; font-weight: bold;`,
      `\n评级: ${data.rating}`,
      `\n导航类型: ${data.navigationType || 'navigate'}`,
    )
  }

  /**
   * 上报性能指标
   */
  private async reportMetric(data: PerformanceData) {
    if (!this.config.reportUrl)
      return

    try {
      // 使用 sendBeacon 或 fetch 上报
      const body = JSON.stringify({
        ...data,
        url: location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      })

      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.config.reportUrl, body)
      }
      else {
        await fetch(this.config.reportUrl, {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        })
      }
    }
    catch (error) {
      console.error('[Web Vitals] 上报失败:', error)
    }
  }

  /**
   * 获取评级表情
   */
  private getRatingEmoji(rating: string): string {
    const emojiMap: Record<string, string> = {
      'good': '✅',
      'needs-improvement': '⚠️',
      'poor': '❌',
    }
    return emojiMap[rating] || '❓'
  }

  /**
   * 获取评级颜色
   */
  private getRatingColor(rating: string): string {
    const colorMap: Record<string, string> = {
      'good': '#0cce6b',
      'needs-improvement': '#ffa400',
      'poor': '#ff4e42',
    }
    return colorMap[rating] || '#666'
  }

  /**
   * 获取指标单位
   */
  private getMetricUnit(name: string): string {
    if (name === 'CLS')
      return ''
    return 'ms'
  }

  /**
   * 格式化指标值
   */
  private formatValue(value: number, name: string): string {
    if (name === 'CLS') {
      return value.toFixed(3)
    }
    return value.toFixed(0)
  }

  /**
   * 获取所有指标
   */
  getMetrics(): Map<string, PerformanceData> {
    return this.metrics
  }

  /**
   * 获取单个指标
   */
  getMetric(name: string): PerformanceData | undefined {
    return this.metrics.get(name)
  }

  /**
   * 获取性能评分（0-100）
   */
  getScore(): number {
    const metrics = Array.from(this.metrics.values())
    if (metrics.length === 0)
      return 0

    const scores = metrics.map((metric) => {
      if (metric.rating === 'good')
        return 100
      if (metric.rating === 'needs-improvement')
        return 50
      return 0
    })

    const sum = scores.reduce((a: number, b: number) => a + b, 0)
    return Math.round(sum / scores.length)
  }
}

/**
 * 创建并启动性能监控（单例模式）
 */
let monitorInstance: PerformanceMonitor | null = null

export function setupPerformanceMonitor(config?: PerformanceConfig) {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor(config)
    monitorInstance.start()
  }
  return monitorInstance
}

/**
 * 获取性能监控实例
 */
export function getPerformanceMonitor(): PerformanceMonitor | null {
  return monitorInstance
}

/**
 * 快速启动监控（开发环境自动打印，生产环境上报）
 */
export function quickStartMonitor(reportUrl?: string) {
  const isDev = import.meta.env.DEV

  return setupPerformanceMonitor({
    enableLog: isDev,
    enableReport: !isDev,
    reportUrl: reportUrl || '/api/performance',
  })
}

/**
 * 性能指标阈值（根据 Google 标准）
 */
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    good: 2500,
    poor: 4000,
  },
  FID: {
    good: 100,
    poor: 300,
  },
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  FCP: {
    good: 1800,
    poor: 3000,
  },
  TTFB: {
    good: 800,
    poor: 1800,
  },
  INP: {
    good: 200,
    poor: 500,
  },
}

/**
 * 导出类型
 */
export type {
  CLSMetric,
  FCPMetric,
  INPMetric,
  LCPMetric,
  Metric,
  TTFBMetric,
}
