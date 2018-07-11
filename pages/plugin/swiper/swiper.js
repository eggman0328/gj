// pages/plugin/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperImg: {
      type: Array,
      value: []
    },
    swiperWidth: {
      type: String,
      value: 0
    },
    initIndex: {
      type: Number,
      value: 0
    },
    swiperIndex: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        this.pageTo(newVal, oldVal)
      }
    },
    swiperType: {
      type: String,
      value: "slide"
    },
    swiperLoop: {
      type: Boolean,
      value: false
    },
    swiperDuration: {
      type: Number,
      value: 1500
    },
    swiperAuto: {
      type: Boolean,
      value: false
    },
    swiperAutoWaiting: {
      type: Number,
      value: 3000
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _swiperDuration: 500,
    _swiperDisabled: false,
    _swiperIndex: 0,
    _showPN: false,
  },

  /**
   * 组件生命周期函数，在组件布局完成后执行
   */
  ready: function () {
    this.setData({
      _swiperDuration: 0,
      _swiperIndex: this.data.initIndex
    })

    var isAutoPlay = this.data.swiperAuto
    if (isAutoPlay) {
      this._autoPlay();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //跳页
    pageTo: function (newVal, oldVal) {
      var duration = Math.abs(newVal - oldVal) > 1 ? 0 : this.data.swiperDuration;
      this.setData({
        _swiperDuration: duration,
        _swiperIndex: newVal
      })
    },

    //设置是否禁止播放
    setDisabled: function (e) {
      this.setData({
        _swiperDisabled: e.currentTarget.dataset.disabled
      })
    },

    //向上翻页
    _pagePrev: function () {

      var swiper = this

      swiper.triggerEvent('onprev', {})

      if (swiper.data._swiperDisabled) {
        return false
      }

      //翻页方式
      ; (function (type) {
        var prev = {

          //滑动
          "slide": function () {
            if (swiper.data.swiperLoop) {
              if (swiper.data._swiperIndex == -1) {
                swiper.setData({
                  _swiperDuration: 0,
                  _swiperIndex: swiper.data.swiperImg.length - 1
                })
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex - 1
                })
              } else {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex - 1
                })
              }
            } else {
              if (swiper.data._swiperIndex > 0) {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex - 1
                })
              }
            }
          },

          //抽纸
          "paper": function () {
            if (swiper.data.swiperLoop) {
              if (swiper.data._swiperIndex == 0) {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data.swiperImg.length - 1
                })
              } else {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex - 1
                })
              }
            } else {
              if (swiper.data._swiperIndex > 0) {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex - 1
                })
              }
            }
          }
        }

        if (typeof prev[type] !== 'function') {
          return false;
        }

        return prev[type]()

      })(swiper.data.swiperType)
    },

    //向下翻页
    _pageNext: function () {

      var swiper = this

      swiper.triggerEvent('onnext', {})

      if (swiper.data._swiperDisabled) {
        return false
      }

      //翻页方式
      ; (function (type) {
        var next = {

          //滑动
          "slide": function () {
            if (swiper.data.swiperLoop) {
              if (swiper.data._swiperIndex == swiper.data.swiperImg.length) {
                swiper.setData({
                  _swiperDuration: 0,
                  _swiperIndex: 0
                })
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex + 1
                })
              } else {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex + 1
                })
              }
            } else {
              if (swiper.data._swiperIndex < swiper.data.swiperImg.length - 1) {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex + 1
                })
              }
            }
          },

          //抽纸
          "paper": function () {
            if (swiper.data.swiperLoop) {
              if (swiper.data._swiperIndex == swiper.data.swiperImg.length - 1) {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: 0
                })
              } else {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex + 1
                })
              }
            } else {
              if (swiper.data._swiperIndex < swiper.data.swiperImg.length - 1) {
                swiper.setData({
                  _swiperDuration: swiper.data.swiperDuration,
                  _swiperIndex: swiper.data._swiperIndex + 1
                })
              }
            }
          }
        }

        if (typeof next[type] !== 'function') {
          return false;
        }

        return next[type]()

      })(swiper.data.swiperType)
    },

    //自动播放
    _autoPlay: function () {
      var swiper = this
      setInterval(function () {
        swiper._pageNext()
      }, swiper.data.swiperAutoWaiting)
    },

    //轮播区触摸事件
    _wrapAction: function (){
      this.triggerEvent('wrapAction', {})
    },

    //显示左右按键
    showPN() {
      this.setData({
        _showPN: true
      })
    },

    //隐藏左右按键
    hidePN() {
      this.setData({
        _showPN: false
      })
    },

    //获取当前index
    getPage() {
      return this.data._swiperIndex
    }
  }
})
