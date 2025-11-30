import { MyEffect } from './effect'

export function MyComputed(getter: any) {
  let _dirty = true
  const _value = MyEffect(getter, {
    scheduler: () => { _dirty = true },
  })
  let catchValue: any
  class ComputedRefImpl {
    get value() {
      if (_dirty) {
        catchValue = _value()
        _dirty = false
      }
      return catchValue
    }
  }
  return new ComputedRefImpl()
}
