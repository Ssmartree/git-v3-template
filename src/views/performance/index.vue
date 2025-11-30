<template>
  <div class="performance-page">
    <PerformanceMonitor />
  </div>
</template>

<script setup lang="ts">
import PerformanceMonitor from '@/components/performance-monitor.vue'
</script>

<style scoped lang="scss">
/* stylelint-disable */
.performance-page {
  padding: 20px;
  min-height: 100vh;
  background: #f5f7fa;
}
</style>

