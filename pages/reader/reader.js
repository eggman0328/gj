// pages/reader/reader.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageStyle: {
      width: wx.getSystemInfoSync().screenWidth,
      height: wx.getSystemInfoSync().screenHeight,
      rotate: 0
    },
    imgUrl: [],
    voiceUrl: [],
    version: '1',
    initIndex: 0,
    swiperIndex: 0,
    repeat: true,
    autoplay: true,
    autoplayText: '自动播放',
    voice: true,
    swiperType: "paper",
    bookTitle: '',
    pageTotal: 10,
    pageNow: 1,
    actionState: true,
    actionShow: true,
    playInit: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {

    let page = this
    let json = res.json
    this.setData({
      version: res.version
    })

    //横竖屏切换
    let isLandscape = false
    if (isLandscape) {
      page.setData({
        pageStyle: {
          width: wx.getSystemInfoSync().screenHeight,
          height: wx.getSystemInfoSync().screenWidth,
          rotate: 90
        }
      })
    }

    //书本资源请求
    wx.request({
      url: json,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (page.data.version !== '2'){
          page.oldBookSet(res.data);
        }else{
          page.newBookSet(res.data);
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onPrev: function () {

  },

  action: function () {

  },

  /**
   * 旧书播放器初始化
   */
  oldBookSet: function (data) {
    let imgarr = new Array();
    let voicearr = new Array();
    let file = this.data.version === "1" ? "https://wgscdn.babystory365.com/cbook/" : "https://wgscdn.babystory365.com//cbook/";
    const pageTotal = data.pageTotal;
    const bookTitle = data.bookName;
    for (let i = 0; i < pageTotal; i++) {
      let subImgArr = new Array();
      let bgUrl = file + data.id + "/extract/page_bg_" + (i + 1) + ".jpg";
      let subUrl = file + data.id + "/extract/page_sub_" + (i + 1) + ".png";
      let voiceUrl = file + data.id + "/extract/page_audio_" + (i + 1) + ".mp3";
      subImgArr.push(bgUrl);
      subImgArr.push(subUrl);
      imgarr.push(subImgArr);
      voicearr.push(voiceUrl);
    }

    this.setData({
      imgUrl: imgarr,
      voiceUrl: voicearr,
      bookTitle: bookTitle,
      pageTotal: pageTotal
    })

    const pagevoice = wx.createInnerAudioContext();
    this.pagevoice = pagevoice;
    this.pagevoice.autoplay = this.data.autoplay;
    this.pagevoice.src = this.data.voiceUrl[0];
    var page = this;
    
    this.bookswiper = this.selectComponent('#book-swiper');

    this.pagevoice.onEnded(() => {
      if (page.data.autoplay) {
        page.bookswiper._pageNext();
      } else {
        this.pagevoice.pause();
      }
    })
  },

  /**
   * 新书播放器初始化
   */
  newBookSet: function (data) {
    let imgarr = new Array();
    let file = "https://wgscdn.babystory365.com";
    this.audioArr = new Array();
    const pageTotal = data.pages.length;
    const bookTitle = data.book_name;
    for (let i = 0; i < pageTotal; i++) {
      let subImgArr = new Array();
      let bgUrl = file + data.pages[i].img_path;
      let subUrl = data.pages[i].lrc_path === undefined ? '' : (file + data.pages[i].lrc_path);
      let audio_start = data.pages[i].audio_start_time
      subImgArr.push(bgUrl);
      subImgArr.push(subUrl);
      imgarr.push(subImgArr);
      this.audioArr.push(audio_start);
    }
    const voiceUrl = file + data.audio.audio_path;
    const bgvoiceUrl = file + data.bg_music_path;

    this.setData({
      imgUrl: imgarr,
      voiceUrl: voiceUrl,
      bookTitle: bookTitle,
      pageTotal: pageTotal
    })

    const pagevoice = wx.createInnerAudioContext();
    const bgvoice = wx.createInnerAudioContext();
    this.pagevoice = pagevoice;
    this.bgvoice = bgvoice;
    this.pagevoice.autoplay = this.data.autoplay;
    this.pagevoice.pause();
    this.bgvoice.autoplay = false;
    this.pagevoice.src = this.data.voiceUrl;
    this.bgvoice.src = bgvoiceUrl;
    this.bgvoice.loop = true;
    var page = this;
    
    this.bookswiper = this.selectComponent('#book-swiper');

    //小程序的一个bug，需要手动唤醒interval，不然onTimeUpdate不会生效，等bug解决后这句废代码就不需要了...
    setInterval(function () {page.pagevoice.currentTime},100);

    this.pagevoice.onTimeUpdate(() => {
      var currentTime = this.pagevoice.currentTime;
      if (page.audioArr[page.data.pageNow] != undefined) {
        if (this.pagevoice.currentTime > page.timeFormat(page.audioArr[page.data.pageNow])) {
          if (page.data.autoplay) {
            page.bookswiper._pageNext();
          } else {
            this.pagevoice.pause();
          }
        }
      }
    })
  },

  //向上翻页事件
  onPrev: function () {
    this.setData({
      pageNow: this.data.pageNow - 1
    })
    if(this.data.version !== '2'){
      this.pagevoice.src = this.data.voiceUrl[this.data.pageNow - 1];
    } else {
      this.pagevoice.seek(this.timeFormat(this.audioArr[this.data.pageNow - 1]));
      this.pagevoice.play();
      if (this.data.pageNow - 1 > 0) {
        this.bgvoice.play();
      }
    }
  },

  //向下翻页事件
  onNext: function () {
    this.setData({
      pageNow: this.data.pageNow + 1
    })
    if (this.data.version !== '2'){
      this.pagevoice.src = this.data.voiceUrl[this.data.pageNow - 1];
    } else {
      this.pagevoice.seek(this.timeFormat(this.audioArr[this.data.pageNow - 1]));
      this.pagevoice.play();
      if (this.data.pageNow - 1 > 0) {
        this.bgvoice.play();
      }
    }
  },

  //重播控制
  repeatAction: function () {
    this.setData({
      repeat: this.data.repeat ? false : true,
      pageNow: 1,
      playInit: true
    })
    this.bookswiper.pageTo(0, this.bookswiper.getPage())
    if (this.data.version !== '2') {
      this.pagevoice.src = this.data.voiceUrl[0];
    } else {
      this.bgvoice.stop()
    }
    this.pagevoice.stop()
  },

  //自动播放控制
  autoplayAction: function () {
    this.setData({
      autoplay: this.data.autoplay ? false : true
    })
    this.setData({
      autoplayText: this.data.autoplay ? "自动播放" : "手动播放"
    })
    if (this.data.autoplay) {
      this.bookswiper.hidePN()
    }else {
      this.bookswiper.showPN()
    }
  },

  //音量控制
  voiceAction: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  //wrapAction
  wrapAction: function(){
    this.showAction();
  },

  //控制器显示
  showAction: function(){
    var page = this
    this.pagevoice.pause()
    this.setData({
      actionShow: true
    })
    setTimeout(function () {
      page.setData({
        actionState: true
      })
    }, 100)
  },

  //控制器隐藏
  hideAction: function(){
    var page = this
    this.pagevoice.play()
    this.setData({
      actionState: false,
      playInit:false
    })
    setTimeout(function(){
      page.setData({
        actionShow: false
      })
    },300)
  },

  //时间转换
  timeFormat: function (time){
    let s = '';
    let min = time.split(':')[0];
    let sec = time.split(':')[1];
    s = Number(min * 60) + Number(sec);

    return s;
  }

})