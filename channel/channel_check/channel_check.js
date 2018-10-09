// channel/channel_check/channel_check.js
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
    ckHidden: true,
    ckType: true,
    ckTitle: '',
    ckText: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.request({
      url: 'https://www.meafe.cn/lite/get_data/',
      method: 'POST',
      data: {
        'tab': 'wx_channel_apply',
        'col': ['id', 'apply_tp', 'apply_act', 'apply_user', 'state', 'apply_text', 'check_user', 'opt_user'],
        'whe': {
          'id': options.id
        },
      },
      success: res => that.setData({
        applyData: res.data[0]
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
    this.setData({
      ckHidden: false,
      ckTitle: '审核通过',
      ckType: true,
    });
  },

  disagree: function() {
    this.setData({
      ckHidden: false,
      ckTitle: '退回',
      ckType: false,
    });
  },

  ckCancel: function() {
    this.setData({
      ckHidden: true
    });
  },

  ckConfirm: function() {
    let that = this;
    if (app.userInfo)
      var userInfo = app.userInfo;
    else
      return
    wx.request({
      url: 'https://www.meafe.cn/lite/apply_upt/',
      method: 'POST',
      data: {
        'id': that.data.applyData.id,
        'apply_user': that.data.applyData.apply_user,
        'agree': that.data.ckType,
        'role': userInfo.CHANNEL_ROLE,
        'check_user': userInfo.STAFF_NM,
        'text': that.data.ckText,
      },
      success: res => wx.navigateBack({
        delta: 2
      }),
    })
  },

  ckInput: function(e) {
    this.setData({
      ckText: e.detail.value,
    });
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