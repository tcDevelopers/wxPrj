var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
    data:{
        mobile_phone : "",
        selected1 : false,
        ReadySearch : null,
        list : []
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
      var role = app.globalData.ggwUserInfo.smz_role;
      console.log("用户角色："+role);
      var ReadySearch = _this.data.ReadySearch;
      if (nbr.length==0){
        if (ReadySearch != null) {
          clearTimeout(ReadySearch)
        }
        return;
      }
      if (ReadySearch != null){
        clearTimeout(ReadySearch)
        
      }
      ReadySearch = setTimeout(function(){
       
        var sql = "select a.ACC_NO,b.* from wxd.wxd_accno_list@tcscb2 a "
          + "join ly_sys_user_photo@tcscb2 b on a.acc_no=b.nbr "
          + "where b.staff_no='" + work_id + "' and b.nbr like '%" + nbr + "%' and rownum<100";
        if (role=='管理员'){
          sql = "select a.ACC_NO, b.* from  wxd.wxd_accno_list@tcscb2 a "
            + "join ly_sys_user_photo@tcscb2 b on a.acc_no=b.nbr "
            + "where a.acc_no='" + nbr + "'" ;
        }
        //查询号码是否存在
        meafe.SCB3Query(sql,
          function (obj) {
            _this.setData({ list: obj })
          },
          function () {
            meafe.Toast('获取数据失败');
          }
        );
      },1000);
      _this.setData({ ReadySearch: ReadySearch});
    },
    tapRecordSubmit:function(e){
      var _this = this;
      var nbr = this.data.mobile_phone;
      var work_id = app.globalData.ggwUserInfo.work_id;
      console.log(work_id)
      //查询号码是否存在
      wx.showLoading({
        title: '正在查询..',
      })
      
      meafe.SCB3Query("select * from wxd.wxd_accno_list@tcscb2 a "
        + "left join ly_sys_user_photo@tcscb2 b on a.acc_no=b.nbr" 
        + " where a.acc_no='" + nbr + "'",
        function (obj) {
          wx.hideLoading();
          if (obj.length>0){
            if(obj[0].NBR==''){
              wx.navigateTo({
                url: '../page_add/page_add?nbr=' + nbr + '&act=insert'
              })
            }
            else{
              if (obj[0].STAFF_NO == work_id) {
                wx.showModal({
                  title: '提示',
                  content: '此号码已登记，是否重新登记',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../page_add/page_add?nbr=' + nbr + '&act=update'
                      })
                    }
                  }
                })
              }
              else {
                wx.showModal({
                  title: '提示',
                  content: '此号码已登记',
                  success: function (res) {
                    if (res.confirm) {
                    }
                  }
                })
              }
            }
          }
          else {
            wx.showModal({
              title: '提示',
              content: '非有效号码',
              success: function (res) {
                if (res.confirm) {
                }
              }
            })
          }
        },
        function () {
          wx.hideLoading();
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