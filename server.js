const App = require('express')()
const Actions = require('./server/actions.js')
Actions(App)
//启动server
const server = App.listen(8081, function () {
  console.log("http://127.0.0.1:8081")
})
