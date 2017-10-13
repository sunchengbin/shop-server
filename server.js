// const App = require('express')()
// const Actions = require('./server/actions.js')
// App.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By",' 3.2.1')
//   if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
//   else  next();
// });
// Actions(App)
// //启动server
// const server = App.listen(8081, function () {
//   console.log('已启动服务器',"http://127.0.0.1:8081")
// })
const Koa = require('koa')
const App = new Koa()
const KoaRouter = require('koa-router')()
const BodyParser = require('koa-bodyparser')
import {Login, Signin} from './router/index'
app.use(BodyParser())
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  await next()
})
// add url-router
// KoaRouter.get('/hello/:name', async (ctx, next) => {
//   let name = ctx.params.name
//   ctx.response.body = `<h1>hello,${name}</h1>`
// })
// KoaRouter.get('/', async (ctx, next) => {
//   ctx.response.body = `<h1>Index</h1>
//         <form action="/signin" method="post">
//             <p>Name: <input name="name" value="koa"></p>
//             <p>Password: <input name="password" type="password"></p>
//             <p><input type="submit" value="Submit"></p>
//         </form>`
// })
// KoaRouter.post('/signin', async (ctx, next) => {
//     let name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`signin with name: ${name}, password: ${password}`);
//     if (name === 'koa' && password === '12345') {
//         ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
//     } else {
//         ctx.response.body = `<h1>Login failed!</h1>
//         <p><a href="/">Try again</a></p>`;
//     }
// });
KoaRouter.get(Login.url, Login.callback)
KoaRouter.post(Signin.url, Signin.callback)
App.use(KoaRouter.routes())
App.listen(2000)
console.log('koa server is starting')
console.log('the link is http://localhost:2000')
