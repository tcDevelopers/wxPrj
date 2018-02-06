// neiwang/grsw_list/grsw_list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    sender: '',
    title: '',
    pageData: [],
    hidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    let { pageSize, sender, title } = _this.data;
    _this.getList(app.globalData.ggwUserInfo.work_id, pageSize, sender, title);
  },

  /**
   * 发件人更新
   */
  changeSender: function (e) {
    this.setData({ sender: e.detail.value });
  },

  /**
   * 标题更新
   */
  changeTitle: function (e) {
    this.setData({ title: e.detail.value });
  },

  /**
   * 搜索列表
   */
  search: function (e) {
    this.reLoad();
  },

  /**
   * 获取个人事务列表
   */
  getList: function (p1, p2, p3, p4, cb) {
    var _this = this;
    var url = 'https://www.meafe.cn/sxf/get_grsw_shou_list/';
    url += '?staff_no=' + p1 + '&top_n=' + p2
      + '&search_user=' + p3 + '&search_title=' + p4;
    _this.setData({ hidden: false });
    wx.request({
      url: url,
      success: function (res) {
        _this.setData({ pageData: res.data })
      },
      complete: function (res) {
        _this.setData({ hidden: true });
      }
    })
  },

  /**
   * 下拉刷新
   */
  reLoad: function (e) {
    let { sender, title } = this.data;
    this.setData({ pageSize: 10 });
    this.getList(app.globalData.ggwUserInfo.work_id, 10, sender, title);
  },

  /**
   * 下拉更多加载
   */
  loadMore: function (e) {
    var _this = this;
    var { pageSize, sender, title } = _this.data;
    var url = 'https://www.meafe.cn/sxf/get_grsw_shou_list/';
    url += '?staff_no=' + app.globalData.ggwUserInfo.work_id + '&top_n=' +
      (pageSize + 10) + '&search_user=' + sender + '&search_title=' + title;
    _this.setData({ hidden: false });
    wx.request({
      url: url,
      success: function (res) {
        if (res.data.length > pageSize)
          pageSize += 10;
        _this.setData({
          pageData: res.data,
          pageSize: pageSize
        })
      },
      complete: function (res) {
        _this.setData({ hidden: true });
      }
    })
  },

  /**
   * 跳转个人事务详细页面
   */
  grswDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    })
    wx.navigateTo({
      url: '../../neiwang/page_detail/page_detail?id=' + id + "&type=grsw_shou",
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

  }
})