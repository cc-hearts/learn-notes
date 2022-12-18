// 补码转原码
function b2y(num) {
    // 补码 = 源码反转 + 1
    // 源码 = ( 补码 - 1) 反转
    if (num < 0) {
        num--;
    }
    var data = num ^ 255;
    console.log(data);
    data = Number.prototype.toString.call(data, 2);
    if (typeof data === "string") {
        data = data.replace("-", "0b");
    }
    return Number(data);
}
