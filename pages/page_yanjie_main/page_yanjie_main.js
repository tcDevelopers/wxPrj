var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
    data:{
        selected:true,
        selected1:false,
        list: []
    },
    selected:function(e){
        this.setData({
            selected1:false,
            selected:true
        });
        this.loadMyRecord();
    },
    selected1:function(e){
        this.setData({
            selected:false,
            selected1:true
        })
        this.loadUnHandleredRecord();
    },
    tapUploadSubmit:function(){
        wx.navigateTo({
            url: '../page_yanjie_add/page_yanjie_add'
        })
    },
    onLoad:function(){
       
    },
    loadMyRecord:function(){
        var _this = this;
        meafe.SQLQuery("select a.*,b.person_name from (select * from 沿街店铺记录 where record_person_id="+app.globalData.ggwUserInfo.id+") a left join 广告位登记人员表 b on a.record_person_id=b.id order by record_time desc",
            function(obj){
                console.log(obj);
                _this.setData({
                    list:obj
                });
            }
        );
    },
    loadUnHandleredRecord:function(){
        var _this = this;
        meafe.SQLQuery("select a.*,b.name from (select xiaoqu_id,count(*) as zongshu, count(*)-sum(case when len(handler_result)>1 then 1 else 0 end) as notHandlerCount from 广告位记录 where xiaoqu_id in (select id from 小区表 where belong_department in (select belong_department from 广告位登记人员表 where id="+app.globalData.ggwUserInfo.id+" and person_role='小区处理人')) group by xiaoqu_id) a left join (select * from 小区表) b on a.xiaoqu_id=b.id order by a.notHandlerCount desc",
            function(obj){
                _this.setData({
                    list:obj
                });
            }
        );
    },
    tapListBtn:function(e){
        var record_id = e.currentTarget.id;
        wx.navigateTo({
            url: '../page_yanjie_add/page_yanjie_add?record_id='+record_id
        })
    },
    onShow:function(e){
        console.log('show');
        if(this.data.selected){
            this.loadMyRecord();
        }
        else
            this.loadUnHandleredRecord();
    },
    tapShowImage:function(e){
        console.log(e);
        wx.navigateTo({
            url: '../page_preview_image/page_preview_image?img='+ e.target.dataset.imgloc
        })
    }
})