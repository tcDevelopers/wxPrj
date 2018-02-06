var app = getApp();
var meafe = require('utils/util_meafe.js');
var fundebug = require('libs/fundebug.min.js');
fundebug.apikey = 'c4fc693b8425ab58f470537137ea25b66004cbb806903a10b0662c65e95ddc6b';
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var _this = this;
  },
  globalData:{ 
    code:'',
    userInfo:null,
    openid:"",
    ggwUserInfo:{work_id:'',person_name:'',smz_role:''}
  },
  webview_url:""
})