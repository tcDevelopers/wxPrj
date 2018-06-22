// channel/channel_checklist/channel_checklist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    applyList: [],
    hidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.request({
      url: 'https://www.meafe.cn/lite/apply_info/',
      method: 'POST',
      data: {
        'whe': {
          'state': options.state,
        },
        'off': 0,
        'sz': 0,
      },
      success: res => {
        that.setData({
          applyList: res.data
        });
      },
      fail: res => wx.showModal({
        title: "数据请求失败",
        content: "请重新进入本页面",
        showCancel: false,
        success: res => wx.navigateBack({
          delta: 1
        })
      }),
      complete: res => that.setData({
        hidden: true
      }),
    })
  },

  checkit: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../channel_check/channel_check?id=' + id
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

  }
})