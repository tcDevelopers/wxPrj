// channel/channel_checklist/channel_checklist.js
var meafe = require('../../utils/util_meafe.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyList: [],
    hidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let sqlstr = "select id,case apply_tp when 1 then '工号' when 2 then '渠道' end apply_tp,case apply_act when 1 then '新增' when 2 then '修改' when 3 then '删除' end apply_act,apply_user, convert(varchar(12),apply_dt,111) dt, a.state, b.state_name from channel_list a left join channel_state b on a.state = b.state_id where state = " + options.state + " order by id desc";
    meafe.SQLQuery(sqlstr,
      function (obj) {
        if (obj.length > 0) {
          that.setData({
            applyList: obj,
            hidden: true,
          });
        }
      }, function (res) {
        wx.showModal({
          title: "数据请求失败",
          content: "请重新进入本页面",
          showCancel: false,
          success: res => wx.navigateBack({ delta: 1 })
        });
      }
    );
  },

  checkit: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../channel_check/channel_check?id=' + id
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
})