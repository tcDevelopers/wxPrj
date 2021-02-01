// map/map.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    longitude: 0,
    latitude: 0,
    taplon: 0,
    taplat: 0,
    tapnm: '目的地',
    tp: 0,
    satellite: true,
    rid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.tp = options.tp;
    if (options.tp == '3' || options.tp == '4')
      this.setData({
        rid: options.rid
      });
    else if (options.tp == '1')
      this.data.satellite = false;
    if (options.tp != '4') {
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          this.data.taplon = res.longitude;
          this.data.taplat = res.latitude;
          this.remarker(res.longitude, res.latitude, options.tp)
        }
      })
    } else {
      this.data.taplon = options.lon;
      this.data.taplat = options.lat;
      this.remarker(options.lon, options.lat, options.tp)
    }

  },

  remarker: function (lon, lat, tp) {
    let url = '';
    if (tp == '1')
      url = app.server + 'station';
    else
      url = app.server + 'light';
    wx.request({
      url: url + '?lon=' + lon + '&lat=' + lat + '&tp=' + tp,
      success: res =>
        this.setData({
          longitude: lon,
          latitude: lat,
          markers: res.data,
          satellite: this.data.satellite
        })
    })
  },

  regionchange: function (e) {
    // 地图发生变化的时候，获取中间点
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      let lon = e.detail.centerLocation.longitude;
      let lat = e.detail.centerLocation.latitude;
      this.remarker(lon, lat, this.data.tp);
    }
  },

  submit: function () {
    let params = {
      tableName: 'ly_sys_ZC定单系统',
      id: this.data.rid,
      map: {
        COL2: this.data.longitude + "," + this.data.latitude
      },
    };
    wx.showModal({
      title: '提示',
      content: '是否提交该位置？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: 'https://www.meafe.cn/paidan/UpdateById',
            data: {
              t: JSON.stringify(params)
            },
            method: 'POST',
            success: res => {
              if (res.statusCode == 200) {
                wx.showModal({
                  title: '保存结果',
                  content: '成功',
                })
              } else {
                wx.showModal({
                  title: '保存结果',
                  content: '失败',
                })
              }
            },
          })
        }
      }
    });
  },

  markertap: function (e) {
    this.data.taplon = this.data.markers[e.detail.markerId].longitude;
    this.data.taplat = this.data.markers[e.detail.markerId].latitude;
    let tapnm = this.data.markers[e.detail.markerId].callout.content;
    this.data.tapnm = tapnm.match(/:([\u4e00-\u9fa5]+)/)[1];
  },

  changetp: function () {
    this.setData({
      satellite: !this.data.satellite
    })
  },

  myposition: function () {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.remarker(res.longitude, res.latitude, this.data.tp)
      }
    })
  },

  guide: function (e) {
    wx.openLocation({
      type: 'gcj02',
      longitude: this.data.taplon,
      latitude: this.data.taplat,
      name: this.data.tapnm,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})