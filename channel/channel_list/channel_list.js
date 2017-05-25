// channel/channel_list/channel_list.js
var meafe = require('../../utils/util_meafe.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyList:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cond = '';
    if (options.check_state)
      cond = " where state=" + options.check_state;
    var _this = this;
    var sqlstr = "select id,case apply_tp when 1 then '工号' when 2 then '渠道' end apply_tp,case apply_act when 1 then '新增' when 2 then '修改' when 3 then '删除' end apply_act,apply_user, CONVERT(varchar(12), apply_dt,111) dt, a.state, b.state_name from channel_list a left join channel_state b on a.state = b.state_id"+cond;
    meafe.SQLQuery(sqlstr,function(obj){
      _this.setData({ applyList: obj});
    });
  },

  channelView: function(e){
    var id = e.currentTarget.dataset.id;
    var state = e.currentTarget.dataset.state;
    if (app.globalData.chnlRole == '审核员' && state == 1 || app.globalData.chnlRole == '管理员' && state == 3)
      wx.navigateTo({
        url: '../channel_check/channel_check?id=' + id
      })
    else
      wx.navigateTo({
        url: '../channel_view/channel_view?id=' + id
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