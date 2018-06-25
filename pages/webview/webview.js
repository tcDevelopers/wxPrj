var app = getApp();
Page({
  data: {
    id: -1,
    url: '',
  },
  onLoad: function () {
    this.setData({
      url: app.webview_url,
    });
  }
})