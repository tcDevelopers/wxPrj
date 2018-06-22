var app = getApp();
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
  onLoad: function(options) {
    this.checkCache();
    this.setData({
      person_name: app.globalData.ggwUserInfo.person_name
    });
  },

  tpChange: function(e) {
    this.setData({
      apply_tp: e.detail.value
    });
  },

  actChange: function(e) {
    this.setData({
      apply_act: e.detail.value
    });
  },

  textBlur: function(e) {
    this.setData({
      apply_text: e.detail.value
    });
  },
  //加载审核人
  checkCache: function() {
    wx.request({
      url: 'https://www.meafe.cn/lite/get_data/',
      method: 'POST',
      data: {
        'tab': 'wx_user',
        'col': ['person_name', 'mobile_phone'],
        'whe': {
          'channel_role': '审核员'
        }
      },
      success: res => wx.setStorageSync('checkPerson', res.data),
    })
  },

  submit: function(e) {
    let that = this;
    let checkPerson = wx.getStorageSync('checkPerson');
    if (!that.data.apply_text) {
      wx.showModal({
        title: "提醒",
        content: "申请内容不能为空",
        showCancel: false,
        success: res => that.setData({
          text_focus: true
        }),
      });
    } else if (!checkPerson) {
      that.checkCache();
      return
    } else {
      let arr = [],
        nbr = [];
      checkPerson.forEach(item => {
        arr.push(item.person_name);
        nbr.push(item.mobile_phone);
      })
      wx.showActionSheet({
        itemList: arr,
        success: function(e) {
          if (e.cancel || !that.data.person_name)
            return
          let {
            apply_tp,
            apply_act,
            apply_text
          } = that.data;
          let apply_tp_nm = apply_tp == 1 ? '工号' : '渠道';
          let apply_act_nm = apply_act == 1 ? '新增' : apply_act == 2 ? '修改' : '删除';
          wx.request({
            url: 'https://www.meafe.cn/lite/apply_add/',
            method: 'POST',
            data: {
              'tab': 'wx_channel_apply',
              'val': {
                'apply_tp': apply_tp,
                'apply_tp_nm': apply_tp_nm,
                'apply_act': apply_act,
                'apply_act_nm': apply_act_nm,
                'apply_text': apply_text,
                'apply_user': that.data.person_name,
                'apply_dt': '',
                'state': 1,
                'state_nm': '待领导审核',
              },
            },
            success: res => {
              if (res.statusCode == 200) {
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
                  success: res => wx.navigateBack({
                    delta: 1
                  }),
                });
              }
            },
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  }
})