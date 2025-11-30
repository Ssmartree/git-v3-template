import Toast from '@/components/Toast/Toast.vue'
import { createVNode, render } from 'vue'

let toastInstance: any = null

export type ToastType = 'info' | 'success' | 'warning' | 'error'

interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

export function showToast(message: string | ToastOptions, type: ToastType = 'info'): void {
  // 关闭已存在的Toast
  if (toastInstance) {
    closeToast()
  }

  // 处理参数
  const options: ToastOptions = typeof message === 'string'
    ? { message, type }
    : { ...message }

  // 创建容器
  const container = document.createElement('div')
  container.className = 'toast-container'

  // 创建VNode
  const vnode = createVNode(Toast, {
    ...options,
    // 销毁事件通知
    onDestroy: () => {
      render(null, container)
      document.body.removeChild(container)
      toastInstance = null
      options.onClose?.()
    },
  })

  // 渲染
  render(vnode, container)
  document.body.appendChild(container)

  // 保存实例
  toastInstance = vnode.component
}

export function closeToast(): void {
  if (toastInstance) {
    toastInstance.exposed.close()
  }
}
