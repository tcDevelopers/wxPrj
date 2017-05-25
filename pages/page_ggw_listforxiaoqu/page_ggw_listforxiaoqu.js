var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
    data:{
        selected:true,
        selected1:false,
        list: [],
        xiaoqu_id:-1,
        xiaoqu_name:'',
        user_id:''
    },
    data:{
        list: []
    },
    selected:function(e){
        this.setData({
            selected1:false,
            selected:true
        })
        this.getUnhandlered();
    },
    selected1:function(e){
        this.setData({
            selected:false,
            selected1:true
        })
        this.getHandlered();
    },
    tapUploadSubmit:function(){
        wx.navigateTo({
            url: '../page_ggw_add/page_ggw_add'
        })
    },
    onLoad:function(option){
        var _this = this;
        this.setData({xiaoqu_id:option.xiaoqu_id,selected:true,user_id:app.globalData.ggwUserInfo.id});
        meafe.SQLQuery("select * from 小区表 where id="+this.data.xiaoqu_id,
            function(obj){
                _this.setData({
                    xiaoqu_name:obj[0].name
                });
            }
        );
    },
    getUnhandlered:function(){
        var _this = this;
        meafe.SQLQuery("select c.*,d.person_name from (select a.*,b.name from (select * from 广告位记录 where xiaoqu_id="+this.data.xiaoqu_id+" and (handler_result is null or handler_result='')) a left join (select * from 小区表) b on a.xiaoqu_id=b.id) c left join 广告位登记人员表 d on c.record_person_id=d.id order by c.record_time desc",
            function(obj){
                _this.setData({
                    list:obj
                });
            }
        );
    },
    getHandlered:function(){
        var _this = this;
        meafe.SQLQuery("select c.*,d.person_name from (select a.*,b.name from (select * from 广告位记录 where xiaoqu_id="+this.data.xiaoqu_id+" and len(handler_result)>0 ) a left join (select * from 小区表) b on a.xiaoqu_id=b.id) c left join 广告位登记人员表 d on c.record_person_id=d.id order by c.handler_time desc",
            function(obj){
                _this.setData({
                    list:obj
                });
            }
        );
    },
    tapList:function(e){
        var record_id = e.currentTarget.id;
        wx.navigateTo({
            url: '../page_ggw_handler/page_ggw_handler?record_id='+record_id
        })
    },
    tapShowImage:function(e){
        console.log(e);
        wx.navigateTo({
            url: '../page_preview_image/page_preview_image?img='+ e.target.dataset.imgloc
        })
    },
    onShow:function(){
        if(this.data.selected)
            this.getUnhandlered();
        else
            this.getHandlered();
    }
})