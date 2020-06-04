// pages/home/index.js
// const innerAudioContext = wx.createInnerAudioContext();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    song:{
      poster:'../../images/logo_18.jpg',
      author: [{name:'华语群星'}],
      title: '华语群星 - 云水禅心 (古筝版)',
      src: '/music/华语群星 - 云水禅心 (古筝版).mp3'
    },
    // 控制音频的播放与暂停
    isMusicPlay: null,
    innerAudioContext:'null',
    // 当前播放时间
    currentTime:0,
    // 歌曲总长
    duration:0,
    //歌单列表
    musicList: [],
    // 是否关闭歌单列表
    isClose: true,
    currentIndex:0
  },
// 播放音乐或暂停音乐
  audioPlay: function () {
    // this.data.isMusicPlay = !this.data.isMusicPlay;
    let isMusicPlay = !this.data.isMusicPlay;
    app.globalData.isMusicPlay = !this.data.isMusicPlay;
    console.log(app.globalData.isMusicPlay)
    this.setData({
      isMusicPlay,
    })
    // console.log(this.data.isMusicPlay)
    if(isMusicPlay) {
      app.globalData.innerAudioContext.play()
    }else{
      app.globalData.innerAudioContext.pause()
    }
    
  },
// 暂停音乐
  audioPause: function() {
    // this.data.innerAudioContext.pause()
  },
  // 初始化音乐对象
  initmusic: function() {
    const song = {
      poster:app.globalData.picUrl,
      author: app.globalData.selectsingername,
      title:app.globalData.selectsongTitle,
      src: app.globalData.selectsongUrl,
    }
    this.setData({
      isMusicPlay: app.globalData.isMusicPlay,
      song:song,
      musicList:app.globalData.musicList,
    });
  },
  getRecommenData: function () {
    const _that = this
    wx.request({
      // g_tk 为歌组号
      url: "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=19800000&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5&jsonpCallback=jp1",
      data: {
      },
      success: function (res) {
      var res2 = _that.getObject(res)
       console.log(res2.data.topList)
       _that.setData({
         songList : res2.data.topList
       })
      }
    })
  },
  // 把返回来的字符串处理成对象
  getObject: function (res) {
    var res1 = res.data.replace("jp1(", "")
    var res2 = JSON.parse(res1.substring(0,res1.length-1))
    return res2;  
  },
  // 跳转到某一热门歌单组界面
  toHostSingPage:function(e) {
    // console.log(e.target.dataset.groupid)
    app.globalData.selectsongGound = e.target.dataset.groupid
    wx.navigateTo({
      url: '/pages/hostSingList/hostSingList'
    })
  },
  // 关闭歌单
  closeSongList: function() {
      this.setData({
        isClose: true
      })
  },
  // 显示歌单
  showSonglist: function() {
      this.setData({
        isClose: false,
        currentIndex:app.globalData.currentIndex,
      })
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化歌曲状态，播放和停止
    this.setData({
      isMusicPlay: app.globalData.isMusicPlay
    });
    // 初始化音乐对象
    this.initmusic();
  // 这里必须为绝对路径，不能为相对路径，可以从根目录开始写
  app.globalData.innerAudioContext.src = this.data.song.src;
  this.getRecommenData()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    // this.audioCtx = wx.createAudioContext('myAudio')
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 
    this.initmusic()
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

  }
})