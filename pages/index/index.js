var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data: {
    userInfo: {},
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
  //通讯录
  bindNeiwangTxlClick: function () {
    wx.navigateTo({
      url: '../../neiwang/tongxunlu/tongxunlu'
    })
  },
  //加载时执行
  onLoad: function () {
    //this.tryLogin();
  },
  //每次显示时执行，分为全新登录，有openid登录和有work_id刷新未读数3种情况
  onShow: function () {
    let that = this;
    if (app.globalData.ggwUserInfo && app.globalData.ggwUserInfo.work_id)
      that.getGrswCount();
    else if (app.globalData.openid && !app.globalData.ggwUserInfo)
      that.loginRemoteServer();
    else if (!app.globalData.openid)
      that.tryLogin();
  },
  //获取openid和userinfo
  tryLogin: function () {
    var _this = this;
    wx.showLoading({
      title: '登陆中...',
    })
    wx.login({
      success: res => _this.getOpenid(res.code),
      complete: () => wx.hideLoading(),
    })
  },
  //根据code获取openid,再获取userinfo
  getOpenid: function (code) {
    let that = this;
    wx.request({
      url: 'https://www.meafe.cn/wx/GetXcxOpenid?&code=' + code,
      success: res => {
        app.globalData.openid = res.data;
        that.loginRemoteServer();
      },
    });
  },
  //根据openid从服务器获取userinfo
  loginRemoteServer: function () {
    let that = this;
    meafe.SQLQuery("select * from 广告位登记人员表 where openid='" + app.globalData.openid + "'",
      function (obj) {
        console.log(obj);
        if (obj.length > 0) {
          app.globalData.ggwUserInfo = obj[0];
          that.setData({ userInfo: obj[0] });
          if (obj[0].work_id)
            that.getGrswCount();
        }
      });
  },
  //根据work_id获取个人事务未读数
  getGrswCount: function () {
    let that = this;
    wx.request({
      url: 'https://www.meafe.cn/sxf/get_grsw_cnt/?staff_no=' + app.globalData.ggwUserInfo.work_id,
      success: res => that.setData({ grswUnReadNum: res.data[0][0] })
    })
  },
})

