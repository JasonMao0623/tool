//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
  },
  onLoad: function () {
  },
  //进入工具箱tap事件
  onTap:function(){
    //console.log('123');
    wx.switchTab({
      url: "/pages/privatization/privatization",
    })
  }
})
