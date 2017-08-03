const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const Config = require('./config.js')
const Dburl = Config.db.url + Config.dbtable.name

module.exports = {
  connect: (callback)=>{
    MongoClient.connect(Dburl, function(err, db) {
        if(err){
          console.log(err)
          return
        }
        console.log("连接成功！")
        callback && callback(db)
    })
  }
}
