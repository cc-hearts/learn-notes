/**
 * @author cc-heart
 * @description async/await 自动状态的实现
 * @Date 2022-11-15
 */
function run(gen) {
  return new Promise((resolve, reject) => {
    const g = gen();
    // 执行了3次
    function _next(val?) {
      try {
        var res = g.next(val);
      } catch (e) {
        reject(e);
      }
      if (res.done) {
        return resolve(res.value);
      }
      Promise.resolve(res.value)
        .then((res) => {
          _next(res);
        })
        .catch((err) => {
          g.throw(err);
        });
    }
    _next();
  });
}

function* myGenerator() {
  try {
    console.log("123");
    console.log(yield Promise.resolve(1));
    console.log("123");
    console.log(yield 2); //2
    console.log(yield Promise.reject("error"));
  } catch (error) {
    console.log(error);
  }
}

// const result = run(myGenerator);
//result是一个Promise
//输出 1 2 error

// 生成可迭代对象 但是函数还没有运行。
const g = myGenerator();

// 此时 yield Promise.resolve(1) 已经执行完毕 但是还没有赋值给左边
const data = g.next('213')
console.log(data);
