App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
  },
  userInfo: {
    openid: "",
    staff_no: "",
    staff_nm: "",
    bm: "",
    nw_role: 0,
  },
  server: "https://www.meafe.cn/lite/",
  webview_url: "",
  downloadTask: null,
  notice: 1
})