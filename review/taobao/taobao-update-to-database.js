// 栗子 phantomjs taobao-update-to-database.js 1 3 43957459520
// https://detail.tmall.hk/hk/item.htm?spm=a220m.1000858.1000725.22.46e3dd76eJ91vC&id=558385670021&areaId=110100&user_id=2549841410&cat_id=2&is_b=1&rn=765564d552da962d8c726db6869ffbae
// https://detail.tmall.com/item.htm?spm=a230r.1.14.20.616c0232khOPvL&id=43957459520&ns=1&abbucket=3&skuId=3687315811558
// https://detail.tmall.com/item.htm?id=545436853162&skuId=3455057059484
var webPage = require('webpage').create(),
    system = require('system'),
    page = Number(system.args[1]),
    pageMax = Number(system.args[2]),
    productId = Number(system.args[3]);
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
  var url = 'https://rate.tmall.com/list_detail_rate.htm?itemId='+ productId +'&spuId=645800866&sellerId=1055530397&order=3&currentPage=' +page+ '&append=0&content=1&tagId=&posi=&picture=&ua=098%23E1hv%2BpvEvbQvU9CkvvvvvjiPPLqw1jtWR2qWtjthPmPv6j1bRFFpljlHRLdUtjYVPsejvpvhvvpvv2yCvvpvvvvvvphvC9v9vvCvpbyCvmFMMzMbphvIC9vvvdYvpvs8vvvHvhCvHUUvvvZvphvZE9vvvdYvpCpekphvC99vvOH0B8yCvv9vvUvQa8gSf9yCvhQhU8wvC0s%2BFOcn%2B3CtpgoXlfe1RkDVK42B%2BbJZR6FaiaVnnCpSCK0n3w0AhjC8AXcBlLyzOvxr1WCl5F%2BSBiVvQbmAdcHvaNoxfBKK2QhvCPMMvvm5vpvhvvmv99%3D%3D&isg=And3GnGM4WQmq2h2qA9qNzXUBm1tLGD8aJOuB8kkn8ateJe60Qzb7jXaLO7d&needFold=0&_ksTS=1512715243849_884&callback=jsonp885'
  webPage.open(url, function(res) {
      console.log(url)
    page++
    if (res == 'success'){
      webPage.includeJs('https://code.jquery.com/jquery-3.2.1.min.js',function(){
        webPage.evaluate(function() {
          function getUrlPrem (key, url) {
            var _search = url
            var _pattern = new RegExp('[?&]'+key+'=([^&]+|\\w+)', 'g')
            var _matcher = _pattern.exec(_search)
            var _items = null
            if (_matcher !== null) {
              try {
                _items = decodeURIComponent(decodeURIComponent(_matcher[1]))
              } catch (e) {
                try {
                  _items = decodeURIComponent(_matcher[1])
                } catch (e) {
                  _items = _matcher[1]
                }
              }
            }
            return _items
          }
          var ItemId = getUrlPrem('itemId',location.href)
          window.jsonp885 = function(data){
            if (!data || !data.rateDetail || !data.rateDetail.rateList) {
              console.log('error')
            } else {
              var rateList = data.rateDetail.rateList
              for (var i = 0; i < rateList.length; i++) {
                var content = rateList[i].rateContent
                // if (content.length > 10 && !/但愿/g.test(content) && !/大概/g.test(content) && !/可能/g.test(content) && !/希望/g.test(content) && !/期待/g.test(content)) {
                if (content.length > 10){
                  $.ajax({
                    url: 'http://api.zerotoone.com/v1/updateComments',
                    dataType: 'json',
                    type: 'post',
                    data: {
                      comment: content,
                      oneOne: '',
                      oneTwo: '',
                      twoOne: '',
                      twoTwo: '',
                      commentId: rateList[i].id,
                      itemId: Number(ItemId)
                    },
                    success: function(res){
                      console.log('success')
                    }
                  })
                }
              }
            }
          }
          eval(document.getElementsByTagName('body')[0].innerText)
        })
      })
    }
  })
}, 2000)
