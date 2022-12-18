import type { callback } from "../types"
export class Interceptor {
  // 存储拦截切面
  constructor(private aspects: Array<callback> = []) { }

  // 注册拦截切面
  use( /** async*/functor: callback) {
    this.aspects.push(functor)
    return this
  }

  // 注册的切面包装成一个洋葱模型 context 一个http请求的上下文
  async run(context) {
    const aspects = this.aspects
    // 运用reduceRight 可以拿到上一个切面的函数 将每个函数进行包装 最后返回的是第一个添加的切面的包装函数
    const proc = aspects.reduceRight((acc, cur) => {
      return async () => {
        await cur(context, acc)
      }
    }, () => Promise.resolve())

    try {
      await proc()
    } catch (ex) {
      console.error(ex.message)
    }

    return context
  }
}