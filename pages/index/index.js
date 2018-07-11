//index.js
//获取应用实例
const app = getApp()

Page({
  
  data: {
    tabState: 0,                          //tab实时位置
    tabName: ['内容简介','内容列表'],      //tab标题
    listData: '{}',                       //书单列表内容
    lockRule: 20,                         //书单解锁规则
    isGroup: false,                       //是否成团
    animateAction: true,                  //动画开关
    groupAction: false,                     //拼团开关
  },

  //app加载
  onLoad: function (res) {
    this.setBookList();
  },

  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快来参团',
      path: '/pages/index/index?id=123'
    }
  },

  //页面展示时调用
  onShow: function(){
    this.setData({
      animateAction: true
    })
  },

  //页面隐藏时调用
  onHide: function () {
    setTimeout(() => {
      this.setData({
        animateAction: false
      })
    }, 1000)
  },

  //tab选择
  onTabSelect: function () {
    this.hometab = this.selectComponent('#home-tab');
    this.setData({
      tabState: this.hometab.getTabState()
    })
  },

  //bookList渲染
  setBookList: function(){
    var page = this
    wx.request({
      url: 'https://img.v2.babystory365.com/wechatapp/guojiang/json/booklist6.json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        page.setData({
          listData: res.data
        })
      }
    })
  },

  //立即购买
  onPay: function(){
    wx.request({
      url: 'https://promoting.newtest.babystory365.com/api/payment/order',
      data: '{"header":{"userId":468667},"order":{"type":99,"productId":1,"payChannel":{"payChannelId":1,"payType":2}}}',
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log();
        wx.requestPayment({
          'timeStamp': '',
          'nonceStr': '',
          'package': '',
          'signType': 'MD5',
          'paySign': '',
          'success': function (res) {
          },
          'fail': function (res) {
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
      
    })
    
  },

  //两人拼团
  onGroup: function () {
    this.setData({
      groupAction: true
    })
  },

  onGroupBack: function(){
    this.setData({
      groupAction: false
    })
  }
 
})
