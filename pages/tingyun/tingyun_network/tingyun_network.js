// pages/tingyun/tingyun.js
var app=getApp();
var tyConfig = require("../../../utils/config/tingyun.js");
var configData = tyConfig.tyConfig;
var httpProperties = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    isCheckExist: "display",
    isHisExist: "nodisplay"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app);
    var tag = options.tag;
    var charts = this.switchFunction(tag);
    this.setData({
      charts: charts
    })
    httpProperties.chartId = "application-webaction-topn";
    var date=app.getTime()
    this.setData({
      time: date.time,
      date: date.day
    })
  },
  //switch函数
  switchFunction: function (tag) {
    var chartObj = tyConfig.chartObj;
    switch (tag) {
      case "server":
        return chartObj.server;
        break;
      case "network":
        return chartObj.network;
        break;
      case "app":
        return chartObj.app;
        break;
      case "browser":
        return chartObj.browser;
        break;
    }
  },
  //日期选择绑定事件
  bindDateChange: function (e) {
    //console.log(e);
    var day = e.detail.value;
    this.setData({
      date: day
    })
  },
  //时间选择绑定事件
  bindTimeChange: function (e) {
    //console.log(e);
    var time = e.detail.value + ":" + "00";
    this.setData({
      time: time
    })
  },
  //用户id输入事件
  onUserIdConfirm: function (e) {
    var value = e.detail.value;
    httpProperties.accountId = value;
    this.propertyListen();
    //console.log(httpProperties);
  },
  //授权码输入事件
  onAuthKeyConfirm: function (e) {
    var value = e.detail.value;
    httpProperties.authKeyId = value;
    this.propertyListen();
    //console.log(httpProperties);
  },
  //应用id输入事件
  onAppIdConfirm: function (e) {
    var value = e.detail.value;
    httpProperties.appId = value;
    this.propertyListen();
    //console.log(httpProperties);
  },
  //图表ID输入事件
  bindChartChange: function (e) {
    var value = e.detail.value;
    this.setData({
      index: value
    })
    httpProperties.chartId = this.data.charts[value].id;
    this.propertyListen();
    console.log(httpProperties);
  },
  //时间段输入事件
  onPeriodConfirm: function (e) {
    var value = e.detail.value;
    httpProperties.period = value;
    this.propertyListen();
    //console.log(httpProperties);
  },
  //全局属性监听事件
  propertyListen: function () {
    if (httpProperties.accountId && httpProperties.authKeyId && httpProperties.appId && httpProperties.chartId) {
      this.setData({
        className: "blue"
      })
    } else {
      this.setData({
        className: ""
      })
    }
  },
  //立即生成按钮点击事件
  onButtonTap: function (e) {
    var className = this.data.className;
    if (className == "blue") {
      this.processUrl();
      //发起网络请求
    } else {
      wx.showModal({
        title: '提醒',
        content: '带*的是必填项哦',
      })
    }
  },
  //url处理函数
  processUrl: function () {
    var url = 'https://api.tingyun.com/server/latest/accounts/';
    url = url + httpProperties.accountId + "/application/" + httpProperties.appId + "/charts/" + httpProperties.chartId + ".json";
    this.httpFunction(url);
  },
  //http请求函数
  httpFunction: function (url) {
    var property = wx.getStorageSync("property");
    var that = this;
    var date = this.data.date + " " + this.data.time;
    var period = httpProperties.period;
    if (!httpProperties.period) {
      period = 0;
    }
    httpProperties.date = date;
    httpProperties.period = period;
    //由于对象比较是根据该对象所占的内存情况比较的所及相对复杂
    //该方法利用将对象转换成字符串的方式进行比较
    var str1 = JSON.stringify(property);
    var str2 = JSON.stringify(httpProperties);
    //判断接口是否调用，避免接口滥用 
    if (str1 == str2) {
      wx.showModal({
        title: '提醒',
        content: '该数据已生成，请到历史列表查看',
      })
    } else {
      wx.request({
        url: url,
        data: {
          "timePeriod": period,
          "endTime": date
        },
        header: {
          'X-Auth-Key': httpProperties.authKeyId,
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          //console.log(res);
          if (res.statusCode == 200) {
            //调用数据处理函数
            that.processData(res);
            wx.setStorageSync("property", httpProperties);
          } else {
            wx.showModal({
              title: '提醒',
              content: '请正确输入查询信息',
            })
          }
        },
        fail: function () {
          console.log("调用失败")
        }
      })
    }
  },
  //数据处理函数
  processData: function (res) {
    var head = res.data.chart.dataset[0].head;
    var data = res.data.chart.dataset[0].data[0];
    var cateGory = head.categories[0].name;
    var serieses = head.serieses;
    //获取事务名称函数
    var affairArray = [];
    for (var i = 0; i < serieses.length; i++) {
      var seriese = serieses[i].name;
      affairArray.push(seriese)
    };
    //调用计算平均值函数
    var avgTimeArray = [];
    var chartId = httpProperties.chartId;
    //console.log(data);
    if (data.length == 0) {
      wx.showModal({
        title: '注意',
        content: '数据为空，时间段再选长点呗',
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      switch (chartId) {
        case "application-webaction-topn":
          avgTimeArray = this.avgSumProcess(data, 2);
          break;
        case "application-external-topn":
          avgTimeArray = this.avgSumProcess(data, 1);
          break;
        case "application-database-topn":
          avgTimeArray = this.avgSumProcess(data, 1);
          break;
      }
    }
    console.log(avgTimeArray);
    this.processArray(cateGory, affairArray, avgTimeArray);
  },
  //计算平均值函数,并返回平均值数组
  avgSumProcess: function (data, num) {
    var avgTimeArray = [];
    //console.log(data);
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var timeSum = 0;
      var avgTime = 0;
      //console.log(dataItem);
      for (var x = 0; x < dataItem.length; x++) {
        var timeArray = dataItem[x];
        //数组判空
        if (!timeArray[num]) {
          timeArray[num] = 0;
        }
        var time = timeArray[num];
        timeSum = timeSum + time;
        avgTime = timeSum / dataItem.length;
        avgTime = avgTime.toFixed(3).toString() + "秒";
        avgTimeArray.push(avgTime);
      }
      return avgTimeArray;
    };
  },
  //将处理的数据在处理
  processArray: function (cateGory, name, data) {
    var rows = [];
    var title = ["来源", "对应网址/接口/错误", "类型", "响应时间/错误率"];
    for (var index in name) {
      var row = [];
      row.push(cateGory);
      row.push(name[index]);
      row.push("响应慢");
      row.push(data[index]);
      rows.push(row);
    };
    console.log("rows");
    console.log(rows);
    app.excelHttp(configData,title,rows,cateGory,this.callBack);
  },
  //回调函数
  //来源app.js
  callBack: function (res, cateGory, urlArray){
    console.log(res);
    wx.hideLoading();
    var urlObj = {};
    var excelUrl = res.data.showapi_res_body.url;
    urlObj.name = cateGory;
    urlObj.url = excelUrl;
    urlArray.unshift(urlObj);
    wx.setStorageSync("urlArray", urlArray);
  },
  //历史点击事件
  onHisTap: function () {
    this.setData({
      isCheckExist: "nodisplay",
      isHisExist: "display"
    })
    var array = wx.getStorageSync("urlArray");
    this.setData({
      his: array,
    })
  },
  //XX关闭事件
  onOffTap: function () {
    this.setData({
      isCheckExist: "display",
      isHisExist: "nodisplay"
    })
  },
  //点击帮助事件
  onHelpTap: function () {
    var cnt = "https://www.kancloud.cn/mjjpipi/tingyun/395259";
    wx.showModal({
      title: "打开网页",
      content: cnt,
      complete: function () {
        wx.setClipboardData({
          data: cnt,
        });
        wx.showToast({
          title: '已复制',
        })
      }
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
  }
})