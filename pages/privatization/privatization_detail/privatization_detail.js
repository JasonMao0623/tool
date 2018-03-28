var datas=require("../../../utils/testdata/taskdata.js")
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
    var array = ['', '', '', ''];
    var top_index = options.index;
    array[top_index] = true
    this.setData({
      topindex: array
    })
    this.setData({
      datas:datas.datas,
      note_num: datas.datas.note_data.length,
      now_num: datas.datas.now_data.length,
      wait_num: datas.datas.wait_data.length,
      need_num: datas.datas.need_data.length,
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
  onShow: function (option) {
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
  onTopBarTap:function(e){
    var array=['','','',''];
    var top_index = e.currentTarget.dataset.index;
    array[top_index]=true
    this.setData({
      topindex: array
    })
  },
  onTaskTap:function(e){
    wx.navigateTo({
      url: '../task_detail/task_detail',
    })
  },
  onAddTap: function () {
    var is_display = this.data.is_display;
    this.setData({
      is_display: !is_display
    })
  }
})