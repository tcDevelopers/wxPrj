var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data: {
    id: -1,
    url: "",
  },
  onLoad: function () {
    var thiz = this;
    console.log("url->" + app.webview_url)
    thiz.setData({
      url: app.webview_url,
    });
    console.log("url->"+thiz.data.url)
  }
})