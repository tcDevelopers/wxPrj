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
    dls: 0,
    scrollViewHeight: 900
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 通过页面参数dls来区分内网还是代理商;
    var _this = this;
    if (options.dls == '1') {
      _this.setData({
        dls: 1
      });
      wx.setNavigationBarTitle({
        title: '代理商个人事务'
      });
    }
    let {
      pageSize,
      sender,
      title,
      dls
    } = _this.data;
    _this.getList(app.userInfo.STAFF_NO, pageSize, sender, title, dls);

    wx.getSystemInfo({
      success: function(res) {
        let height = res.windowHeight;
        var query = wx.createSelectorQuery() //创建节点查询器 query
        query.select('#search_bar').boundingClientRect() //这段代码的意思是选择Id=the-id的节点，获取节点位置信息的查询请求
        query.exec(function(res) {
          _this.setData({
            scrollViewHeight: height - res[0].height
          });
        })
      },
      fail: function() {}
    });
  },

  /**
   * 发件人更新
   */
  changeSender: function(e) {
    this.setData({
      sender: e.detail.value
    });
  },

  /**
   * 标题更新
   */
  changeTitle: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  /**
   * 搜索列表
   */
  search: function(e) {
    this.reLoad();
  },

  /**
   * 获取个人事务列表
   */
  getList: function(p1, p2, p3, p4, p5) {
    var _this = this;
    var url = 'https://www.meafe.cn/litest/grsw_list';
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
        'dls': p5
      },
      success: function(res) {
        _this.setData({
          pageData: res.data
        })
      },
      complete: function(res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 下拉刷新
   */
  reLoad: function(e) {
    this.setData({
      pageSize: 20
    });
    let {
      pageSize,
      sender,
      title,
      dls
    } = this.data;
    this.getList(app.userInfo.STAFF_NO, pageSize, sender, title, dls);
  },

  /**
   * 下拉更多加载
   */
  loadMore: function(e) {
    let _this = this;
    let {
      pageSize,
      sender,
      title,
      dls
    } = _this.data;
    let url = 'https://www.meafe.cn/litest/grsw_list';
    wx.showLoading({
      title: '正在加载..',
      mask: true
    })
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'staff_no': app.userInfo.STAFF_NO,
        'topnum': pageSize + 20,
        'search_user': sender,
        'search_title': title,
        'dls': dls
      },
      success: function(res) {
        if (res.data.length > pageSize)
          pageSize += 20;
        _this.setData({
          pageData: res.data,
          pageSize: pageSize
        })
      },
      fail: function() {
        wx.showToast({
          title: '数据加载失败',
          icon: 'loading',
          mask: true
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },

  /**
   * 跳转个人事务详细页面
   */
  grswDetail: function(e) {
    let shouid = e.currentTarget.dataset.id;
    let dls = this.data.dls;
    let url = 'https://www.meafe.cn/litest/grsw_read?';
    url += 'staff_no=' + app.userInfo.STAFF_NO;
    url += '&shouid=' + shouid;
    url += '&dls=' + dls;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    });
    wx.request({
      url: url
    });
    app.webview_url = 'https://www.meafe.cn/litest/nw_detail?id=' + shouid + '&grsw=1&dls=' + dls;
    wx.hideLoading();
    wx.navigateTo({
      url: '/pages/webview/webview',
    })
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

  },
  open_send: function() {
    wx.navigateTo({
      url: '/neiwang/grsw_send/grsw_send?tp=1&dls=' + this.data.dls
    });
  }
})