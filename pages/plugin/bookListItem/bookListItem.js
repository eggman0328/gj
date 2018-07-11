// pages/plugin/bookListItem/bookListItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: ''
    },
    version: {
      type: Number,
      value: 1
    },
    cover:{
      type: String,
      value: 'http://img.v2.babystory365.com/wechatapp/guojiang/img-demobook.png'
    },
    json: {
      type: String,
      value:''
    },
    isLock: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    read: function(){
      if (this.properties.isLock){
        return false
      }
      wx.navigateTo({
        url: '../reader/reader?json=' + this.properties.json + '&version=' + this.properties.version,
      })
    }
  }
})
