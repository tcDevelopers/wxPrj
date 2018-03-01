var app = getApp();
var meafe = require('../../utils/util_meafe.js');
var sms = require('../../utils/sms.js');
Page({
  data:{ 
    verify_code:'',
    mobile_phone:'',
    sendWait: 0
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
      verify_code: e.detail.value
    })
  },
  bindInput2: function (e) {
    this.setData({
      mobile_phone: e.detail.value
    })
  },
  tapSendSms:function(){
    var _this = this;
    wx.request({
      url: 'https://www.meafe.cn/wx/get_xcx_verify_code.jsp?mobile_phone=' + _this.data.mobile_phone,
      data: {
        mobile_phone: _this.data.mobile_phone,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.indexOf("success") > -1 && res.data.indexOf("err")==-1){
          meafe.Toast("发送成功");
          _this.setData({ sendWait: 30 });
          _this.sendWaitProd();
        }
      }
    })
  },
  sendWaitProd: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({ sendWait: _this.data.sendWait - 1 });
      if (_this.data.sendWait>0){
        _this.sendWaitProd();
      }
    }, 1000)
  },
  tapSubmit: function () {
    var _this = this;
    //检查是否满足提交的条件
    if (_this.data.verify_code == ''){
      meafe.Toast('请输入验证码')
      return;
    }
    if (_this.data.mobile_phone.length != 11) {
      meafe.Toast('请输入正确手机号' )
      return;
    } var _this = this;
    wx.request({
      url: 'https://www.meafe.cn/wx/check_xcx_verify_code.jsp?mobile_phone=' + _this.data.mobile_phone + "&verify_code=" + _this.data.verify_code,
      data: {
        mobile_phone: _this.data.mobile_phone,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.indexOf("ok") > -1) {
          meafe.SQLQuery("select * from 广告位登记人员表 where mobile_phone='" + _this.data.mobile_phone + "' ", function (obj) {
            if (obj.length > 0) {
              meafe.SQLEdit("update 广告位登记人员表 set openid='" + app.globalData.openid + "',mobile_phone='" + _this.data.mobile_phone + "' where mobile_phone='" + _this.data.mobile_phone + "' ", function (obj) {
                meafe.SQLQuery("select * from 广告位登记人员表 where openid='" + app.globalData.openid + "'", function (obj) {
                  wx.hideLoading();
                  if (obj.length > 0) {
                    app.globalData.ggwUserInfo = obj[0];
                    meafe.Toast(obj[0].pserson_name + '，绑定成功')
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
              meafe.Toast('没有找到您的号码，请联系管理员添加')
            }
          }, function () {
            wx.hideLoading();
            meafe.Toast('请重试')
          });
        }
      }
    })   
  }
})