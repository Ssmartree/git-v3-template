<script lang="ts" setup>
import { MyComputed } from './computed'
import { myRef } from './MyRef'

// proxy 代理 13个方法 参数一一样
// Reflect 反射 13个方法 参数一模一样
// mobx observable

// const person = { name: '小满', age: 24 }
// // proxy 支持对象 数组 函数 set map
// person.name// 取值
// person.name = 'xxx' // 赋值
// const personProxy = new Proxy(person, {

//   // 取值 arget==>person对象 value==>属性值 receiver===personProxy对象也就是自身
//   get(target, key,receiver) {
//     console.log('get', key)
//     return target[key]
//   },
//   // 赋值
//   // target==>person对象  key==>属性名  value==>属性值  receiver===personProxy对象也就是自身
//   set(target, key, value, receiver) {
//     console.log('set', key, value)
//     target[key] = value
//     return true
//   },

//   // 拦截函数调用
//   apply(target, thisArg, args) {
//     console.log('apply', args)
//     return target(...args)
//   },

//   // 拦截 in 操作符
//   has(target, key) {
//     console.log('has', key)
//     return key in target
//   },

//   // 拦截 for in
//   ownKeys(target) {
//     console.log('ownKeys')
//     return Object.keys(target)
//   },

//   // 拦截new操作符
//   construct(target, args, newTarget) {
//     console.log('construct', args)
//     return new target(...args)
//   },

//   // 拦截 delete 删除操作
//   deleteProperty(target, key) {
//     console.log('deleteProperty', key)
//     delete target[key]
//     return true
//   },

//   getPrototypeOf(target) {
//     console.log('getPrototypeOf')
//     return Object.getPrototypeOf(target)
//   },
//   isExtensible(target) {
//     console.log('isExtensible')
//     return Object.isExtensible(target)
//   },
//   preventExtensions(target) {
//     console.log('preventExtensions')
//     return Object.preventExtensions(target)
//   },
//   defineProperty(target, key, descriptor) {
//     console.log('defineProperty', key, descriptor)
//     return Object.defineProperty(target, key, descriptor)
//   },
//   getOwnPropertyDescriptor(target, key) {
//     console.log('getOwnPropertyDescriptor', key)
//     return Object.getOwnPropertyDescriptor(target, key)
//   },
//   setPrototypeOf(target, prototype) {
//     console.log('setPrototypeOf', prototype)
//     return Object.setPrototypeOf(target, prototype)
//   },
// })

const person = { name: '小满', age: 24 }
const personProxy = new Proxy(person, {
  get(target, key, receiver) {
    console.log('get', key)
    if (target.age <= 18) {
      return Reflect.get(target, key, receiver)
    }
    else {
      return '成年了'
    }
  },
  set(target, key, value, receiver) {
    console.log('set', key, value, receiver)
    // target[key] = value
    return true
  },
})
console.log(personProxy.age)

// 响应式原理：数据劫持
const tree = myRef({ name: 'smartree', age: 23 })

console.log('🚀 ~ tree', tree)
tree.age = 24
console.log('🚀 ~ tree', tree)
const age10 = MyComputed(() => {
  const a = tree.age * 10
  console.log('🚀 ~ age10', a) // tree.age修改后会自动触发从而打印
  return a
})
function addAge() {
  tree.age++
  console.log('🚀 ~ tree', tree)
  console.log('🚀 ~ age10', age10)
}

function noaddAge() {
  console.log('🚀 ~ noaddAge', tree.age * 10)
}
const a = ref(0)
const b = a
console.log('🚀 ~ b', b)
</script>

<template>
  <div>响应式原理：数据劫持  dom未重新渲染</div>
  <div>{{ tree }}</div>
  <div>{{ tree.name }}</div>
  <div>{{ tree.age }}</div>
  <n-button type="primary" @click="addAge">
    改变年龄
  </n-button>
  <n-button type="primary" @click="noaddAge">
    不改变年龄
  </n-button>
</template>
