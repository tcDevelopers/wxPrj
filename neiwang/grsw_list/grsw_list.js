// neiwang/grsw_list/grsw_list.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 20,
    sender: '',
    title: '',
    pageData: [],
    scrollViewHeight: 900
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    let { pageSize, sender, title } = _this.data;
    _this.getList(app.userInfo.STAFF_NO, pageSize, sender, title);

    wx.getSystemInfo({
      success: function (res) {
        let height = res.windowHeight;
        console.log('sys height ' + height);
        var query = wx.createSelectorQuery()//创建节点查询器 query
        query.select('#search_bar').boundingClientRect()//这段代码的意思是选择Id=the-id的节点，获取节点位置信息的查询请求
        query.exec(function (res) {
          console.log(res);
          _this.setData({
            scrollViewHeight: height - res[0].height
          });
        })
      },
      fail: function () {
      }
    });
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
    var url = 'https://www.meafe.cn/lite/get_grsw_shou_list/';
    url += '?staff_no=' + p1 + '&top_n=' + p2 + '&search_user=' + p3 + '&search_title=' + p4;
    //url += '?staff_no=600033&top_n=' + p2 + '&search_user=' + p3 + '&search_title=' + p4;
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    wx.request({
      url: url,
      success: function (res) {
        _this.setData({ pageData: res.data })
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 下拉刷新
   */
  reLoad: function (e) {
    let { sender, title } = this.data;
    this.setData({ pageSize: 20 });
    this.getList(app.userInfo.STAFF_NO, 20, sender, title);
  },

  /**
   * 下拉更多加载
   */
  loadMore: function (e) {
    var _this = this;
    var { pageSize, sender, title } = _this.data;
    var url = 'https://www.meafe.cn/lite/get_grsw_shou_list/';
    url += '?staff_no=' + app.userInfo.STAFF_NO + '&top_n=' + (pageSize + 20) + '&search_user=' + sender + '&search_title=' + title;
    //url += '?staff_no=600033&top_n=' + (pageSize + 20) + '&search_user=' + sender + '&search_title=' + title;
    wx.showLoading({
      title: '正在加载..',
      mask: true
    })
    wx.request({
      url: url,
      success: function (res) {
        if (res.data.length > pageSize)
          pageSize += 20;
        _this.setData({
          pageData: res.data,
          pageSize: pageSize
        })
      },
      fail: function () {
        wx.showToast({
          title: '数据加载失败',
          icon: 'loading',
          mask: true
        })
      },
      complete: function () {
        wx.hideLoading();
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
    wx.request({
      url: 'https://www.meafe.cn/lite/chakan_grsw/?shouid=' + id,
    })
    app.webview_url = 'https://www.meafe.cn/lite/get_grsw_shou_html/?id=' + id + "&type=grsw";
    wx.hideLoading();
    wx.navigateTo({
      url: '../../pages/webview/webview',
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
  open_send: function () {
    wx.navigateTo({
      url: '../grsw_reply/grsw_reply',
    })
  }
})