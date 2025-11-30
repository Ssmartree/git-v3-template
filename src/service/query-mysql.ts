import { usePermissionStore } from '@/stores/permission'
import { encrypt } from '@/utils/crypto'
import axios from 'axios'
import { type QueryParams, QueryType, registerRequestInterceptors, registerResponseInterceptors } from './interceptors'

const queryMysqlEntity = axios.create({
  baseURL: '/brdcontrol-service/getRequestServer',
  timeout: 30000,
  method: 'post',
  headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
})

registerRequestInterceptors(queryMysqlEntity)
registerResponseInterceptors(queryMysqlEntity, QueryType.MYSQL)

export async function queryMysql<T>({ sql, type = 5 }: QueryParams): Promise<T> {
  const permissionStore = usePermissionStore()
  await permissionStore.checkSqlPermission(sql)

  return queryMysqlEntity({
    data: {
      requestParams: JSON.stringify({
        serviceName: 'brd-mysql-8086',
        serviceMethod: `/brdmysql/executeprt`,
        serviceParam: encrypt(JSON.stringify({ type: `${type}`, dataSourceType: '1', sql })),
        requesttype: 'post',
      }),
    },
  })
}
