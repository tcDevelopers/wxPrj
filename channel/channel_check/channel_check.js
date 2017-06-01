// channel/channel_check/channel_check.js
var meafe = require('../../utils/util_meafe.js');
var sms = require('../../utils/sms.js');
var app = getApp();
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
    var _this = this;
    _this.setData({ node1: '发起申请' });
    //状态1领导审批环节
    if (options.state == 1) {
      _this.setData({ node2: '待审核' });
    }
    //状态3管理员审批环节
    else if (options.state == 3) {
      _this.setData({ node2: '审核通过' });
      _this.setData({ node3: '待审核' });
    }
    //其他退出
    else
      return
    var sqlstr = "select a.id,apply_tp,apply_act,apply_user,apply_text,state,isnull(check_user,'领导') check_user,isnull(opt_user,'管理员') opt_user,b.mobile_phone apply_phone from channel_list a left join 广告位登记人员表 b on a.apply_user = b.person_name where a.id =" + options.id;
    meafe.SQLQuery(sqlstr, function (obj) {
      _this.setData({ applyData: obj[0], hidden: true });
    });
  },

  agree: function () {
    var _this = this;
    if (_this.data.applyData.state == 1) {
      var sqlstr = "update channel_list set state=3,check_user='" + app.globalData.ggwUserInfo.person_name + "',check_dt=GetDate() where id=" + _this.data.applyData.id;
      meafe.SQLEdit(sqlstr, function (obj) {
        wx.showModal({
          title: "操作完成",
          content: "审核通过",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({ delta: 2 })
          }
        });
        sms.sendSMS({
          nbr: _this.data.applyData.apply_phone,
          cnt: "你的申请已通过领导审批",
          pri: "1",
          from_sys: "小程序",
          create_person: app.globalData.ggwUserInfo.person_name,
        });
        meafe.SQLQuery("select mobile_phone from 广告位登记人员表 where id=" + app.globalData.ggwUserInfo.parent_id, function (obj) {
          sms.sendSMS({
            nbr: obj[0].mobile_phone,
            cnt: "有一个" + _this.data.person_name + "发起的新申请待审批",
            pri: "1",
            from_sys: "小程序",
            create_person: app.globalData.ggwUserInfo.person_name,
          });
        });
      });
    }
    else if (_this.data.applyData.state == 3) {
      var sqlstr = "update channel_list set state=5,opt_user='" + app.globalData.ggwUserInfo.person_name + "',opt_dt=GetDate() where id=" + _this.data.applyData.id;
      meafe.SQLEdit(sqlstr, function (obj) {
        wx.showModal({
          title: "操作完成",
          content: "审核通过",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({ delta: 2 })
          }
        });
        sms.sendSMS({
          nbr: _this.data.applyData.apply_phone,
          cnt: "你的申请已通过管理员审批",
          pri: "1",
          from_sys: "小程序",
          create_person: app.globalData.ggwUserInfo.person_name,
        });
      });
    }
  },

  disagree: function () {
    var _this = this;
    if (_this.data.applyData.state == 1) {
      var sqlstr = "update channel_list set state=2,check_user='" + app.globalData.ggwUserInfo.person_name + "',check_dt=GetDate() where id=" + _this.data.applyData.id;
      meafe.SQLEdit(sqlstr, function (obj) {
        wx.showModal({
          title: "操作完成",
          content: "审核通过",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({ delta: 2 })
          }
        });
        sms.sendSMS({
          nbr: _this.data.applyData.apply_phone,
          cnt: "你的申请被领导退回",
          pri: "1",
          from_sys: "小程序",
          create_person: app.globalData.ggwUserInfo.person_name,
        });
      });
    }
    else if (_this.data.applyData.state == 3) {
      var sqlstr = "update channel_list set state=4,opt_user='" + app.globalData.ggwUserInfo.person_name + "',opt_dt=GetDate() where id=" + _this.data.applyData.id;
      meafe.SQLEdit(sqlstr, function (obj) {
        wx.showModal({
          title: "操作完成",
          content: "审核通过",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({ delta: 2 })
          }
        });
        sms.sendSMS({
          nbr: _this.data.applyData.apply_phone,
          cnt: "你的申请被管理员退回",
          pri: "1",
          from_sys: "小程序",
          create_person: app.globalData.ggwUserInfo.person_name,
        });
      });
    }
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