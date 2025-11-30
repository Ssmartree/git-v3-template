import Loading from '@/components/loading/Loading.vue'
// utils/loading.ts
import { createVNode, render } from 'vue'

let container: HTMLElement | null = null

export function showLoading(text = '加载中...') {
  if (container)
    return // 已存在
  container = document.createElement('div')
  document.body.appendChild(container)
  const vnode = createVNode(Loading, { visible: true, fullscreen: true, text })
  render(vnode, container)
}

export function hideLoading() {
  if (container) {
    render(null, container)
    document.body.removeChild(container)
    container = null
  }
}
