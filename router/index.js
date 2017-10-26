let Login = {
  type: 'GET',
  url: '/',
  callback: async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`
  }
}
let Signin = {
  type: 'POST',
  url: '/signin',
  callback: async (ctx, next) => {
    let name = ctx.request.body.name || '',
        password = ctx.request.body.password || ''
    console.log(`signin with name: ${name}, password: ${password}`)
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1><a href="/hello/sun">sun</a>`
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`
    }
  }
}
export {
  Login,
  Signin
}
