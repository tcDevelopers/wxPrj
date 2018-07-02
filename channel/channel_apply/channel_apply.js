var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_user: '',
    apply_tp: '1',
    apply_act: '1',
    apply_text: '',
    text_focus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      apply_user: app.userInfo.STAFF_NM
    });
    wx.getStorage({
      key: 'checkPerson',
      success: res => that.checkPerson = res.data,
      fail: res => that.checkCache(),
    })
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
    let that = this;
    wx.request({
      url: 'https://www.meafe.cn/lite/get_data/',
      method: 'POST',
      data: {
        'tab': 'ly_sys_user_table',
        'col': ['staff_nm'],
        'whe': {
          'channel_role': '审核员'
        }
      },
      success: res => {
        wx.setStorageSync('checkPerson', res.data);
        that.checkPerson = res.data;
      },
    })
  },

  submit: function(e) {
    let that = this;
    if (!that.data.apply_text) {
      wx.showModal({
        title: "提醒",
        content: "申请内容不能为空",
        showCancel: false,
        success: res => that.setData({
          text_focus: true
        }),
      });
    } else if (!that.checkPerson) {
      that.checkCache();
      return
    } else {
      let arr = [];
      that.checkPerson.forEach(item => {
        arr.push(item.staff_nm)
      })
      wx.showActionSheet({
        itemList: arr,
        success: function(e) {
          if (e.cancel || !that.data.apply_user)
            return
          let {
            apply_tp,
            apply_act,
            apply_text,
            apply_user
          } = that.data;
          wx.request({
            url: 'https://www.meafe.cn/lite/apply_add/',
            method: 'POST',
            data: {
              'val': {
                'apply_tp': apply_tp,
                'apply_act': apply_act,
                'apply_text': apply_text,
                'apply_user': apply_user
              },
              'check': arr[e.tapIndex]
            },
            success: res => {
              if (res.statusCode == 200) {
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