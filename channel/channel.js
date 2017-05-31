// channel/channel.js
var meafe = require('../utils/util_meafe.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person_name: '',
    avatarUrl: '',
    check_state: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      person_name: app.globalData.ggwUserInfo.person_name,
      avatarUrl: app.globalData.userInfo.avatarUrl
    });

    if (app.globalData.ggwUserInfo.channel_role == '管理员'){
      _this.setData({ check_state: 3 });
    }
    else if (app.globalData.ggwUserInfo.channel_role == '审核员'){
      _this.setData({ check_state: 1 });
    }
    else if (app.globalData.ggwUserInfo.channel_role == '申请员') {
      _this.setData({ check_state: 0 });
    }
    else{
      wx.showModal({
        title: "提醒",
        content: "你无权访问此页",
        showCancel: false,
        success: function (res) {
          wx.navigateBack({ delta: 1 });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})