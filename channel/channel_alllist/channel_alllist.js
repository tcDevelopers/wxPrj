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
    page: 1,
    size: 5,
    applyUser: [{ person_name: '全选' }],
    applyState: ['全选', '待领导审核', '领导退回', '待管理员审核', '管理员退回', '管理员通过'],
    pick1: 0,
    pick2: 0,
    pick3: '全选',
    where: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({ hidden: false });
    var sqlstr = "select person_name from 广告位登记人员表 where channel_role = '申请员'";
    meafe.SQLQuery(sqlstr,
      function (obj) {
        _this.setData({
          applyUser: _this.data.applyUser.concat(obj),
          hidden: true
        });
        _this.setWhere();
        _this.reload();
      }, function (res) {
        wx.showModal({
          title: "数据请求失败",
          content: "请重新进入本页面",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({ delta: 1 });
          }
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
    var _this = this;
    var apply_user = _this.data.pick1 == 0 ? '%' : _this.data.applyUser[_this.data.pick1].person_name;
    var state = _this.data.pick2 == 0 ? '%' : _this.data.pick2;
    var dt = _this.data.pick3 == '全选' ? '%' : _this.data.pick3;
    _this.setData({ where: "where apply_user like '" + apply_user + "' and state like '" + state + "' and convert(varchar(10),apply_dt,20) like '" + dt + "'" });
  },

  reload: function (e) {
    var _this = this;
    if (!_this.data.hidden)
      return
    else
      _this.setData({ hidden: false, page: 1 });
    var sqlstr = "select top " + _this.data.size + " id,case apply_tp when 1 then '工号' when 2 then '渠道' end apply_tp,case apply_act when 1 then '新增' when 2 then '修改' when 3 then '删除' end apply_act,apply_user, convert(varchar(12),apply_dt,111) dt, a.state, b.state_name from channel_list a left join channel_state b on a.state = b.state_id " + _this.data.where + " order by id desc";
    meafe.SQLQuery(sqlstr,
      function (obj) {
        _this.setData({ applyList: obj, hidden: true, });
      }, function (res) {
        wx.showModal({
          title: "数据请求失败",
          content: "请重新进入本页面",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({ delta: 1 });
          }
        });
      }
    );
  },

  loadMore: function (e) {
    var _this = this;
    if (!_this.data.hidden)
      return
    else
      _this.setData({ hidden: false });
    var sqlstr = "select top " + _this.data.size + " id,case apply_tp when 1 then '工号' when 2 then '渠道' end apply_tp,case apply_act when 1 then '新增' when 2 then '修改' when 3 then '删除' end apply_act,apply_user, convert(varchar(12),apply_dt,111) dt, a.state, b.state_name from channel_list a left join channel_state b on a.state = b.state_id " + _this.data.where + " and id not in (select top " + _this.data.page * _this.data.size + " id from channel_list " + _this.data.where + " order by id desc) order by id desc";
    meafe.SQLQuery(sqlstr,
      function (obj) {
        if (obj.length > 0) {
          _this.setData({
            applyList: _this.data.applyList.concat(obj),
            page: _this.data.page + 1,
          })
        }
        _this.setData({ hidden: true, });
      }, function (res) {
        wx.showModal({
          title: "数据请求失败",
          content: "请重新进入本页面",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({ delta: 1 });
          }
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