<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission'

defineProps<{ needPermission: keyof Permission }>()
const { permission } = storeToRefs(usePermissionStore())
</script>

<template>
  <slot v-if="permission?.[needPermission]">
  </slot>
</template>
