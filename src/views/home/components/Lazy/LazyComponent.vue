<script setup lang="ts">
import { componentsMap, componentsMapKeys } from '@/utils/componentsMap'

const props = defineProps<{
  component: string
}>()

const isVisible = ref(false)
const asyncComponent = defineAsyncComponent(componentsMap[props.component])

const target = ref<HTMLElement | null>(null)

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      isVisible.value = true
      observer.unobserve(entry.target)
    }
  })
})

onMounted(() => {
  if (target.value) {
    observer.observe(target.value)
  }
})
onBeforeUnmount(() => {
  // 清理
  if (observer && target.value) {
    observer.unobserve(target.value)
  }
})
const keyComponent = defineAsyncComponent(() =>
  import(`../../../../${componentsMapKeys[props.component]}.vue`),
)
</script>

<template>
  <div ref="target" class="lazy-container">
    <component :is="asyncComponent" v-if="isVisible" />
    <component :is="keyComponent" v-if="isVisible" />
  </div>
</template>

<style scoped>
.lazy-container {
  height: 300px; /* 根据需要设定高度 */
}
</style>
