/**
 * @author heart
 * @description
 * @Date 2022-10-15
 */

const zlib = require('zlib')

console.log(zlib)
// gzip deflate br 是三种不同的压缩算法
// 其中gzip和deflate是同一种格式(gzip)的两种不同的算法实现
// br 则是使用Brotli算法的压缩格式。

const deflate = zlib.createDeflate()

const gzip = zlib.createGzip()

const br = zlib.createBrotliCompress()

