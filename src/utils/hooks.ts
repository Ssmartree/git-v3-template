export function useScroll() {
  const scrollRef = ref<HTMLDivElement | null>(null)

  const scrollToBottom = () => nextTick(() => scrollRef.value && (scrollRef.value.scrollTop = scrollRef.value.scrollHeight))
  const scrollToTop = () => nextTick(() => scrollRef.value && (scrollRef.value.scrollTop = 0))

  return { scrollRef, scrollToBottom, scrollToTop }
}
