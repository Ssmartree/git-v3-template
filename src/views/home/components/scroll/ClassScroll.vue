<script lang="ts" setup>
import { VirtualScroll } from '@/utils/VirtualScroll'

const name = ''
interface Item {
  id: number
  name: string
}
function foo(input: string) {
  return input
}
foo('linbudu')
const abc = 'aahfjklah'
// abc = 10
const data: Item[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
}))

onMounted(() => {
  // 确保 DOM 已挂载后再获取元素
  const container = document.getElementById('scrollByClass') as HTMLElement
  if (!container) {
    console.error('未找到 scrollByClass 元素')
    return
  }

  const virtualScroll = new VirtualScroll<Item>({
    container,
    items: data,
    itemHeight: 40, // 每项高度为 40px
    buffer: 5,
    // 渲染单项回调：返回一个 div 节点
    renderItem: (item) => {
      const div = document.createElement('div')
      div.className = 'item'
      div.textContent = item.name
      div.style.height = '40px'
      div.style.lineHeight = '40px'
      div.style.borderBottom = '1px solid #eee'
      return div
    },
    // loadMore 可选回调，用于触发加载更多数据
    loadMore: () => {
      console.log('加载更多数据...')
      // 在这里加载更多数据，然后调用 virtualScroll.updateItems(newData)
    },
  })
  virtualScroll.updateItems(data) // 初始化数据
  // 不需要额外绑定 onScroll，因为构造函数中已绑定了滚动事件
})
</script>

<template>
  <div>
    <!-- HTML：确保容器在模板中存在 -->
    <div id="scrollByClass" style="height: 300px; border: 1px solid #ccc;"></div>
  </div>
</template>

<style lang="scss" scoped>
/* 可根据需要添加样式 */
</style>
