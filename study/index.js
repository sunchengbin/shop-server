const eventEmitter = require('events').EventEmitter
const event = new eventEmitter()
function listen1 () {
  console.log('监听器 listen1 执行')
}
function listen2 () {
  console.log('监听器 listen2 执行')
}
event.addListener('connect', listen1)
event.on('connect', listen2)
console.log(eventEmitter.listenerCount(event, 'connect') + '个监听器监听连接事件')
event.emit('connect')
event.removeListener('connect', listen2)
event.emit('connect')
