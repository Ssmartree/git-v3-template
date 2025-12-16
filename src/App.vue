<script setup lang="ts">
import { themeOverrides } from '@/../configs/theme'
import { dateZhCN, zhCN } from 'naive-ui'

const router = useRouter()
onMounted(() => {
  // 捕捉路由错误
  router.onError((error) => {
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      window.location.reload()
    }
  })
})
</script>

<template>
  <img src="" alt="">
  <button>111</button>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" abstract :theme-overrides="themeOverrides">
    <n-theme-editor>
      <naive-provider>
        <router-view />
      </naive-provider>
    </n-theme-editor>
  </n-config-provider>
</template>
