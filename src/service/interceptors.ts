import type { AxiosInstance } from 'axios'
import { decrypt } from '@/utils/crypto'

export interface QueryParams {
  sql: string
  /** 5:自定义查询 6:自定义执行 */
  type?: 5 | 6
}
export enum QueryType {
  MYSQL = 'mysql',
  PREP = 'prep',
  MIDDLE = 'middle',
  PERMISSION = 'permission',
}

const specialErrMsgMap: Record<string, string> = {
  'timeout': '请求超时！请您稍后重试',
  'Network Error': '网络错误！请您稍后重试',
}

// 注册请求拦截器
export function registerRequestInterceptors(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(
    (config) => {
      return config
    },
    (err) => {
      return Promise.reject(err)
    },
  )
}

// 注册响应拦截器
export function registerResponseInterceptors(axiosInstance: AxiosInstance, type: QueryType) {
  axiosInstance.interceptors.response.use(
    (res) => {
      const { data } = res

      const relData = type === QueryType.MIDDLE ? JSON.parse(decrypt(data)) : data
      if (type === QueryType.PREP) {
        return relData
      }
      else if (relData.result) {
        if (type === QueryType.PERMISSION)
          return relData.result
        return type === QueryType.MYSQL
          ? relData.datalist
          : relData.datas.map((row: string[][]) => {
              const obj: Record<string, any> = {}
              relData.headers.forEach((field: Record<string, any>, index: number) => {
                obj[field.name] = row[index]
              })
              return obj
            })
      }

      window.$notification.error({
        content: '请求错误',
        meta: relData.msg,
        keepAliveOnHover: true,
      })
    },
    (err) => {
      const { status, message } = err

      const specialErrMsg = Object.keys(specialErrMsgMap).find(key => message.includes(key))
      if (specialErrMsg) {
        message.error(specialErrMsgMap[specialErrMsg])
      }
      else {
        checkStatus(status)
      }

      return Promise.reject(err)
    },
  )
}

// 状态码校验
const statusMap: Record<number, string> = {
  400: '请求失败！请您稍后重试',
  401: '登录失效！请您重新登录',
  403: '当前账号无权限访问！',
  404: '你所访问的资源不存在！',
  405: 'sid已失效或者请求方式错误！',
  408: '请求超时！请您稍后重试',
  500: '服务异常！',
  502: '网关错误！',
  503: '服务不可用！',
  504: '网关超时！',
}
export function checkStatus(status: number) {
  window.$message.error(statusMap[status] || '请求失败！')
}
