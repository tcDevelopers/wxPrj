// channel/channel_view/channel_view.js
var meafe = require('../../utils/util_meafe.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyData: {},
    node1: '',
    node2: '',
    node3: '',
    hidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let sqlstr = "select id,apply_tp,apply_act,apply_user,apply_text,state,isnull(check_user,'领导') check_user,isnull(opt_user,'管理员') opt_user from channel_list where id=" + options.id;
    meafe.SQLQuery(sqlstr,
      function (obj) {
        let node1 = '发起申请', node2 = '审核通过', node3 = '审核通过';
        if (obj[0].state == 1)
          node2 = '待审核';
        else if (obj[0].state == 2)
          node2 = '退回';
        if (obj[0].state == 3)
          node3 = '待审核';
        else if (obj[0].state == 4)
          node3 = '退回';
        that.setData({
          applyData: obj[0],
          hidden: true,
          node1: node1,
          node2: node2,
          node3: node3,
        });
      }, function (res) {
        wx.showModal({
          title: "数据请求失败",
          content: "请重新进入本页面",
          showCancel: false,
          success: res => wx.navigateBack({ delta: 1 }),
        })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})