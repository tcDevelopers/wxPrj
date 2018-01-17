var app = getApp();
var meafe = require('../../utils/util_meafe.js');
var util = require('../../utils/util.js');
Page({
  data:{ 
    del_hidden: 'hide',
    nbr:'',
    contact_phone:'',
    act: '',
    img1: 'https://www.meafe.cn/wx/sys_img/select_img.png',
    img2: 'https://www.meafe.cn/wx/sys_img/select_img.png',
    img3: 'https://www.meafe.cn/wx/sys_img/select_img.png',
    img4: 'https://www.meafe.cn/wx/sys_img/select_img.png',
    img5: 'https://www.meafe.cn/wx/sys_img/select_img.png',
    img1_save: '',
    img2_save: '',
    img3_save: '',
    img4_save: '',
    img5_save: '',
    img1_small_save: '',
    img2_small_save: '',
    img3_small_save: '',
    img4_small_save: '',
    img5_small_save: ''
  },
  onLoad:function(option){
    console.log(option)
    var _this = this;
    var work_id = app.globalData.ggwUserInfo.work_id;
    //员工账号显示删除按钮
    if(work_id!=''){
      this.setData({
        del_hidden:''
      });
    }
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({ nbr: option.nbr , act: option.act });
    //加载数据
    if(option.act=='update'){
      meafe.SCB3Query("select * from ly_sys_user_photo@tcscb2 where nbr='" + this.data.nbr + "'",function(obj){
        var d = obj[0];
        _this.setData({
          img1: 'https://www.meafe.cn/upfiles/wx/' + d['IMG1_SMALL'],
          img2: 'https://www.meafe.cn/upfiles/wx/' + d['IMG2_SMALL'],
          img3: 'https://www.meafe.cn/upfiles/wx/' + d['IMG3_SMALL'],
          img4: 'https://www.meafe.cn/upfiles/wx/' + d['IMG4_SMALL'],
          img5: 'https://www.meafe.cn/upfiles/wx/' + d['IMG5_SMALL'],
          img1_save: d['IMG1'],
          img2_save: d['IMG2'],
          img3_save: d['IMG3'],
          img4_save: d['IMG4'],
          img5_save: d['IMG5'],
          img1_small_save: d['IMG1_SMALL'],
          img2_small_save: d['IMG2_SMALL'],
          img3_small_save: d['IMG3_SMALL'],
          img4_small_save: d['IMG4_SMALL'],
          img5_small_save: d['IMG5_SMALL'],
          contact_phone: d["CONTACT_PHONE"]
        });
      },function(){
        meafe.Toast('获取失败');
        wx.navigateBack({
          delta:-1
        })
      });
    }
    else{
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
  
  },
  bindPickerChange: function(e) {  
    this.setData({  
      wanggeTypeIndex: e.detail.value  
    })  
  },  
  bindInput:function(e){
    this.setData({
      contact_phone: e.detail.value
    })
  },
  imgTap1:function(e){
    var _this = this;
    //删除旧文件，添加新文件
    meafe.FileChooseAndUpload('user_photo',
      function (localPath) {
        if (localPath.length > 0) {
          _this.setData({ img1: localPath });
          wx.showLoading({
            title: '正在上传',
          })
        }
      },
      function (obj) {
        _this.setData({ img1_save: obj.origin, img1_small_save: obj.small });
        wx.hideLoading();
      },
      function () {
        wx.hideLoading();
        meafe.Toast('上传失败')
      }
    );
  },
  imgTap2:function(e){
    var _this = this;
    
    //删除旧文件，添加新文件
    meafe.FileChooseAndUpload('user_photo',
      function (localPath) {
        if (localPath.length > 0) {
          _this.setData({ img2: localPath });
          wx.showLoading({
            title: '正在上传',
          })
        }
      },
      function (obj) {
        wx.hideLoading();
        _this.setData({ img2_save: obj.origin, img2_small_save: obj.small });
      },
      function () {
        wx.hideLoading();
        meafe.Toast('上传失败')
      }
    );
  },
  imgTap3:function(e){
    var _this = this;
    //删除旧文件，添加新文件
    meafe.FileChooseAndUpload('user_photo',
      function (localPath) {
        if (localPath.length > 0) {
          _this.setData({ img3: localPath });
          wx.showLoading({
            title: '正在上传',
          })
        }
      },
      function (obj) {
        _this.setData({ img3_save: obj.origin, img3_small_save: obj.small });
        wx.hideLoading();
      },
      function () {
        wx.hideLoading();
        meafe.Toast('上传失败')
      }
    );
  },
  imgTap4: function (e) {
    var _this = this;
    //删除旧文件，添加新文件
    meafe.FileChooseAndUpload('user_photo',
      function (localPath) {
        if (localPath.length > 0) {
          _this.setData({ img4: localPath }); 
          wx.showLoading({
            title: '正在上传',
          })
        }
      },
      function (obj) {
        _this.setData({ img4_save: obj.origin ,img4_small_save:obj.small });
        wx.hideLoading();
      },
      function () {
        wx.hideLoading();
        meafe.Toast('上传失败')
      }
    );
  },
  imgTap5: function (e) {
    var _this = this;
    //删除旧文件，添加新文件
    meafe.FileChooseAndUpload('user_photo',
      function (localPath) {
        if (localPath.length > 0) {
          _this.setData({ img5: localPath });
          wx.showLoading({
            title: '正在上传',
          })
        }
      },
      function (obj) {
        _this.setData({ img5_save: obj.origin, img5_small_save: obj.small });
        wx.hideLoading();
      },
      function () {
        wx.hideLoading();
        meafe.Toast('上传失败')
      }
    );
  },
  imageLoaded:function(){
      console.log("图片加载完成")
  },
  tapDelete:function(){
      var _this = this;
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success: function(res) {
            if (res.confirm) {
              meafe.SCB3Edit("delete from ly_sys_user_photo@tcscb2 where nbr='" + _this.data.nbr + "'",
                    function(re){
                        if(re.indexOf("success")!=-1)
                        {
                            wx.navigateBack({delta: 1});
                        }
                    },function(){
                      meafe.Toast('操作失败');
                    })
                }
            }
        })
      
  },
  tapSubmit:function(){
      var _this = this;
      if (_this.data.contact_phone.length == 8 || _this.data.contact_phone.length == 11) {

      }
      else {
        wx.showModal({
          title: '提示',
          content: '请输入正确的联系号码',
          success: function (res) {
            if (res.confirm) {
            }
          }
        });
        return;
      }

      //检查是否满足提交的条件
      if (this.data.img1_save == '' || this.data.img2_save == '' || this.data.img3_save == '' || this.data.img4_save == '' || this.data.img5_save == ''){
          meafe.Toast("请上传所有图片");return;
      }
      var act = _this.data.act;
      var nbr = _this.data.nbr;
      var whereCause = null;
      var work_id = app.globalData.ggwUserInfo.work_id;
      //员工账号显示删除按钮
      if (act == 'update' ) {
        whereCause = " where nbr='" + nbr + "'";
      }
      var dataMap = {
          // record_time:''//由服务器启动
          nbr: _this.data.nbr,
          contact_phone: _this.data.contact_phone,
          generate_dt: util.formatTime(new Date()),
          staff_no: app.globalData.ggwUserInfo.work_id,
          img1: this.data.img1_save,
          img2: this.data.img2_save,
          img3: this.data.img3_save,
          img4: this.data.img4_save,
          img5: this.data.img5_save,
          img1_small: this.data.img1_small_save,
          img2_small: this.data.img2_small_save,
          img3_small: this.data.img3_small_save,
          img4_small: this.data.img4_small_save,
          img5_small: this.data.img5_small_save,
          is_handler:0,
          staff_nm: app.globalData.ggwUserInfo.person_name
      };

    
      wx.showLoading({
        title: '正在提交',
      })
      meafe.SQLUpdate("sql_update_scb3.jsp", dataMap, " ly_sys_user_photo@tcscb2 ", whereCause, 
      function(re){
        wx.hideLoading();
          if(re.indexOf("success")!=-1)
          {
              meafe.Toast("提交成功");
              wx.navigateBack({delta: 1});
          }
          else{
              meafe.Toast("提交失败");
          }
      }, function () {
        wx.hideLoading();
        meafe.Toast("提交失败");
      });
  }
})