import { MyPromise2 } from "./promise-2";
function func(con) {
  const p1 = new con((resolve, reject) => {
      resolve(1)
  });

  p1.then((res) => {
    console.log(res);
    //then回调中可以return一个Promise
    return new con((resolve, reject) => {
      setTimeout(() => {
        resolve(2);
      }, 1000);
    });
  })
    .then((res) => {
      console.log(res);
      //then回调中也可以return一个值
      return 3;
    })
    .then((res) => {
      console.log(res);
    });
}

func(Promise);
func(MyPromise2);
