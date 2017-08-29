var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
    data:{
        mobile_phone:true,
        selected1:false,
        ReadySearch: null,
        list: []
    },
    onLoad:function(){
       
    },
    bindInput: function (e) {
      this.setData({
        mobile_phone: e.detail.value
      })
      this.searchRecord();
    },
    tapListItem: function (e) {
      var nbr = e.currentTarget.id;
      wx.navigateTo({
        url: '../page_add/page_add?nbr=' + nbr + '&act=update'
      })
    },
    searchRecord: function (e) {
      var _this = this;
      var nbr = this.data.mobile_phone;
      var work_id = app.globalData.ggwUserInfo.work_id;
      var ReadySearch = _this.data.ReadySearch;
      if (ReadySearch != null){
        clearTimeout(ReadySearch)
        
      }
      ReadySearch = setTimeout(function(){
        wx.showLoading({
          title: '正在获取数据',
        })
        //查询号码是否存在
        meafe.SCB3Query("select * from  wxd.wxd_accno_list@tcscb2 a "
          + "left join ly_sys_user_photo@tcscb2 b on a.acc_no=b.nbr "
          + "where (b.nbr is null or (b.staff_no='" + work_id + "')) and b.nbr like '%" + nbr + "%' and rownum<100",
          function (obj) {
            _this.setData({ list: obj })
            wx.hideLoading();
          },
          function () {
            wx.hideLoading();
            meafe.Toast('获取数据失败');
          }
        );
      },1000);
      _this.setData({ ReadySearch: ReadySearch});
    },
    tapRecordSubmit:function(e){
      var _this = this;
      var nbr = this.data.mobile_phone;
      var word_id = app.globalData.ggwUserInfo.work_id;
      //查询号码是否存在
      wx.showLoading({
        title: '正在查询..',
      })
      meafe.SCB3Query("select * from  wxd.wxd_accno_list@tcscb2 a "
      +"left join ly_sys_user_photo@tcscb2 b on a.acc_no=b.nbr "
        + "where (b.nbr is null or (b.staff_no='" + word_id +"')) and a.acc_no='"+nbr+"'" ,
        function (obj) {
          if (obj.length>0){
            var act='insert'
            if (obj[0].NBR.length > 0) {
              wx.hideLoading();
              meafe.Toast("号码已登记");
            }
            else {
              wx.navigateTo({
                url: '../page_add/page_add?nbr=' + nbr + '&act=insert'
              })
            }
          }
          else {
            wx.hideLoading();
            meafe.Toast("非目标号码")
          }
        },
        function(){

        }
      );
    },
    onShow:function(e){
      this.searchRecord();
    },
    tapShowImage:function(e){
        console.log(e);
        wx.navigateTo({
            url: '../page_preview_image/page_preview_image?img='+ e.target.dataset.imgloc
        })
    },
    clickImage: function (e) {
      var current = e.target.dataset.imgloc;
      var urls = [];
      urls.push('https://www.meafe.cn/upfiles/wx/' + current);
      console.log(current)
      wx.previewImage({
        current: 'https://www.meafe.cn/upfiles/wx/' + current,
        urls: urls,
        fail: function () {
          console.log('fail')
        },
        complete: function () {
          //console.info("点击图片了");
        },
      })
    }
})