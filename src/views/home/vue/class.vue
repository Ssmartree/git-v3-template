<script lang="ts" setup>
class Person {
  private name: string
  constructor(name: string) {
    this.name = name
  }

  getName() {
    return this.name
  }
}
const b = new Person('小满')
console.log(b.getName())
class Dog<T> {
  name: T
  constructor(name: T) { this.name = name }
}
// let d1: Dog<string> = new Dog('小狗')
const d1 = new Dog('小狗')
console.log('🚀 ~ d1', d1)
const d2 = new Dog<number>(999)
console.log('🚀 ~ d2', d2)
</script>

<template>
  <div>
  </div>
</template>

<style lang="scss" scoped>

</style>
