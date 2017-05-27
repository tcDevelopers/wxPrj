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
    this.setData({
      person_name: app.globalData.ggwUserInfo.person_name
    });
  },
  
  tpChange: function(e) {
    this.setData({apply_tp: e.detail.value});
  },

  actChange: function(e) {
    this.setData({apply_act: e.detail.value});
  },

  textBlur: function(e){
    this.setData({ apply_text: e.detail.value });
  },
  
  submit: function(e){
    var _this = this;
    if (_this.data.apply_text == '') {
      wx.showModal({
        title: "提醒",
        content: "申请内容不能为空",
        showCancel: false,
        success: function(res){
          _this.setData({text_focus: true});
        }
      });
    }
    else{
      meafe.SQLEdit("insert into channel_list(apply_tp,apply_act,apply_text,apply_user,apply_dt,state) values(" + _this.data.apply_tp + "," + _this.data.apply_act + ",'" + _this.data.apply_text + "','" + app.globalData.ggwUserInfo.person_name + "',GetDate(),1)", function (obj) {
        wx.showModal({
          title: "申请成功",
          content: "请耐心等待领导审阅",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({ delta: 1 });
          }
        });
      });
      meafe.SQLQuery("select mobile_phone from 广告位登记人员表 where id=" + app.globalData.ggwUserInfo.parent_id, function (obj) {
        sms.sendSMS({
          nbr: obj[0].mobile_phone,
          cnt: "有一个" + _this.data.person_name + "发起的新申请待审批",
          pri: "1",
          from_sys: "小程序",
          create_person: app.globalData.ggwUserInfo.person_name,
        }, null);
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