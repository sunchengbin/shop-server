// 栗子 node jd-get-comments.js 11773821015 90 obq
const https = require('https')
const argv = process.argv.splice(2)
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const ProductId = argv[0]
const MaxPage = Number(argv[1])
const Name = argv[2]
const fs = require('fs')
const excelPort = require('excel-export')
let getComment = async (url) => {
  return new Promise((resolve, reject) => {
    console.log(url)
    https.get(url, (res) => {
      let chunks = []
      let i = 0
      res.on('data', (chunk) => {
        chunks.push(chunk)
      })
      res.on('end', () => {
        if (chunks.length) {
          let buf = Buffer.concat(chunks)
          let response = iconv.decode(buf, 'GBK')
          resolve(response)
        } else {
          resolve({'message': 'error'})
        }
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}
function testComment (content) {
  let obj = null
  if (content.length > 10 && !/但愿/g.test(content) && !/大概/g.test(content) && !/可能/g.test(content) && !/希望/g.test(content) && !/期待/g.test(content)) {
    obj = {}
    obj['content'] = content
    obj['noNumber'] = 0
    obj['keyWordOneOne'] = getHadKeyWord('oneOne', content)
    obj['keyWordOneTwo'] = getHadKeyWord('oneTwo', content)
    obj['keyWordTwoOne'] = getHadKeyWord('twoOne', content)
    obj['keyWordTwoTwo'] = getHadKeyWord('twoTwo', content)
  }
  return obj
}
function getHadKeyWord (type, content) {
  let keyWords = []
  let config = {
    oneOne: ["生发", "脱发变少", "脱发也好多了", "脱发好些", "减少掉发", "掉发变少", "掉头发少", "掉发越来越少", "长出", "茂密"],
    oneTwo: ["掉", "掉发", "长不出来", "掉的更多", "掉的更快", "会掉头发", "发际线更高", "稀疏"],
    twoOne: ["舒服", "出油少", "头屑变少", "头屑减少", "控油"],
    twoTwo: ["痒", "头屑多", "辣辣的", "刺激"],
    denyWord: ["不", "无", "非", "莫", "勿", "未", "不要", "不必", "没有"]
  }
  let num = 0
  config[type].forEach((txt,i) => {
    let reg = new RegExp(txt)
    if (reg.test(content)) {
      config['denyWord'].forEach((deny, k) => {
        let denyReg = new RegExp(deny)
        if (denyReg.test(content)) {
          num++
        }
      })
      keyWords.push(txt)
    }
  })
  let reStr = num > 0 ? '/' + num : ''
  return keyWords.join(',') + reStr
}
function exportToExcel (comment, config) {
  config = config || {}
  config.cols = [
     {caption:'话', type:'string', width:2000},
     {caption:'contentId', type:'number', width:200},
     {caption:'关键词1.1', type:'string', width:200},
     {caption:'关键词1.2', type:'string', width:200},
     {caption:'关键词2.1', type:'string', width:200},
     {caption:'关键词2.2', type:'string', width:200}
  ]
  let arr = []
  let i = 0
  try {
    for (var u in comment) {
      let contentArr = comment[u].content.split(/[\n|\s|，|,]/g)
      contentArr.forEach((conArr, j) => {
        let contentObj = testComment(conArr)
        if (contentObj !== null) {
          arr[i] = []
          arr[i].push(contentObj.content)
          arr[i].push(Number(comment[u].id))
          arr[i].push(contentObj.keyWordOneOne)
          arr[i].push(contentObj.keyWordOneTwo)
          arr[i].push(contentObj.keyWordTwoOne)
          arr[i].push(contentObj.keyWordTwoTwo)
          i++
        }
      })
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
let start = async () => {
  let page = 1
  let comments = []
  let setInt = setInterval(async () => {
    if (page > MaxPage) {
      if (!comments.length) return
      exportToExcel(comments)
      clearInterval(setInt)
    } else {
      let Url = `https://sclub.jd.com/comment/productPageComments.action?callback=callback&productId=${ProductId}&score=0&sortType=5&page=${page}&pageSize=10&isShadowSku=0&rid=0&fold=1`
      let comment = await getComment(Url)
      comment = JSON.parse(comment.replace('callback(','').replace(');',''))
      comments = comments.concat(comment.comments)
      if (!comment.comments.length) {
        console.log(`not have data: ${comments.length}`)
        page = MaxPage + 1
      } else {
        console.log(comments.length)
        page++
      }
    }
  },1000)
}
start()
