const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const checksum = require('checksum')

function httpFilter(url) {
  return new Promise((resolve, reject) => {
    const white = ['/favicon.ico']
    if (white.includes(url)) resolve(null)
    else resolve(url)
  })
}

function writeHead(
  code,
  {
    ContentType = 'text/html; charset="utf-8"',
    CacheControl = 'no-cache',
    eTag
  } = {}
) {
  if (this && this.writeHead && this.writeHead instanceof Function) {
    const header = {
      'Content-Type': ContentType,
      'Cache-Control': CacheControl
    }
    if (eTag !== void 0) {
      header['ETag'] = eTag
    }
    this.writeHead(code, header)
  }
}

const service = http.createServer(async (req, res) => {
  const prefixFile = 'static'
  let { url: httpUrl } = req
  httpUrl = await httpFilter(httpUrl)
  if (httpUrl === null) {
    res.end(null)
    return
  }
  let filePath = path.resolve(
    __dirname,
    path.join(prefixFile, url.fileURLToPath(`file:///${httpUrl}`))
  )
  if (fs.existsSync(filePath)) {
    // 获取文件信息
    let stats = fs.statSync(filePath)
    const isDirectory = stats.isDirectory()
    // 是一个文件夹 默认返回改文件夹下的 index.html
    if (isDirectory) {
      filePath = path.join(filePath, 'index.html')
    }
    if (fs.existsSync(filePath)) {
      const { ext } = path.parse(filePath)
      const resHeader = {
        ContentType: mime.getType(ext)
      }
      // 添加缓存信息
      const eTag = req.headers['if-none-match']
      checksum.file(filePath, (err, sum) => {
//        console.log('checksum:', sum)
//        console.log('If-None-Match:', eTag)
        resHeader['eTag'] = sum
        if (sum === eTag) {
          writeHead.call(res, 304, resHeader)
          res.end()
          return
        }
        writeHead.call(res, 200, resHeader)
        const readStream = fs.createReadStream(filePath)
        readStream.pipe(res)
        return
      })
    }
  } else {
    writeHead.call(res, 404)
    res.end('<h1>404 page not found')
  }
})

service.listen(8080, () => {
  console.log('services: http://localhost:8080')
})
