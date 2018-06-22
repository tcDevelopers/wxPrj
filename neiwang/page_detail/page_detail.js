var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    id: -1,
    detail_type: "gsxx",
    receiver_hidden: true,
    mobile_phone: "",
    fj_list:[] ,
    sender: "加载中...",
    time: "",
    receiver: "加载中...",
    title: "加载中...",
    neirong: "加载中...",
    neirong_url1: "",
    neirong_url: ""
  },
  onLoad:function(options){
    var thiz = this;
    console.log(options);
    thiz.setData({ id: options.id, 
    detail_type: options.type, 
    receiver_hidden: ( options.type == "gsxx"),
    sender_hidden: (options.type == "grsw_fa")
     });
    thiz.getdetail();

   // var re = { "neirong": "见附件：", "time": "2009-07-31 16:07:51", "sender": "徐利春", "title": "一周菜单（2009.8.3-8.7）", "fujian": [["附录一：“健康顾问”详细介绍.doc", "upload/files/600105_200983164317.doc"]] }
  },
  getdetail: function (e) {
    wx.showLoading({
      title: '正在加载数据...',
      mask: true
    })
    var url = "";
    var neirong_url = "";
    var thiz = this;
    if (this.data.detail_type == "grsw_shou") {
      url = "https://www.meafe.cn/lite/get_grsw_shou_detail/?id=" + thiz.data.id;
      neirong_url = 'https://www.meafe.cn/lite/get_grsw_shou_html/?id=' + thiz.data.id
      wx.setNavigationBarTitle({
        title: "个人事务（收件箱）"
      })
    }
    else if (this.data.detail_type == "grsw_fa") {
      url = "https://www.meafe.cn/lite/get_grsw_fa_detail/?id=" + thiz.data.id;
      neirong_url = 'https://www.meafe.cn/lite/get_grsw_fa_html/?id=' + thiz.data.id
      wx.setNavigationBarTitle({
        title: "个人事务（发件箱）"
      })
    }
    else {
      url = "https://www.meafe.cn/lite/oa_gsxx_detail/?id=" + thiz.data.id;
      neirong_url = 'https://www.meafe.cn/lite/get_gsxx_html/?id=' + thiz.data.id
      wx.setNavigationBarTitle({
        title: "公司信息"
      })
    }
    thiz.setData({ neirong_url1: neirong_url });
    wx.request({
      url: url,
      data: {},
      header: {},
      method: "GET",
      dataType: "json",
      responseType: "text",
      success: function (res) {
        console.log(res.data);
        thiz.loadPageData(res.data);
      },
      fail:function(res){
        wx.showModal({
          title: '服务器开小差了，是否重新获取数据？',
          content: '',
          success: function (res) {
            if (res.confirm) {
              thiz.getdetail();
            } else if (res.cancel) {
            }
          }
        })
      },
      complete: function (res) { wx.hideLoading(); },
    })
  },
  loadPageData:function(re){
    var fj_list = [];
    for (var i = 0; i < re.fujian.length; i++) {
      var path = re.fujian[i][1];
      var name = re.fujian[i][0];
      var ftype = "file";
      if (path.toLowerCase().endsWith(".doc") || path.toLowerCase().endsWith(".docx")) {
        ftype = "word";
      }
      else if (path.toLowerCase().endsWith(".xls") || path.toLowerCase().endsWith(".xlsx")) {
        ftype = "excel";
      }
      else if (path.toLowerCase().endsWith(".ppt") || path.toLowerCase().endsWith(".pptx")) {
        ftype = "ppt";
      }
      else if (path.toLowerCase().endsWith(".pdf")) {
        ftype = "pdf";
      }
      else if (path.toLowerCase().endsWith('.jpg') || path.toLowerCase().endsWith('.png')
        || path.toLowerCase().endsWith('.bmp') | path.toLowerCase().endsWith('.jpeg')) {
        ftype = "img";
      }
      else {
        ftype = "file";
      }
      fj_list.push({ ftype: ftype, path: path, name: name });
    }
    this.setData({
      fj_list: fj_list,
      title: re.title,
      neirong: re.neirong,
      sender: re.sender,
      time: re.time,
      receiver: re.receiver
    });
    var that = this;
    WxParse.wxParse('article', 'html', that.data.neirong, that, 5);
  },
  tapListItem: function (e) {

  },
  bindSrcHtml: function () {
    app.webview_url = this.data.neirong_url1;
    wx.navigateTo({
      url: '../../pages/webview/webview',
    })
  }
})