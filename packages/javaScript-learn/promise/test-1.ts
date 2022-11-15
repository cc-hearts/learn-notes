import { MyPromise1 } from "./promise-1";

function func(con) {
  const data = new con((resolve, reject) => {
      resolve("1");
  });

  data.then((res) => {
    console.log(res, "1");
  });

  data.then((res) => {
    console.log(res, "2");
    data.then((res) => {
      console.log(res, 3);
    });
  });
  data.then();
}

console.log("------------promise start------------");
func(Promise)
console.log("------------promise end--------------");

console.log("------------promise1 start------------");
func(MyPromise1)
console.log("------------promise1 end--------------");
