// channel/channel_check/channel_check.js
var sms = require('../../utils/sms.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyData: {},
    node1: '',
    node2: '',
    node3: '',
    hidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.request({
      url: 'https://www.meafe.cn/lite/user_and_apply/',
      method: 'POST',
      data: {
        'lcol': ['mobile_phone'],
        'rcol': ['id', 'apply_tp', 'apply_act', 'apply_user', 'state', 'apply_text', 'check_user', 'opt_user'],
        'lwhe': '',
        'rwhe': {
          'id': options.id
        },
      },
      success: res => that.setData({
        applyData: res.data
      }),
      fail: res =>
        wx.showModal({
          title: "数据请求失败",
          content: "请重新进入本页面",
          showCancel: false,
          success: res => wx.navigateBack({
            delta: 1
          }),
        }),
      complete: res => that.setData({
        hidden: true
      }),
    });
  },

  agree: function() {
    let that = this;
    if (app.globalData.ggwUserInfo && app.globalData.ggwUserInfo.channel_role)
      var userInfo = app.globalData.ggwUserInfo;
    else
      return
    let data = {
      'tab': 'wx_channel_apply',
      'whe': {
        'id': that.data.applyData.id
      },
    }
    if (userInfo.channel_role == '审核员')
      data.val = {
        'state': 3,
        'state_nm': '待管理员审核',
        'check_user': userInfo.person_name,
        'check_dt': '',
      }
    else if (userInfo.channel_role == '管理员')
      data.val = {
        'state': 5,
        'state_nm': '管理员通过',
        'opt_user': userInfo.person_name,
        'opt_dt': '',
      }
    else
      return
    wx.request({
      url: 'https://www.meafe.cn/lite/apply_upt/',
      method: 'POST',
      data: data,
      success: res => {
        sms.sendSMS({
          nbr: that.data.applyData.mobile_phone,
          cnt: "你的申请已通过" + userInfo.person_name + "审批",
          pri: "1",
          from_sys: "小程序",
          create_person: userInfo.person_name,
        });
        sms.sendSMS({
          nbr: "18006226337",
          cnt: "有一个" + that.data.applyData.apply_user + "发起的新申请待审批",
          pri: "1",
          from_sys: "小程序",
          create_person: userInfo.person_name,
        });
        wx.showModal({
          title: "操作完成",
          content: "审核通过",
          showCancel: false,
          success: res => wx.navigateBack({
            delta: 2
          }),
        });
      }
    })
  },

  disagree: function() {
    let that = this;
    if (app.globalData.ggwUserInfo && app.globalData.ggwUserInfo.channel_role)
      var userInfo = app.globalData.ggwUserInfo;
    else
      return
    let data = {
      'tab': 'wx_channel_apply',
      'whe': {
        'id': that.data.applyData.id
      },
    }
    if (userInfo.channel_role == '审核员')
      data.val = {
        'state': 2,
        'state_nm': '领导退回',
        'check_user': userInfo.person_name,
        'check_dt': '',
      }
    else if (userInfo.channel_role == '管理员')
      data.val = {
        'state': 4,
        'state_nm': '管理员退回',
        'opt_user': userInfo.person_name,
        'opt_dt': '',
      }
    else
      return
    wx.request({
      url: 'https://www.meafe.cn/lite/apply_upt/',
      method: 'POST',
      data: data,
      success: res => {
        sms.sendSMS({
          nbr: that.data.applyData.mobile_phone,
          cnt: "你的申请被" + userInfo.person_name + "退回",
          pri: "1",
          from_sys: "小程序",
          create_person: userInfo.person_name,
        });
        wx.showModal({
          title: "操作完成",
          content: "审核通过",
          showCancel: false,
          success: res => wx.navigateBack({
            delta: 2
          }),
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  }
})