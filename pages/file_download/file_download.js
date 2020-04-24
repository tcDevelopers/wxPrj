var app = getApp();
Page({
  data: {
    id: -1,
    url: "",
    file_name: ""
  },
  onLoad: function(options) {
    var thiz = this;
    thiz.setData({
      url: options.url,
      file_name: options.url.substring(options.url.lastIndexOf('/') + 1)
    }, () => thiz.download());
  },
  returnBack: function() {
    try {
      app.downloadTask.abort(); // 取消下载任务
    } catch (e) {

    }
    wx.navigateBack({
      delta: 1
    })
  },
  download: function() {
    var thiz = this;
    var down_url = thiz.data.url;
    console.log(down_url);
    if (down_url.toLowerCase().endsWith('.jpg') || down_url.toLowerCase().endsWith('.png') ||
      down_url.toLowerCase().endsWith('.bmp') || down_url.toLowerCase().endsWith('.jpeg') ||
      down_url.toLowerCase().endsWith('.gif')) {
      wx.previewImage({
        current: down_url,
        urls: [down_url],
      })
    } else {
      wx.showLoading({
        title: "准备下载..",
        mask: true
      });
      app.downloadTask = wx.downloadFile({
        url: down_url,
        success: function(res) {
          wx.hideLoading();
          if (res.statusCode === 200) {
            wx.openDocument({
              filePath: res.tempFilePath,
            });
          } else {
            wx.showToast({
              title: '文件下载失败',
              icon: 'success',
              duration: 1500
            })
          }
        },
        fail: function() {
          wx.hideLoading();
          wx.showToast({
            title: '文件下载失败',
            icon: 'success',
            duration: 1500
          })
        }
      });
      app.downloadTask.onProgressUpdate((res) => {
        wx.showLoading({
          title: "下载进度" + res.progress + "%",
          mask: true
        });
      })
    }
  },
  onUnload: function() {
    try {
      app.downloadTask.abort(); // 取消下载任务
    } catch (e) {

    }
  }
})