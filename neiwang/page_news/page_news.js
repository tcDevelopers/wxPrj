var app = getApp();
var meafe = require('../../utils/util_meafe.js'); 
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    mobile_phone: "",

  },
  onLoad: function () {
    var article = '<div style="color:Red;">我是HTML代码</div>';
    var that = this;
    WxParse.wxParse('article', 'html', article, that, 5);
    var down_url ="https://www.meafe.cn/nw/upload/fjgrsw/201801/2018_1_30_989468_严伟_小区分类调整-下发版.xlsx";
    const downloadTask = wx.downloadFile({
      url:down_url,
      success:function(res){
        if (res.statusCode === 200) {
          wx.openDocument({
            filePath: res.tempFilePath,
          })
        }
        else{
          meafe.Toast("文件下载失败")
        }
      }
    });
    downloadTask.onProgressUpdate((res) => {
      meafe.Toast("下载进度"+res.progress + "%");
    })
  },
  bindInput: function (e) {
  
  },
  tapListItem: function (e) {
   
  },
  searchRecord: function (e) {
   
  }
})