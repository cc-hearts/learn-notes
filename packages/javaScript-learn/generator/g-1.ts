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
    console.log(yield Promise.resolve(1));
    console.log(yield 2); //2
    console.log(yield Promise.reject("error"));
  } catch (error) {
    console.log(error);
  }
}

const result = run(myGenerator);
//result是一个Promise
//输出 1 2 error
