var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    staffList: [],
    staff_no: '',
    staff_nm: '',
    bm: '',
    phone: '',
    short_phone: '',
    actionSheetHidden: true,
    actionSheetItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /*输入框更改函数*/
  changeNm: function (e) {
    this.data.staff_nm = e.detail.value;
  },
  changeStaff: function (e) {
    this.data.staff_no = e.detail.value;
  },
  changeBm: function (e) {
    this.data.bm = e.detail.value;
  },
  changePhone: function (e) {
    this.data.phone = e.detail.value;
  },
  changeShort: function (e) {
    this.data.short_phone = e.detail.value;
  },
  changeGh: function (e) {
    this.data.gd_phone = e.detail.value;
  },
  /*查询函数 */
  search: function () {
    let that = this;
    wx.showLoading({
      title: '正在加载...',
      mask: true
    });
    wx.request({
      url: app.server + 'staff_list',
      method: 'POST',
      data: {
        'staff_no': that.data.staff_no,
        'staff_nm': that.data.staff_nm,
        'bm': that.data.bm,
        'phone': that.data.phone,
        'short_phone': that.data.short_phone,
        'gd_phone': that.data.gd_phone,
      },
      success: res => {
        that.setData({
          staffList: res.data
        })
      },
      complete: () => wx.hideLoading(),
    })
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
  makeCall: function (e) {
    var nbr = e.currentTarget.dataset.id;
    wx.makePhoneCall({
      phoneNumber: nbr
    })
  },
  openMakeCallOption: function (e) {
    var item = e.currentTarget.dataset.id;
    var nbrs = [];
    if (item[3] && item[3].length == 11) {
      nbrs.push(item[3]);
    }
    if (item[4] && item[4].length == 4) {
      nbrs.push(item[4]);
    }
    if (item[5] && item[5].length == 8) {
      nbrs.push(item[5]);
    }
    this.setData({
      actionSheetItems: nbrs,
      actionSheetHidden: false
    });
  },
  listenerActionSheet: function (e) {
    this.setData({
      actionSheetHidden: true
    })
  },
})