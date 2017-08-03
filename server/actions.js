const GetAction = require('./get_action.js')
const PostAction = require('./post_action.js')
module.exports = (app) => {
  GetAction(app)
  PostAction(app)
}
