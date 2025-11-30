import { moduleId } from '@/utils'
import axios from 'axios'
import { QueryType, registerResponseInterceptors } from './interceptors'

const queryPermissionEntity = axios.create({
  baseURL: `/brdcontrol-service/resource/right/${moduleId}`,
  timeout: 30000,
  method: 'post',
})

registerResponseInterceptors(queryPermissionEntity, QueryType.PERMISSION)

export function queryPermission<T>(): Promise<T> {
  return queryPermissionEntity({
    data: {
      requestParams: JSON.stringify({
        serviceMethod: '/api/rights/modelRights',
        serviceParam: `moduleId=${moduleId}`,
        serviceName: 'bdv-web',
        requesttype: 'get',
      }),
    },
  })
}
