<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// 模拟数据
const totalItems = 100000
const items = Array.from({ length: totalItems }, (_, index) => ({ id: index, name: `Item ${index}` }))

const container = ref<null | HTMLDivElement>(null)
const startIndex = ref(0)
const endIndex = ref(10)
const itemHeight = 30
const visibleCount = 10

const visibleItems = computed(() => items.slice(startIndex.value, endIndex.value))

const offset = computed(() => startIndex.value * itemHeight)
const spacerHeight = computed(() => items.length * itemHeight)

function onScroll() {
  if (container.value) {
    const scrollTop = container.value.scrollTop
    startIndex.value = Math.floor(scrollTop / itemHeight)
    endIndex.value = startIndex.value + visibleCount
  }
}
let scrollInterval: number | null = null
function startScrolling() {
  scrollInterval = setInterval(() => {
    if (container.value) {
      const currentScrollTop = container.value.scrollTop
      const maxScrollTop = container.value.scrollHeight - container.value.clientHeight
      if (currentScrollTop < maxScrollTop) {
        container.value.scrollTop += 1
      }
      else {
        setTimeout(() => {
          container.value && (container.value.scrollTop = 0)
        }, 1000)
      }
    }
  }, 50) // 100 毫秒等于 0.1 秒
}

function stopScrolling() {
  if (scrollInterval !== null) {
    clearInterval(scrollInterval)
    scrollInterval = null
  }
}
onUnmounted(() => {
  if (scrollInterval !== null) {
    clearInterval(scrollInterval)
  }
})
onMounted(() => {
  if (container.value) {
    container.value.addEventListener('scroll', onScroll)
    container.value.addEventListener('mouseenter', stopScrolling)
    container.value.addEventListener('mouseleave', startScrolling)
    startScrolling()
  }
})
</script>

<template>
  <div ref="container" class="table-container" @scroll="onScroll">
    <div class="spacer" :style="{ height: `${spacerHeight}px` }">
      <div class="visible-items" :style="{ transform: `translateY(${offset}px)` }">
        <div v-for="item in visibleItems" :key="item.id" class="item">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  position: relative;
  height: 300px;
  overflow-y: auto;
}

.spacer {
  width: 100%;
}

.visible-items {
  position: absolute;
  width: 100%;
}

.item {
  display: flex;
  align-items: center;
  height: 30px;
  border-bottom: 1px solid #ddd;
}
</style>
