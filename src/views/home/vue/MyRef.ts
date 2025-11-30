import { isObject } from '@vueuse/core'
import { track, trigger } from './effect'

export function myRef<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, key, receiver) { // receiver是调用proxy的对象，如果发生继承，则receiver可以保证拿到正确的this
      const res = Reflect.get(target, key, receiver)
      track(target, key)
      if (isObject(res)) {
        return myRef(res)
      }
      return res
    },
    set(target, key, value, receiver) { // 需要返回一个boolean
      const res = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return res
    },
  })
}
