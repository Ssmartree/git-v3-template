<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
}>()

const isVisible = ref(false)

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      isVisible.value = true
      observer.unobserve(entry.target)
    }
  })
})

onMounted(() => {
  const img = document.querySelector('.lazy-image')
  if (img) {
    observer.observe(img)
  }
})
</script>

<template>
  <img v-if="isVisible" :src="props.src" :alt="alt" class="lazy-image" />
</template>

<style scoped>
.lazy-image {
  width: 100%;
  height: auto;
}
</style>
