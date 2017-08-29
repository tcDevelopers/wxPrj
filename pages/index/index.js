var app = getApp();
var meafe = require('../../utils/util_meafe.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '',
    hidden: true,
    btn_hidden: true,
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
  },
  bindGGWDJ: function () {
    wx.navigateTo({
      url: '../page_ggw_list/page_ggw_list'
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
    var _this = this;
    wx.showLoading({
      title: '登陆中...',
    })
    _this.tryLogin();
  },
  //设置下方代码主要是从其他界面返回的时候，显示最新的用户信息，有可能在用户绑定界面就改变了用户信息
  onShow: function () {
    var _this = this;
    if (app.globalData.ggwUserInfo && app.globalData.ggwUserInfo.openid) {
      _this.setData({ userInfo: app.globalData.ggwUserInfo, btn_hidden: app.globalData.ggwUserInfo.openid == '' });
    }
    //调用应用实例的方法获取全局数据
    if (app.globalData.userInfo && app.globalData.userInfo.avatarUrl){
      _this.setData({ userInfo: app.globalData.ggwUserInfo , motto: app.globalData.userInfo.avatarUrl });
    }
  },
  tryLogin: function () {
    var _this = this;
    wx.login({
      success: function (loginCode) {
        var appid = 'wxe2fab7d8fade2cff';//填写微信小程序appid  
        var secret = 'a826603abc5285050e9163d40f61efb3';//填写微信小程序secret 
           wx.getUserInfo({
              withCredentials: false,
              success: function (res) {
                //头像，用户昵称等信息
                app.globalData.userInfo = res.userInfo;
                wx.request({
                  url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + loginCode.code + '&grant_type=authorization_code',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    //根据openid获取用户信息
                    app.globalData.openid = res.data.openid;
                    console.log(res);
                    meafe.SQLQuery("select * from 广告位登记人员表 where openid='" + app.globalData.openid + "' order by id desc", function (obj) {
                      wx.hideLoading();
                      if (obj.length > 0) {
                        app.globalData.ggwUserInfo = obj[0];
                        console.log(app.globalData.ggwUserInfo);
                        if (app.globalData.ggwUserInfo && app.globalData.ggwUserInfo.openid) {
                          _this.setData({ userInfo: app.globalData.ggwUserInfo, btn_hidden: app.globalData.ggwUserInfo.openid == '' });
                        }
                        //调用应用实例的方法获取全局数据
                        _this.setData({ userInfo: app.globalData.ggwUserInfo });
                        _this.setData({ motto: app.globalData.userInfo.avatarUrl });
                      }
                      else {
                        if (app.globalData.ggwUserInfo == null) {
                          wx.navigateTo({
                            url: '../page_bind/page_bind'
                          })
                        }
                      }
                    }, function () {
                      _this.setLoginFailed();
                    });
                  },
                  fail: function () {
                    _this.setLoginFailed();
                  }
                });
              },
              fail: function () {
                _this.setLoginFailed();
              }
            })
          },
          fail: function () {
            _this.setLoginFailed();
          }
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
  }
})

