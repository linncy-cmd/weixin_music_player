// pages/item/item.js
const Lyric = require('../../utils/lyric.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   * res.data.req_0.data.sip[0] + res.data.req_0.data.midurlinfo[0].purl
   */
  data: {
      lyric : "看 大江东去 浪花淘尽千古英雄 笑 指点江山 是非成败俱灰飞烟灭 此地一为别 青山旧 雨初歇 豪情却 向谁说 机遇难赊 东风且暂借 流年似水 足印难重叠 赤壁难辨 风流云散处 只剩下当时明月 枉海阔天空 故人不曾入梦 几度夕阳红 晚钟 分久必合 合久必分 暂寄天地之间敌友难分 多情应笑我华发生 但为君故独沉吟至今 一时瑜亮 一壶酒 万古销沉 人道是 分久必合 合久必分 和你终须一别 秋月春风残雪 枉海阔天空 故人不曾入梦 几度夕阳红 晚钟 分久必合 合久必分 暂寄天地之间敌友难分 多情应笑我华发生 但为君故独沉吟至今 一时瑜亮 一壶酒 万古销沉 人道是 分久必合 合久必分 和你终须一别 分久必合 合久必分 暂寄天地之间主客难分 多情应笑我华发生 但为君故独沉吟至今 一时瑜亮 一壶酒 戎马一生 人道是 分久必合 合久必分 人生纵使一别 天涯共此明月",
      // 目前歌曲播放位置
      currentTime:0,
      // 歌曲总长
      duration:0,
      // 歌曲进度条
      percent:0,
      // 是否循环
      loop: false,
      // logo 图片地址
      picUrl:'',
      // 歌曲标题
      title:'',
      // 歌曲作者
      author:[],
      // 歌曲列表
      musicList:[],
      // 当前播放歌索引
      currentIndex:1,
      // 是否关闭歌单
      isClose: true,
      // 是否播放
      
  },
  // 播放音乐或暂停音乐
  audioPlay: function () {
    // this.data.isMusicPlay = !this.data.isMusicPlay;
    let isMusicPlay = !this.data.isMusicPlay;
    app.globalData.isMusicPlay = !this.data.isMusicPlay;
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
  // 监听音乐是否循环
  setLoop: function () {
    const loop = ! this.data.loop;
    app.globalData.innerAudioContext.loop = loop;
    this.setData({
      loop,
    })
  },
  // 获取播放链接
  getSongUrl: function() {
    // app.globalData.selectsongid = 004dtxRA4Mvvna
    const selectsongmidid = app.globalData.selectsongmidid;
    const _that = this
    wx.request({
      // g_tk 为歌组号
     url: `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=%7B%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%22358840384%22%2C%22songmid%22%3A%5B%22${selectsongmidid}%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%221443481947%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A%2218585073516%22%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D`,
     success:function(res) {
       if(res.data.req_0.data.midurlinfo[0].purl){
        const url = res.data.req_0.data.sip[0] + res.data.req_0.data.midurlinfo[0].purl;
        app.globalData.innerAudioContext.src = url;
        //成功获取之后地址之后，把midid赋值为空
        app.globalData.selectsongmidid = '';
        app.globalData.innerAudioContext.play()
        app.globalData.isMusicPlay = true
        console.log(app.globalData.isMusicPlay)
        _that.setData({
          isMusicPlay:app.globalData.isMusicPlay
        });
        app.globalData.timer = setInterval(()=>{
          // console.log(app.globalData.duration)
          _that.setData({
            duration:app.globalData.duration || 0,
            currentTime:app.globalData.currentTime || 0,
            percent:app.globalData.percent || 0
        })},1000);
       }
       else{
        wx.showToast({
          title: '本歌曲暂时不能播放。请切换下一首',
          icon: 'none'
        })
       }
     }
   });
  },
  // 获取歌曲logo
  getSingerLogo: function() {
    const _that = this;
    const singer = app.globalData.selectsingername;
    const title = app.globalData.selectsongTitle;
    // console.log(title)
    // console.log(singer)
    wx.request({
     url: `http://music.163.com/api/search/get/web?s=${singer[0].name}&type=100`,
     success:function(res) {
      //  console.log(res.data.result.artists[0].picUrl)
      app.globalData.picUrl = res.data.result.artists[0].picUrl;
      _that.setData({
        picUrl:res.data.result.artists[0].picUrl,
        author:singer,
        title:title
      })
     }
   });
  },
  // 初始化界面logo
  initPage: function () {
    console.log(app.globalData.musicList)
    this.setData({
      picUrl:app.globalData.picUrl,
      author:app.globalData.selectsingername,
      title:app.globalData.selectsongTitle,
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
  // 切换歌曲
  toggleSong: function(e) {
    // console.log(app.globalData.timer)
    const str = e.currentTarget.dataset.song_obj.selectsongmidid;
    app.globalData.selectsongmidid = e.currentTarget.dataset.song_obj.selectsongmidid;
    app.globalData.selectsingername = e.currentTarget.dataset.song_obj.selectsingername;
    app.globalData.selectsongTitle = e.currentTarget.dataset.song_obj.selectsongTitle;
    app.globalData.currentIndex = e.currentTarget.dataset.song_obj.index;
    // 不为空时，就证明是从热门歌单组过来的
    if(str.trim().length != 0){
      app.globalData.innerAudioContext.stop()
      // 初始化歌曲地址
     this.getSongUrl();
     // 初始化logo
     this.getSingerLogo();
     this.setData({
       currentIndex:app.globalData.currentIndex
     })
    //  console.log(app.globalData.isMusicPlay)
   }else{
     // 否则则用默认logo
     this.initPage()
   }
  //  this.audioPlay()
  },
  // 切换下一首或上一首
  nextIndex: function(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    console.log(typeof index);
    app.globalData.currentIndex = app.globalData.currentIndex + index;
    const item = app.globalData.musicList.find(item => item.index === app.globalData.currentIndex);
    const str = item.selectsongmidid;
    app.globalData.selectsongmidid = item.selectsongmidid;
    app.globalData.selectsingername = item.selectsingername;
    app.globalData.selectsongTitle = item.selectsongTitle;
    app.globalData.currentIndex = item.index;
    // 不为空时，就证明是从热门歌单组过来的
    if(str.trim().length != 0){
      app.globalData.innerAudioContext.stop()
      // 初始化歌曲地址
     this.getSongUrl();
     // 初始化logo
     this.getSingerLogo();
     this.setData({
       currentIndex:app.globalData.currentIndex
     })
    //  console.log(app.globalData.isMusicPlay)
   }else{
     // 否则则用默认logo
     this.initPage()
   }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const str = app.globalData.selectsongmidid;
    // console.log(str)
    // console.log(str.trim().length != 0)
    // 不为空时，就证明是从热门歌单组过来的
    if(str.trim().length != 0){
       // 初始化歌曲地址
      this.getSongUrl();
      // 初始化logo
      this.getSingerLogo()
    }else{
      // 否则则用默认logo
      this.initPage()
    }
    // 初始化 isMusicPlay
    this.setData({
      isMusicPlay: app.globalData.isMusicPlay,
      musicList:app.globalData.musicList
    });
  },
  // 处理歌曲时间
  _formatTime: function (interval) {
    interval = Math.ceil(interval) | 0
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  },
  /*秒前边加0*/
  _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
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
    this.setData({
      isMusicPlay: app.globalData.isMusicPlay,
      musicList:app.globalData.musicList,
    });
    const str = app.globalData.selectsongmidid;
    if(str.trim().length != 0){
        // 初始化歌曲地址
      this.getSongUrl();
      // 初始化logo
      this.getSingerLogo()
    }else{
      // 否则则用默认logo
      this.initPage()
    }
    app.globalData.timer = setInterval(()=>{
      this.setData({
        duration:app.globalData.duration || 0,
        currentTime:app.globalData.currentTime || 0,
        percent:app.globalData.percent || 0
    })},1000);
    
  },

  /**
   * 生命周期函数--监听页面隐藏,切换到其他界面时
   */
  onHide: function () {
    clearInterval(app.globalData.timer)
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

  }
})