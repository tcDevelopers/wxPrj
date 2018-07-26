var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data: {
    userInfo: {},
    funcList: {},
    grswUnReadNum: 0
  },
  bindQuery: function() {
    wx.navigateTo({
      url: '../../query/query'
    })
  },
  bindGGWUser: function() {
    wx.navigateTo({
      url: '../page_bind/page_bind'
    })
  },
  bindKehuPhoto: function() {
    wx.navigateTo({
      url: '../../page_rec_photo/page_main/page_main'
    })
  },
  bindChannel: function() {
    wx.navigateTo({
      url: '../../channel/channel'
    })
  },
  onLoad: function() {
      this.tryLogin();
  },
  //每次显示时执行，分为全新登录，有openid登录和有work_id刷新未读数3种情况
  onShow: function() {
    let that = this;
    if (app.userInfo.STAFF_NO) {
      that.getGrswCount();
    }
  },
  //个人事务
  bindNeiwangGrswClick: function() {
    wx.navigateTo({
      url: '../../neiwang/grsw_list/grsw_list'
    })
  },
  //公司信息
  bindNeiwangGsxxClick: function() {
    wx.navigateTo({
      url: '../../neiwang/news_list/news_list'
    })
  },
  //通讯录
  bindNeiwangTxlClick: function() {
    wx.navigateTo({
      url: '../../neiwang/tongxunlu/tongxunlu'
    })
  },
  //获取openid和userinfo
  tryLogin: function() {
    var _this = this;
    wx.showLoading({
      title: '登陆中...',
    });
    wx.login({
      success: res => {
        app.code = res.code;
        wx.request({
          url: 'https://www.meafe.cn/paidan/page_wx_xcx/get_xcx_openid.jsp?code=' + app.code,
          success: res => {
            if (res.statusCode == 200) {
              app.userInfo.openid = res.data;
              _this.loginRemoteServer();
            }
          },
        });
      },
      fail: () => _this.setLoginFailed(),
      complete: () => wx.hideLoading(),
    })
  },
  loginRemoteServer: function() {
    var _this = this;
    wx.showLoading({
      title: '登陆中...',
    })
    meafe.ListData({
      service: "selectXcxUserList",
        open_id: app.userInfo.openid
      },
      function(obj) {
        wx.hideLoading();
        if (obj.length > 0) {
          for (var f in obj[0]) {
            app.userInfo[f] = obj[0][f];
          }
          if (app.userInfo && app.userInfo.openid) {
            _this.setData({
              userInfo: app.userInfo
            });
          }
          _this.getGrswCount();
          //加载web按钮清单
          _this.getFuncList();
        } else {
          //加载web按钮清单
          _this.getFuncList();
        }
      },
      function() {
        _this.setLoginFailed();
      });
  },
  setLoginFailed: function() {
    wx.hideLoading();
    var _this = this;
    wx.showModal({
      title: '登陆出错，是否重试',
      content: '',
      success: function(res) {
        if (res.confirm) {
          _this.tryLogin();
        } else if (res.cancel) {
          _this.setData({
            hidden: true
          });
        }
      }
    })
  },
  bindNeiwangTxlClick: function() {
    wx.navigateTo({
      url: '../../neiwang/tongxunlu/tongxunlu'
    })
  },
  bindOpenWeb: function(opt) {
    console.log(opt);
    app.webview_url = opt.currentTarget.id + "?staff_no=" + app.userInfo.STAFF_NO+"&openid="+app.userInfo.openid;
    wx.navigateTo({
      url: '../../pages/webview/webview'
    })
  },
  getGrswCount: function() {
    var _this = this;
    if (app.userInfo.STAFF_NO && app.userInfo.STAFF_NO.length > 0) {
      //console.log('get grsw count');
      wx.request({
        url: 'https://www.meafe.cn/lite/get_grsw_cnt/?staff_no=' + app.userInfo.STAFF_NO,
        success: function(res) {
          _this.setData({
            grswUnReadNum: res.data
          })
        }
      })
    }
  },
  getFuncList: function() {
    var _this = this;
    meafe.ListData({
      service: "selectXcxFuncList",
      staff_no: app.userInfo.STAFF_NO ? app.userInfo.STAFF_NO : ""
    }, function(re) {
      _this.setData({
        funcList: re
      })
    },function(){
      wx.showModal({
        title: '菜单加载失败，是否重新加载',
        content: '',
        success: function (res) {
            _this.getFuncList();
        }
      })
    })
  }
})