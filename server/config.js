//数据库链接地址和数据库名字,还有table名
module.exports = {
  db:{
    url: 'mongodb://localhost:27017/'//使用时后面添加库名
  },
  dbtable : {
    name:'express',
    collection:'express'
  }
}
