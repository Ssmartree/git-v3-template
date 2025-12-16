<script setup lang="ts">
import PerformanceMonitor from '@/components/performance-monitor.vue'
</script>

<template>
  <div class="performance-page">
    <performance-monitor />
  </div>
</template>

<style scoped lang="scss">
/* stylelint-disable */
.performance-page {
  padding: 20px;
  min-height: 100vh;
  background: #f5f7fa;
}
</style>
