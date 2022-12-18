import path from "path";
import { parse } from "url";
import { callback } from "../types.js";

export function check(rule: string, pathname: string) {
  // 匹配路由规则
  const paraMatched = rule.match(/:[^/]+/g);

  const ruleExp = new RegExp(`^${rule.replace(/:[^/]+/g, '([^/]+)')}$`);

  const ruleMatched = pathname.match(ruleExp)

  if (ruleMatched) {
    const res = {}
    if (paraMatched) {
      for (let i = 0; i < paraMatched.length; i++) {
        res[paraMatched[i].slice(1)] = ruleMatched[i + 1]
      }
    }
    return res
  }
  return null
}

function route(method, rule, aspect) {
  return async (ctx, next) => {
    const req = ctx.req;
    if (!ctx.url) ctx.url = parse(`http://${req.headers.host}${req.url}`);
    // 检查是否有 /test/:index 这种路由匹配情况
    const checked = check(rule, ctx.url.pathname)
    if (!!checked && !ctx.route && (req.method === method || method === '*')) {
      ctx.route = checked
      await aspect(ctx, next)
    } else {
      // 路径不对 跳过当前的切面 直接执行下一个切面
      await next()
    }
  }
}

class Router {
  public baseURL = ''
  public routerList: callback[]
  constructor(base = '') {
    this.baseURL = base;
    this.routerList = []
  }

  getRouter() {
    return this.routerList
  }

  get(rule, aspect) {
    this.routerList.push(route('GET', path.join(this.baseURL, rule), aspect))
  }

  post(rule, aspect) {
    this.routerList.push(route('POST', path.join(this.baseURL, rule), aspect))
  }

  put(rule, aspect) {
    this.routerList.push(route('PUT', path.join(this.baseURL, rule), aspect))
  }

  delete(rule, aspect) {
    this.routerList.push(route('DELETE', path.join(this.baseURL, rule), aspect))
  }

  all(rule, aspect) {
    this.routerList.push(route('*', path.join(this.baseURL, rule), aspect))
  }
}

export default Router