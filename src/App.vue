<script setup lang="ts">
import { themeOverrides } from '@/../configs/theme'
import { dateZhCN, zhCN } from 'naive-ui'
import { usePermissionStore } from './stores/permission'

</script>

<template>
  <button>111</button>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" abstract :theme-overrides="themeOverrides">
    <n-theme-editor>
      <naive-provider>
        <router-view />
      </naive-provider>
    </n-theme-editor>
  </n-config-provider>
</template>
