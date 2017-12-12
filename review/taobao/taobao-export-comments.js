// 栗子：node taobao-export-comments.js 2491437 ynby
const https = require('http')
const argv = process.argv.splice(2)
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const ProductId = argv[0] // 商品id
const Name = argv[1] // 产生的xlsx文件名后缀
const fs = require('fs')
const excelPort = require('excel-export')
let getData = async (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let chunks = []
      let i = 0
      res.on('data', (chunk) => {
        chunks.push(chunk)
      })
      res.on('end', () => {
        if (chunks.length) {
          let buf = Buffer.concat(chunks)
          resolve(buf.toString())
        } else {
          resolve({'message': 'error'})
        }
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}
function exportToExcel (comments, config) {
  config = config || {}
  config.cols = [
     {caption:'原话', type:'string', width:2000},
     {caption:'contentId', type:'string', width:200},
     {caption:'关键词1.1', type:'string', width:200},
     {caption:'关键词1.2', type:'string', width:200},
     {caption:'关键词2.1', type:'string', width:200},
     {caption:'关键词2.2', type:'string', width:200}
  ]
  let arr = []
  let i = 0
  try {
    for (var u in comments) {
      arr[i] = []
      arr[i].push(comments[u].comment)
      arr[i].push(comments[u].comment_id)
      arr[i].push(comments[u].one_one)
      arr[i].push(comments[u].one_two)
      arr[i].push(comments[u].two_one)
      arr[i].push(comments[u].two_two)
      i++
    }
  } catch (e) {
    console.log(e)
    return
  }
  config.rows = arr
  let result = excelPort.execute(config)
  let filePath = `${__dirname}/xlsx/comment-${Name}.xlsx`
  fs.writeFile(filePath, result, 'binary',(err) => {
    if(err){
      console.log(err)
    }
  })
}
function getCommentsUrl () {
  return `http://api.zerotoone.com/v1/getComments/${ProductId}`
}
async function getComments () {
  let commentUrl = getCommentsUrl()
  let comment = await getData(commentUrl)
  return comment
}
let start = async () => {
  let comment = await getComments()
  comment = JSON.parse(comment.replace(/\\/g,''))
  if (comment.code === 200) {
    exportToExcel(comment.data)
  } else {
    console.log(`comment.code:${comment.code}`)
  }
}
start()
