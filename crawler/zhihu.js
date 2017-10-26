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
  var conf = {}
  conf.cols = [
     {caption:'名字', type:'string', width:200},
     {caption:'性别', type:'string', width:200},
     {caption:'描述', type:'string', width:200},
     {caption:'回答', type:'number', width:200},
     {caption:'文章', type:'number', width:200},
     {caption:'关注', type:'number', width:200}
  ]
  var arr = []
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
    console.log(arr[i])
    i++
  }
  conf.rows = arr
  var result = excelPort.execute(conf)
  var filePath = __dirname + '/page1.xlsx'
  fs.writeFile(filePath, result, 'binary',function(err){
    if(err){
      console.log(err)
    }
  })
}
function getUsersInfo (url, page) {
  if (page > 1002) {
    Stop = true
    exportToExcel(Users)
    console.log(page)
  } else {
    https.get(url, function(res) {
     var chunks = []
     var i = 0
     res.on('data', function(chunk) {
       chunks.push(chunk)
     })
     res.on('end', function() {
       var titles = []
       var html = Buffer.concat(chunks)
       var $ = cheerio.load(html, {decodeEntities: false})
       $('.UserLink-link').each((index, element) => {
         var $element = $(element)
       })
       var res = JSON.parse($('#data').attr('data-state')).entities.users
       Object.assign(Users, res)
       start()
     })
   })
  }
}
function start () {
  let st = setTimeout(() => {
    if (!Stop) {
      getUsersInfo(indexUrl + Page, Page)
      console.log(Page)
      Page++
    } else {
      console.log('end')
      clearTimeout(st)
    }
  },2000)
}
start()
