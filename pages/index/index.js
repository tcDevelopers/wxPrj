var app = getApp();
var meafe = require('../../utils/util_meafe.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '',
    hidden: true,
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindGGWDJ: function () {
    wx.navigateTo({
      url: '../page_ggw_list/page_ggw_list'
    })
  },
  bindGGWUser: function () {
    wx.navigateTo({
      url: '../page_user_bind/page_user_bind'
    })
  },
  bindYanjie: function () {
    wx.navigateTo({
      url: '../page_yanjie_main/page_yanjie_main'
    })
  },
  bindChannel: function () {
    wx.navigateTo({
      url: '../../channel/channel'
    })
  },
  onLoad: function () {
    var _this = this;
    //调用应用实例的方法获取全局数据
    _this.setData({ hidden: false })
    wx.login({
      success: function (loginCode) {
        var appid = 'wxe2fab7d8fade2cff';//填写微信小程序appid  
        var secret = 'a826603abc5285050e9163d40f61efb3';//填写微信小程序secret 
        wx.getUserInfo({
          withCredentials: false,
          success: function (res) {
            //头像，用户昵称等信息
            app.globalData.userInfo = res.userInfo;
            console.log(res.userInfo)
            _this.setData({ motto: res.userInfo.avatarUrl });
          }
        });

        console.log("登陆完成...");
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
              if (obj.length > 0) {
                app.globalData.ggwUserInfo = obj[0];
                _this.setData({ userInfo: app.globalData.ggwUserInfo });
                console.log(app.globalData.ggwUserInfo);
              }
              else {

              }
              _this.setData({ hidden: true });
            });
          }
        });
      }
    })
  },
  //设置下方代码主要是从其他界面返回的时候，显示最新的用户信息，有可能在用户绑定界面就改变了用户信息
  onShow: function () {
    var _this = this;
    _this.setData({ userInfo: app.globalData.ggwUserInfo });
  }
})
