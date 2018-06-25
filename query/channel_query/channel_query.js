// query/channel_query/channel_query.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gh = '';
    this.nm = '';
    this.hm = '';
    this.qd = '';
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
  //工号更改
  changeGh: function (e) {
    this.gh = e.detail.value;
  },
  //姓名更改
  changeXm: function (e) {
    this.nm = e.detail.value;
  },
  //手机更改
  changeSj: function (e) {
    this.hm = e.detail.value;
  },
  //渠道名称更改
  changeQd: function (e) {
    this.qd = e.detail.value;
  },
  //查询函数
  search: function () {
    let that = this;
    if (!(that.gh || that.nm || that.hm || that.qd))
      wx.showModal({
        title: '提醒',
        content: '查询内容为空',
        showCancel: false,
      })
    else {
      wx.showLoading({
        title: '数据查询中...',
      })
      wx.request({
        url: 'https://www.meafe.cn/lite/search_qd/',
        data: {
          gh: that.gh,
          nm: that.nm,
          hm: that.hm,
          qd: that.qd,
        },
        method: 'post',
        success: res => that.setData({ staffList: res.data }),
        complete: wx.hideLoading(),
      })
    }
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

  }
})