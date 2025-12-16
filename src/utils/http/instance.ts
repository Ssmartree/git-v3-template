import type { AxiosError, AxiosRequestConfig, AxiosResponse, Canceler } from 'axios'
import { showToast } from '@/components/Toast'
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import qs from 'qs'

// /**
//  * 扩展配置选项
//  */
// export interface HttpRequestConfig extends AxiosRequestConfig {
//   showLoading?: boolean // 是否显示全局loading
//   loadingTarget?: string // 局部loading的目标元素
//   showErrorMessage?: boolean // 是否显示错误提示
//   cancelRequest?: boolean // 是否取消重复请求
//   cache?: boolean // 是否缓存数据
//   cacheKey?: string // 缓存key
//   cacheTime?: number // 缓存时间（秒）
//   retry?: number // 重试次数
//   retryDelay?: number // 重试延迟
// }
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// --- 重复请求控制 ---
const pendingMap = new Map<string, Canceler>()

/**
 * 生成请求Key
 */
export function generateRequestKey(config: AxiosRequestConfig): string {
  const { method, url, params, data } = config
  return [method, url, qs.stringify(params), qs.stringify(data)].join('&')
}

/**
 * 添加请求到pendingMap
 */
function addPendingRequest(config: AxiosRequestConfig): void {
  if (config.cancelRequest === false)
    return
  const requestKey = generateRequestKey(config)
  config.cancelToken = new axios.CancelToken((cancel) => {
    if (!pendingMap.has(requestKey))
      pendingMap.set(requestKey, cancel)
  })
}

/**
 * 移除请求从pendingMap
 */
function removePendingRequest(config: AxiosRequestConfig): void {
  if (config.cancelRequest === false)
    return
  const key = generateRequestKey(config)
  const cancel = pendingMap.get(key)
  if (cancel) {
    cancel(key)
    pendingMap.delete(key)
  }
}

// --- 拦截器 ---
instance.interceptors.request.use(
  (config) => {
    const appStore = useAppStore() as any
    const userStore = useUserStore() as any

    // Loading
    if (config.showLoading !== false)
      appStore.setLoading(true)
    if (config.loadingTarget)
      appStore.addLoadingTarget(config.loadingTarget)

    // 防重复
    removePendingRequest(config)
    addPendingRequest(config)

    // Token
    const token = userStore.token as string | undefined
    if (token)
      config.headers = { ...(config.headers ?? {}), Authorization: `Bearer ${token}` } as any

    return config
  },
  (error: AxiosError) => {
    ; (useAppStore() as any).setLoading(false)
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const appStore = useAppStore() as any
    const config = response.config

    // 请求完成后移除请求
    removePendingRequest(config)

    // 关闭loading
    if (config.showLoading !== false) {
      appStore.setLoading(false)
    }

    // 关闭局部loading
    if (config.loadingTarget) {
      appStore.removeLoadingTarget(config.loadingTarget)
    }

    // 处理二进制数据
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return response.data
    }

    const { code, data, message } = response.data

    // 业务逻辑错误
    if (code !== 0 && code !== 200) {
      if (config.showErrorMessage !== false)
        showToast(message || '请求失败', 'error')
      return Promise.reject(new Error(message || '请求失败'))
    }

    // 缓存数据
    if (config.cache) {
      const cacheKey = config.cacheKey || generateRequestKey(config)
      const cacheTime = config.cacheTime || 60 * 5 // 默认缓存5分钟
      const cacheData = {
        data,
        expire: Date.now() + cacheTime * 1000,
      }
      localStorage.setItem(`http_cache_${cacheKey}`, JSON.stringify(cacheData))
    }

    return data
  },
  (error: AxiosError) => {
    const appStore = useAppStore() as any
    const userStore = useUserStore() as any

    // 关闭所有loading
    appStore.setLoading(false)
    appStore.clearLoadingTargets()

    // 取消请求不报错
    if (axios.isCancel(error))
      return Promise.reject(error)
    const errorConfig = (error as any).config || {}

    // 请求完成后移除请求
    if (errorConfig)
      removePendingRequest(errorConfig)

    const response = (error as any).response as AxiosResponse || {}
    // 处理401未授权
    if (response?.status === 401) {
      userStore.logout()
      router.push('/login')
      showToast('登录已过期，请重新登录', 'warning')
      return Promise.reject(error)
    }

    // 处理网络错误
    if (!navigator.onLine) {
      showToast('网络断开，请检查连接', 'error')
      return Promise.reject(new Error('网络断开，请检查连接'))
    }

    // 处理超时
    const message = (error as any).message || '请求失败'
    if (message.includes('timeout')) {
      showToast('请求超时，请稍后重试', 'error')
      return Promise.reject(new Error('请求超时，请稍后重试'))
    }

    // 处理其他错误
    if (errorConfig?.showErrorMessage !== false)
      showToast(message, 'error')

    return Promise.reject(error)
  },
)

export default instance
