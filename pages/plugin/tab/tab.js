// pages/plugin/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabName: {
      type: Array,
      value:['item1','item2']
    },
    tabStateInit: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabState: 0
  },

  attached: function () {
    this.setData({
      tabState: this.properties.tabStateInit
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //tab选择
    _onSelect: function (event){
      this.setData({
        tabState: event.currentTarget.dataset.index
      })
      this.triggerEvent('tabSelect', {})
    },

    getTabState: function(){
      return this.data.tabState
    }
  }
})
