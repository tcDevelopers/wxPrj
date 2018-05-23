var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person_name: '',
    check_state: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this, check_state = 0, userinfo = app.globalData.ggwUserInfo;
    if (userinfo && userinfo.channel_role == '管理员') {
      check_state = 3;
    }
    else if (userinfo && userinfo.channel_role == '审核员') {
      check_state = 1;
    }
    else if (userinfo && userinfo.channel_role == '申请员') {
      check_state = 0;
    }
    else {
      wx.showModal({
        title: "提醒",
        content: "你无权访问此页",
        showCancel: false,
        success: res => wx.navigateBack({ delta: 1 })
      });
    }
    that.setData({
      person_name: userinfo.person_name,
      check_state: check_state,
    });
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