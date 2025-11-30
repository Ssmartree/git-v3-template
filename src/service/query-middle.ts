import { usePermissionStore } from '@/stores/permission'
import { encrypt } from '@/utils/crypto'
import axios from 'axios'
import { type QueryParams, QueryType, registerRequestInterceptors, registerResponseInterceptors } from './interceptors'

const queryMiddlePreEntity = axios.create({
  baseURL: '/brdcontrol-service/data/prep',
  timeout: 30000,
  method: 'post',
  headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8;' },
})
const queryMiddleEntity = axios.create({
  baseURL: '/brdcontrol-service/data/query',
  timeout: 30000,
  method: 'post',
  headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8;' },
})

registerRequestInterceptors(queryMiddlePreEntity)
registerRequestInterceptors(queryMiddleEntity)
registerResponseInterceptors(queryMiddlePreEntity, QueryType.PREP)
registerResponseInterceptors(queryMiddleEntity, QueryType.MIDDLE)

export async function queryMiddle<T>({ sql }: QueryParams): Promise<T> {
  const permissionStore = usePermissionStore()
  await permissionStore.checkSqlPermission(sql)

  const { queryId } = await queryMiddlePreEntity({
    data: {
      prepParam: encrypt(JSON.stringify({
        directQuerySQL: sql,
        directSQLDataSource: 'presto',
        webModuleId: 9007,
      })),
    },
  }) as { queryId: string }

  return queryMiddleEntity({
    data: {
      queryParam: encrypt(JSON.stringify({
        startPosi: 1,
        endPosi: 500,
        queryId,
      }),
      ),
    },
  })
}
