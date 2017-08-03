module.exports = (err,result) => {
  if(err) return {code:500,message:err}
  return {code:200,data:result}
}
