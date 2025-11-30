<script setup lang="ts">
import { useBroadcastStore } from '@/stores/broadcastChannel'

const broadcastStore = useBroadcastStore()
broadcastStore.init() // 确保监听开启
</script>

<template>
  <div>
    <p>组件 B 消息：{{ broadcastStore.message }}</p>
  </div>
</template>
