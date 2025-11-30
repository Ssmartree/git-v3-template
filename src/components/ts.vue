<script lang="ts" setup>
// const o1: object = { foo: 0 }
// const o2: object = { foo: 0 }

// o1.toString() // 正确
// o1.foo // 报错

// o2.toString() // 正确
// o2.foo // 报错

interface Person {
  name: string
  age: number
  add: (num1: number, num2: number) => number
}

const p1: Person = {
  name: 'Alice',
  age: 25,
  add(num1: number, num2: number) {
    return this.age + num1 + num2
  },
}

p1.add(1, 2) // 正确
</script>

<template>
  <div></div>
</template>
