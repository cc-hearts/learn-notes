/**
 * @author cc-heart
 * @description 第二版本 引入状态机
 * @Date 2022-11-15
 */
import type { call } from "./types";
enum STATUS {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

export class MyPromise2 {
  private _status: STATUS = STATUS.PENDING;

  private _value = undefined; // 储存then回调return的值
  // 收集 then 成功的回调队列
  private _resolveQueue: Array<call> = [];
  // 收集 then 失败的回调队列
  private _rejectQueue: Array<call> = [];

  // promise的 executor
  constructor(executor: (_resolve: call, reject: call) => void) {
    executor(this._resolve, this._reject);
  }

  // this 在里面调用 方式找不到值
  private _resolve = (val: unknown) => {
    // 兼容同步代码 使用SetTimeout 保证执行顺序 MutationObserver模拟微任务
    const callback = () => {
      // 状态只能由pending 变为 fulfilled 或者 reject 有且只能改变一次
      if (this._status !== STATUS.PENDING) return;
      this._status = STATUS.PENDING;
      this._value = val;
      // 由于then 中还可以使用 myPromiseInstance 去.then 放弃使用slice拷贝数组
      while (this._resolveQueue.length) {
        const call = this._resolveQueue.shift()!;
        call instanceof Function && call(val);
      }
    };
    setTimeout(callback);
  };

  private _reject(err: unknown) {
    const callback = () => {
      // reject 同理
      if (this._status !== STATUS.PENDING) return;
      this._status = STATUS.REJECTED;
      this._value = err;
      while (this._rejectQueue.length) {
        const call = this._rejectQueue.shift();
        call instanceof Function && call(err);
      }
    };
    setTimeout(callback);
  }

  then(resolveFn?: call, rejectFn?: call) {
    typeof resolveFn !== "function" ? (resolveFn = (value) => value) : null;
    typeof rejectFn !== "function"
      ? (rejectFn = (reason) => {
          throw new Error(reason instanceof Error ? reason.message : reason);
        })
      : null;
    return new MyPromise2((resolve, reject) => {
      const fulfilledFn = (val: unknown) => {
        try {
          const res = resolveFn(val);
          // @ts-ignore
          res instanceof MyPromise2 ? res.then(resolve, reject) : resolve(res);
        } catch (error) {
          reject(error);
        }
      };

      const rejFn = (val: unknown) => {
        try {
          const res = rejectFn(val);
          // @ts-ignore
          res instanceof MyPromise2 ? res.then(resolve, reject) : resolve(res);
        } catch (error) {
          reject(error);
        }
      };
      switch (this._status) {
        case STATUS.PENDING:
          this._resolveQueue.push(fulfilledFn);
          this._rejectQueue.push(rejFn);
          break;
        // 当状态已经变为resolve/reject时,直接执行then回调
        // Promise.resolve().then()
        case STATUS.FULFILLED:
          // 上一次的返回值
          fulfilledFn(this._value);
          break;
        default:
          rejFn(this._value);
          break;
      }
    });
  }

  catch(errFn: call) {
    return this.then(undefined, errFn);
  }

  static resolve(value: unknown) {
    if (value instanceof MyPromise2) return value;
    return new MyPromise2((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise2((resolve, reject) => reject(reason));
  }

  static all(promiseList) {
    let index = 0;
    let arr = [];
    return new Promise((resolve, reject) => {
      promiseList.forEach((p, i) => {
        MyPromise2.resolve(p)
          .then((res) => {
            arr[i++] = res;
            if (i === index) {
              resolve(arr);
            }
          })
          // 有一个Promise被reject时，MyPromise的状态变为reject
          .catch((err) => {
            reject(err);
          });
      });
    });
  }

  // Promise.race(iterable)方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
  static race(promiseList) {
    return new MyPromise2((resolve, reject) => {
      promiseList.forEach((p) => {
        MyPromise2.resolve(p).then(resolve, reject);
      });
    });
  }

  // TODO:
  //finally方法
  finally(callback) {
    return this.then(
      // MyPromise.resolve执行回调,并在then中return结果传递给后面的Promise
      // https://www.jianshu.com/p/f0b94daf9bf7
      (value) => MyPromise2.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise2.resolve(callback()).then(() => {
          throw reason;
        }) // reject同理
    );
  }
}
