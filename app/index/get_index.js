const DbsConnect = require('../../server/dbsconnect.js')
const Response = require('../common/response.js')
const Config = require.('../../server/config.js')
module.exports = {
  getIndex: (req,callback) => {
    DbsConnect.connect(function(db){
      const collection = db.collection(Config.dbtable.collection)
      collection.find({title:"sun"}).toArray(function(err,result){
        result = Response(err,result)
        console.log(result)
        callback && callback(result)
        db.close()
        console.log("关闭成功！")
      })
    })
  }
}
