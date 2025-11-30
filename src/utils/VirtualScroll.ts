/**
 * VirtualScrollOptions 定义了传入 VirtualScroll 构造函数的参数结构，
 * 包括：
 * - container: 滚动容器，必须是一个 HTMLElement
 * - items: 数据数组，类型为泛型 T[]
 * - itemHeight: 每项的高度（单位 px），用于计算总高度和可见区域
 * - buffer: 附加缓冲项数（可选，默认 5），保证在可视区域外也预渲染一定数量项
 * - renderItem: 渲染单项的回调函数，接收当前项和索引，返回对应的 HTMLElement
 * - loadMore: （可选）当滚动到底部时触发加载更多数据的回调函数
 */
export interface VirtualScrollOptions<T> {
  container: HTMLElement
  items: T[]
  itemHeight: number
  buffer?: number
  renderItem: (item: T, index: number) => HTMLElement
  loadMore?: () => void
}

/**
 * VirtualScroll 类封装了虚拟滚动逻辑，使用 IntersectionObserver 来监控底部的哨兵元素，
 * 并监听滚动事件，根据当前滚动位置计算可见区域，只渲染这些部分的 DOM 节点。
 * 该类使用了泛型 <T>，可以适用于任意类型的数据列表。
 */
export class VirtualScroll<T> {
  container: HTMLElement
  items: T[]
  itemHeight: number
  buffer: number
  renderItem: (item: T, index: number) => HTMLElement
  loadMore?: () => void
  innerWrapper: HTMLDivElement
  renderContainer: HTMLDivElement
  sentinel: HTMLDivElement
  observer: IntersectionObserver
  currentRange: { start: number, end: number }

  constructor(options: VirtualScrollOptions<T>) {
    // 1. 保存传入的参数
    this.container = options.container
    this.items = options.items || []
    this.itemHeight = options.itemHeight
    this.buffer = options.buffer ?? 5
    this.renderItem = options.renderItem
    this.loadMore = options.loadMore
    // 当前已经渲染的索引范围，初始为空
    this.currentRange = { start: 0, end: 0 }

    // 2. 设置滚动容器样式（确保 container 为定位元素并具有滚动条）
    this.container.style.position = 'relative'
    this.container.style.overflow = 'auto'

    // 3. 创建一个内层容器，用于模拟整个列表的高度。
    //    这里 innerWrapper 的高度等于数据总项数 * 每项高度，这样滚动条的高度能模拟完整列表。
    this.innerWrapper = document.createElement('div')
    this.innerWrapper.style.position = 'relative'
    this.innerWrapper.style.width = '100%'
    this.innerWrapper.style.height = `${this.items.length * this.itemHeight}px`
    this.container.appendChild(this.innerWrapper)

    // 4. 创建实际渲染可见项的容器（renderContainer），该容器采用绝对定位，
    //    其 top 值会根据当前可见区域进行调整，从而在整体列表中定位正确的位置。
    this.renderContainer = document.createElement('div')
    this.renderContainer.style.position = 'absolute'
    this.renderContainer.style.width = '100%'
    this.innerWrapper.appendChild(this.renderContainer)

    // 5. 添加一个哨兵元素，用于 IntersectionObserver 监控。当滚动到底部时，
    //    该元素进入视口，会触发 loadMore 回调（如果有定义）。
    this.sentinel = document.createElement('div')
    this.sentinel.style.position = 'absolute'
    this.sentinel.style.bottom = '0'
    this.sentinel.style.height = '1px'
    this.innerWrapper.appendChild(this.sentinel)

    // 6. 设置 IntersectionObserver 来监测 sentinel 是否进入视口
    this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
      root: this.container,
      threshold: 1.0,
    })
    this.observer.observe(this.sentinel)

    // 7. 绑定滚动事件，滚动时调用 onScroll 方法重新计算并渲染可见区域
    this.container.addEventListener('scroll', this.onScroll.bind(this))

    // 8. 初始化时立即调用 onScroll 进行首次渲染
    this.onScroll()
  }

  /**
   * onScroll 方法在容器滚动时被调用。
   * 根据 scrollTop 和容器高度计算当前可见的项索引范围，
   * 同时加入 buffer（缓冲区）来提前渲染额外项，防止出现空白。
   */
  onScroll(): void {
    const scrollTop = this.container.scrollTop
    const containerHeight = this.container.clientHeight
    const totalItems = this.items.length

    // 计算开始索引，并向上扩展 buffer 项，防止滚动时出现闪烁
    let startIndex = Math.floor(scrollTop / this.itemHeight) - this.buffer
    startIndex = Math.max(0, startIndex)

    // 计算结束索引，并向下扩展 buffer 项
    let endIndex = Math.ceil((scrollTop + containerHeight) / this.itemHeight) + this.buffer
    endIndex = Math.min(totalItems, endIndex)

    // 如果当前可见范围未改变，则无需重复渲染
    if (this.currentRange.start === startIndex && this.currentRange.end === endIndex) {
      return
    }
    this.currentRange = { start: startIndex, end: endIndex }

    // 清空当前渲染区域的内容
    this.renderContainer.innerHTML = ''
    // 设置 renderContainer 的 top 值，使其位置与实际列表中当前渲染项对齐
    this.renderContainer.style.top = `${startIndex * this.itemHeight}px`

    // 根据计算出的索引范围，调用 renderItem 回调来生成 DOM 节点，并插入到渲染区域中
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.items[i]
      const itemEl = this.renderItem(item, i)
      this.renderContainer.appendChild(itemEl)
    }
  }

  /**
   * onIntersection 方法是 IntersectionObserver 的回调函数，
   * 当 sentinel 元素进入视口时会被调用。
   * 如果定义了 loadMore 回调，则调用该方法来加载更多数据。
   */
  onIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log('哨兵进入视口，触发加载更多数据的回调')
        if (typeof this.loadMore === 'function') {
          this.loadMore()
        }
      }
    })
  }

  /**
   * updateItems 方法用于在数据更新时重新传入新的数据数组，
   * 同时更新内层容器的高度，并调用 onScroll 重新渲染可见项。
   * 例如在加载更多数据后调用此方法。
   */
  updateItems(newItems: T[]): void {
    this.items = newItems
    this.innerWrapper.style.height = `${this.items.length * this.itemHeight}px`
    this.onScroll()
  }
}
