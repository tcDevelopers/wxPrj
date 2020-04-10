var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data: {
    userInfo: {},
    funcList: {},
    nwUnread: 0,
    dlsUnread: 0,
    notice: 0,
    noticeTitle: '',
    noticeContent: '',
  },
  bindGGWUser: function() {
    wx.navigateTo({
      url: '../page_bind/page_bind'
    })
  },
  bindKehuPhoto: function() {
    wx.navigateTo({
      url: '/page_rec_photo/page_main/page_main'
    })
  },
  mdConfirm: function() {
    this.setData({
      notice: 0
    })
  },
  mdCancel: function() {
    app.notice = 0;
    this.setData({
      notice: 0
    })
  },
  onLoad: function() {
    let that = this;
    if (!that.data.notice)
      wx.request({
        url: 'https://www.meafe.cn/litest/notice',
        success: (res) => {
          if (res.data)
            that.setData({
              notice: 1,
              noticeTitle: res.data.title,
              noticeContent: res.data.cnt
            })
        }
      })
    that.tryLogin();
  },
  //每次显示时执行，分为全新登录，有openid登录和有work_id刷新未读数3种情况
  onShow: function() {
    this.getNwUnread();
    this.getDlsUnread();
  },
  //公司信息
  bindNwXx: function() {
    wx.navigateTo({
      url: '/neiwang/news_list/news_list'
    })
  },
  //内网个人事务
  bingNwGrsw: function() {
    wx.navigateTo({
      url: '/neiwang/grsw_list/grsw_list?dls=0'
    })
  },
  //代理商个人事务
  bindDlsGrsw: function() {
    wx.navigateTo({
      url: '/neiwang/grsw_list/grsw_list?dls=1'
    })
  },
  //内网通讯录
  bindNwTxl: function() {
    wx.navigateTo({
      url: '/neiwang/txl/txl'
    })
  },
  bindOpenWeb: function(opt) {
    app.webview_url = opt.currentTarget.id;
    if (app.webview_url.indexOf("?") > -1) {
      app.webview_url += "&staff_no=" + app.userInfo.STAFF_NO + "&openid=" + app.userInfo.openid
    } else {
      app.webview_url += "?staff_no=" + app.userInfo.STAFF_NO + "&openid=" + app.userInfo.openid;
    }

    wx.navigateTo({
      url: '/pages/webview/webview'
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
            } else {
              _this.setLoginFailed("系统正在维护...(openid未获取)");
            }
          },
          fail: () => _this.setLoginFailed("系统正在维护...(openid未获取)")
        });
      },
      fail: () => _this.setLoginFailed("系统正在维护...微信登陆失败"),
      complete: () => wx.hideLoading(),
    })
  },
  loginRemoteServer: function() {
    var that = this;
    wx.showLoading({
      title: '登陆中...',
    })
    wx.request({
      url: 'https://www.meafe.cn/litest/user_info',
      method: 'POST',
      data: {
        'openid': app.userInfo.openid
      },
      success: res => {
        app.userInfo = res.data;
        that.setData({
          userInfo: res.data
        });
        that.getNwUnread();
        that.getDlsUnread();
        that.getFuncList();
      },
      fail: () => that.setLoginFailed("系统正在维护...获取用户信息失败"),
      complete: () => wx.hideLoading(),
    })
  },
  setLoginFailed: function(msg) {
    var that = this;
    wx.showModal({
      title: '登陆出错，是否重试',
      content: msg ? msg : "",
      success: function(res) {
        if (res.confirm) {
          that.tryLogin();
        }
      }
    })
  },
  getNwUnread: function() {
    var that = this;
    if (app.userInfo.STAFF_NO) {
      wx.request({
        url: 'https://www.meafe.cn/litest/grsw_unread?staff_no=' + app.userInfo.STAFF_NO + '&dls=0',
        success: function(res) {
          that.setData({
            nwUnread: res.data
          })
        }
      })
    }
  },
  getDlsUnread: function() {
    var that = this;
    if (app.userInfo.STAFF_NO) {
      wx.request({
        url: 'https://www.meafe.cn/litest/grsw_unread?staff_no=' + app.userInfo.STAFF_NO + '&dls=1',
        success: function(res) {
          that.setData({
            dlsUnread: res.data
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
    }, function() {
      wx.showModal({
        title: '菜单加载失败，是否重新加载',
        content: '',
        success: function(res) {
          _this.getFuncList();
        }
      })
    })
  }
})