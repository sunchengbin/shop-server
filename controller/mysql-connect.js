import Sequelize from 'sequelize'
import MysqlConfig from './mysql-config'
import {Operate} from './mysql-operate'
const Config = MysqlConfig.MYSQLCONFIG
// 创建数据库连接池
let SeqExample = new Sequelize(Config.database, Config.username, Config.password, {
    host: Config.host,
    port: Config.port,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000,
      acquire: 30000
    }
})
let getResult = async function(){
  let res = await SeqExample.query('select * from zhenduan_oral where id = 2', { type: Sequelize.QueryTypes.SELECT }).spread((results) => {
    return results
  })
  console.log(res)
  console.log('select is success')
  await SeqExample.close()
  console.log('connect is close')
}
getResult()
