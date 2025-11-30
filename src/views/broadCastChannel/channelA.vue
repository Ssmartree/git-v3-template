<script setup lang="ts">
import { useBroadcastStore } from '@/stores/broadcastChannel'

const broadcastStore = useBroadcastStore()
</script>

<template>
  <div>
    <p>组件 A 消息：{{ broadcastStore.message }}</p>
    <button @click="broadcastStore.init()">
      初始化监听
    </button>
    <button @click="broadcastStore.sendMessage('A-Type', { text: 'Hello from A' })">
      发送消息
    </button>
  </div>
</template>
