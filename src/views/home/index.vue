<script setup lang="ts">
import { queryMiddleAPI } from '@/service/api'
import useRequest from '@/service/use-request'
import ChannelA from '../broadCastChannel/channelA.vue'
import ChannelB from '../broadCastChannel/channelB.vue'
import ScrollThree from '../d3/scrollThree.vue' // 添加这行
import AsyncComponent from './components/Lazy/AsyncComponent.vue'
import LazyComponent from './components/Lazy/LazyComponent.vue'
import ClassScroll from './components/scroll/ClassScroll.vue'
import ScrollTable from './components/scroll/ScrollTable.vue'
import VirtualList from './components/scroll/VirtualList.vue'

const { loading, data, run } = useRequest(queryMiddleAPI, { immediate: false })
const { items, fruits, removeItem, randomize, handleMidData } = useAutoAnimate()

function useAutoAnimate() {
  const items = ref(['😏', '😐', '😑', '😒', '😕', '😔', '😞', '😟', '😠', '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭', '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷', '🙁', '🙂', '🙃', '🙄', '🤔', '🤨', '🤯', '🥵', '🥶', '🥴', '🤬', '🤫', '🤥', '🤢', '🤮', '🤧', '🥳', '🥸', '😈'])
  const fruits = ref(['🍓   ', '🥥   ', '🥝   ', '🍇   '])

  const removeItem = (data: any[], index: number) => data?.splice(index, 1)
  const randomize = () => items.value.sort(() => (Math.random() > 0.5 ? 1 : -1))
  const handleMidData = () => data.value?.length ? data.value.length = 0 : run()

  return { items, fruits, removeItem, randomize, handleMidData }
}

// TODO
const totalItems = 100000
const scrollTableData: Array<{ id: number, content: string }> = Array.from({ length: totalItems }, (_, index) => ({ id: index, content: `Item ${index}` }))

const a = []
</script>

<template>
  <div class="flow-demo">
    <h3>流动效果</h3>
    <scroll-three></scroll-three>
  </div>
  <div class="flex flex-col select-none gap-10 px-100 py-50">
    <n-card v-motion-slide-top embedded>
      <div class="flex flex-col gap-10">
        <div v-auto-animate class="flex flex-wrap items-center gap-10">
          <div
            v-for="(item, index) in items" :key="item"
            class="cursor-pointer border rounded-4 p-10 hover:border-hover-primary" @click="removeItem(items, index)"
          >
            {{ item }}
          </div>
        </div>
        <n-button type="primary" @click="randomize">
          打乱顺序
          <count-to :end-value="items.length"></count-to>
        </n-button>
      </div>
    </n-card>

    <permission need-permission="query">
      <n-card v-motion-slide-bottom embedded>
        <div v-auto-animate class="flex flex-col gap-10">
          <n-button type="primary" :loading="loading" :disabled="loading" @click="handleMidData">
            {{ data?.length ? '清空数据' : '获取数据' }}
          </n-button>
          <n-card v-if="data?.length">
            <div v-auto-animate class="flex flex-col gap-10">
              <div
                v-for="(item, index) in data" :key="item.ROW_NUM!"
                class="flex cursor-pointer items-center justify-between border rounded-4 p-10 hover:border-hover-primary"
              >
                <div>{{ fruits[index] + item.SCENE_SUBCLASS }}</div>
                <div class="i-pixelarticons:close hover:color-hover-error" @click="removeItem(data, index)"></div>
              </div>
            </div>
          </n-card>
        </div>
      </n-card>
    </permission>
  </div>
  <hr />
  <p>class类 虚拟滚动列表</p>
  <class-scroll></class-scroll>
  <hr />
  <p>函数式组件 虚拟滚动列表</p>
  <hr />
  <virtual-list></virtual-list>
  <hr>
  <p>表格 虚拟滚动列表</p>
  <scroll-table v-if="true" :data="scrollTableData" :is-auto-scroll="true"></scroll-table>
  <hr />
  <p>异步引入组件</p>
  <async-component component="defineAsyncComponent"></async-component>
  <hr />
  <p>可视区域展示组件</p>
  <lazy-component component="defineLazyComponent"></lazy-component>
  <hr />

  <p>broadCastChannel 传递信息</p>
  <channel-a></channel-a>
  <channel-b></channel-b>
  <div class="container">
    <div class="item">
      stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器
    </div>
    <div class="item">
      B
    </div>
    <div class="item">
      C
    </div>
  </div>
  <div class="item1">
    C
  </div>
  <video src="@/assets/video/火影-合并后.mp4" controls></video>
</template>

<style lang="scss" scoped>
.flow-demo {
  padding: 20px;

  h3 {
    margin-bottom: 16px;
  }

  .mkdir {
    width: 100px;
    height: 100px;
  }
}

.container {
  display: flex;
  align-items: stretch;

  /* 默认值，项目会被拉伸 */
  height: 200px;

  /* 父容器的高度 */
  border: 2px solid #000;
}

.item {
  width: 200px;
  background: lightblue;
  border: 1px solid #333;

  /* 注意这里“没有设置 height”，所以 height:auto → 会被 stretch */
}

.item1 {
  width: 200px;
  height: 100px;
  vertical-align: middle;
  background: lightblue;
  border: 1px solid #333;
}
</style>
