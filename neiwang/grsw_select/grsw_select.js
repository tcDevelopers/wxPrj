// neiwang/grsw_select.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    staffList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    });
    wx.request({
      url:"https://www.meafe.cn/litest/staff_list?dls="+options.dls,
      success: (res) => that.data.staffList = res.data,
      complete: () => wx.hideLoading(),
    });
    let selected = wx.getStorageSync('selected');
    if (selected&&selected.length)
      that.setData({
        searchList: selected
      });
  },

  checkboxChange: function (e) {
    let that = this;
    let searchList = that.data.searchList;
    searchList.forEach(val => {
      if (e.detail.value.includes(val.staff))
        val.checked = true;
      else
        val.checked = false;
    });
    that.setData({
      searchList: searchList
    });
  },

  changeName: function(e) {
    this.search(e.detail.value);
  },

  search: function(name) {
    if (!name) return;
    let that = this;
    //保留之前searchList中checked的元素
    let searchList = that.data.searchList;
    if (searchList.length)
      searchList = searchList.filter(val => val.checked);
    //添加List中包含name且不是上一个checked的元素
    that.data.staffList.forEach(val => {
      if (val.nm.includes(name) && !searchList.some(v => v.staff == val.staff)) {
        val.checked = false;
        searchList.push(val);
      }
    });
    that.setData({
      searchList: searchList
    });
  },

  submit: function() {
    let selected = this.data.searchList.filter(val => val.checked);
    if (!selected.length) {
      wx.showModal({
        title: "",
        content: "请选择联系人",
        showCancel: false,
      })
      return
    }
    wx.setStorageSync('selected', selected);
    wx.navigateBack({
      delta: 1
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