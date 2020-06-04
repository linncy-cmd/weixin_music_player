// pages/hostSingList/hostSingList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面logo
    logoSrc:'',
    // 该组所有歌
    songList:[]
  },

  toPlaylist:function(e) {
    // console.log(e)
    app.globalData.selectsongid = e.currentTarget.dataset.songinfo.songid
    app.globalData.selectsingername = e.currentTarget.dataset.songinfo.singer
    app.globalData.selectsongTitle = e.currentTarget.dataset.songinfo.songname
    app.globalData.selectsongmidid = e.currentTarget.dataset.songinfo.songmid
    app.globalData.currentIndex = e.currentTarget.dataset.index
    app.globalData.duration = 0
    wx.switchTab({
      url: '/pages/item/item'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(app.globalData.selectsongGound)
      this.getGoundData()
  },
  getGoundData: function () {
    const _that = this;
    const groupId = app.globalData.selectsongGound
    wx.request({
       // g_tk 为歌组号
      url: `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=${groupId}&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5&jsonpCallback=jp1`,

      success:function(res) {
        var res2 = _that.getObject(res);
        // console.log(res2)
        // 设置页面标题
        wx.setNavigationBarTitle({
          title: res2.topinfo.ListName,
        });
        // console.log(res2.songlist);
        _that.setData({
          logoSrc:res2.topinfo.MacDetailPicUrl,
          songList:res2.songlist
        });
        // 获取歌单数据
        app.globalData.musicList = _that.getMusicList(res2.songlist);
        
      }
    });
  },
  // 把返回来的字符串处理成对象
  getObject: function (res) {
    var res1 = res.data.replace("jp1(", "")
    var res2 = JSON.parse(res1.substring(0,res1.length-1))
    return res2;  
  },
  // 处理播放歌单列表
  getMusicList:function(arr) {
    var result = [];
    arr.forEach((item,index)=>{
      let obj = {
        index: index,
        selectsongid:item.data.songid,
        selectsongTitle:item.data.songname,
        selectsongmidid:item.data.songmid,
        selectsingername:item.data.singer
      }
      result.push(obj)
    })
    return result;
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

  }
})