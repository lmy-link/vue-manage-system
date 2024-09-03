<template>
  <!-- <div>{{ obj.age }}</div> -->
</template>

<script setup lang="ts" name="dashboard">
// 非响应式
// import { reactive } from 'vue'
import { effect } from './reactive/index' //effect 为什么叫做副作用函数，当响应式数据发生变更时，effect 中的回调会实时执行
import { reactive } from './reactive/index'
const obj: any = reactive({ name: 'limy',age:18 })
effect(()=>{
  // console.log('2222222222222222222',obj.age)
})
setInterval(() => {
  obj.age++  // 会触发一次get 持续触发set
}, 1000)



</script>
