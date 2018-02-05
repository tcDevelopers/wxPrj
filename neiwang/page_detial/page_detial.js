var app = getApp();
var meafe = require('../../utils/util_meafe.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    id: -1,
    detail_type:"grsw",
    receiver_hidden: true,
    mobile_phone: "",
    fj_list:[] ,
    sender:"加载中...",
    time:"",
    receiver:"加载中...",
    title:"加载中...",
    neirong:"加载中..."
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
    var thiz = this;
    if (this.data.detail_type == "grsw_shou") {
      url = "https://www.meafe.cn/sxf/get_grsw_shou_detail/?id=" + thiz.data.id;
      wx.setNavigationBarTitle({
        title: "个人事务（收件箱）"
      })
    }
    else if (this.data.detail_type == "grsw_fa") {
      url = "https://www.meafe.cn/sxf/get_grsw_fa_detail/?id=" + thiz.data.id;
      wx.setNavigationBarTitle({
        title: "个人事务（发件箱）"
      })
    }
    else {
      url = "https://www.meafe.cn/sxf/oa_gsxx_detail/?id=" + thiz.data.id;
      wx.setNavigationBarTitle({
        title: "公司信息"
      })
    }

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
      if (path.endsWith(".doc") || path.endsWith(".docx")) {
        ftype = "word";
      }
      else if (path.endsWith(".xls") || path.endsWith(".xlsx")) {
        ftype = "excel";
      }
      else if (path.endsWith(".ppt") || path.endsWith(".pptx")) {
        ftype = "ppt";
      }
      else if (ftype.endsWith(".pdf")) {
        ftype = "pdf";
      }
      else {
        ftype = "other";
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
  tapListItem: function (e) {
    wx.showLoading({ title: "准备下载..", mask:true});
    var path = e.currentTarget.id;
    var down_url = "https://www.meafe.cn/nw/upload/fjgrsw/201801/2018_1_30_989468_严伟_小区分类调整-下发版.xlsx";
    down_url = "https://www.meafe.cn/nw/"+path;
    const downloadTask = wx.downloadFile({
      url: down_url,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          wx.openDocument({
            filePath: res.tempFilePath,
          });
        }
        else {
          meafe.Toast("文件下载失败");
        }
      },
      fail:function(){
        wx.hideLoading();
        meafe.Toast("文件下载失败");
      }
    });
    downloadTask.onProgressUpdate((res) => {
      wx.showLoading({ title: "下载进度" + res.progress + "%", mask:true});
      
    })
  },
})