// utils/componentsMap.ts
import type { Component } from 'vue'

type AsyncComponent = () => Promise<Component>

interface ComponentsMap {
  [key: string]: AsyncComponent
}
interface ComponentsMapKeys {
  [key: string]: string
}

export const componentsMap: ComponentsMap = {
  defineAsyncComponent: () => import('@/views/home/components/Lazy/defineAsyncComponent.vue'),
  defineLazyComponent: () => import('@/views/home/components/Lazy/defineLazyComponent.vue'),
  // 添加更多组件
} as const
export const componentsMapKeys: ComponentsMapKeys = {
  defineLazyComponent: 'views/home/components/Lazy/defineLazyComponent',
}
