import type { AxiosRequestConfig } from 'axios'
import instance, { generateRequestKey } from './instance'

/**
 * 请求方法封装
 */
async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  // 处理缓存  按需开启缓存 是个“可选增强”，而不是“默认行为”。
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
      const result = await instance.request<any, T>(config)
      if (config.cache) {
        const cacheKey = config.cacheKey || generateRequestKey(config)
        const cacheTime = config.cacheTime || 60 * 5
        const cacheData = {
          data: result,
          expire: Date.now() + cacheTime * 1000,
        }
        localStorage.setItem(`http_cache_${cacheKey}`, JSON.stringify(cacheData))
      }
      return result
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
  get: <T = any>(url: string, params?: object, config?: AxiosRequestConfig) =>
    request<T>({ method: 'get', url, params, ...config }),

  post: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) =>
    request<T>({ method: 'post', url, data, ...config }),

  put: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) =>
    request<T>({ method: 'put', url, data, ...config }),

  delete: <T = any>(url: string, params?: object, config?: AxiosRequestConfig) =>
    request<T>({ method: 'delete', url, params, ...config }),

  download: (url: string, params?: object, config?: AxiosRequestConfig) =>
    request<Blob>({
      method: 'get',
      url,
      params,
      responseType: 'blob',
      ...config,
    }),

  upload: <T = any>(url: string, file: File | FormData, config?: AxiosRequestConfig) => {
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
