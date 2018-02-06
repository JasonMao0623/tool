var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //图片点击事件
  onLoginTap:function(){
  },
  //获取用户信息事件
  getUser:function(){
    var that =this;
    var avatarUrl="/image/tingyun/user-logo.png"
    app.checkLoginStatus();
    wx.getUserInfo({
      success: function (res) {
        avatarUrl = res.userInfo.avatarUrl;
        var name = res.userInfo.nickName;
        var obj={
          "name":name,
          "avatarUrl": avatarUrl
        };
        that.setData({
          "userLogo":avatarUrl
        })
      },
    })
  },
  onIntoTap: function (e) {
    var tag = e.currentTarget.dataset.tag;
    console.log(tag);
    var url = '/pages/tingyun/tingyun_' + tag + '/tingyun_' + tag +'?tag='+tag;
    wx.navigateTo({
      url: url
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
    this.getUser();
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