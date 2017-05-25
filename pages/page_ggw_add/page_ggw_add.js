var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data:{ 
    hidden:true,
    xiaoquArray: [
      {
        id: -1,
        name: '正在搜索附近小区...'
      },
    ],
    index: 0,
    range_key:'name',
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
    ggw_desc:'',
    ggwUserInfo:{}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({ggwUserInfo:app.globalData.ggwUserInfo});
    console.log("if ggw_userinfo is exists");
    console.log(app.globalData.ggwUserInfo);
    if(app.globalData.ggwUserInfo==null){
        wx.redirectTo({
            url: '../page_user_bind/page_user_bind'
        })
    }
    var _this = this;
    this.loadNearestBuilding();
  },
  loadNearestBuilding:function(cb){
        var _this = this;
    //获取用户经纬度
    wx.getLocation( {
      type: 'gcj02',
      success: function(res) {
        console.log(res)
        _this.setData( {
          location: res  //res.longitude  res.latitude
        })
        if(cb){
            cb();
        }
        //获取距离较近的小区清单
        meafe.SQLQuery('select * from (select *,6378137.0*ACOS(SIN('+_this.data.location.latitude+'/180*PI())*SIN(lat/180*PI())+COS('+_this.data.location.latitude+'/180*PI())*COS(lat/180*PI())*COS(('+_this.data.location.longitude+'-lng)/180*PI())) as dis FROM [微信小程序].[dbo].[小区表]) t ORDER BY t.dis',function(res){
                _this.setData({ xiaoquArray:res,index: 0,xiaoquArrayLoaded:true});
                _this.setData({ textText:res[0].name});
              })
      }
    })
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
  bindGGWDescInput:function(e){
    this.setData({
      ggw_desc: e.detail.value
    })
  },
  tapShowMap:function(){
      var _this = this;
    
        this.loadNearestBuilding(function(){
            wx.openLocation( _this.data.location);
        });
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
  tapSubmit:function(){
      var _this = this;
      //检查是否满足提交的条件
      if(this.data.ggw_img1_group==null && this.data.ggw_img2_group==null && this.data.ggw_img3_group==null){
          meafe.Toast("请上传图片");return;
      }
      if(!this.data.xiaoquArrayLoaded){
          meafe.Toast("小区数据未正常加载，请重新进入本页面");return;
      }
      var dataMap = {
          xiaoqu_id:this.data.xiaoquArray[this.data.index].id,
          ggw_desc:this.data.ggw_desc,
          // record_time:''//由服务器启动
          record_lng:this.data.location.longitude,
          record_lat:this.data.location.latitude,
          record_person_id:app.globalData.ggwUserInfo.id,
      };
      if(this.data.ggw_img1_group!=null){
          dataMap["img1"]=this.data.ggw_img1_group.origin;
          dataMap["img1_small"]=this.data.ggw_img1_group.small;
      }
      if(this.data.ggw_img2_group!=null){
          dataMap["img2"]=this.data.ggw_img2_group.origin;
          dataMap["img2_small"]=this.data.ggw_img2_group.small;
      }
      if(this.data.ggw_img3_group!=null){
          dataMap["img3"]=this.data.ggw_img3_group.origin;
          dataMap["img3_small"]=this.data.ggw_img3_group.small;
      }
      meafe.SQLUpdate("sql_update_ggw.jsp", dataMap, "广告位记录", null, function(re){
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
              meafe.Toast("上传失败");
          }
      });
  }
})