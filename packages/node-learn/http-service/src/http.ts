import { Interceptor } from "./interceptor.js";
import {  createServer,  IncomingMessage, ServerResponse } from "http";
import type { callback } from "../types";
import Router from "./router.js";
const noop = () => {};
export default class {
  service: import("./http").Server<
    typeof IncomingMessage,
    typeof ServerResponse
  >;
  private interceptor: Interceptor;
  constructor() {
    this.interceptor = new Interceptor();

    this.service = createServer(
      async (
        req,
        res: ServerResponse<IncomingMessage> & {
          req: IncomingMessage;
        }
      ) => {
        // 等待切面的执行
        await this.interceptor.run({ req, res });
        if (!res.writableFinished) {
          let body = Reflect.get(res, "body") || "200 OK";
          if (body.pipe) {
            body.pipe(res);
          } else {
            if (
              typeof body !== "string" &&
              res.getHeader("Content-Type") === "application/json"
            ) {
              body = JSON.stringify(body);
            }
            res.end(body);
          }
        }
      }
    );

    this.service.on("clientError", (err, socket) => {
      console.log(err);
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });
  }

  listen(opts: number | Record<string, unknown>, cb: callback = () => {}) {
    if (typeof opts === "number") {
      opts = { port: opts };
    }
    opts.host = opts.host || "0.0.0.0";
    console.log(`Starting up http-server
    http://${opts.host}:${opts.port}`);
    this.service.listen(opts, () => cb(this.service));
  }

  use(aspect: callback | string, router?: Router) {
    console.log(router);
    if (typeof aspect === "string") {
      this.interceptor.use(async (ctx, next) => {
        const url = ctx.req.url as string;
        if (aspect === "*" || url.startsWith(aspect)) {
          if (router) {
            const route = router.getRouter();
            ctx.req.url = url.replace(new RegExp(`^${aspect}`), "");
            route.forEach((call) => {
              call instanceof Function && call(ctx, noop);
            });
            ctx.req.url = url;
          }
        }
        next();
      });
    } else {
      this.interceptor.use(aspect);
    }
  }
}
