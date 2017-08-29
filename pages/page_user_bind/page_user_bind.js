var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
  data: {
    motto: '',
    userInfo: {},
    person_name:'',
    mobile_phone:'',
    old_name:'',
    fenjuIndex:0,
    fenjuRangeKey:'fenju',
    fenjuArray:[{fenju:'正在加载...'}],
    belong_departmentIndex:0,
    belong_departmentRangeKey:'belong_department',
    belong_departmentArray:[{belong_department:'正在加载...'}],
    personIndex:0,
    personKey:'person_name',
    personArray:[{person_name:'正在加载...'}],
    hidden:false
  },
  bindPickerChangeFenju: function(e) {  
    this.setData({  
      fenjuIndex:e.detail.value
    })  
    this.updateBelongDepartment();
  },  
  bindPickerChangeBelong_departmemt: function(e) {  
    this.setData({  
      belong_departmentIndex:e.detail.value
    })  
    this.updatePerson();
  },  
  bindPickerPerson: function(e) {  
    this.setData({  
      personIndex:e.detail.value
    })  
  }, 
  bindPersonNameInput:function(e){
    this.setData({
      person_name: e.detail.value
    })
  },  
  bindMobilePhoneInput:function(e){
    this.setData({
      mobile_phone: e.detail.value
    })
  },
  tapSubmit: function(){
    var _this = this;
    var dataMap = {
                    id:_this.data.personArray[_this.data.personIndex].id,
                    openid:app.globalData.openid,
                    mobile_phone:_this.data.mobile_phone
                  };
    //如果名字未发生修改，只修改了电话号码，则可以直接提交
    meafe.SQLUpdate("sql_update_userinfo.jsp", dataMap, "广告位登记人员表", null,
          function(re){
                if(re.indexOf("success")!=-1)
                {
                    //返回前一页
                    wx.navigateBack({delta: 1});
                    //重新获取用户信息
                    meafe.SQLQuery("select * from 广告位登记人员表 where openid='"+app.globalData.openid+"'",function(obj){
                        app.globalData.ggwUserInfo = obj[0];
                        console.log("全局变量修改结果：");
                        console.log(app.globalData.ggwUserInfo);
                    });
                }
                else{
                  meafe.Toast(re);
                }
      });
    
  },
  onLoad: function () {
    var _this = this;
    //重新获取用户信息
     meafe.SQLQuery("select * from 广告位登记人员表 where openid='"+app.globalData.openid+"'",function(obj){
      if(obj.length>0){
        app.globalData.ggwUserInfo = obj[0];
        var curUser =  app.globalData.ggwUserInfo;
      //如果该用户已经登陆，调整用户select
        _this.setData({mobile_phone:curUser.mobile_phone});
        _this.updateFenju(function(){
            var reIndex1 = meafe.ArrayIndex(curUser.fenju,_this.data.fenjuArray,"fenju");
            _this.setData({fenjuIndex:reIndex1});
            _this.updateBelongDepartment(function(){
              var reIndex2 = meafe.ArrayIndex(curUser.belong_department,_this.data.belong_departmentArray,"belong_department");
              _this.setData({belong_departmentIndex:reIndex2});
              _this.updatePerson(function(){
                var reIndex3 = meafe.ArrayIndex(curUser.person_name, _this.data.personArray,"person_name"); 
                  console.log(curUser.person_name+","+reIndex3);
                  _this.setData({personIndex:reIndex3});
                  if(_this.data.old_name==''){
                    _this.setData({
                       old_name:curUser.person_name
                    });
                  }
                });
            });
        });
      }
      else{
        _this.updateFenju(function(){
            _this.updateBelongDepartment(function(){
                _this.updatePerson();
            });
        });
      }
    
      });
  },
  updateFenju:function(callback){
    var _this = this;
    meafe.SQLQuery("select distinct fenju from 广告位登记人员表",function(obj){
          _this.setData({  
              fenjuArray:obj,
              fenjuIndex:0,
          })  
          callback();
      });
  },
  updateBelongDepartment: function(callback){
    var _this = this;
    //重新获取用户信息
    meafe.SQLQuery("select distinct belong_department from 广告位登记人员表 where fenju='"+_this.data.fenjuArray[_this.data.fenjuIndex].fenju+"'",function(obj){
        _this.setData({  
            belong_departmentArray:obj,
            belong_departmentIndex:0,
        });
        callback();
    });
  },
  updatePerson: function(callback){
    var _this = this;
    //重新获取用户信息
    meafe.SQLQuery("select id,person_name from 广告位登记人员表 where belong_department='"+_this.data.belong_departmentArray[_this.data.belong_departmentIndex].belong_department+"'",function(obj){
        _this.setData({
            personArray:obj,
            personIndex:0,
            hidden:true
      });
      callback();
    });
  }
})
