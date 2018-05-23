// channel/channel_list/channel_list.js
var meafe = require('../../utils/util_meafe.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyList: [],
    hidden: true,
    applyUser: [{ person_name: '全选' }],
    applyState: ['全选', '待领导审核', '领导退回', '待管理员审核', '管理员退回', '管理员通过'],
    pick1: 0,
    pick2: 0,
    pick3: '全选',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.page = 1;
    that.size = 5;
    that.setData({ hidden: false });
    let sqlstr = "select person_name from 广告位登记人员表 where channel_role = '申请员'";
    meafe.SQLQuery(sqlstr,
      function (obj) {
        that.setData({
          applyUser: that.data.applyUser.concat(obj),
          hidden: true
        });
        that.setWhere();
        that.reload();
      }, function (res) {
        wx.showModal({
          title: "数据请求失败",
          content: "请重新进入本页面",
          showCancel: false,
          success: res => wx.navigateBack({ delta: 1 })
        })
      });
  },

  bindPick1: function (e) {
    this.setData({ pick1: e.detail.value });
    this.setWhere();
    this.reload();
  },

  bindPick2: function (e) {
    this.setData({ pick2: e.detail.value });
    this.setWhere();
    this.reload();
  },

  bindPick3: function (e) {
    this.setData({ pick3: e.detail.value });
    this.setWhere();
    this.reload();
  },

  channelView: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../channel_view/channel_view?id=' + id
    });
  },

  setWhere: function () {
    let that = this;
    let apply_user = that.data.pick1 == 0 ? '%' : that.data.applyUser[that.data.pick1].person_name;
    let state = that.data.pick2 == 0 ? '%' : that.data.pick2;
    let dt = that.data.pick3 == '全选' ? '%' : that.data.pick3;
    that.where = "where apply_user like '" + apply_user + "' and state like '" + state + "' and convert(varchar(10),apply_dt,20) like '" + dt + "'";
  },

  reload: function (e) {
    let that = this;
    that.page = 1;
    if (!that.data.hidden)
      return
    else
      that.setData({ hidden: false});
    let sqlstr = "select top " + that.size + " id,case apply_tp when 1 then '工号' when 2 then '渠道' end apply_tp,case apply_act when 1 then '新增' when 2 then '修改' when 3 then '删除' end apply_act,apply_user, convert(varchar(12),apply_dt,111) dt, a.state, b.state_name from channel_list a left join channel_state b on a.state = b.state_id " + that.where + " order by id desc";
    meafe.SQLQuery(sqlstr,
      function (obj) {
        that.setData({ applyList: obj, hidden: true, });
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

  loadMore: function (e) {
    let that = this;
    if (!that.data.hidden)
      return
    else
      that.setData({ hidden: false });
    let sqlstr = "select top " + that.size + " id,case apply_tp when 1 then '工号' when 2 then '渠道' end apply_tp,case apply_act when 1 then '新增' when 2 then '修改' when 3 then '删除' end apply_act,apply_user, convert(varchar(12),apply_dt,111) dt, a.state, b.state_name from channel_list a left join channel_state b on a.state = b.state_id " + that.where + " and id not in (select top " + that.page * that.size + " id from channel_list " + that.where + " order by id desc) order by id desc";
    meafe.SQLQuery(sqlstr,
      function (obj) {
        if (obj.length > 0) {
          that.page += 1;
          that.setData({
            applyList: that.data.applyList.concat(obj)
          })
        }
        that.setData({ hidden: true });
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