var app = getApp();
Page({
  data: {
    id: -1,
    url: "",
    file_name:""
  },
  onLoad: function (options) {
    var thiz = this;
    var url = options.url;
    var file_name = url.substring(url.lastIndexOf('/')+1);
    thiz.setData({ url: url, file_name: file_name});
    thiz.download();
  },
  returnBack: function () {
    try {
      app.downloadTask.abort(); // 取消下载任务
    } catch (e) {

    }
    wx.navigateBack({
      delta: 1
    })
  },
  download:function(){
    var thiz = this;
    var down_url = "https://www.meafe.cn/nw/" + encodeURI(thiz.data.url);
    console.log(down_url);
    if (down_url.toLowerCase().endsWith('.jpg') || down_url.toLowerCase().endsWith('.png')
      || down_url.toLowerCase().endsWith('.bmp') | down_url.toLowerCase().endsWith('.jpeg')) {

      var current = down_url;
      var urls = [];
      urls.push(down_url);
      console.log(current)
      wx.previewImage({
        current: down_url,
        urls: urls,
        fail: function () {
          console.log('fail')
        },
        complete: function () {
          //console.info("点击图片了");
        },
      })
    }
    else {
      wx.showLoading({ title: "准备下载..", mask: true });
      app.downloadTask = wx.downloadFile({
        url: down_url,
        success: function (res) {
          wx.hideLoading();
          if (res.statusCode === 200) {
            wx.openDocument({
              filePath: res.tempFilePath,
            });
          }
          else {
            wx.showToast({
              title: '文件下载失败',
              icon: 'success',
              duration: 1500
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: '文件下载失败',
            icon: 'success',
            duration: 1500
          })
        }
      });
      app.downloadTask.onProgressUpdate((res) => {
        wx.showLoading({ title: "下载进度" + res.progress + "%", mask: true });
      })
    }
  },
  onUnload: function () {
    try {
      app.downloadTask.abort(); // 取消下载任务
    }catch(e){

    }
  }
})