// channel/channel_check/channel_check.js
var meafe = require('../../utils/util_meafe.js');
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var sqlstr = "select id,apply_tp,apply_act,apply_user,apply_text,state,isnull(check_user,'领导') check_user,isnull(opt_user,'管理员') opt_user from channel_list where id=" + options.id;
    meafe.SQLQuery(sqlstr, function (obj) {
      _this.setData({ applyData: obj[0] });
      _this.setData({ node1: '发起申请' });
      if (_this.data.applyData.state == 1)
        _this.setData({ node2: '待审核' });
      else if (_this.data.applyData.state == 2)
        _this.setData({ node2: '退回' });
      else
        _this.setData({ node2: '审核通过' });
      if (_this.data.applyData.state == 3)
        _this.setData({ node3: '待审核' });
      else if (_this.data.applyData.state == 4)
        _this.setData({ node3: '退回' });
      else
        _this.setData({ node3: '审核通过' });
    });
  },

  agree: function(){
    if (this.data.applyData.state == 1)
      var sqlstr = "update channel_list set state=state+2,check_user='" + app.globalData.ggwUserInfo.person_name + "',check_dt=GetDate() where id=" + this.data.applyData.id;
    else if (this.data.applyData.state == 3)
      var sqlstr = "update channel_list set state=state+2,opt_user='" + app.globalData.ggwUserInfo.person_name + "',opt_dt=GetDate() where id=" + this.data.applyData.id;
    else
      return;
    meafe.SQLEdit(sqlstr, function (obj) {
      wx.showModal({
        title: "操作完成",
        content: "审核通过",
        showCancel: false,
        success: function (res) {
          wx.navigateBack({ delta: 2 })
        }
      });
    });
  },

  disagree: function () {
    if(this.data.applyData.state==1)
      var sqlstr = "update channel_list set state=state+1,check_user='" + app.globalData.ggwUserInfo.person_name + "',check_dt=GetDate() where id="+this.data.applyData.id;
    else if (this.data.applyData.state == 3)
      var sqlstr = "update channel_list set state=state+1,opt_user='" + app.globalData.ggwUserInfo.person_name + "',opt_dt=GetDate() where id="+this.data.applyData.id;
    else
      return;
    meafe.SQLEdit(sqlstr,function(obj){
      wx.showModal({
        title: "操作完成",
        content: "退回成功",
        showCancel: false,
        success: function (res) {
          wx.navigateBack({ delta: 2 })
        }
      });
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