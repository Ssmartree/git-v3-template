import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { showToast } from '@/components/Toast'
import router from '@/router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import qs from 'qs'

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求映射表，用于取消重复请求
const pendingMap = new Map()

/**
 * 生成请求Key
 */
function generateRequestKey(config: AxiosRequestConfig): string {
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
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingMap.has(requestKey)) {
      pendingMap.set(requestKey, cancel)
    }
  })
}

/**
 * 移除请求从pendingMap
 */
function removePendingRequest(config: AxiosRequestConfig): void {
  if (config.cancelRequest === false)
    return

  const requestKey = generateRequestKey(config)
  if (pendingMap.has(requestKey)) {
    const cancelToken = pendingMap.get(requestKey)
    cancelToken(requestKey)
    pendingMap.delete(requestKey)
  }
}

// 添加请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const appStore = useAppStore() as any
    const userStore = useUserStore() as any

    // 显示全局loading
    if (config.showLoading !== false) {
      appStore.setLoading(true)
    }

    // 显示局部loading
    if (config.loadingTarget) {
      appStore.addLoadingTarget(config.loadingTarget)
    }

    // 取消重复请求
    removePendingRequest(config)
    addPendingRequest(config)

    // 添加token
    const token = userStore.token as string | undefined
    if (token) {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}` as any,
      } as any
    }

    return config
  },
  (error: AxiosError) => {
    const appStore = useAppStore() as any
    appStore.setLoading(false)
    return Promise.reject(error)
  },
)

// 添加响应拦截器
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
      if (config.showErrorMessage !== false) {
        showToast(message || '请求失败', 'error')
      }
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
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const config = error.config as HttpRequestConfig | undefined

    // 请求完成后移除请求
    if (config) {
      removePendingRequest(config)
    }

    // 处理401未授权
    if (error.response?.status === 401) {
      userStore.logout()
      router.push('/login')
      showToast('登录已过期，请重新登录', 'warning')
      return Promise.reject(error)
    }

    // 处理网络错误
    if (!navigator.onLine) {
      showToast('网络已断开，请检查网络连接', 'error')
      return Promise.reject(new Error('网络已断开，请检查网络连接'))
    }

    // 处理超时
    if (error.message.includes('timeout')) {
      showToast('请求超时，请稍后重试', 'error')
      return Promise.reject(new Error('请求超时，请稍后重试'))
    }

    // 处理其他错误
    if (config?.showErrorMessage !== false) {
      showToast(error.message || '请求失败', 'error')
    }

    return Promise.reject(error)
  },
)

/**
 * 扩展配置选项
 */
interface HttpRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean // 是否显示全局loading
  loadingTarget?: string // 局部loading的目标元素
  showErrorMessage?: boolean // 是否显示错误提示
  cancelRequest?: boolean // 是否取消重复请求
  cache?: boolean // 是否缓存数据
  cacheKey?: string // 缓存key
  cacheTime?: number // 缓存时间（秒）
  retry?: number // 重试次数
  retryDelay?: number // 重试延迟
}

/**
 * 请求方法封装
 */
async function request<T = any>(config: HttpRequestConfig): Promise<T> {
  // 处理缓存
  if (config.cache) {
    const cacheKey = config.cacheKey || generateRequestKey(config)
    const cacheData = localStorage.getItem(`http_cache_${cacheKey}`)

    if (cacheData) {
      try {
        const { data, expire } = JSON.parse(cacheData)
        // 缓存未过期
        if (expire > Date.now()) {
          return data as T
        }
        else {
          // 缓存已过期，删除缓存
          localStorage.removeItem(`http_cache_${cacheKey}`)
        }
      }
      catch (e) {
        console.error('缓存数据解析错误', e)
      }
    }
  }

  // 处理重试逻辑
  const { retry = 0, retryDelay = 300 } = config
  let retryCount = 0

  const executeRequest = async (): Promise<T> => {
    try {
      return await instance.request<any, T>(config)
    }
    catch (err) {
      if (retryCount < retry) {
        retryCount++
        // 延迟重试
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return executeRequest()
      }
      return Promise.reject(err)
    }
  }

  return executeRequest()
}

// 常用请求方法封装
const http = {
  get: <T = any>(url: string, params?: object, config?: HttpRequestConfig) =>
    request<T>({ method: 'get', url, params, ...config }),

  post: <T = any>(url: string, data?: object, config?: HttpRequestConfig) =>
    request<T>({ method: 'post', url, data, ...config }),

  put: <T = any>(url: string, data?: object, config?: HttpRequestConfig) =>
    request<T>({ method: 'put', url, data, ...config }),

  delete: <T = any>(url: string, params?: object, config?: HttpRequestConfig) =>
    request<T>({ method: 'delete', url, params, ...config }),

  download: (url: string, params?: object, config?: HttpRequestConfig) =>
    request<Blob>({
      method: 'get',
      url,
      params,
      responseType: 'blob',
      ...config,
    }),

  upload: <T = any>(url: string, file: File | FormData, config?: HttpRequestConfig) => {
    let formData: FormData

    if (file instanceof FormData) {
      formData = file
    }
    else {
      formData = new FormData()
      formData.append('file', file)
    }

    return request<T>({
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  },

  // 通用请求方法
  request,
}

export default http
