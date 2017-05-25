var app = getApp();
var meafe = require('../../utils/util_meafe.js');
Page({
    data:{
        selected:true,
        selected1:false,
        list: [],
        handler_btn_show:''
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
            url: '../page_ggw_add/page_ggw_add'
        })
    },
    onLoad:function(){
       
    },
    loadMyRecord:function(){
        var _this = this;
        meafe.SQLQuery("select a.*,b.name from (select xiaoqu_id,count(*) as zongshu, count(*)-sum(case when len(handler_result)>1 then 1 else 0 end) as notHandlerCount from 广告位记录 where xiaoqu_id in (select xiaoqu_id from 广告位记录 where record_person_id="+app.globalData.ggwUserInfo.id+") group by xiaoqu_id) a left join (select * from 小区表) b on a.xiaoqu_id=b.id order by a.notHandlerCount desc",
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
    tapListItem:function(e){
        var xiaoqu_id = e.currentTarget.id;
        wx.navigateTo({
            url: '../page_ggw_listforxiaoqu/page_ggw_listforxiaoqu?xiaoqu_id='+xiaoqu_id
        })
    },
    onShow:function(e){
        console.log('show');
        if(this.data.selected){
            this.loadMyRecord();
        }
        else
            this.loadUnHandleredRecord();
    }
})