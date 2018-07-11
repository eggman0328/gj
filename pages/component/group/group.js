// pages/component/group/group.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groupType: {
      type: String,
      value: 1    // 组件状态 1：拼团成功，给出倒计时统计；2：拼团失败：给出失败提示
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    groupRule: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showRule: function(){
      this.setData({
        groupRule: true
      })
    },
    hideRule: function () {
      this.setData({
        groupRule: false
      })
    },
    groupBack: function(){
      this.triggerEvent('groupBack', {})
    }
  }
})
