import Router from './router.js'
const router = new Router()


router.get('/detail', ({ res }, next) => {
  res.body = '345'
  next()
})

export default router
// export function install(app, router) {
//   const list = router.getRouter()
//   list.forEach(cb => {
//     app.use(cb)
//   });
// }

