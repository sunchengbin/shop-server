const argv = process.argv.splice(2)
const cheerio = require('cheerio')
const https = require('https')
const iconv = require('iconv-lite')
const fs = require('fs')
const excelPort = require('excel-export')
const indexUrl = 'https://www.zhihu.com/people/pingcejun/followers?page='
let Users = {}
let Page = 1
let Stop = false
function exportToExcel(users){
  let conf = {}
  conf.cols = [
     {caption:'名字', type:'string', width:200},
     {caption:'性别', type:'string', width:200},
     {caption:'描述', type:'string', width:200},
     {caption:'回答', type:'number', width:200},
     {caption:'文章', type:'number', width:200},
     {caption:'关注', type:'number', width:200}
  ]
  let arr = []
  let i = 0
  for (var u in users) {
    arr[i] = []
    arr[i].push(users[u].name)
    switch (users[u].gender) {
      case 0:
        arr[i].push('女')
        break
      case 1:
        arr[i].push('男')
        break
      default:
        arr[i].push('')
        break
    }
    arr[i].push(users[u].headline)
    arr[i].push(users[u].answerCount)
    arr[i].push(users[u].articlesCount)
    arr[i].push(users[u].followerCount)
    i++
  }
  conf.rows = arr
  let result = excelPort.execute(conf)
  let filePath = __dirname + '/page.xlsx'
  fs.writeFile(filePath, result, 'binary',(err) => {
    if(err){
      console.log(err)
    }
  })
}
function getUsersInfo (url, page) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let chunks = []
      let i = 0
      res.on('data', (chunk) => {
        chunks.push(chunk)
      })
      res.on('end', () => {
        let titles = []
        let html = Buffer.concat(chunks)
        let $ = cheerio.load(html, {decodeEntities: false})
        let res = JSON.parse($('#data').attr('data-state')).entities.users
        resolve(res)
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}
function start () {
  if (Page > Number(argv[0])) {
    exportToExcel(Users)
    console.log('end')
  } else {
    let userPromise = getUsersInfo(indexUrl + Page, Page)
    userPromise.then((users) => {
      Object.assign(Users, users)
      start()
    }, (e) => {
      console.log(e)
    })
    console.log(Page)
    Page++
  }
}
start()
