// pages/privatization/privatization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first_tab:true,
    second_tab: false,
    title_name: "我的任务",
    workbench_config:[
      {
        img_src:"/images/siyouhua/note.png",
        name:"我的笔记",
        num:"0",
        desc:"note"
      },
      {
        img_src: "/images/siyouhua/now.png",
        name: "正在执行的任务",
        num: "0",
        desc:"now"
      },
      {
        img_src: "/images/siyouhua/wait.png",
        name: "等待执行的任务",
        num: "0",
        desc: "wait"
      },
      {
        img_src: "/images/siyouhua/need.png",
        name: "需我跟踪",
        num: "0",
        desc: "need"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
          title_name:"个人空间"
        });
        var array=[
          {
            img_src: "/images/siyouhua/wait.png",
            name: "pmp",
            num: "",
            desc:"pmp"
          },
          {
            img_src: "/images/siyouhua/note.png",
            name: "快速体验",
            num: "",
            desc: "ksty"
          }
        ];
        this.setData({
          projects:array
        })
    }
  }
})