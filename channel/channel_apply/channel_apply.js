var app = getApp();
var meafe = require('../../utils/util_meafe.js');
var sms = require('../../utils/sms.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person_name: '',
    apply_tp: 1,
    apply_act: 1,
    apply_text: '',
    text_focus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkCache();
    this.setData({
      person_name: app.globalData.ggwUserInfo.person_name
    });
  },

  tpChange: function (e) {
    this.setData({ apply_tp: e.detail.value });
  },

  actChange: function (e) {
    this.setData({ apply_act: e.detail.value });
  },

  textBlur: function (e) {
    this.setData({ apply_text: e.detail.value });
  },
  //加载审核人
  checkCache: function () {
    let sqlstr = "select person_name,mobile_phone from 广告位登记人员表 where channel_role='审核员'";
    meafe.SQLQuery(sqlstr, function (obj) {
      wx.setStorageSync('checkPerson', obj);
    });
  },

  submit: function (e) {
    let that = this;
    let checkPerson = wx.getStorageSync('checkPerson');
    if (!that.data.apply_text) {
      wx.showModal({
        title: "提醒",
        content: "申请内容不能为空",
        showCancel: false,
        success: res => that.setData({ text_focus: true }),
      });
    }
    else if (!checkPerson) {
      that.checkCache();
      return
    }
    else {
      let arr = [], nbr = [];
      checkPerson.forEach(item => {
        arr.push(item.person_name);
        nbr.push(item.mobile_phone);
      })
      wx.showActionSheet({
        itemList: arr,
        success: function (e) {
          if (e.cancel)
            return
          let sqlstr = "insert into channel_list(apply_tp,apply_act,apply_text,apply_user,apply_dt,state) values(" + that.data.apply_tp + "," + that.data.apply_act + ",'" + that.data.apply_text + "','" + that.data.person_name + "',GetDate(),1)";
          meafe.SQLEdit(sqlstr, function (obj) {
            sms.sendSMS({
              nbr: nbr[e.tapIndex],
              cnt: "有一个" + that.data.person_name + "发起的新申请待审批",
              pri: "1",
              from_sys: "小程序",
              create_person: that.data.person_name,
            });
            wx.showModal({
              title: "申请成功",
              content: "请耐心等待" + arr[e.tapIndex] + "审阅",
              showCancel: false,
              success: res => wx.navigateBack({ delta: 1 }),
            });
          });
        }
      })
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