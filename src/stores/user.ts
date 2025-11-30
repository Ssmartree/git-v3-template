// import type { LoginParams, UserInfo } from '@/types/user'
// import { getUserInfo, login, logout } from '@/api/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // const token = ref<string>(localStorage.getItem('token') || '')
  // const userInfo = ref<UserInfo | null>(null)
  // const permissions = ref<string[]>([])
  // const roles = ref<string[]>([])

  // // 登录
  // const loginAction = async (params: LoginParams) => {
  //   try {
  //     const data = await login(params)
  //     token.value = data.token
  //     localStorage.setItem('token', data.token)
  //     await getUserInfoAction()
  //     return data
  //   }
  //   catch (error) {
  //     return Promise.reject(error)
  //   }
  // }

  // // 获取用户信息
  // const getUserInfoAction = async () => {
  //   try {
  //     const data = await getUserInfo()
  //     userInfo.value = data
  //     permissions.value = data.permissions || []
  //     roles.value = data.roles || []
  //     return data
  //   }
  //   catch (error) {
  //     return Promise.reject(error)
  //   }
  // }

  // // 退出登录
  // const logoutAction = async () => {
  //   try {
  //     await logout()
  //   }
  //   finally {
  //     resetUserState()
  //   }
  // }

  // // 重置用户状态
  // const resetUserState = () => {
  //   token.value = ''
  //   userInfo.value = null
  //   permissions.value = []
  //   roles.value = []
  //   localStorage.removeItem('token')
  // }

  // // 检查是否有权限
  // const hasPermission = (permission: string) => {
  //   return permissions.value.includes(permission)
  // }

  // // 检查是否有某个角色
  // const hasRole = (role: string) => {
  //   return roles.value.includes(role)
  // }

  // return {
  //   token,
  //   userInfo,
  //   permissions,
  //   roles,
  //   loginAction,
  //   logoutAction,
  //   getUserInfoAction,
  //   hasPermission,
  //   hasRole,
  //   resetUserState,
  // }
})
