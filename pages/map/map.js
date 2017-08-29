var app = getApp();
var meafe = require('../../utils/util_meafe.js');
//获取应用实例
var app = getApp()
Page({
  location: {},
  data: {
    markers: []
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onLoad: function () {
    var _this = this;
    _this.setData({
      location:{ longitude: 121.11264, latitude: 31.45284 }
      });
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        _this.setData({
            location: res  //res.longitude  res.latitude
        })
      }
    })
    meafe.SQLQuery("select * from 营业厅表",
      function (d) {
        console.log(d);
        var mrks = [];
        for (var i = 0; i < d.length; i++) {
          var mrk = {
            iconPath: "../../img/dx.png",
            id: i,
            longitude: parseFloat(d[i].lng),
            latitude: parseFloat(d[i].lat),
            width: 72,
            height: 36,
            callout:{
              content: d[i].name+'\n'+d[i].miaoshu,
              borderRadius:6,
              fontSize:18,
              padding:6,
              display:'BYCLICK'
            }
          }
          mrks.push(mrk);
        }
        _this.setData({
          markers: mrks  //res.longitude  res.latitude
        })
      },
      function(res){}
    );
     
  },
  //设置下方代码主要是从其他界面返回的时候，显示最新的用户信息，有可能在用户绑定界面就改变了用户信息
  onShow: function () {
    var _this = this;
    
  }
})
