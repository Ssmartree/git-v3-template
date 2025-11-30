import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    showLoading?: boolean
    loadingTarget?: string
    showErrorMessage?: boolean
    cancelRequest?: boolean
    cache?: boolean
    cacheKey?: string
    cacheTime?: number
    retry?: number
    retryDelay?: number
  }

  interface InternalAxiosRequestConfig {
    showLoading?: boolean
    loadingTarget?: string
    showErrorMessage?: boolean
    cancelRequest?: boolean
    cache?: boolean
    cacheKey?: string
    cacheTime?: number
    retry?: number
    retryDelay?: number
  }
}
