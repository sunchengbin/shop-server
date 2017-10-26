// 初始化后端router
import Fs from 'fs'
import KoaRouter from 'koa-router'
const KoaRouterApp = KoaRouter()
const routerFiles = Fs.readdirSync(process.cwd() + '/router')
var jsRouterFiles = routerFiles.filter((f) => {
    return f.endsWith('.js')
})
jsRouterFiles.forEach((f) => {
  console.log(`process controller: ${f}...`)
  // 导入js文件:
  let file = require(process.cwd() + '/router/' + f)
  for (let param in file) {
    let fileParam = file[param]
    let type = fileParam.type
    switch (type) {
      case 'GET':
        KoaRouterApp.get(fileParam.url, fileParam.callback)
        break
      case 'POST':
        KoaRouterApp.post(fileParam.url, fileParam.callback)
        break
      default:
        break
    }
  }
})
export {
  KoaRouterApp
}
