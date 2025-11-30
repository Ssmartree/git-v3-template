<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}>(), {
  type: 'info',
  duration: 3000,
})

// 销毁组件通知
const emit = defineEmits(['destroy'])
const visible = ref(false)
let timer: number | null = null

const iconClass = computed(() => {
  switch (props.type) {
    case 'success': return 'icon-success'
    case 'warning': return 'icon-warning'
    case 'error': return 'icon-error'
    default: return 'icon-info'
  }
})

function close() {
  visible.value = false
  setTimeout(() => {
    emit('destroy')
  }, 300) // 等待动画结束
}

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    timer = window.setTimeout(() => {
      close()
    }, props.duration)
  }
})

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

defineExpose({
  close,
})
</script>

<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="[`toast-${type}`]">
      <div v-if="type" class="toast-icon">
        <i class="icon" :class="iconClass"></i>
      </div>
      <div class="toast-content">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 9999;
  display: flex;
  align-items: center;
  min-width: 300px;
  max-width: 80%;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 15%);
  transform: translateX(-50%);

  &-icon {
    margin-right: 10px;
    font-size: 20px;
  }

  &-content {
    font-size: 14px;
    line-height: 1.5;
  }

  &-info {
    .toast-icon {
      color: $primary-color;
    }
  }

  &-success {
    .toast-icon {
      color: $success-color;
    }
  }

  &-warning {
    .toast-icon {
      color: $warning-color;
    }
  }

  &-error {
    .toast-icon {
      color: $error-color;
    }
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
