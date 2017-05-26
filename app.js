var meafe = require('utils/util_meafe.js');
var fundebug = require('libs/fundebug.min.js');
fundebug.apikey='a521937be063d9ff5bca4fe18c46e595582626055fe7bfdf2bc45fce0438b5ac';
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
  },
  globalData:{ 
    userInfo:null,
    openid:"",
    ggwUserInfo:null
  }

})
//luyu