//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    innerAudioContext:'',
    // 控制音频的播放与暂停
    isMusicPlay: false,
    // 当前选择的歌曲id
    selectsongid:"",
     // ------------------------------以下皆有默认值-----------------
    // 当前选择的歌曲名
    selectsingername: [{name:'华语群星'}],
    // 歌曲标题
    selectsongTitle:'华语群星 - 云水禅心 (古筝版)',
    // 歌曲mid
    selectsongmidid:'',
    // 歌曲logo
    picUrl:'/images/logo_18.jpg',
    // 歌曲地址
    selectsongUrl:'./music/华语群星 - 云水禅心 (古筝版).mp3',
    musicList:[
     { 
      index: 0,
      selectsongid:'',
      selectsongTitle:'华语群星 - 云水禅心 (古筝版)',
      selectsongmidid:'',
      selectsingername:[{name:'华语群星'}]
    }
    ],
    // 当前播放歌曲索引
    currentIndex:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.globalData.innerAudioContext = wx.createInnerAudioContext()
    this.globalData.innerAudioContext.loop = false
    this.globalData.innerAudioContext.autoplay = false
    this.globalData.innerAudioContext.onPause(() => {
      console.log('暂停')
    })
    this.globalData.innerAudioContext.onStop(()=>{
      console.log('暂停');
      this.globalData.duration = 0;
      this.globalData.currentTime = 0;
      this.globalData.percent = 0;
    });
    this.globalData.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    });
    this.globalData.innerAudioContext.onPlay(() => {
      console.log('开始播放')
      var timer = setTimeout(()=>{
        this.globalData.innerAudioContext.onTimeUpdate(()=>{
          const currentTime = this.globalData.innerAudioContext.currentTime;
          const duration = this.globalData.innerAudioContext.duration;
          // console.log(currentTime / duration)
          this.globalData.duration = this._formatTime(duration),
          this.globalData.currentTime = this._formatTime(currentTime),
          this.globalData.percent = (currentTime / duration) * 100
        });
      },1000)
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
})