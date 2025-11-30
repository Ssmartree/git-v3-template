export const useBroadcastStore = defineStore('broadcast', () => {
  const message = ref('等待消息...')
  let channel: BroadcastChannel | null = null

  function init() {
    console.log('init')
    if (!channel) { // 🔥 确保只创建一个实例
      channel = new BroadcastChannel('app_channel')

      channel.onmessage = (event) => {
        const data = event.data
        console.log('🚀 ~ data', data)
        if (typeof data === 'object' && data.type) {
          message.value = `收到消息 [${data.type}]: ${JSON.stringify(data)}`
        }
        else {
          message.value = `收到未知格式消息: ${JSON.stringify(data)}`
        }
      }
    }
  }

  function sendMessage(type: string, content: any) {
    if (!channel) {
      console.warn('BroadcastChannel 未初始化')
      return
    }
    channel.postMessage({ type, content })
  }

  return { message, init, sendMessage }
})
