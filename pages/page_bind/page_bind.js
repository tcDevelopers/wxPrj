var app = getApp();
Page({
  data: {
    verify_code: '',
    staff_no: '',
    sms: false,
  },
  onLoad: function (options) {},
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {},
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {},
  bindInput1: function (e) {
    this.setData({
      staff_no: e.detail.value
    })
  },
  bindInput2: function (e) {
    this.setData({
      verify_code: e.detail.value
    })
  },
  tapSendSms: function () {
    let that = this;
    if (that.data.staff_no.trim().length < 4) {
      wx.showToast({
        title: '请填写正确工号',
        icon: 'loading',
        duration: 1500,
        mask: true,
      });
      return;
    }
    wx.request({
      url: app.server + 'bind_staff',
      method: 'POST',
      data: {
        tp: 0,
        staff_no: that.data.staff_no
      },
      success: res => {
        if (res.statusCode == 200)
          wx.showToast({
            title: res.data,
            icon: 'loading',
            duration: 1500,
            mask: true,
          });
        that.setData({
          sms: true
        });
        setTimeout(() => that.setData({
          sms: false
        }), 30000);
      }
    })
  },
  tapSubmit: function () {
    let that = this;
    //检查是否满足提交的条件
    if (!that.data.verify_code.trim().length) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'loading',
        duration: 1500,
        mask: true,
      });
      return;
    }
    if (that.data.staff_no.trim().length < 4) {
      wx.showToast({
        title: '请填写正确工号',
        icon: 'loading',
        duration: 1500,
        mask: true,
      });
      return;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    wx.request({
      url: app.server + 'bind_staff',
      method: 'POST',
      data: {
        tp: 1,
        staff_no: that.data.staff_no,
        verify_code: that.data.verify_code,
        open_id: app.userInfo.openid,
      },
      success: res => {
        wx.hideLoading();
        if (res.data.success)
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            mask: true,
            complete: () => setTimeout(function () {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }, 1500)
          })
        else
          wx.showToast({
            title: '验证码错误',
            icon: 'loading',
            mask: true
          })
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '绑定失败',
          icon: 'loading',
          duration: 1500,
          mask: true,
        })
      }
    })
  }
})