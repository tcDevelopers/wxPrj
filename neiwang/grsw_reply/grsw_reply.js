var app = getApp();
var meafe = require('../../utils/util_meafe.js');
var util = require('../../utils/util.js');
Page({
  data: {
    id: -1,
    receivers: "",
    title: '',
    content: '',
  },
  onLoad: function (option) {
    var thiz = this;
    thiz.setData({ id: option.id});
    thiz.getData();
    var _this = this;
    var work_id = app.globalData.ggwUserInfo.work_id;
    //员工账号显示删除按钮
    if (work_id != '') {
      this.setData({
        del_hidden: ''
      });
    }
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({ nbr: option.nbr, act: option.act });
    //加载数据
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {

  },
  getData: function(){
    wx.showLoading({
      title: '正在加载..',
    })
    var thiz = this;
    //获取数据内容
    wx.request({
      url: "https://www.meafe.cn/sxf/get_grsw_shou_detail/?id=" + thiz.data.id,
      data: {},
      header: {},
      method: "GET",
      dataType: "json",
      responseType: "text",
      success: function (res) {
        console.log(res.data);
        thiz.setData({
          title: "回复 " + res.data.title,
          receivers: res.data.sender
        });
      },
      fail: function (res) {
        wx.showModal({
          title: '服务器开小差了，是否重新获取数据？',
          content: '',
          success: function (res) {
            if (res.confirm) {
              thiz.getData();
            } else if (res.cancel) {
            }
          }
        })
      },
      complete: function (res) { wx.hideLoading(); },
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      wanggeTypeIndex: e.detail.value
    })
  },
  textBlur: function (e) {
    this.setData({ title: e.detail.value });
  },
  textBlur2: function (e) {
    this.setData({ content: e.detail.value });
  },

  bindInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindInput1: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit:function(){
    var thiz = this;
    setTimeout(function(){

      console.log(thiz.data)

    },100);
  }
})