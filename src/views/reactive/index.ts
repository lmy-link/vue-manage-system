
const proxyMap = new WeakMap()  // 缓存已经被深层代理过的对象

const targetMap = new WeakMap() // 用于存放具有副作用函数的对象
let activeEffect = null

export function effect(fn, options: any = {}) {  // 将副作用函数fn抛出
  const effectFn = () => {
    try {
      activeEffect = effectFn
      return fn()
    } finally {
      activeEffect = null
    }
  }
  if (!options.lazy) {
    effectFn()
  }
  effectFn.scheduler = options.scheduler
  return effectFn
}

// 收集副作用函数 为属性添加effect
function track(target, key) {
  // targetMap Map对象  用于存放所有的副作用函数
  // 访问对象的时候 
  // targetMap = {  // 存成这样
  //   target: {
  //     key: [effect1, effect2, effect3,...]
  //   },
  //   target2: {
  //     key: [effect1, effect2, effect3,...]
  //   }
  // }
  let despMap = targetMap.get(target)
  if (!despMap) {
    despMap = new Map()
    targetMap.set(target, despMap)
  }
  let deps = despMap.get(key)
  if (!deps) {
    deps = new Set()  // 用于存放副作用函数
  }
  // console.log(1111, activeEffect)
  if (!deps.has(activeEffect) && activeEffect) {
    deps.add(activeEffect)  // 存放副作用函数
  }
  despMap.set(key, deps)
  console.error('track-targetMap', targetMap)
  // console.error('track-despMap', despMap)
}

// 触发属性的effect
export function trigger(target, key) {
  const despMap = targetMap.get(target)
  // 当前对象中所有的key都没有副作用函数（从来没有被使用过）
  console.log('trigger-targetMap', targetMap)
  console.log('trigger-despMap', despMap)
  if (!despMap) {
    return
  }
  const deps = despMap.get(key)
  // console.log(deps)
  if (!deps) {
    // 表示这个属性没有依赖
    return
  }
  console.log('trigger-deps', deps)
  deps.forEach(effectFn => { // 遍历set 触发所有的副作用函数
    if (effectFn.scheduler) {
      effectFn.scheduler()
    } else {
      console.error('11111', effectFn)
      effectFn()
    }
  })
}
export function reactive(target) {
  return createReactiveObject(target, proxyMap)
}
function createReactiveObject(target, proxyMap) {
  if (typeof target !== 'object') {
    return target
  }
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  const proxy = new Proxy(target, {
    get: (target, key, receiver) => {
      // 获取值 
      const res = Reflect.get(target, key, receiver)
      track(target, key) // 依赖收集（收集副作用函数）在读取该响应式数据的时候将用到这个响应式数据的函数给收集起来
      return res
    },
    set: (target, key, value, receive) => {
      const res = Reflect.set(target, key, value, receive)
      trigger(target, key)
      return res
    }
  })
  // 将代理过的target存入proxyMap中
  proxyMap.set(target, proxy)
  return proxy
}
