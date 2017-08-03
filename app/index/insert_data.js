const DbsConnect = require('../../server/dbsconnect.js')
const Response = require('../common/response.js')
const Config = require('../../server/config.js')
let index_data = {
   title: 'this is the index page',
   name: 'sunchengbin',
   data: {
       userInfo: {
           name: 'sunchengbin',
           url:'http://www.badu.com'
       },
       items:[
          {
            name: '锤子手机',
            images: ['https://m.360buyimg.com/n12/jfs/t5335/39/1553366100/209772/32105f74/5911bac3N5d51d2aa.jpg!q70.jpg'],
            description: '锤子手机'
          }
       ]
   }
}

module.exports = {
  insertIndex: (data,callback) => {
    DbsConnect.connect(function(db){
      const collection = db.collection(Config.dbtable.collection)
      collection.insert(data,function(err,result){
        result = Response(err,result)
        console.log(result)
        callback && callback(result)
        db.close()
        console.log("关闭成功！")
      })
    })
  }
}
