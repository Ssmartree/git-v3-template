<script lang="ts" setup>
import { MyComputed } from './computed'
import { myRef } from './MyRef'

// 1.class 的基本用法继承和类型约束 implements
// 2.class 的修饰符 readonly只读 private 只可内部使用 protected 可继承 public 公开使用
// 3.super 原理
// 4.静态方法
// 5. get set

// private 只可内部使用 不能在外部访问 子类也不可用
// protected 只能给内部使用 或者子类使用
// public 公开使用 内部使用 子类使用 可以在外部访问
// readonly 只读 只能赋值不能修改
interface Options {
  el: string | HTMLElement
}
interface Vuecls {
  options: Options
  init: () => void
}
interface Vnode {
  tag: string // div section header
  text?: string // 123
  children?: Vnode[]
}
// 虚拟dom 简单版
class Dom {
  constructor(name: string) {
    console.log('🚀 ~ name', name)
    console.log('Dom init')
  }

  // 创建节点的方法
  createElement(el: string) {
    return document.createElement(el)
  }

  // 填充文本的方法
  setText(el: HTMLElement, text: string | null) {
    el.textContent = text
  }

  // 渲染函数
  protected render(data: Vnode) {
    const root = this.createElement(data.tag)
    if (data.children && Array.isArray(data.children)) {
      data.children.forEach((item) => {
        const child = this.render(item)
        root.appendChild(child)
      })
    }
    else {
      data.text && this.setText(root, data.text)
    }
    return root
  }
}
class Vue extends Dom implements Vuecls {
  options: Options
  constructor(options: Options) {
    super('传给dom -- 我是子类super过来的')// 初始化父类 即此处的Dom //父类的prototype.constructor.call
    this.options = options
    this.init()
    // super.render()
  }

  static xxx() {}
  static version() {
    // 静态方法 这里面的this只能指向其他的static 只可以调其他static的方法和属性
    this.xxx()
    return '1.0.0'
  }

  public init(): void {
    // 虚拟dom 就是通过js 去渲染我们这个真实dom
    const data: Vnode = {
      tag: 'div',
      children: [
        {
          tag: 'section',
          text: '我是子节点1',
          children: [
            {
              tag: 'section',
              text: '我是子节点1-1',
            },
            {
              tag: 'section',
              text: '我是子节点1-2',
            },
          ],
        },
        {
          tag: 'section',
          text: '我是子节点1',
        },
      ],
    }
    const app = typeof this.options.el == 'string' ? document.querySelector(this.options.el) : this.options.el
    if (app instanceof HTMLElement) {
      app.appendChild(this.render(data))
    }
  }
}

// 创建 Vue 实例
// eslint-disable-next-line unused-imports/no-unused-vars
const vueInstance = new Vue({
  el: '#app22',
})
Vue.version()
console.log('🚀 ~ Vue.version()', Vue.version())

// 手动调用 init 方法来渲染虚拟DOM
// vueInstance.init()

class Ref {
  _value: any
  constructor(value: any) {
    this._value = value
  }

  get value() {
    return `${this._value}+get`
  }

  set value(newValue) {
    this._value = `${newValue}+set`
  }
}
const ref = new Ref('哈哈啊哈')
console.log('🚀 ~ ref', ref.value)
ref.value = '哈哈啊哈2'
console.log('🚀 ~ ref', ref.value)

// 测试myRef
const a = myRef({
  name: '张三',
  info: {
    age: 20,
    hobby: {
      name: '篮球',
      time: 10,
    },
  },
})

const b = MyComputed(() => a.info.hobby.time * 10)

const c = MyComputed(() => a.info.age * 10)
console.log('🚀 ~ b  ', b.value) // 20
console.log('🚀 ~ c  ', c.value)

a.info.age = 60
a.info.hobby.time = 30

console.log('🚀 ~ b  ', b.value) // 20
console.log('🚀 ~ c  ', c.value)

// interface AAA {
//   name: string
//   num: number
// }
// interface BBB {
//   name: string
// }
// type C = AAA & BBB
// const c1: C = {
//   name: 'example',
//   num: 1,
// }
// console.log('🚀 ~ c1', c1)
</script>

<template>
  <div class="vue-render">
    <div id="app22">
      vue render 渲染实例
    </div>
    <br>
    <div style="width:100%;height:1px;background-color:black;"></div>
    <br>

    <proxy></proxy>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
// .vue-render {
//   width: 100%;
// }
</style>
