var meafe = require('../../utils/util_meafe.js');
var app = getApp();
Page({
  data: {
    tabs: ['最新信息', '业务通报', '经营通知', '友情提醒'],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    tabData: [],
    pageSize: [10, 10, 10, 10],
    loadingHidden: true,
  },
  onLoad: function (options) {
    //var _this = this;
    //_this.setData({ loadingHidden: false});
    //console.log(_this.data.tabData);
    try {
      let { tabs } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }
    this.reLoad(0);
    this.reLoad(1);
    this.reLoad(2);
    this.reLoad(3);
  },
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  handlerMove(e) {
    let { clientX, clientY } = e.touches[0];
    let { stv } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });
  },
  handlerCancel(e) {

  },
  handlerEnd(e) {
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    let { tabs, stv, activeTab } = this.data;
    let { offset, windowWidth } = stv;
    //快速滑动
    if (endTime - this.tapStartTime >= 100) {
      //向左
      if (Math.abs(this.tapStartY - clientY) < 50) {
        if (this.tapStartX - clientX > 10) {
          if (activeTab < this.tabsCount - 1) {
            this.setData({ activeTab: ++activeTab })
          }
        } else if (this.tapStartX - clientX < -10) {
          if (activeTab > 0) {
            this.setData({ activeTab: --activeTab })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } 
      /*else {
        快速滑动 但是Y距离大于50 所以用户是左右滚动
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
        }
        stv.offset = stv.windowWidth * page;
      }*/
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({ activeTab: page })
      }
      stv.offset = stv.windowWidth * page;
    }
    stv.tStart = false;
    this.setData({ stv: stv })
  },
  _updateSelectedPage(page) {
    let { tabs, stv, activeTab } = this.data;
    activeTab = page;
    this.setData({ activeTab: activeTab })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv });
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  },
  loadMore: function (e) {
    let _this = this;
    let tab = _this.data.activeTab;
    let pagesize = _this.data.pageSize;
    if (!_this.data.loadingHidden)
      return
    _this.setData({ loadingHidden: false });
    meafe.nwMsg(pagesize[tab] + 10, _this.data.tabs[tab],
      function (res) {
        let tabdata = _this.data.tabData;
        tabdata[tab] = res.data;
        _this.setData({ tabData: tabdata });
        if (res.data.length > pagesize[tab])
          pagesize[tab] = pagesize[tab] + 10
        _this.setData({
          pageSize: pagesize
        })
      }, function () {
        wx.showToast({
          title: '数据加载失败',
          mask: true
        })
      }, function () {
        _this.setData({ loadingHidden: true, })
      })
  },
  reLoad: function (tab) {
    var _this = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    meafe.nwMsg(_this.data.pageSize[tab], _this.data.tabs[tab], function (res) {
      let tabdata = _this.data.tabData;
      tabdata[tab] = res.data;
      _this.setData({ tabData: tabdata });
    }, function () {
      wx.showToast({
        title: '数据加载失败',
        mask: true,
      })
    }, function () {
      wx.hideLoading();
    })
  },
  newsDetail: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../neiwang/page_detial/page_detial?id='+id+"&type=gsxx",
    })
  }
})