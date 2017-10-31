const argv = process.argv.splice(2)
const cheerio = require('cheerio')
const https = require('https')
const iconv = require('iconv-lite')
const fs = require('fs')
const excelPort = require('excel-export')
const indexUrl = 'https://www.zhihu.com/people/pingcejun/followers?page='
let Users = {}
let Page = argv[0]
let Stop = false
function exportToExcel(users){
  let conf = {}
  conf.cols = [
     {caption:'名字', type:'string', width:200},
     {caption:'性别', type:'string', width:200},
     {caption:'描述', type:'string', width:200},
     {caption:'回答', type:'number', width:200},
     {caption:'文章', type:'number', width:200},
     {caption:'关注', type:'number', width:200},
     {caption:'居住地', type:'string', width:200},
     {caption:'所在行业', type:'string', width:200},
     {caption:'职业经历', type:'string', width:200},
     {caption:'教育经历', type:'string', width:200},
     {caption:'个人简介', type:'string', width:200}
  ]
  let arr = []
  let i = 0
  try {
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
      arr[i].push((users[u].locations && users[u].locations.length && users[u].locations[0].name) ? users[u].locations[0].name : '')
      arr[i].push((users[u].business && users[u].business.name) ? users[u].business.name : '')
      arr[i].push((users[u].employments && users[u].employments.length && users[u].employments[0].company && users[u].employments[0].company.name) ? users[u].employments[0].company.name : '')
      arr[i].push((users[u].educations && users[u].educations.length && users[u].educations[0].school && users[u].educations[0].school.name) ? users[u].educations[0].school.name : '')
      arr[i].push(users[u].description || '')
      i++
    }
  } catch (e) {
    console.log(e)
    return
  }
  conf.rows = arr
  let result = excelPort.execute(conf)
  let filePath = `${__dirname}/page-${argv[2]}.xlsx`
  fs.writeFile(filePath, result, 'binary',(err) => {
    if(err){
      console.log(err)
    }
  })
}
function getOnePage (url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let chunks = []
      let i = 0
      res.on('data', (chunk) => {
        chunks.push(chunk)
      })
      res.on('end', () => {
        let titles = []
        if (chunks.length) {
          let html = Buffer.concat(chunks)
          let $ = cheerio.load(html, {decodeEntities: false})
          if ($('#data').attr('data-state')) {
            let res = JSON.parse($('#data').attr('data-state')).entities.users
            resolve(res)
          } else {
            resolve({'message': 'error'})
          }
        } else {
          resolve({'message': 'error'})
        }
      })
    }).on('error', (e) => {
      reject(e)
      console.log(e)
    })
  })
}
async function start () {
  if (Page > Number(argv[1])) {
    exportToExcel(Users)
    console.log('end')
  } else {
    console.log(`this is page ${Page}`)
    let pagePromise = await getOnePage(indexUrl + Page)
    console.log('loading...')
    if (!pagePromise.message) {
      for (let user in pagePromise) {
        if (pagePromise[user].answerCount > 100 && pagePromise[user].name !== '独孤评测') {
          console.log(`${pagePromise[user].name}'s answerCont is ${pagePromise[user].answerCount}`)
          let userPromise = await getOnePage(`https://www.zhihu.com/people/${user}/activities`)
          userPromise && Object.assign(Users, userPromise)
        }
      }
    }
    Page++
    console.log(`the ${Page} page is end`)
    start()
  }
}
start()
