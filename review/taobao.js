// 栗子 phantomjs taobao.js 1 20 545436853162
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
    page++
    if (res == 'success'){
      webPage.includeJs('https://code.jquery.com/jquery-3.2.1.min.js',function(){
        webPage.evaluate(function() {
          function getHadKeyWord (type, content) {
            var keyWords = []
            var config = {
              oneOne: ["生发", "脱发变少", "脱发也好多了", "脱发好些", "减少掉发", "掉发变少", "掉头发少", "掉发越来越少", "长出", "茂密"],
              oneTwo: ["掉", "掉发", "长不出来", "掉的更多", "掉的更快", "会掉头发", "发际线更高", "稀疏"],
              twoOne: ["舒服", "出油少", "头屑变少", "头屑减少", "控油"],
              twoTwo: ["痒", "头屑多", "辣辣的", "刺激"],
              denyWord: ["不", "无", "非", "莫", "勿", "未", "不要", "不必", "没有"]
            }
            var num = 0
            for (var k = 0;k < config[type].length;k++){
              var txt = config[type][k]
              var reg = new RegExp(txt)
              if (reg.test(content)) {
                for (var j = 0;j < config['denyWord'].length;j++){
                  var deny = config['denyWord'][j]
                  var denyReg = new RegExp(deny)
                  if (denyReg.test(content)) {
                    num++
                  }
                }
                keyWords.push(txt)
              }
            }
            var reStr = num > 0 ? '/' + num : '@'
            return keyWords.join(',') + reStr
          }
          window.jsonp885 = function(data){
            if (!data || !data.rateDetail || !data.rateDetail.rateList) {
              console.log('error')
            } else {
              var rateList = data.rateDetail.rateList
              for (var i = 0; i < rateList.length; i++) {
                var content = rateList[i].rateContent
                if (content.length > 10 && !/但愿/g.test(content) && !/大概/g.test(content) && !/可能/g.test(content) && !/希望/g.test(content) && !/期待/g.test(content)) {
                  console.log(rateList[i].rateContent + '@oneOne=' + getHadKeyWord('oneOne', content) + '@oneTwo=' + getHadKeyWord('oneTwo', content)+ '@twoOne=' + getHadKeyWord('twoOne', content)+ '@twoTwo=' + getHadKeyWord('twoTwo', content))
                }
              }
            }
          }
          eval(document.getElementsByTagName('body')[0].innerText)
        })
      })
    }
  })
}, 3000)
