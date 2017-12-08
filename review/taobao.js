var webPage = require('webpage').create(),
    system = require('system'),
    page = Number(system.args[1]),
    pageMax = Number(system.args[2]);
webPage.onConsoleMessage = function (msg) {
  if (msg == 'error') {
    console.log(page)
  } else {
    console.log(msg)
  }
}
setInterval(function(){
  if (page > pageMax) {
    phantom.exit()
  }
  var url = 'https://rate.tmall.com/list_detail_rate.htm?itemId=525535549726&spuId=467602184&sellerId=2707252427&order=3&currentPage='+page+'&append=0&content=1&tagId=&posi=&picture=&ua=098%23E1hvAQvPvBQvUvCkvvvvvjiPPLqvsjtWRLFOljivPmPUtjYWRLFhAjiWR2SO1jlhRphvCvvvphmCvpvWzPs2cxzNznsw3Yn4dphvHU7vUAvKvvvK9AZNLU71%2BuVzrkEndphvHU7vSfyJvvmeCoZNcweHns89RFBV9phv2nQGAxzBqYswzj%2Fb7uwCvvpvvhHh2QhvCvvvMMGCvpvVvUCvpvvvkphvC9hvpyjOA8yCvv9vvhh3Wh0vPdyCvmFMMqgivvmm9vvvBkvvvUUovvC8o9vv9Dvvvhi8vvmmQ9vvBkvvvUbmmphvLvVNPL6at8TJVCODN%2BLZdigOHkx%2F1WAK53hKnpcUQC%2BKK33Apw11K39XemBglwvXV3yKnpcU1CQKK33ApJC1K39XVcOulwvXebvKnpZtvpvhvvCvpUwCvvpv9hCvRphvCvvvphv%3D&isg=AhgYt-5f9uRdm9fLE6L9Ah6h6UAGEaZUk-YxGlIJHNNK7bnX-hAlG8wPUROm&needFold=0&_ksTS=1512035279478_1562&callback=cb'
  webPage.open(url, function(res) {
    page++
    if (res == 'success'){
      webPage.evaluate(function() {
        window.cb = function(data){
          if (!data || !data.rateDetail || !data.rateDetail.rateList) {
            console.log('error')
          } else {
            var rateList = data.rateDetail.rateList
            for (var i = 0; i < rateList.length; i++) {
              // if (Number(rateList[i].rateDate.split('-')[1]) < 11) {
                console.log(rateList[i].rateContent)
              // }
            }
          }
        }
        eval(document.getElementsByTagName('body')[0].innerText)
      })
    }
  })
}, 3000)
