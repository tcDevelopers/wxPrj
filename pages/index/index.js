var app = getApp();
var meafe = require('../../utils/util_meafe.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '',
    hidden: true,
    btn_hidden: true,
    userInfo: {},
    grswUnReadNum:0,
    neiwangModuleHide : true
  },
  //事件处理函数
  bindViewTap: function () {
  },
  bindQuery: function () {
    wx.navigateTo({
      url: '../../query/query'
    })
  },
  bindGGWUser: function () {
    wx.navigateTo({
      url: '../page_bind/page_bind'
    })
  },
  bindKehuPhoto: function () {
    wx.navigateTo({
      url: '../../page_rec_photo/page_main/page_main'
    })
  },
  bindChannel: function () {
    wx.navigateTo({
      url: '../../channel/channel'
    })
  },
  onLoad: function () {
    var _this = this;
    _this.tryLogin();
  },
  //设置下方代码主要是从其他界面返回的时候，显示最新的用户信息，有可能在用户绑定界面就改变了用户信息
  onShow: function () {
    var _this = this;
    _this.refreshLogo();
    //console.log('show')
  },
  refreshLogo:function(){
    var _this = this;
    if (app.globalData.userInfo && app.globalData.userInfo.avatarUrl) {
      _this.setData({
        motto: app.globalData.userInfo.avatarUrl
      });
    }
    if (app.globalData.ggwUserInfo && app.globalData.ggwUserInfo.openid) {
      _this.setData({
        userInfo: app.globalData.ggwUserInfo,
        btn_hidden: app.globalData.ggwUserInfo.openid == ''
      });
    }
  },
  wxLogin: function (success,fail) {
    var _this = this;
    wx.login({
      success: function (res) {
        if (success){
          success(res);
        }
      },
      fail: function (res) {
        _this.setLoginFailed();
        if (fail){
          fail(res)
        }
      }
    });
  },
  tryAuth:function(){
    /*
    var _this = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              
            },
            fail(r) {
              _this.alert("检查权限失败");
              console.log(r)
            }
          })
        }
      },
      fail:function(r){
      }
    })*/
  },
  getUserInfo:function(suc,fail) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if(suc) suc(res);
      },
      fail: function (res) {
        //console.log("wx.getUserInfo Error");
        //console.log(res);
        _this.setLoginFailed();
        if(fail) fail(res);
      }
    })
  },
  tryLogin: function () {
    var _this = this;
    wx.showLoading({
      title: '登陆中...',
    })
    _this.wxLogin(function(res){
        //console.log(res)
        app.globalData.code = res.code;
        _this.getUserInfo(function(res){
            //console.log(res)
            app.globalData.userInfo = res.userInfo ;
            _this.refreshLogo();
        });
        _this.getOpenid(function(res){
          _this.loginRemoteServer();
        });
    })

  },
  getOpenid: function (suc,fail) {
    var appid = 'wxe2fab7d8fade2cff';//填写微信小程序appid  
    var secret = 'a826603abc5285050e9163d40f61efb3';//填写微信小程序secret 
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' +app.globalData.code + '&grant_type=authorization_code',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //根据openid获取用户信息
        app.globalData.openid = res.data.openid;
        //console.log("getOpenid")
        //console.log(res);
        if(suc) suc(res)
      },
      fail: function () {
        _this.setLoginFailed();
        if(fail)fail();
      }
    });
  },
  loginRemoteServer:function(){
    var _this = this;
    meafe.SQLQuery("select * from 广告位登记人员表 where openid='" + app.globalData.openid + "' order by id desc",
     function (obj) {
      wx.hideLoading();
      if (obj.length > 0) {
        app.globalData.ggwUserInfo = obj[0];
        //console.log(app.globalData.ggwUserInfo);
        if (app.globalData.ggwUserInfo && app.globalData.ggwUserInfo.openid) {
          _this.setData({ 
            userInfo: app.globalData.ggwUserInfo, btn_hidden: app.globalData.ggwUserInfo.openid == '', 
            neiwangModuleHide: obj[0].person_type != '主业'
            });
        }
        //调用应用实例的方法获取全局数据
        _this.setData({ userInfo: app.globalData.ggwUserInfo });
      }
      else {
        if (app.globalData.ggwUserInfo == null) {
          //wx.navigateTo({
          //  url: '../page_bind/page_bind'
          //})
        }
      }
    }, function () {
      _this.setLoginFailed();
    });
  },
  setLoginFailed: function () {
    wx.hideLoading();
    var _this = this;
    wx.showModal({
      title: '登陆出错，是否重试',
      content: '',
      success: function (res) {
        if (res.confirm) {
          _this.tryLogin();
        } else if (res.cancel) {
          _this.setData({ hidden: true });
        }
      }
    })
  },
  alert:function(msg,ok_cb){
    wx.showModal({
      title: msg,
      content: '',
      success: function (res) {
        if(ok_cb)
        ok_cb();
      }
    })
  },
  //个人事务
  bindNeiwangGrswClick: function () {
    wx.navigateTo({
      url: '../../neiwang/gsrw_list/gsrw_list'
    })
  },
  //公司信息
  bindNeiwangGsxxClick: function () {
    wx.navigateTo({
      url: '../../neiwang/news_list/news_list'
    })
  },
})

