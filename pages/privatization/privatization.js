// pages/privatization/privatization.js
var datas = require("../../utils/testdata/taskdata.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first_tab: true,
    second_tab: false,
    title_name: "我的任务",
    is_display:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var workbench_config = [
      {
        img_src: "/images/siyouhua/note.png",
        name: "我的笔记",
        num: datas.datas.note_data.length,
        category: 0,
        id: "0"
      },
      {
        img_src: "/images/siyouhua/now.png",
        name: "正在执行的任务",
        num: datas.datas.now_data.length,
        category: 0,
        id: "1"
      },
      {
        img_src: "/images/siyouhua/wait.png",
        name: "等待执行的任务",
        num: datas.datas.wait_data.length,
        category: 0,
        id: "2"
      },
      {
        img_src: "/images/siyouhua/need.png",
        name: "需我跟踪",
        num: datas.datas.need_data.length,
        category: 0,
        id: "3"
      },
    ]
    this.setData({
      workbench_config: workbench_config
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
  onTopTabTap: function (e) {
    var tapName = e.target.dataset.tapname;
    switch (tapName) {
      case "workbench":
        this.setData({
          first_tab: true,
          second_tab: false,
          title_name: "我的任务",
        })
        break;
      case "project":
        this.setData({
          first_tab: false,
          second_tab: true,
          title_name: "个人空间"
        });
        var array = [
          {
            img_src: "/images/siyouhua/wait.png",
            name: "pmp",
            project_id: 0,
            category:1,
            id:0
          },
          {
            img_src: "/images/siyouhua/note.png",
            name: "快速体验",
            project_id: 1,
            category:1,
            id:1
          }
        ];
        this.setData({
          projects: array
        })
    }
  },
  onLineTap: function (event) {
    var category = event.currentTarget.dataset.category;
    var id = event.currentTarget.dataset.id;
    if (!category) {
      wx.navigateTo({
        url: '/pages/privatization/privatization_detail/privatization_detail?index=' + id
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/privatization/project/project?id=' + id,
      })
    }
  },
  onAddTap:function(){
    var is_display = this.data.is_display;
    this.setData({
      is_display: !is_display
    })
  },
  onCreateProjectTap:function(){
    wx.navigateTo({
      url: '/pages/privatization/create_project/create_project',
    })
  }
})