Page({
  data: {
    id: null,
    longitude: null,
    latitude: null,
    marker_lng: null, 
    marker_lat: null,
    hiddenSave: true,
    markers: [{ id: 0 }]
  },
  onLoad: function (options) {
    var thiz = this; 
    console.log(options);
    var hidden = true;
    if (options.edit && options.edit== "1"){
      hidden = false;
    }
    thiz.setData({ 
      id: options.id,
      hiddenSave: hidden,
      tn: options.tn,
      colName: options.col_name
    });
    wx.request({
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      url: 'https://www.meafe.cn/paidan/ListData',
      data: { t: JSON.stringify({service:"selectById",tableName: thiz.data.tn, ID: thiz.data.id }) },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log("http success");
        if (res.statusCode == 200) {
          var obj = res.data;
          var value = obj[0][thiz.data.colName];
          console.log(obj[0]);
          console.log(value);
          var lng, lat;
          if(value){
            try {
              lng = parseFloat(value.split(',')[0]);
              lat = parseFloat(value.split(',')[1]);
            } catch (e) {
              console.log(e);
            }
          }
          console.log(lng + "," + lat);
          if (lng && lat) {
            thiz.setData({
              longitude: lng,
              latitude: lat,
              marker_lng: lng,
              marker_lat: lat,
              markers: [{
                id: 0,
                latitude: lat,
                longitude: lng
              }]
            });
          }
          else {
            thiz.showReSetMsg();
          }
        }
        else {
          thiz.showReSetMsg();
        }
      },
      fail: function (res) {
        thiz.showReSetMsg();
      },
      complete: function () {}
    })
    
  },
  onReady: function () {
      
  },
  showReSetMsg: function () {
    var thiz = this;
    wx.showModal({
      title: '无位置信息',
      content: '请点击地图，重新选址',
    })
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        //console.log(res.latitude);
        thiz.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          marker_lat: res.latitude,
          marker_lng: res.longitude,
          markers: [{
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
      }
    })
  }
  ,
  tapMyposition:function(){
    var thiz = this;
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        //console.log(res.latitude);
        thiz.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        
      }
    })
  },
  tapSave: function () {
    var thiz = this;
    var data = {};
    data[thiz.data.colName] = thiz.data.marker_lng + "," + thiz.data.marker_lat;
    var params = { tableName: thiz.data.tn, map: data, id: thiz.data.id };
    console.log(params);

    wx.showModal({
      title: '保存提示',
      content: '保存将覆盖原有数据，是否确认保存？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: 'https://www.meafe.cn/paidan/UpdateById',
            data: { t: JSON.stringify(params) },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            success: function (res) {
              console.log("http success");
              if (res.statusCode == 200) {
                var obj = res.data;
                wx.showModal({
                  title: '保存结果',
                  content: '成功',
                })
              }
              else {
                wx.showModal({
                  title: '保存结果',
                  content: '失败',
                })
              }
            },
            fail: function (res) {
              wx.showModal({
                title: '保存结果',
                content: '网络错误',
              })
            },
            complete: function () {
            }
          });
        }
      }
    });
    
  },
  mapMove:function(e){
    
    console.log(e);
    var thiz = this;
    if (!thiz.data.hiddenSave){
    var mapCtx = wx.createMapContext("map");
    var latitude, longitude;

        latitude = e.detail.latitude;
        longitude = e.detail.longitude;
        thiz.setData({
          marker_lng: longitude,
          marker_lat: latitude,
          markers: [{
            id:0,
            latitude: latitude,
            longitude: longitude,
          }]
        });
    }
  },
  //导航
  onGuideTap: function (event) {
    var thiz=this;
    var lon = Number(thiz.data.marker_lng);
    var lat = Number(thiz.data.marker_lat);
    var bankName = "目的地";
    wx.openLocation({
      type: 'gcj02',
      latitude: lat,
      longitude: lon,
      name: bankName,
      scale: 28
    })
  }
})