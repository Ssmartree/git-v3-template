interface RequestOption {
  /** 是否立即执行 */
  immediate?: boolean
}

export default function useRequest<T>(
  func: () => Promise<T>,
  options: RequestOption = { immediate: true },
) {
  const loading = ref(false)
  const data = ref<T>()
  const run = async () => {
    loading.value = true
    return func()
      .then((res) => {
        data.value = res
        return data.value
      })
      .finally(() => {
        loading.value = false
      })
  }
  options.immediate && run()

  return { loading, data, run }
}
