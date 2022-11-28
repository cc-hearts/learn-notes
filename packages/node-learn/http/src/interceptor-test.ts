
/**
 * @author heart
 * @description 测试洋葱模型
 * @Date 2022-11-19
 */
import { Interceptor } from './interceptor.js'


const inter = new Interceptor()

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const task = function (id) {
  return async (ctx, next) => {
    try {
      console.log(`task ${id} begin`)
      ctx.count++
      await wait(1000)
      console.log(`count: ${ctx.count}`);
      await next();
      console.log(`task ${id} end`);
    } catch (error) {
      console.log(error.message)
    }
  }
}

// 将多个任务以拦截切面的方式注册到拦截器中
inter.use(task(0));
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));
inter.use(task(4));

// 从外到里依次执行拦截切面
inter.run({ count: 0 });