<script setup lang="ts">
import { componentsMap } from '@/utils/componentsMap'
import { defineAsyncComponent, ref } from 'vue'

const props = defineProps<{
  component: string
}>()

// 定义异步组件
const asyncComponent = defineAsyncComponent(componentsMap[props.component])

const isVisible = ref(false)

function toggleComponent() {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <div>
    <h1>异步组件加载示例</h1>
    <button @click="toggleComponent">
      切换组件
    </button>
    <component :is="asyncComponent" v-if="isVisible" />
  </div>
</template>
