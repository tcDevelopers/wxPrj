var app = getApp();
Page({
  data: {
    userInfo: {},
    nwUnread: 0,
    notice: 0,
    noticeTitle: '',
    noticeContent: '',
  },
  bindUser: function () {
    wx.navigateTo({
      url: '../page_bind/page_bind'
    })
  },
  bindMap: function (e) {
    wx.navigateTo({
      url: '/map/map?tp=1'
    })
  },
  mdConfirm: function () {
    this.setData({
      notice: 0
    })
  },
  mdCancel: function () {
    app.notice = 0;
    this.setData({
      notice: 0
    })
  },
  onLoad: function () {
    this.tryLogin();
  },
  //每次显示时执行，分为全新登录，有openid登录和有work_id刷新未读数3种情况
  onShow: function () {
    this.getNwUnread();
  },
  //公司信息
  bindNews: function () {
    wx.navigateTo({
      url: '/neiwang/news_list/news_list'
    })
  },
  //内网个人事务
  bindGrsw: function () {
    wx.navigateTo({
      url: '/neiwang/grsw_list/grsw_list'
    })
  },
  //内网通讯录
  bindTxl: function () {
    wx.navigateTo({
      url: '/neiwang/txl/txl'
    })
  },
  //支撑系统的2个链接
  bindOpenWeb: function (e) {
    let url = 'https://www.meafe.cn/paidan/';
    if (e.currentTarget.dataset.tp == '1')
      app.webview_url = url + 'page_login.jsp?staff_no=' + app.userInfo.staff_no + '&openid=' + app.userInfo.openid;
    else if (e.currentTarget.dataset.tp == '2')
      app.webview_url = url + 'page_weihubu_wuliaoguanli/index.jsp?staff_no=' + app.userInfo.staff_no + '&openid=' + app.userInfo.openid;
    else
      return 0;
    wx.navigateTo({
      url: '/pages/webview/webview'
    })
  },
  //获取openid和userinfo
  tryLogin: function () {
    var _this = this;
    wx.showLoading({
      title: '登陆中...',
    });
    wx.login({
      success: res => {
        wx.request({
          url: 'https://www.meafe.cn/lite/openid?code=' + res.code,
          success: res => {
            if (res.statusCode == 200 && res.data.openid) {
              app.userInfo.openid = res.data.openid;
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
  loginRemoteServer: function () {
    var that = this;
    wx.showLoading({
      title: '登陆中...',
    })
    wx.request({
      url: app.server + 'user_info',
      method: 'POST',
      data: {
        'openid': app.userInfo.openid
      },
      success: res => {
        if (res.data) {
          app.userInfo = res.data;
          that.setData({
            userInfo: res.data
          });
          if (app.notice)
            wx.request({
              url: app.server + 'notice',
              success: (res) => {
                if (res.data)
                  that.setData({
                    notice: 1,
                    noticeTitle: res.data.title,
                    noticeContent: res.data.cnt
                  })
              }
            })
          that.getNwUnread();
        }
      },
      fail: () => that.setLoginFailed("系统正在维护...获取用户信息失败"),
      complete: () => wx.hideLoading(),
    })
  },
  setLoginFailed: function (msg) {
    let that = this;
    wx.showModal({
      title: '登陆出错，是否重试',
      content: msg ? msg : "",
      success: function (res) {
        if (res.confirm) {
          that.tryLogin();
        }
      }
    })
  },
  getNwUnread: function () {
    var that = this;
    if (app.userInfo.nw_role) {
      wx.request({
        url: app.server + 'grsw_unread?staff_no=' + app.userInfo.staff_no,
        success: function (res) {
          if (res.statusCode == 200)
            that.setData({
              nwUnread: res.data
            })
        }
      })
    }
  },
})