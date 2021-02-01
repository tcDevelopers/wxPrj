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
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        let height = res.windowHeight;
        var query = wx.createSelectorQuery() //创建节点查询器 query
        query.select('#search_bar').boundingClientRect() //这段代码的意思是选择Id=the-id的节点，获取节点位置信息的查询请求
        query.exec(function (res) {
          that.setData({
            scrollViewHeight: height - res[0].height
          });
        })
      },
    });
    let {
      pageSize,
      sender,
      title,
    } = that.data;
    that.getList(app.userInfo.staff_no, pageSize, sender, title);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 发件人更新
   */
  changeSender: function (e) {
    this.setData({
      sender: e.detail.value
    });
  },

  /**
   * 标题更新
   */
  changeTitle: function (e) {
    this.setData({
      title: e.detail.value
    });
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
  getList: function (p1, p2, p3, p4) {
    var _this = this;
    var url = app.server + 'grsw_list';
    wx.showLoading({
      title: '正在加载...'
    })
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'staff_no': p1,
        'topnum': p2,
        'search_user': p3,
        'search_title': p4,
      },
      success: function (res) {
        _this.setData({
          pageData: res.data
        })
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
    this.setData({
      pageSize: 20
    });
    let {
      pageSize,
      sender,
      title
    } = this.data;
    this.getList(app.userInfo.staff_no, pageSize, sender, title);
  },

  /**
   * 下拉更多加载
   */
  loadMore: function (e) {
    let _this = this;
    let {
      pageSize,
      sender,
      title
    } = _this.data;
    let url = app.server + 'grsw_list';
    wx.showLoading({
      title: '正在加载..',
      mask: true
    })
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'staff_no': app.userInfo.staff_no,
        'topnum': pageSize + 20,
        'search_user': sender,
        'search_title': title
      },
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
    let shouid = e.currentTarget.dataset.id;
    let url = app.server + 'grsw_read?';
    url += 'staff_no=' + app.userInfo.staff_no;
    url += '&shouid=' + shouid;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    });
    wx.request({
      url: url
    });
    app.webview_url = app.server + 'nw_detail?id=' + shouid + '&grsw=1';
    wx.hideLoading();
    wx.navigateTo({
      url: '/pages/webview/webview',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
      url: '/neiwang/grsw_send/grsw_send?tp=1'
    });
  }
})