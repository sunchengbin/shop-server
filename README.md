## 数据抓取技术栈
--------------------------------------------------------------------------------
- nodejs http https（适合有明确获取数据接口的或者页面直接渲染数据的，容易导出文件） [http://nodejs.cn/api/]
- cheerio （把数据流buffer转换成适合jquery操作的dom结构）[https://github.com/cheeriojs/cheerio/wiki/Chinese-version]
- iconv-lite （如果接口返回的response是非utf8格式的数据，中文出现乱码时，可以使用它来转译成utf8）[https://github.com/ashtuchkin/iconv-lite]
- phantomjs （没有视图的浏览器内核(可进行各种事件操作)，适用动态数据抓取场景，只能通过请求、打log保存数据或者） [http://phantomjs.org/documentation/]
