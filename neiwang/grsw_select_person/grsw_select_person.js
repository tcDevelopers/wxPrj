// neiwang/grsw_select_person.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.showLoading({
      title: '正在加载',
    })
    if (!_this.nmList) {
      wx.getStorage({
        key: 'nmList',
        success: (res) => _this.nmList = res.data,
        fail: function () {
          wx.request({
            url: 'https://www.meafe.cn/lite/nmlist_grsw/',
            success: function (res) {
              _this.nmList = res.data;
              wx.setStorageSync('nmList', res.data);
            },
            fail: function () {
              wx.showModal({
                title: "数据请求失败",
                content: "请重新进入本页面",
                showCancel: false,
                success: () => wx.navigateBack({ delta: 1 })
              })
            },
          })
        },
        complete: () => wx.hideLoading(),
      })
    }
    let selected = wx.getStorageSync('selected');
    if (selected.length)
      _this.setData({ searchList: selected });
  },

  changeName: function (e) {
    this.name = e.detail.value;
    this.search();
  },

  search: function () {
    let { name, nmList } = this;
    if (!name) {
      return
    }
    //取nmList中checked或者nm包含name的元素
    let searchList = this.data.searchList;
    if (searchList.length)
      searchList = searchList.filter(val => val.checked);
    nmList.forEach(val => {
      if (val.nm.includes(name) && !searchList.some(v => v.nm == val.nm)) {
        val.checked = false;
        searchList.push(val);
      }
    });
    this.setData({ searchList: searchList });
  },

  checkboxChange: function (e) {
    let _this = this;
    let searchList = _this.data.searchList;
    searchList.forEach(val => {
      if (e.detail.value.includes(val.gh))
        val.checked = true;
      else
        val.checked = false;
    });
    _this.setData({ searchList: searchList });
  },

  submit: function () {
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
    wx.navigateBack({ delta: 1 });
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
    app.receivers = this.data.selectedPerson;
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