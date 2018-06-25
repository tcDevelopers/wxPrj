var app = getApp();
var meafe = require('utils/util_meafe.js');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var _this = this;
  },
  code:'',
  userInfo:{STAFF_NO:""},
  receivers:[],
  webview_url:"",
  downloadTask: null
})