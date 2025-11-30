import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 全局loading状态
  const loading = ref<boolean>(false)

  // 局部loading状态(目标DOM的id或class)
  const loadingTargets = ref<Set<string>>(new Set())

  // 侧边栏状态
  const sidebarCollapsed = ref<boolean>(false)

  // 设置全局loading
  const setLoading = (status: boolean) => {
    loading.value = status
  }

  // 添加局部loading
  const addLoadingTarget = (target: string) => {
    loadingTargets.value.add(target)
  }

  // 移除局部loading
  const removeLoadingTarget = (target: string) => {
    loadingTargets.value.delete(target)
  }

  // 清空所有局部loading
  const clearLoadingTargets = () => {
    loadingTargets.value.clear()
  }

  // 切换侧边栏状态
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    loading,
    loadingTargets,
    sidebarCollapsed,
    setLoading,
    addLoadingTarget,
    removeLoadingTarget,
    clearLoadingTargets,
    toggleSidebar,
  }
}, {
  persist: {
    // paths: ['sidebarCollapsed'],
  },
})
