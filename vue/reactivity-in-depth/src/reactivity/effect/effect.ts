// 当前依赖下的事件响应
let activeEffect: ReactiveEffect

class ReactiveEffect {
  constructor(private _fn: () => void) {}

  run() {
    activeEffect = this
    this._fn()
  }
}

const targetMap = new Map()

export const effect = (fn: () => void) => {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

/**
 * 依赖收集
 * @param target - 目标对象
 * @param key - 目标对象字段
 */
export const track = (
  target: Record<string | symbol, any>,
  key: string | symbol
) => {
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

/**
 * 依赖作用触发
 * @param target - 目标对象
 * @param key - 目标对象字段
 */
export const trigger = (
  target: Record<string | symbol, any>,
  key: string | symbol
) => {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)

  for (const effect of dep) {
    effect.run()
  }
}
