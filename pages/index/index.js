var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data: {
    motto: "../../img/timg.jpg",
    hidden: true,
    btn_hidden: true,
    userInfo: {},
    funcList: {},
    grswUnReadNum: 0
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
    _this.getWxUserInfo();
    _this.getGrswCount();
  },
  refreshLogo: function () {
    var _this = this;
    console.log(app.userInfo);
      _this.setData({
        userInfo: app.userInfo
      });
  },
  wxLogin: function (success, fail) {
    var _this = this;
    wx.login({
      success: function (res) {
        if (success) {
          success(res);
        }
      },
      fail: function (res) {
        _this.setLoginFailed();
        if (fail) {
          fail(res)
        }
      }
    });
  },
  getWxUserInfo: function () {
    console.log("get wx logo");
    var _this = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        app.userInfo["avatarUrl"] = res.userInfo.avatarUrl;
        _this.refreshLogo();
      }
    })
  },
  tryLogin: function () {
    var _this = this;
    wx.showLoading({
      title: '登陆中...',
    })
    _this.wxLogin(function (res) {
      app.globalData.code = res.code;
      _this.getOpenid(function (res) {
        _this.loginRemoteServer();
      });
    })
  },
  getOpenid: function (suc, fail) {
    var _this = this;
    var appid = 'wxe2fab7d8fade2cff';//填写微信小程序appid  
    var secret = 'a826603abc5285050e9163d40f61efb3';//填写微信小程序secret 
    wx.request({
      url: 'https://www.meafe.cn/wx/GetXcxOpenid?&code=' + app.globalData.code ,
      success: function (res) {
        //根据openid获取用户信息
        app.userInfo.openid = res.data;
        if (suc) suc(res)
      },
      fail: function () {
        _this.setLoginFailed();
        if (fail) fail();
      }
    });
  },
  loginRemoteServer: function () {
    var _this = this;
    meafe.ListData({service:"selectUserList", open_id: app.userInfo.openid},
      function (obj) {
        wx.hideLoading();
        if (obj.length > 0) {
          for (var f in obj[0]){
            app.userInfo[f]=obj[0][f];
          }
          _this.getGrswCount();
          if (app.userInfo && app.userInfo.openid) {
            _this.setData({
              userInfo: app.userInfo
            });
          }
          //加载web按钮清单
          _this.getFuncList();
        }
        else {
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
  alert: function (msg,sub_msg, ok_cb) {
    wx.showModal({
      title: msg,
      content: sub_msg,
      success: function (res) {
        if (ok_cb)
          ok_cb();
      }
    })
  },
  //个人事务
  bindNeiwangGrswClick: function () {
    wx.navigateTo({
      url: '../../neiwang/grsw_list/grsw_list'
    })
  },
  //公司信息
  bindNeiwangGsxxClick: function () {
    wx.navigateTo({
      url: '../../neiwang/news_list/news_list'
    })
  },
  bindNeiwangTxlClick: function () {
    wx.navigateTo({
      url: '../../neiwang/tongxunlu/tongxunlu'
    })
  },
  bindOpenWeb: function (opt) {
    console.log(opt);
    app.webview_url = opt.currentTarget.id+"?staff_no="+app.userInfo.STAFF_NO;
    wx.navigateTo({
      url: '../../pages/webview/webview'
    })
  },
  getGrswCount:function(){
    var _this = this;
    if (app.userInfo.STAFF_NO && app.userInfo.STAFF_NO.length > 0) {
      //console.log('get grsw count');
      wx.request({
        url: 'https://www.meafe.cn/sxf/get_grsw_cnt/?staff_no=' + app.userInfo.STAFF_NO
        , success: function (res) {
          _this.setData({ grswUnReadNum: res.data })
        }
      })
    }
  },
  getFuncList: function () {
    var _this =this;
    meafe.ListData({service: "selectFuncList", staff_no: app.userInfo.SFATT_NO}
      , function (res) {
        _this.setData({ funcList: res })
      }
    )
  }
})

