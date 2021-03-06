var app = getApp();
Page({
  data: {
    nms: [],
    staffs: [],
    title: '',
    content: '',
    dx: false,
    tp: '1',
  },
  onLoad: function (options) {
    /*依据tp字段有3种场景
      1：发送
      2：回复
      3：转发
    */
    let that = this;
    if (options.tp == '2') {
      wx.setNavigationBarTitle({
        title: '回复个人事务'
      });
      let {
        sendgh,
        sender
      } = options;
      wx.setStorageSync('selected', [{
        'staff': sendgh,
        'nm': sender
      }]);
      that.setData({
        tp: options.tp,
        title: '回复 ' + sender + ' ' + options.title
      })
    } else if (options.tp == '3') {
      wx.setNavigationBarTitle({
        title: '转发个人事务'
      });
      wx.setStorageSync('selected', []);
      that.shouid = options.shouid;
      that.setData({
        tp: options.tp,
        title: '转自' + options.sender + ' ' + options.title
      });
    } else {
      wx.setStorageSync('selected', []);
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    let selected = wx.getStorageSync('selected');
    if (selected && selected.length)
      this.setData({
        nms: selected.map(val => val.nm),
        staffs: selected.map(val => val.staff)
      });
  },
  textBlur: function (e) {
    this.setData({
      title: e.detail.value
    });
  },
  textBlur2: function (e) {
    this.setData({
      content: e.detail.value
    });
  },
  ifdx: function (e) {
    this.setData({
      dx: e.detail.value
    });
  },
  bindSelect: function () {
    if (this.data.tp == '2') return;
    wx.navigateTo({
      url: '../grsw_select/grsw_select',
    })
  },
  submit: function () {
    var that = this;
    if (!that.data.staffs.length) {
      wx.showToast({
        title: '请选择联系人',
        icon: 'loading',
        duration: 1500,
        mask: true,
      });
      return;
    }
    if (!that.data.title.trim().length) {
      wx.showToast({
        title: '请输入标题',
        icon: 'loading',
        duration: 1500,
        mask: true,
      });
      return;
    }
    wx.showLoading({
      title: '正在发送...',
    })
    let data = {
      staff_no: app.userInfo.staff_no,
      receivers: that.data.staffs,
      title: that.data.title,
      content: that.data.content,
      dx: that.data.dx,
      staff_nm: app.userInfo.staff_nm,
    };
    let url = app.server + 'grsw_send';
    if (that.data.tp == '3') {
      data.shouid = that.shouid;
      url = app.server + 'grsw_forward';
    }
    wx.request({
      url: url,
      data: data,
      method: "POST",
      success: function (res) {
        wx.hideLoading();
        if (res.data) {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 1500,
            mask: true,
          });
          wx.removeStorageSync("selected");
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: '发送失败',
            icon: 'loading',
            duration: 1500,
            mask: true,
          });
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '发送失败',
          icon: 'loading',
          duration: 1500,
          mask: true,
        });
      }
    })
  }
})