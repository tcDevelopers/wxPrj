// channel/channel_list/channel_list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyList: [],
    hidden: true,
    applyUser: [{
      staff_nm: '全选'
    }],
    applyState: ['全选', '待领导审核', '领导退回', '待管理员审核', '管理员退回', '管理员通过'],
    pick1: 0,
    pick2: 0,
    pick3: '全选',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.where = {};
    that.page = 1;
    that.size = 5;
    that.setData({
      hidden: false
    });
    wx.request({
      url: 'https://www.meafe.cn/lite/get_data/',
      method: 'POST',
      data: {
        'tab': 'ly_sys_user_table',
        'col': ['staff_nm'],
        'whe': {
          'channel_role': '申请员'
        },
      },
      success: res => {
        that.setData({
          applyUser: that.data.applyUser.concat(res.data),
          hidden: true,
        });
        that.loadData();
      },
      fail: res => wx.showModal({
        title: "数据请求失败",
        content: "请重新进入本页面",
        showCancel: false,
        success: res => wx.navigateBack({
          delta: 1
        })
      }),
    })
  },

  bindPick1: function(e) {
    if (e.detail.value == 0)
      delete this.where['apply_user'];
    else
      this.where['apply_user'] = this.data.applyUser[e.detail.value].staff_nm;
    this.setData({
      pick1: e.detail.value
    });
    this.page = 1;
    this.size = 5;
    this.loadData();
  },

  bindPick2: function(e) {
    if (e.detail.value == 0)
      delete this.where['state_nm'];
    else
      this.where['state_nm'] = this.data.applyState[e.detail.value];
    this.setData({
      pick2: e.detail.value
    });
    this.page = 1;
    this.size = 5;
    this.loadData();
  },

  bindPick3: function(e) {
    this.where['apply_dt'] = e.detail.value;
    this.setData({
      pick3: e.detail.value
    });
    this.page = 1;
    this.size = 5;
    this.loadData();
  },

  channelView: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../channel_view/channel_view?id=' + id
    });
  },

  loadData: function(e) {
    let that = this;
    if (!that.data.hidden || !that.size)
      return
    else
      that.setData({
        hidden: false
      });
    wx.request({
      url: 'https://www.meafe.cn/lite/apply_info/',
      method: 'POST',
      data: {
        'whe': that.where,
        'off': (that.page - 1) * that.size,
        'sz': that.size,
      },
      success: res => {
        if (res.statusCode == 200) {
          if (that.page == 1)
            that.setData({
              applyList: res.data,
            });
          else
            that.setData({
              applyList: that.data.applyList.concat(res.data),
            });
          if (res.data.length == that.size)
            that.page += 1;
          else
            that.size = 0;
        }
      },
      fale: res => wx.showModal({
        title: "数据请求失败",
        content: "请重新进入本页面",
        showCancel: false,
        success: res => wx.navigateBack({
          delta: 1
        })
      }),
      complete: res => that.setData({
        hidden: true
      }),
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  }
})