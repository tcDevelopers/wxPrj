// pages/store/store.js
const app = getApp();
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewTo: "",
    viewToLeft: "",
    listHeight: 300,
    fillHeight: 0,
    activeIndex: 0,
    tabIndex: 0,
    showModal: false,
    showCart: false,
    heigthArr: [],
    cart: [],
    totalMoney: 0,
    activesInfo: {
      1: {
        class: "manjian",
        text: "订"
      },
      2: {
        class: "xindian",
        text: "限"
      },
      3: {
        class: "zhekou",
        text: "评"
      },
      4: {
        class: "daijinquan",
        text: "券"
      },
      5: {
        class: "xinyonghu",
        text: "新"
      },
      6: {
        class: "peisong",
        text: "配"
      },
      7: {
        class: "lingdaijin",
        text: "领"
      },
      8: {
        class: "zengsong",
        text: "赠"
      }
    },
    storeInfo: {},
    food: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.userInfo || !app.userInfo.STAFF_NO)
      wx.reLaunch({
        url: '/page/index/index',
      })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: 'https://www.meafe.cn/lite/order_select?staff_no=600299',
      success: res => {
        if (res.statusCode == 200) {
          this.setData({
            storeInfo: res.data.storeInfo,
            food: res.data.food
          }, () => this.onRender());
          if (res.data.msgTitle)
            wx.showModal({
              title: res.data.msgTitle,
              content: res.data.msgTxt,
              showCancel: false,
            })
        }
      },
      complete: () => wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onRender: function() {
    let height1, height2;
    let res = wx.getSystemInfoSync();
    let winHeight = res.windowHeight;
    let query = wx.createSelectorQuery();
    query.select(".head").boundingClientRect();
    query.exec(res => {
      height1 = res[0].height;
      let query1 = wx.createSelectorQuery();
      query1.select(".tab").boundingClientRect();
      query1.exec(res => {
        height2 = res[0].height;
        this.setData({
          listHeight: winHeight - height1 - height2
        });
        this.calculateHeight(winHeight - height1 - height2);
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  selectFood(e) {
    this.setData({
      activeIndex: e.target.dataset.index,
      viewTo: e.target.dataset.titleid
    });
  },
  calculateHeight(listHeight) {
    let heigthArr = [];
    let height = 0;
    heigthArr.push(height);
    var query = wx.createSelectorQuery();
    query.selectAll(".title-group").boundingClientRect();
    query.exec(res => {
      let groupHeight = 0;
      for (let i = 0; i < res[0].length; i++) {
        groupHeight = parseInt(res[0][i].height);
        height += groupHeight;
        heigthArr.push(height);
      }
      this.setData({
        heigthArr: heigthArr,
        fillHeight: listHeight - groupHeight
      });
    });
  },
  // 手机端有延迟 节流函数效果不好 用防抖函数凑合
  scroll(e) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      let srollTop = e.detail.scrollTop;
      for (let i = 0; i < this.data.heigthArr.length; i++) {
        if (
          srollTop >= this.data.heigthArr[i] - 50 &&
          srollTop < this.data.heigthArr[i + 1] - 50 &&
          this.data.activeIndex != i
        ) {
          this.setData({
            activeIndex: i
          });
          /*if (i < 3) {
            this.setData({
              viewToLeft: 'title1left'
            })
          } else {
            this.setData({
              viewToLeft: 'title' + (i - 2) + 'left'
            })
          }*/
          return;
        }
      }
    }, 100)
  },
  detailAdd(e) {
    let groupindex = e.target.dataset.groupindex;
    let index = e.target.dataset.index;
  },
  add(e) {
    // 某道菜数量加1
    let groupindex = e.target.dataset.groupindex;
    let index = e.target.dataset.index;
    let countMsg =
      "food[" +
      groupindex +
      "].items[" +
      index +
      "].count";
    let count = this.data.food[groupindex].items[
      index
    ].count;
    let foodCountMsg = "food[" + groupindex + "].foodCount";
    let foodCount = this.data.food[groupindex].foodCount;
    let foodId = this.data.food[groupindex].items[
      index
    ].foodId;
    count += 1;
    foodCount += 1;
    this.setData({
      [countMsg]: count, //数据的局部更新
      [foodCountMsg]: foodCount
    });
    let cart = this.data.cart;
    let hasCart = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].foodId == foodId) {
        hasCart = true;
        break;
      }
    }
    if (hasCart) {
      cart[i].count++;
    } else {
      cart.push({ ...this.data.food[groupindex].items[index],
        groupindex,
        index
      });
    }
    let totalMoney = this.data.totalMoney;
    totalMoney += this.data.food[groupindex].items[
      index
    ].price;
    this.setData({
      cart: cart,
      totalMoney: totalMoney
    });
  },
  reduce(e) {
    // 某道菜数量减1
    let groupindex = e.target.dataset.groupindex;
    let index = e.target.dataset.index;
    let countMsg =
      "food[" +
      groupindex +
      "].items[" +
      index +
      "].count";
    let count = this.data.food[groupindex].items[
      index
    ].count;
    let foodCountMsg = "food[" + groupindex + "].foodCount";
    let foodCount = this.data.food[groupindex].foodCount;
    let foodId = this.data.food[groupindex].items[
      index
    ].foodId;
    count -= 1;
    foodCount -= 1;
    this.setData({
      [countMsg]: count,
      [foodCountMsg]: foodCount
    });
    let cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].foodId == foodId) {
        if (cart[i].count == 1) {
          cart.splice(i, 1);
        } else {
          cart[i].count--;
        }
        break;
      }
    }
    let totalMoney = this.data.totalMoney;
    totalMoney -= this.data.food[groupindex].items[
      index
    ].price;
    this.setData({
      cart: cart,
      totalMoney: totalMoney
    });
  },
  clear() {
    //清空购物车，food和cart数量都清0
    let food = this.data.food;
    food.forEach(val => {
      val.foodCount = 0;
      val.items.forEach(v => v.count = 0);
    });
    this.setData({
      food: food,
      cart: [],
      totalMoney: 0,
    });
  },
  listCart() {
    if (this.data.cart.length > 0) {
      this.setData({
        showCart: !this.data.showCart
      })
    }
  },
  selectTabItem(e) {
    if (e.target.dataset.index) {
      this.setData({
        tabIndex: e.target.dataset.index
      });
    }
  },
  preventScrollSwiper() {
    return false;
  },
  showStoreDetail() {
    this.setData({
      showModal: true
    });
  },
  closeModal(e) {
    this.setData({
      showModal: false
    });
  },
  submit() {
    let cart = this.data.cart
    if (!cart.length | !app.userInfo.STAFF_NO)
      return;
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    wx.request({
      url: 'https://www.meafe.cn/lite/order_submit',
      method: 'POST',
      data: {
        cart: cart,
        staff_no: app.userInfo.STAFF_NO
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '预定成功',
          icon: 'success',
          mask: true,
          complete: () => setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        })
      },
      fail: () => wx.hideLoading()
    })
  }
});