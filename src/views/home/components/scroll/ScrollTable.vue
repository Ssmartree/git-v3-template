<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  data: Array<{ id: number, content: string }>
  isAutoScroll: boolean
}>()

const visibleCount = 10
const itemHeight = 30
const totalHeight = props.data.length * itemHeight
const scrollContainer = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const startIndex = ref(0)
const endIndex = ref(10)
// const visibleData = computed(() => {
//   const start = Math.floor(scrollTop.value / itemHeight)
//   return props.data.slice(startIndex.value, endIndex.value).map((item, index) => {
//     console.log('🚀 ~ index offset', (start + index) * itemHeight)

//     return {
//       ...item,
//       offset: (start + index) * itemHeight,
//     }
//   })
// })
const visibleData = computed(() =>
  props.data.slice(startIndex.value, endIndex.value).map((item, index) => {
    return {
      ...item,
      offset: (startIndex.value + index) * itemHeight,
    }
  }),
)

function handleScroll() {
  scrollTop.value = scrollContainer.value ? scrollContainer.value.scrollTop : 0
  startIndex.value = Math.floor(scrollTop.value / itemHeight)
  endIndex.value = startIndex.value + visibleCount
}

let scrollInterval: number | undefined
onMounted(() => {
  if (props.isAutoScroll) {
    scrollInterval = setInterval(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop += 1
      }
    }, 50)
  }

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }

  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div ref="scrollContainer" style=" height: 300px;overflow: auto;">
    <div :style="{ height: `${totalHeight}px` }">
      <div v-for="item in visibleData" :key="item.id" class="item" :style="{ transform: `translateY(${item.offset}px)`, willChange: 'transform' }">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<style>

</style>
