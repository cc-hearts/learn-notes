const http = require('http')
const serve = http.createServer((req, res) => {
  console.log(req.method) // 请求方法
  console.log(req.headers.accept) // 请求所接受的类型
  console.log(req.url) // 请求的url
  // 浏览器默认的请求是不带 application/json 的形式的
  if (req.method === 'POST' || req.headers.accept.includes('application/json')) {
    res.end('application/json')
    return
  }
  res.end('hello world')
})

serve.listen(8080, () => {
  console.log('services: http://localhost:8080')
})