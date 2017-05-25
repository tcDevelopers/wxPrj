var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data:{ 
    record_id:-1,
    xiaoqu_name:'',
    hidden:true,
    location: null,
    tipTxt:'',
    xiaoquArrayLoaded:false,
    sys_select_img:'https://www.meafe.cn/wx/sys_img/select_img.png',
    ggw_img1:'https://www.meafe.cn/wx/sys_img/select_img.png',
    ggw_img2:'https://www.meafe.cn/wx/sys_img/select_img.png',
    ggw_img3:'https://www.meafe.cn/wx/sys_img/select_img.png',
    ggw_img1_group: null,
    ggw_img2_group: null,
    ggw_img3_group: null,
    ggw_desc: '',
    handler_desc: '',
    delBtnClass: 'hide',
    handlerBtnClass: 'hide',
    processBtnClass: 'hide'
  },
  onLoad:function(options){
    this.setData({ record_id: options.record_id });
    var _this = this;
    // 页面初始化 options为页面跳转所带来的参数
    meafe.SQLQuery("select a.*,b.name from (select * from 广告位记录 where id="+this.data.record_id+") a left join (select * from 小区表) b on a.xiaoqu_id = b.id",
    function(obj){
        _this.setData({
                xiaoqu_name:obj[0].name,
                ggw_desc:obj[0].ggw_desc,
                delBtnClass:obj[0].record_person_id==app.globalData.ggwUserInfo.id?'btn_show':'hide',
                processBtnClass:obj[0].record_person_id==app.globalData.ggwUserInfo.id?'hide':'btn_show',
                handlerBtnClass:obj[0].record_person_id==app.globalData.ggwUserInfo.id?'btn_show':'hide'});
    });
    var _this = this;
    //获取用户经纬度
    wx.getLocation( {
      type: 'gcj02',
      success: function(res) {
        console.log(res)
        _this.setData( {
          location: res  //res.longitude  res.latitude
        })
      }
    })
    //
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
    // 页面关闭时时，删除未提交的图片
    var _this = this;
    if(this.data.ggw_img1_group != null){
        console.log('delete img1 small_img1');
        meafe.FileDelete(_this.data.ggw_img1_group.origin);
        meafe.FileDelete(_this.data.ggw_img1_group.small);
    }
    if(this.data.ggw_img2_group != null){
        console.log('delete img2 small_img3');
        meafe.FileDelete(_this.data.ggw_img2_group.origin);
        meafe.FileDelete(_this.data.ggw_img2_group.small);
    }
    if(this.data.ggw_img3_group != null){
        console.log('delete img2 small_img3');
        meafe.FileDelete(_this.data.ggw_img3_group.origin);
        meafe.FileDelete(_this.data.ggw_img3_group.small);
    }
  },
  bindPickerChange: function(e) {  
    this.setData({  
      index: e.detail.value  
    })  
  },  
  bindGGWHandlerDescInput:function(e){
        this.setData({
            handler_desc: e.detail.value
        })
  },
  tapShowMap:function(){
      var _this = this;
    //获取用户经纬度
    wx.getLocation( {
      type: 'gcj02',
      success: function(res) {
        console.log(res)
        _this.setData( {
          location: res  //res.longitude  res.latitude
        });
        wx.openLocation( _this.data.location);
      }
    })
  },
  imgTap1:function(e){
    var _this = this;
    //删除旧文件，添加新文件
    if(_this.data.ggw_img1_group != null){
        meafe.FileDelete(_this.data.ggw_img1_group.origin);
        meafe.FileDelete(_this.data.ggw_img1_group.small);
    }
    meafe.FileChooseAndUpload('ggw_imgs',
        function(localPath){
          _this.setData({
              hidden: false,
              ggw_img1:localPath
          });
        },
        function(obj){
            _this.setData({
                hidden: true,
                ggw_img1_group:obj
            });
        }
    );
  },
  imgTap2:function(e){
    var _this = this;
    if(_this.data.ggw_img2_group != null){
        meafe.FileDelete(_this.data.ggw_img2_group.origin);
        meafe.FileDelete(_this.data.ggw_img2_group.small);
    }
    meafe.FileChooseAndUpload('ggw_imgs',
        function(localPath){
          _this.setData({
              hidden: false,
              ggw_img2:localPath
          });
        },
        function(obj){
            _this.setData({
                hidden: true,
                ggw_img2_group:obj
            });
        }
    );
  },
  imgTap3:function(e){
    var _this = this;
    if(_this.data.ggw_img3_group != null){
        meafe.FileDelete(_this.data.ggw_img3_group.origin);
        meafe.FileDelete(_this.data.ggw_img3_group.small);
    }
    meafe.FileChooseAndUpload('ggw_imgs',
        function(localPath){
          _this.setData({
              hidden: false,
              ggw_img3:localPath
          });
        },
        function(obj){
            _this.setData({
                hidden: true,
                ggw_img3_group:obj
            });
        }
    );
  },
  imageLoaded:function(){
      console.log("图片加载完成")
  },
  tapSubmitProcess:function(){
      var _this = this;
      var dataMap = {
          handler_desc:this.data.handler_desc,
          handler_lng:this.data.location.longitude,
          handler_lat:this.data.location.latitude,
          process_person_id:app.globalData.ggwUserInfo.id,
      };
        if(this.data.ggw_img1_group != null){
            dataMap["handler_img1"]=this.data.ggw_img1_group.origin;
            dataMap["handler_img1_small"]=this.data.ggw_img1_group.small;
        }
        if(this.data.ggw_img2_group != null){
            dataMap["handler_img2"]=this.data.ggw_img2_group.origin;
            dataMap["handler_img2_small"]=this.data.ggw_img2_group.small;
        }
        if(this.data.ggw_img3_group != null){
            dataMap["handler_img3"]=this.data.ggw_img3_group.origin;
            dataMap["handler_img3_small"]=this.data.ggw_img3_group.small;
        }
      wx.showModal({
        title: '提示',
        content: '确定已处理 广告位吗？',
        success: function(res) {
            if (res.confirm) {
                //检查是否满足提交的条件
                //   if(this.data.ggw_img1_group==null && this.data.ggw_img2_group==null && this.data.ggw_img3_group==null){
                //      meafe.Toast("请上传图片");return;
                //  }
                //   if(this.data.location==null){
                //       meafe.Toast("GPS未识别，请打开GPS重新进入本页面");return;
                //   }
                meafe.SQLUpdate("sql_update_ggw_process.jsp", dataMap, "广告位记录", "where id="+_this.data.record_id, function(re){
                    if(re.indexOf("success")!=-1)
                    {
                        wx.navigateBack({delta: 1});
                        meafe.Toast("提交成功");
                        _this.setData({
                            ggw_img1_group:null,
                            ggw_img2_group:null,
                            ggw_img3_group:null
                        });
                    }
                    else{
                        meafe.Toast("提交失败");
                    }
                });
            }
        }
      });
  },
  tapSubmit:function(){
      var _this = this;
      var dataMap = {
          handler_desc:this.data.handler_desc,
          handler_lng:this.data.location.longitude,
          handler_lat:this.data.location.latitude,
          handler_person_id:app.globalData.ggwUserInfo.id,
      };
        if(this.data.ggw_img1_group != null){
            dataMap["handler_img1"]=_this.data.ggw_img1_group.origin;
            dataMap["handler_img1_small"]=_this.data.ggw_img1_group.small;
        }
        if(this.data.ggw_img2_group != null){
            dataMap["handler_img2"]=_this.data.ggw_img2_group.origin;
            dataMap["handler_img2_small"]=_this.data.ggw_img2_group.small;
        }
        if(this.data.ggw_img3_group != null){
            dataMap["handler_img3"]=_this.data.ggw_img3_group.origin;
            dataMap["handler_img3_small"]=_this.data.ggw_img3_group.small;
        }
       wx.showModal({
        title: '提示',
        content: '确定结单吗？',
        success: function(res) {
            if (res.confirm) {
                //检查是否满足提交的条件
                //   if(this.data.ggw_img1_group==null && this.data.ggw_img2_group==null && this.data.ggw_img3_group==null){
                //      meafe.Toast("请上传图片");return;
                //  }
                //   if(this.data.location==null){
                //       meafe.Toast("GPS未识别，请打开GPS重新进入本页面");return;
                //   }
                
                meafe.SQLUpdate("sql_update_ggw_handler.jsp", dataMap, "广告位记录", "where id="+_this.data.record_id, function(re){
                    if(re.indexOf("success")!=-1)
                    {
                        wx.navigateBack({delta: 1});
                        meafe.Toast("提交成功");
                        _this.setData({
                            ggw_img1_group:null,
                            ggw_img2_group:null,
                            ggw_img3_group:null
                        });
                    }
                    else{
                        meafe.Toast("提交失败");
                    }
                });
            }
        }
      });
  },
  tapDelete:function(){
      var _this = this;
      wx.showModal({
        title: '提示',
        content: '确定删除 广告位吗？',
        success: function(res) {
            if (res.confirm) {
                meafe.SQLEdit("delete from 广告位记录 where id=" + _this.data.record_id,
                    function(re){
                        if(re.indexOf("success")!=-1)
                        {
                            wx.navigateBack({delta: 1});
                        }
                    })
                }
            }
        })
      
  }
})