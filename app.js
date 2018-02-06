//app.js
App({
  onLaunch: function() {
    this.getUser();
  },
  getTime: function () {
    //获取本地时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    month = this.processTime(month);
    strDate = this.processTime(strDate);
    hour = this.processTime(hour);
    minutes = this.processTime(minutes);
    seconds = this.processTime(seconds);
    var day = year + seperator1 + month + seperator1 + strDate;
    var time = hour + seperator2 + minutes + seperator2 + seconds;
    //console.log(time);
    var dateObj={};
    dateObj.day=day;
    dateObj.time=time;
    return dateObj;
  },
  //时间处理事件,个位数前面加0
  processTime: function (value) {
    if (value >= 0 && value <= 9) {
      return "0" + value;
    } else {
      return value;
    }
  },
  //excel表格生成函数
  excelHttp: function (configData,title, rows, cateGory, callBack) {
    var config = configData[0];
    var url = config.url;
    var appid = config.appid;
    var sign = config.sign;
    var urlArray = wx.getStorageSync("urlArray");
    if (!urlArray) {
      urlArray = [];
    }
    wx.request({
      url: url,
      data: {
        showapi_appid: appid,
        showapi_sign: sign,
        title: title,
        rows: rows,
        base64File: false
      },
      success: function (res) {
        //console.log(res);
        callBack(res, cateGory, urlArray);
      }
    })
  },
  //获取用户信息，并且将用户信息添加到全局变量
  getUser: function () {
    var obj={};
    var that =this;
    wx.getUserInfo({
    })
  },
  checkLoginStatus:function(){
    var that =this;
    wx.getSetting({ 
      success:function(res){
        if (!res.authSetting["scope.userInfo"]){
          wx.showModal({
            title: '注意',
            content: '请授予用户信息权限',
            success:function(res){
              wx.openSetting();
            }
          })
        }
      }
    })
  },
})
