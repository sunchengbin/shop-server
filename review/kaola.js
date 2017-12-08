var webPage = require('webpage').create(),
    system = require('system');
webPage.onConsoleMessage = function (msg) {
  if (msg == 'error') {
    console.log('error')
  } else {
    console.log(msg)
  }
}
var url = 'https://www.kaola.com/product/1577228.html'
webPage.open(url, function(res) {
  if (res == 'success'){
    webPage.includeJs('https://code.jquery.com/jquery-3.2.1.min.js',function(){
      webPage.evaluate(function() {
        var page = 0
        $('[data-info="j-userrating"]').click()
        setTimeout(function(){
          var sInt = setInterval(function(){
            page++
            if (page > 2) {
              clearInterval(sInt)
            } else {
              $('.itemDetail').each(function(i,item){
                var _this = $(this)
                console.log(_this.text().replace(/\n/g,'').replace(/\s/g,''))
              })
              $('.pagenxt').click()
            }
          }, 2000)
        },1000)
      })
    })
  }
})
