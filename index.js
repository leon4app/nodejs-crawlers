// 引入依赖
var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

// 建立 express 实例
var app = express();

app.get('/', function (req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('https://cnodejs.org/')
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#topic_list .cell').each(function (idx, element) {
        var $element = $(element);
        var cellEle = {}
        cellEle.title = $element.find('.topic_title').attr('title')
        cellEle.href = $element.find('.topic_title').attr('href')
        var str = $element.find('.user_avatar').attr('href')
        cellEle.author = str.substring(str.lastIndexOf("/")+1);
        items.push(cellEle);
      });

      res.send(items);
    });
});

// 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
app.listen(3000, function () {
  console.log('app is listening at port 3000');
});