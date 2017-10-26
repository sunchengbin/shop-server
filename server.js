import Koa from 'koa'
import BodyParser from 'koa-bodyparser'
import { KoaRouterApp } from './controller/index'
const App = new Koa()
App.use(BodyParser())
App.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  await next()
})
App.use(KoaRouterApp.routes())
App.listen(2000)
console.log('koa server is starting, the link is http://www.shopserver')
