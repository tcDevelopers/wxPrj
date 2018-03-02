// neiwang/tongxunlu/tongxunlu.js
var meafe = require('../../utils/util_meafe.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: [],
    staffBm: '',
    staffBz: '',
    staffNm: '',
    staffGh: '',
    staffSj: '',
    staffDh: '',
    actionSheetHidden: true,
    actionSheetItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /*输入框更改函数*/
  changeBm: function (e) {
    this.setData({ staffBm: e.detail.value });
  },
  changeBz: function (e) {
    this.setData({ staffBz: e.detail.value });
  },
  changeSj: function (e) {
    this.setData({ staffSj: e.detail.value });
  },
  changeNm: function (e) {
    this.setData({ staffNm: e.detail.value });
  },
  changeDh: function (e) {
    this.setData({ staffDh: e.detail.value });
  },
  changeGh: function (e) {
    this.setData({ staffGh: e.detail.value });
  },
  /*查询函数 */
  search: function () {
    var sqlstr = 'select person_name,belong_department,fenju,mobile_phone,short_phone,gd_phone from 广告位登记人员表';
    sqlstr += " where belong_department like '%" + this.data.staffBm + "%'";
    sqlstr += " and fenju like '%" + this.data.staffBz + "%'";
    sqlstr += " and person_name like '%" + this.data.staffNm + "%'";
    sqlstr += " and mobile_phone like '%" + this.data.staffSj + "%'";
    sqlstr += " and short_phone like '%" + this.data.staffDh + "%'";
    sqlstr += " and gd_phone like '%" + this.data.staffGh + "%'";
    sqlstr += " and mobile_phone!=''";
    wx.showLoading({
      title: '正在加载...',
      mask: true
    });
    var _this = this;
    meafe.SQLQuery(sqlstr,
      function (obj) {
        _this.setData({ staffList: obj });
        wx.hideLoading();
      }, function (res) {
        wx.hideLoading();
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

  }
  , makeCall: function (e) {
    var nbr = e.currentTarget.dataset.id;
    wx.makePhoneCall({
      phoneNumber: nbr
    })
  }
  , openMakeCallOption: function(e){
    var item = e.currentTarget.dataset.id;
    var nbrs = [];
    if (item.mobile_phone.length > 0) {
      nbrs.push(item.mobile_phone);
    }
    if(item.short_phone.length>0){
      nbrs.push(item.short_phone);
    }
    if (item.gd_phone.length > 0) {
      nbrs.push(item.gd_phone);
    }
    this.setData({
      actionSheetItems:nbrs,
      actionSheetHidden: false
    });
  },
  listenerActionSheet: function (e) {
    this.setData({
      actionSheetHidden: true
    })
  },
})