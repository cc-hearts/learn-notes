const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const zlib = require('zlib')

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
    lastModified,
    ContentEncoding
  } = {}
) {
  if (this && this.writeHead && this.writeHead instanceof Function) {
    const header = {
      'Content-Type': ContentType,
      'Cache-Control': CacheControl
    }
    if (lastModified !== void 0) {
      header['Last-Modified'] = lastModified
    }
    if (ContentEncoding !== void 0) {
      header['Content-Encoding'] = ContentEncoding
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
      const mimeType = mime.getType(ext)
      const resHeader = {
        ContentType: mimeType
      }
      isDirectory && (stats = fs.statSync(filePath))
      // 添加缓存信息
      const lastModi = req.headers['if-modified-since']
      resHeader['lastModified'] = stats.mtimeMs
      if (lastModi !== void 0 && stats.mtimeMs === Number(lastModi)) {
        writeHead.call(res, 304, resHeader)
        res.end()
        return
      }
      let zlibType = ''
      // 一般只对text 或者application进行压缩 音视频 图片文件一般都会是经过压缩的
      const flag = /^\s*(text|application)\//.test(mimeType)
      const acceptEncoding = req.headers['accept-encoding']
      if (flag && acceptEncoding) {
        // 支持压缩算法
        // 告诉浏览器是用deflate算法压缩的
        // resHeader['ContentEncoding'] = 'deflate'
        // const deflate = zlib.createDeflate()
        acceptEncoding.split(',').some(encoding => {
          if (/deflate/.test((encoding))) {
            resHeader['ContentEncoding'] = 'deflate'
            zlibType = 'createDeflate'
            return true
          }
          if (/gzip/.test(encoding)) {
            resHeader['ContentEncoding'] = 'gzip'
            zlibType = 'createGzip'
            return true
          }
          if (/br/.test(encoding)) {
            resHeader['ContentEncoding'] = 'br'
            zlibType = 'createBrotliCompress'
            return true
          }
          return false
        })
      }
      writeHead.call(res, 200, resHeader)
      const readStream = fs.createReadStream(filePath)
      if (resHeader['ContentEncoding'] !== void 0) {
        const data = zlib[zlibType] instanceof Function && zlib[zlibType]()
        if (data) {
          readStream.pipe(data).pipe(res)
          return
        }
      }
      readStream.pipe(res)
      return
    }
  }
  writeHead.call(res, 404)
  res.end('<h1>404 page not found</h1>')
})

service.listen(8080, () => {
  console.log('services: http://localhost:8080')
})
