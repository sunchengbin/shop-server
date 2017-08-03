const GetIndex = require('../app/index/get_index.js')
module.exports = (app) => {
  app.get('/getIndexInfo', function (req, res) {
    GetIndex.getIndex(req,(result) => {
        res.send(result)
    })
  })
}
