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
const app = new Koa()
app.use(async (ctx, next) => {
  await next()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1>Hello, koa2!</h1>'
})
app.listen(2000)
console.log('koa server is starting')
