Page({
  data:{ imageSrc:'' },
  onLoad:function(option){
    this.setData({imageSrc:"https://www.meafe.cn/upfiles/wx/"+option.img})
  },
  tapCloseNav:function(){
      wx.navigateBack({ delta: 1 });
  }
})