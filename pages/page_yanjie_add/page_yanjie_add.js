var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data:{ 
    record_id:'',
    hidden:true,
    wanggeTypeArray: ['沿街店铺','专业市场','商务楼宇','产业园区','其他'],
    wanggeTypeIndex: 0,
    location: null,
    tipTxt:'',
    xiaoquArrayLoaded:false,
    ggw_img1:'',
    ggw_img2:'',
    ggw_img3:'',
    ggw_img1_group: null,
    ggw_img2_group: null,
    ggw_img3_group: null,
    addressValue: '',
    descValue: '',
    kehumingchengValue: '',
    lianxirenValue: '',
    lianxidianhuaValue: '',
    ggwUserInfo: {},
    delBtnClass:'hide',
    hasImageUpload:false,
  },
  onLoad:function(options){
    var _this = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({ggwUserInfo:app.globalData.ggwUserInfo});
    //如果是编辑一个记录，则显示删除按钮
    if(options.record_id){
        this.setData({delBtnClass:'btn_show',record_id:options.record_id});
    }
    if(app.globalData.ggwUserInfo==null){
        wx.redirectTo({
            url: '../page_user_bind/page_user_bind'
        })
    }
    //加载数据
    if(options.record_id){
        meafe.SQLQuery('select * from 沿街店铺记录 where id='+this.data.record_id,function(obj){
            _this.setData({
                wanggeTypeIndex: meafe.ArrayIndex1(obj[0].wangge_type,_this.data.wanggeTypeArray),
                addressValue: obj[0].address,
                descValue: obj[0].yj_desc,
                kehumingchengValue: obj[0].kehumingcheng,
                lianxirenValue: obj[0].lianxiren,
                lianxidianhuaValue: obj[0].lianxidianhua,
                location:{longitude:obj[0].record_lng,latitude:obj[0].record_lat}
            });
            if(obj[0].img1.length>0){
                _this.setData({
                    ggw_img1: 'https://www.meafe.cn/upfiles/wx/' + obj[0].img1_small,
                    ggw_img1_group:{origin:obj[0].img1,small:obj[0].img1_small}
                });
            }
            else{
                _this.setData({
                    ggw_img1: 'https://www.meafe.cn/wx/sys_img/select_img.png'
                });
            }
            if(obj[0].img2.length>0){
                _this.setData({
                    ggw_img2: 'https://www.meafe.cn/upfiles/wx/'+obj[0].img2_small,
                    ggw_img2_group:{origin:obj[0].img2,small:obj[0].img2_small}
                });
            }
            else{
                _this.setData({
                    ggw_img2: 'https://www.meafe.cn/wx/sys_img/select_img.png'
                });
            }
            if(obj[0].img3.length>0){
                _this.setData({
                    ggw_img3: 'https://www.meafe.cn/upfiles/wx/'+obj[0].img3_small,
                    ggw_img3_group:{origin:obj[0].img3,small:obj[0].img3_small}
                });
            }
            else{
                _this.setData({
                    ggw_img3: 'https://www.meafe.cn/wx/sys_img/select_img.png'
                });
            }
        });
    }
    else{
        _this.setData({
            ggw_img1:'https://www.meafe.cn/wx/sys_img/select_img.png',
            ggw_img2:'https://www.meafe.cn/wx/sys_img/select_img.png',
            ggw_img3:'https://www.meafe.cn/wx/sys_img/select_img.png',
        });
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
    // 页面关闭时时，删除未提交的图片
    var _this = this;
    if(this.data.hasImageUpload){
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
    }
  },
  bindPickerChange: function(e) {  
    this.setData({  
      wanggeTypeIndex: e.detail.value  
    })  
  },  
  bindAddressInput:function(e){
    this.setData({
      addressValue: e.detail.value
    })
  },
  bindKehumingchengInput:function(e){
    this.setData({
      kehumingchengValue: e.detail.value
    })
  },
  bindLianxidianhuaInput:function(e){
    this.setData({
      lianxidianhuaValue: e.detail.value
    })
  },
  bindLianxirenInput:function(e){
    this.setData({
      lianxirenValue: e.detail.value
    })
  },
  bindDescInput:function(e){
    this.setData({
      descValue: e.detail.value
    })
  },
  tapShowMap:function(){
        var _this = this;
        wx.chooseLocation({
            success:function(e){
                console.log(e);
                _this.setData({
                    addressValue:e.address,
                    location:{
                        longitude:e.longitude,
                        latitude:e.latitude
                    }
                });
            }
        });
  },
  imgTap1:function(e){
    var _this = this;
    //删除旧文件，添加新文件
    if(_this.data.ggw_img1_group != null){
        meafe.FileDelete(_this.data.ggw_img1_group.origin);
        meafe.FileDelete(_this.data.ggw_img1_group.small);
    }
    meafe.FileChooseAndUpload('yanjie_imgs',
        function(localPath){
          _this.setData({
              hidden: false,
              ggw_img1:localPath
          });
        },
        function(obj){
            _this.setData({
                hidden: true,
                ggw_img1_group:obj,
                hasImageUpload:true
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
    meafe.FileChooseAndUpload('yanjie_imgs',
        function(localPath){
          _this.setData({
              hidden: false,
              ggw_img2:localPath
          });
        },
        function(obj){
            _this.setData({
                hidden: true,
                ggw_img2_group:obj,
                hasImageUpload:true
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
    meafe.FileChooseAndUpload('yanjie_imgs',
        function(localPath){
          _this.setData({
              hidden: false,
              ggw_img3:localPath
          });
        },
        function(obj){
            _this.setData({
                hidden: true,
                ggw_img3_group:obj,
                hasImageUpload:true
            });
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
        content: '确定删除 广告位吗？',
        success: function(res) {
            if (res.confirm) {
                meafe.SQLEdit("delete from 沿街店铺记录 where id=" + _this.data.record_id,
                    function(re){
                        if(re.indexOf("success")!=-1)
                        {
                            wx.navigateBack({delta: 1});
                        }
                    })
                }
            }
        })
      
  },
  tapSubmit:function(){
      var _this = this;
      //检查是否满足提交的条件
      if(this.data.ggw_img1_group==null && this.data.ggw_img2_group==null && this.data.ggw_img3_group==null){
          meafe.Toast("请上传图片");return;
      }
      if(this.data.location==null){
          meafe.Toast("请在地图上选点");return;
      }
      var dataMap = {
          wangge_type:this.data.wanggeTypeArray[this.data.wanggeTypeIndex],
          // record_time:''//由服务器启动
          record_lng:this.data.location.longitude,
          record_lat:this.data.location.latitude,
          record_person_id:app.globalData.ggwUserInfo.id,
          address:this.data.addressValue,
          yj_desc:this.data.descValue,
          kehumingcheng:this.data.kehumingchengValue,
          lianxiren:this.data.lianxirenValue,
          lianxidianhua:this.data.lianxidianhuaValue,
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
      if(this.data.record_id.length>0){
           dataMap["whereCause"]=" where id="+this.data.record_id;
      }
      meafe.SQLUpdate("sql_update_yanjie.jsp", dataMap, "沿街店铺记录", null, function(re){
          if(re.indexOf("success")!=-1)
          {
              meafe.Toast("提交成功");
              _this.setData({
                  ggw_img1_group:null,
                  ggw_img2_group:null,
                  ggw_img3_group:null,
                  hasImageUpload:false
              });
              wx.navigateBack({delta: 1});
          }
          else{
              meafe.Toast("上传失败");
          }
      });
  }
})