interface Options {
  scheduler?: any
}
let activeEffect: any
export function MyEffect(fn: any, options: Options) {
  const _effect = () => {
    activeEffect = _effect
    const res = fn()
    return res
  }
  _effect.options = options
  _effect()
  return _effect
}
export const targetMap = new WeakMap()
export function track(target: any, key: any) {
  // console.log('track')
  if (!activeEffect)
    return
  let desMap = targetMap.get(target)
  if (!desMap) {
    desMap = new Map()
    targetMap.set(target, desMap)
  }
  let desSet = desMap.get(key)
  if (!desSet) {
    desSet = new Set()
    desMap.set(key, desSet)
  }
  desSet.add(activeEffect)
}
export function trigger(target: any, key: any) {
  // console.log('trigger')
  const desMap = targetMap.get(target)
  if (!desMap) {
    return
  }
  const desSet = desMap.get(key)
  if (!desSet) {
    return
  }
  desSet.forEach((effect: any) => {
    if (effect?.options?.scheduler) {
      effect?.options?.scheduler?.()
    }
    else {
      console.log('🚀 ~ effect', effect)

      effect()
    }
  })
}
