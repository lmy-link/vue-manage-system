<template>
  <!-- <div>{{ obj.age }}</div> -->
</template>

<script setup lang="ts" name="dashboard">
// 非响应式
// import { reactive } from 'vue'
import { effect } from './reactive/index' //effect 为什么叫做副作用函数，当响应式数据发生变更时，effect 中的回调会实时执行
import { reactive } from './reactive/index'
const obj: any = reactive({ name: 'limy',age:18 })
// 1.先执行effect函数 传递一个函数(副作用函数fn)为参数 并抛出fn 同时给activeEffect赋值
// 2.在fn中访问对象的属性 触发get-->track  收集副作用函数到deps中 deps是一个Set结构
effect(()=>{
  console.log('effect-触发')
  console.log(obj.age)  // 在此处访问对象的属性 deps Set结构才会有值
})
// setInterval(() => {
//   obj.age++  // 会触发一次get 持续触发set
// }, 1000)
obj.age++  
// 触发一次get 触发一次set 触发trigger  
// 执行age对应(使用age属性)的所有副作用函数 () => { console.log('effect-触发');console.log(obj.age) } 
// 函数执行 输出打印


</script>
