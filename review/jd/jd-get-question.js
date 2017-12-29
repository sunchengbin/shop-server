// 栗子：node jd-get-question 2491437 ynby
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
          // let response = iconv.decode(buf, 'GBK')
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
function exportToExcel (question, config) {
  config = config || {}
  config.cols = [
     {caption:'问题', type:'string', width:2000},
     {caption:'问题ID', type:'number', width:200},
     {caption:'问题答案', type:'string', width:200}
  ]
  let arr = []
  let i = 0
  try {
    question.forEach((ques, j) => {
      ques.answers.forEach((ans, k) => {
        arr[i] = []
        arr[i].push(ques.question.content)
        arr[i].push(Number(ques.question.id))
        arr[i].push(ans.content)
        i++
      })
    })
  } catch (e) {
    console.log(e)
    return
  }
  config.rows = arr
  let result = excelPort.execute(config)
  let filePath = `${__dirname}/xlsx/question-${Name}.xlsx`
  fs.writeFile(filePath, result, 'binary',(err) => {
    if(err){
      console.log(err)
    }
  })
}
function getQuestionUrl (page) {
  return `https://question.jd.com/question/getQuestionAnswerList.action?callback=callback&page=${page}&productId=${ProductId}`
}
async function getQuestion (page) {
  let questionUrl = getQuestionUrl(page)
  let question = await getData(questionUrl)
  question = JSON.parse(question.replace('callback(','').replace(');',''))
  return question
}
function getAnswerUrl (page, id) {
  return `https://question.jd.com/question/getAnswerListById.action?callback=callback&page=${page}&questionId=${id}`
}
async function getAnswers (page, id) {
  let answerUrl = getAnswerUrl(page, id)
  let answer = await getData(answerUrl)
  answer = JSON.parse(answer.replace('callback(','').replace(');',''))
  return answer
}
let start = async () => {
  let questionPage = 1
  let questions = []
  let questionsAndAnswer = []
  let question = await getQuestion(questionPage)
  let maxPage = Math.ceil(question.totalItem / 10)
  questions = questions.concat(question.questionList)
  let log = `=`
  if (maxPage > 1) {
    for (let i = 2;i < (maxPage + 1);i++) {
      let ques = await getQuestion(i)
      questions = questions.concat(ques.questionList)
    }
  }
  for (let l = 0;l < questions.length;l++) {
    await (async (qes) => {
      let qesId = qes.id
      let answerPage = 1
      let answers = []
      let answer = await getAnswers(answerPage, qesId)
      answers = answers.concat(answer.answers)
      let answerMaxPage = Math.ceil(answer.moreCount / 10)
      if (answerMaxPage > 1) {
        for (let k = 2;k < (answerMaxPage + 1);k++) {
          let ans = await getAnswers(k, qesId)
          answers = answers.concat(ans.answers)
        }
      }
      questionsAndAnswer.push({
        'question': qes,
        'answers': answers
      })
      console.log(log)
      log += `=`
    })(questions[l])
  }
  console.log('questionsAndAnswer'+ questionsAndAnswer.length)
  exportToExcel(questionsAndAnswer)
}
start()
