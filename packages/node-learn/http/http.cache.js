const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const mime = require("mime");

function httpFilter(url) {
    return new Promise((resolve, reject) => {
        const white = ["/favicon.ico"];
        if (white.includes(url)) resolve(null);
        else resolve(url);
    });
}

function writeHead(
        code,
        { ContentType = 'text/html; charset="utf-8"', CacheControl = "no-cache" } = {}
        ) {
    if (this && this.writeHead && this.writeHead instanceof Function) {
        this.writeHead(code, {
            "Content-Type": ContentType,
            'Cache-Control':CacheControl,
        });
    }
}

const service = http.createServer(async (req, res) => {
    const prefixFile = "static";
    let { url: httpUrl } = req;
    httpUrl = await httpFilter(httpUrl);
    if (httpUrl === null) {
        res.end(null);
        return;
    }
    let filePath = path.resolve(
            __dirname,
            path.join(prefixFile, url.fileURLToPath(`file:///${httpUrl}`))
            );
    if (fs.existsSync(filePath)) {
        // 获取文件信息
        const stats = fs.statSync(filePath);
        const isDirectory = stats.isDirectory();
        // 是一个文件夹 默认返回改文件夹下的 index.html
        if (isDirectory) {
            filePath = path.join(filePath, "index.html");
        }
        if (fs.existsSync(filePath)) {
            const { ext } = path.parse(filePath);
            // 添加缓存信息
            writeHead.call(res, 200, {
                ContentType: mime.getType(ext),
                CacheControl: "max-age=60000",
            });
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
            return;
        }
    }
    writeHead.call(res, 404);
    res.end("<h1>404 page not found");
});

service.listen(8080, () => {
    console.log("services: http://localhost:8080");
});
