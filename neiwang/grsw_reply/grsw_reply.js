var app = getApp();
var meafe = require('../../utils/util_meafe.js');
var util = require('../../utils/util.js');
Page({
  data: {
    id: null,
    receivers: "",
    title: '',
    content: '',
    sender: ''
  },
  onLoad: function (option) {
    var thiz = this;
    thiz.setData({ id: option.id, 
      reply: option.reply
    });
    thiz.getData();
    var _this = this;
    app.receivers = [];  
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    this.setData({ receivers: (app.receivers).join(" ")})
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {

  },
  distinct: function (arr) {
    var result = [],
      i,
      j,
      len = arr.length;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        if (arr[i] === arr[j]) {
          j = ++i;
        }
      }
      result.push(arr[i]);
    }
    return result;
  },
  getData: function () {
    var thiz = this;
    if (thiz.data.id == null) return;
    wx.showLoading({
      title: '正在加载..',
    })
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
        var sender = res.data.sender.trim();
        var receiver = res.data.receiver;
        var reply_person = sender;
        if (thiz.data.reply == '2') {
          reply_person = sender + " " + receiver.trim();
        }
        reply_person = reply_person.replace(res.data.shouuser, "");
        reply_person = reply_person.replace(res.data.shouuser, "");
        reply_person = reply_person.replace(res.data.shouuser, "");
        reply_person = reply_person.replace("  ", " ");
        reply_person = reply_person.replace("  ", " ");
        reply_person = reply_person.trim();
        var plist = reply_person.split(" ");
        plist = thiz.distinct(plist);
        app.receivers = plist;  
        thiz.setData({
          title: (thiz.data.reply=='1'?"回复 ":"回复所有人 ") + res.data.title,
          receivers: app.receivers.join(" "),
          sender: res.data.sender
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
  submit: function () {
    var thiz = this;
    setTimeout(function () {
      if (thiz.data.receivers.trim().length == 0) {
        meafe.Toast("请选择联系人");
        return;
      }
      if (thiz.data.title.trim().length == 0) {
        meafe.Toast("请输入标题");
        return;
      }
      if (thiz.data.content.trim().length == 0) {
        meafe.Toast("请输入内容");
        return;
      }
      console.log(thiz.data)
      wx.request({
        url: "https://www.meafe.cn/sxf/fa_grsw/",
        data: {
          receivers: thiz.data.receivers.split(" "),
          sender: app.globalData.ggwUserInfo.work_id,
          title: thiz.data.title,
          content: thiz.data.content
        },
        method: "POST",
        dataType: "json",
        responseType: "text",
        success: function (res) {
          console.log(res.data);
          if (res.data==true) {
            meafe.Toast("发送成功");
            app.receivers = [];
            wx.navigateBack({
              delta: 1
            })
          }
          else {
            meafe.Toast("发送失败");
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '服务器开小差了，是否重新获取数据？',
            content: '',
            success: function (res) {
              if (res.confirm) {
                thiz.submit();
              } else if (res.cancel) {
              }
            }
          })
        },
        complete: function (res) { wx.hideLoading(); },
      })
    }, 300);
  },
  selectContact: function () {
    wx.navigateTo({
      url: '../grsw_select_person/grsw_select_person',
    })
  }
})