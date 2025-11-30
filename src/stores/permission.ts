import { getUserPermissionAPI } from '@/service/api'

// tips：如果需要判断某个权限，调用await permissionStore.checkPermission() 以确保调用时权限有值
export const usePermissionStore = defineStore('permission', () => {
  // 目前只定义了如下权限，后续可根据实际按照接口返回的数据添加
  /** 权限英文名对应的中文名 */
  const permissionMap: Record<keyof Permission, string> = { query: '查询', add: '新增', delete: '删除', modify: '修改', importFlag: '导入', export: '导出' }
  /** 当前用户的权限 */
  const permission = ref<Permission>()
  /** 权限请求 Promise */
  let permissionPromise: Promise<Permission> | null = null

  /** 获取当前用户的权限 */
  const getPermission = async () => {
    if (import.meta.env.DEV)
      return permission.value = Object.fromEntries(Object.keys(permissionMap).map(key => [key, true])) as unknown as Permission

    if (permissionPromise)
      return permissionPromise

    permissionPromise = (async () => {
      const res = await getUserPermissionAPI()
      permission.value = res
      permissionPromise = null
      return res
    })()
  }
  getPermission()

  /** 检查当前用户是否有某种权限 */
  const checkPermission = async (type: keyof Permission) => {
    if (!permission.value)
      await getPermission()
    if (permission.value?.[type])
      return

    const tip = `您暂无${permissionMap[type]}权限`
    window.$message.error(tip)
    // 抛出错误 -> 中断 调用函数 的后续代码执行
    throw new Error(tip)
  }

  const sqlMap: Record<string, keyof Permission> = {
    select: 'query',
    insert: 'add',
    delete: 'delete',
    update: 'modify',
  }
  /** sql语句的自动权限校验 */
  const checkSqlPermission = async (sql: string) => await checkPermission(sqlMap[sql.slice(0, 6).toLowerCase()])

  return { permission, checkPermission, checkSqlPermission }
})
