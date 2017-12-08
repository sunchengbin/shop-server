// 栗子：node taobao-get-comments.js 2491437 ynby
const https = require('https')
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
     {caption:'原话', type:'string', width:2000},
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
      let contentArr = comment[u].rateContent.split(/[\n|\s|，|,]/g)
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
function getCommentsUrl (page) {
  return `https://rate.tmall.com/list_detail_rate.htm?itemId=${ProductId}&spuId=645800866&sellerId=1055530397&order=3&currentPage=${page}&append=0&content=1&tagId=&posi=&picture=&ua=098%23E1hv%2BpvEvbQvU9CkvvvvvjiPPLqw1jtWR2qWtjthPmPv6j1bRFFpljlHRLdUtjYVPsejvpvhvvpvv2yCvvpvvvvvvphvC9v9vvCvpbyCvmFMMzMbphvIC9vvvdYvpvs8vvvHvhCvHUUvvvZvphvZE9vvvdYvpCpekphvC99vvOH0B8yCvv9vvUvQa8gSf9yCvhQhU8wvC0s%2BFOcn%2B3CtpgoXlfe1RkDVK42B%2BbJZR6FaiaVnnCpSCK0n3w0AhjC8AXcBlLyzOvxr1WCl5F%2BSBiVvQbmAdcHvaNoxfBKK2QhvCPMMvvm5vpvhvvmv99%3D%3D&isg=And3GnGM4WQmq2h2qA9qNzXUBm1tLGD8aJOuB8kkn8ateJe60Qzb7jXaLO7d&needFold=0&_ksTS=1512715243849_884&callback=callback`
}
async function getComments (page) {
  let commentUrl = getCommentsUrl(page)
  let comment = await getData(commentUrl)
  comment = JSON.parse(comment.replace('callback(','').replace(');',''))
  return comment
}
let start = async () => {
  let commentPage = 1
  let comments = []
  let comment = await getComments(commentPage)
  let maxPage = Math.ceil(comment.rateDetail.rateCount.total / 20)
  comments = comments.concat(comment.rateDetail.rateList)
  let log = `=`
  if (maxPage > 1) {
    for (let i = 2;i < 4;i++) {
      let com = await getComments(i)
      if (com.rateDetail.rateList.length) {
        comments = comments.concat(com.rateDetail.rateList)
      } else {
        break
      }
    }
  }
  console.log('comments: '+ comments.length)
  // exportToExcel(comments)
}
start()
