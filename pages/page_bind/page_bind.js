var app = getApp();
var meafe = require('../../utils/util_meafe.js');
var sms = require('../../utils/sms.js');
Page({
  data:{ 
    verify_code:'',
    mobile_phone:'',
    staff_no:'',
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
  bindInput3: function (e) {
    this.setData({
      staff_no: e.detail.value
    })
  },
  tapSendSms:function(){
    var _this = this;
    wx.request({
      url: 'https://www.meafe.cn/paidan/page_wx_xcx/get_xcx_verify_code.jsp',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        mobile_phone: _this.data.mobile_phone,
        staff_no: _this.data.staff_no
      },
      method: 'POST',
      success: function (res) {
        if (res.data.indexOf("success") > -1 && res.data.indexOf("err")==-1){
          meafe.Toast("发送成功");
          _this.setData({ sendWait: 30 });
          _this.sendWaitProd();
        }
        else {
          meafe.Toast(res.data.trim());
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
      url: 'https://www.meafe.cn/paidan/page_wx_xcx/check_xcx_verify_code.jsp?mobile_phone=' + _this.data.mobile_phone + "&verify_code=" + _this.data.verify_code+"&open_id="+app.userInfo.openid,
      data: {
        mobile_phone: _this.data.mobile_phone,
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log(res.data);
        var re = res.data;
        if (re.msg=="ok") {
          for (var f in re.data){
            if (re.data[f]){
              app.userInfo[f] = re.data[f];
            }
          }
            meafe.Toast(re.data.STAFF_NM + '，绑定成功');
            var pages = getCurrentPages(); // 当前页面  
            var beforePage = pages[pages.length - 2]; // 前一个页面  
            wx.navigateBack({
              delta: 1,
              success: function () {
                beforePage.getFuncList(); // 执行前一个页面的onLoad方法  
                beforePage.onLoad(); // 执行前一个页面的onLoad方法
              }  
            })
        }
      },
      fail() {
        wx.hideLoading();
        meafe.Toast("网络失败，请重试")
      }
    })   
  }
})