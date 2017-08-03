const InsertIndex = require('../app/index/insert_data.js')
const bodyParser = require('body-parser')
const UrlencodedParser = bodyParser.urlencoded({ extended: false })
const Express = require('express')
module.exports = (app) => {
  app.use(Express.static('public'));
  app.post('/insertIndexInfo',UrlencodedParser, function (req, res) {
    InsertIndex.insertIndex(req,(result) => {
        res.end(result)
    })
  })
}
