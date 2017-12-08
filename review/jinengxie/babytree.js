const argv = process.argv.splice(2)
const cheerio = require('cheerio')
const http = require('http')
const iconv = require('iconv-lite')
const fs = require('fs')
const StartPage = Number(argv[0])
const MaxPage = Number(argv[1])
const Name = argv[2]
const KeyWord = argv[3]
const excelPort = require('excel-export')
function getQuestionData (url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
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
          if ($('.search_item').length) {
            let results = []
            $('.search_item').each(function (i, item){
              var _this = $(this)
              results.push({
                content: _this.find('.search_item_tit').text().replace(/[\n|\s]/g,''),
                answerUrl: _this.find('a').attr('href'),
                num: Number(_this.find('.search_num').text().match(/\d+/g)[0])
              })
            })
            resolve(results)
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
function getAnswerData (url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
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
          if ($('.answer-text').length) {
            let results = []
            $('.answer-text').each(function (item, i) {
              let _this = $(this)
              results.push({
                content: _this.text().replace(/[\n|\s]/g,'')
              })
            })
            resolve(results)
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
function getQuestionUrl (page) {
  return `http://www.babytree.com/s.php?q=${encodeURI(KeyWord)}&c=ask&cid=0&pg=${page}`
}
function exportToExcel (question, config) {
  config = config || {}
  config.cols = [
     {caption:'问题', type:'string', width:2000},
     {caption:'回答数', type:'number', width:200},
     {caption:'问题答案', type:'string', width:200},
     {caption:'问题url', type:'string', width:200}
  ]
  let arr = []
  let i = 0
  try {
    question.forEach((ques, j) => {
      ques.answers.forEach((ans, k) => {
        arr[i] = []
        arr[i].push(ques.question.content)
        arr[i].push(Number(ques.question.num))
        arr[i].push(ans.content)
        arr[i].push(ques.question.answerUrl)
        i++
      })
    })
  } catch (e) {
    console.log(e)
    return
  }
  config.rows = arr
  let result = excelPort.execute(config)
  let filePath = `${__dirname}/question-${Name}.xlsx`
  fs.writeFile(filePath, result, 'binary',(err) => {
    if(err){
      console.log(err)
    }
  })
}
async function start () {
  let questions = []
  let questionsAndAnswer = []
  let log = `=`
  if (StartPage >= MaxPage) {
    console.log('起始页码不小于最大页码数')
    return
  }
  for (let i = StartPage;i < MaxPage;i++) {
    let url = getQuestionUrl(i)
    console.log(url)
    let question = await getQuestionData(url)
    questions = questions.concat(question)
  }
  for (let j = 0;j < questions.length;j++) {
    let answers = []
    if (questions[j].num > 0) {
      let answer = await getAnswerData(questions[j].answerUrl)
      answers = answers.concat(answer)
      let maxPage = Math.ceil(questions[j].num/10)
      if (maxPage > 1) {
        for (let k = 2;k < (maxPage + 1);k++) {
          let questionId = questions[j].answerUrl.match(/\d+$/g)[0]
          answerUrl = `http://www.babytree.com/ask/myqa__view~qdetail,qid~${questionId},pg~${k}#anchor_answer`
          answer = await getAnswerData(answerUrl)
          answers = answers.concat(answer)
        }
      }
    }
    questionsAndAnswer.push({
      question: questions[j],
      answers: answers
    })
    console.log(log)
    log += `=`
  }
  console.log(questionsAndAnswer.length)
  exportToExcel(questionsAndAnswer)
}
start()
