/**
 * @author cc-heart
 * @description Promise 超级简易版本 不支持链式调用
 * @Date 2022-11-15
 */

import type { call } from "./types";
export class MyPromise1 {
  // 收集 then 成功的回调队列
  private _resolveQueue: Array<call> = [];
  // 收集 then 失败的回调队列
  private _rejectQueue: Array<call> = [];

  // promise的 executor
  constructor(executor: (_resolve, reject) => void) {
    executor(this._resolve, this._reject);
  }

  // this 在里面调用 方式找不到值
  private _resolve = (val: unknown) => {
    // 由于then 中还可以使用 myPromiseInstance 去.then 放弃使用slice拷贝数组
    while (this._resolveQueue.length) {
      const call = this._resolveQueue.shift()!;
      call instanceof Function && call(val);
    }
  };

  private _reject(err: unknown) {
    // reject 同理
    while (this._rejectQueue.length) {
      const call = this._rejectQueue.shift();
      call instanceof Function && call(err);
    }
  }

  then(resolveFn?: call, rejectFn?: call) {
    resolveFn && this._resolveQueue.push(resolveFn);
    rejectFn && this._rejectQueue.push(rejectFn);
  }
}
