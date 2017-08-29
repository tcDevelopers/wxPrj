var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data:{ 
    work_id:'',
    mobile_phone:''
  },
  onLoad:function(options){
    var _this = this;
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    
  },
  bindInput1: function (e) {
    this.setData({
      work_id: e.detail.value
    })
  },
  bindInput2: function (e) {
    this.setData({
      mobile_phone: e.detail.value
    })
  },
  tapSubmit: function () {
    var _this = this;
    //检查是否满足提交的条件
    if (_this.data.work_id == ''){
      meafe.Toast('请输入工号')
      return;
    }
    if (_this.data.mobile_phone.length != 11) {
      meafe.Toast('请输入正确手机号' )
      return;
    }
    wx.showLoading();
    meafe.SQLQuery("select * from 广告位登记人员表 where work_id='" + _this.data.work_id + "' ", function (obj) {
      if (obj.length > 0){
        meafe.SQLEdit("update 广告位登记人员表 set openid='" + app.globalData.openid + "',mobile_phone='" + _this.data.mobile_phone +"' where work_id='" + _this.data.work_id + "' ", function (obj) {
          meafe.SQLQuery("select * from 广告位登记人员表 where openid='" + app.globalData.openid + "' order by id desc", function (obj) {
            wx.hideLoading();
            if (obj.length > 0) {
              app.globalData.ggwUserInfo = obj[0];
              meafe.Toast('绑定成功')
              wx.navigateBack({
                delta: 1
              })
             
            }
            else {
              meafe.Toast('请重试')
            }
          }, function () {
            wx.hideLoading();
            meafe.Toast('请重试')
          });
        }, function () {
          wx.hideLoading();
          meafe.Toast('保存失败')
        });
      }
      else {
        wx.hideLoading();
        meafe.Toast('您的工号未配置，请联系管理员')
      }
    }, function () {
      wx.hideLoading();
      meafe.Toast('请重试')
    });
  }
})