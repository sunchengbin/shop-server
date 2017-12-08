var webPage = require('webpage').create(),
    system = require('system'),
    Page = system.args[1];
webPage.onConsoleMessage = function (msg) {
  if (msg == 'error') {
    console.log('error')
  } else {
    console.log(msg)
  }
}
var url = 'https://item.jd.com/'+Page+'.html#comment'
webPage.open(url, function(res) {
  if (res == 'success'){
    webPage.evaluate(function() {
      var page = 0
      var sum = 0
      // 差评开始
      $('[clstag="shangpin|keycount|product|shangpinpingjia_2"]').click()
      $('[clstag="shangpin|keycount|product|chaping"]').click()
      // 差评结束
      var sInt = setInterval(function(){
        page++
        if (page > 90) {
          console.log('sum=' + sum)
          clearInterval(sInt)
        } else {
          $('#comment-5 .comment-con').each(function(i,item){
            var _this = $(this)
            var _txt = _this.text()
            var _length = _txt.length
            sum++
            // if (_length > 10 && !/但愿/g.test(_txt) && !/大概/g.test(_txt) && !/可能/g.test(_txt) && !/希望/g.test(_txt) && !/期待/g.test(_txt)) {
            if (_length > 10) {
              console.log(_txt)
            }
          })
          $('.ui-pager-next').click()
        }
      }, 2000)
    })
  }
})
