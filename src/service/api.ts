import { queryMiddle } from './query-middle'
import { queryMysql } from './query-mysql'
import { queryPermission } from './query-permission'

export function getUserPermissionAPI() {
  return queryPermission<Permission>()
}

export function queryMysqlAPI() {
  const sql = `select * from cfg_tob_dnnproject_mgr`

  return queryMysql<DnnProjects>({ sql })
}

export function queryMiddleAPI() {
  const sql = `select ROW_NUMBER() OVER() AS row_num,  * from prestat.mv_st_s_popapp_15min limit 4`

  return queryMiddle<PopApps>({ sql })
}
