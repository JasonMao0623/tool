// pages/tingyun/tingyun.js
var app = getApp();
var tyConfig = require("../../../utils/config/tingyun.js");
var configData = tyConfig.tyConfig;
var httpProperties = {};
var rowsArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    isCheckExist: "display",
    isHisExist: "nodisplay",
    isFirst: true
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
    httpProperties.chartId = "browser-page-load-time";
    var date = app.getTime()
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
    var url = 'https://api.tingyun.com/browser/latest/accounts/';
    var url = url + httpProperties.accountId + "/browser/application/" + httpProperties.appId + "/charts/" + httpProperties.chartId + ".json";
    //var url2 = url + httpProperties.accountId + "/browser/application/" + httpProperties.appId + "/charts/" + "browser-pv-total" + ".json";
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
        content: '该数据已添加',
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
    console.log(res);
    var head = res.data.chart.dataset[0].head;
    var data = res.data.chart.dataset[0].data[0];
    var cateGory = head.categories[0].name;
    var oldAppId = this.data.appId;
    var row = [];
    this.setData(
      { isFirst: true }
    )
    if (httpProperties.appId == oldAppId) {
      this.setData(
        { isFirst: false }
      )
      row = this.data.row;
      if (!row) {
        row = [];
      }
    }
    //data数据处理函数
    var avgSumTimeArray = [];
    var pv = {};
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
      if (httpProperties.chartId == "browser-page-load-time") {
        avgSumTimeArray = this.avgSumProcess(data, 0);
        row[4] = avgSumTimeArray;
        row[0] = cateGory;
        this.setData({
          row: row
        })
        var isFirst=this.data.isFirst;
        if(!isFirst){
          rowsArray.push(this.data.row);
          this.setData({
            rowsArray:rowsArray
          })
        }
      } else if (httpProperties.chartId == "browser-pv-total") {
        pv = this.pvProcess(data);
        console.log(pv);
        row[1] = pv.pvTotal;
        row[2] = pv.max;
        row[3] = pv.min;
        this.setData({
          row: row
        })
        var isFirst = this.data.isFirst;
        if (!isFirst) {
          rowsArray.push(this.data.row);
          this.setData({
            rowsArray: rowsArray
          });
        }
      }
      this.setData({
        appId: httpProperties.appId
      });
      wx.hideLoading();
      wx.showToast({
        title: '添加成功',
      })
      console.log(rowsArray);
    }
    //this.processArray(cateGory,avgSumTimeArray,pv);
  },
  //pv处理函数
  pvProcess: function (data) {
    var truePvArray = data[0];
    var pv = {};
    var pvTotal = 0;
    var pvArray = [];
    //计算pv总量
    for (var i in truePvArray) {
      var truePv = truePvArray[i][0];
      pvTotal = pvTotal + truePv;
      pvArray.push(truePv);
    }
    //计算pv的最大值和最小值
    var max = pvArray[0];
    var min = pvArray[0];
    for (var j in pvArray) {
      if (max < pvArray[j]) {
        max = pvArray[j]
      }
      if (min > pvArray[j]) {
        min = pvArray[j]
      }
    };
    pv.pvTotal = pvTotal;
    pv.max = max;
    pv.min = min;
    return pv;
  },
  //计算平均下载时间函数,并返回平均值数组
  avgSumProcess: function (data, num) {
    var dataItem = data[0];
    var sumTimeArray = [];
    var totalTime = 0;
    for (var i = 0; i < dataItem.length; i++) {
      var time = dataItem[i];
      var sumTime = 0;
      for (var j = 0; j < time.length; j++) {
        sumTime = sumTime + time[j];
      }
      sumTimeArray.push(sumTime);
    };
    for (var a = 0; a < sumTimeArray.length; a++) {
      totalTime = totalTime + sumTimeArray[a];
    }
    var avgTime = totalTime / sumTimeArray.length;
    avgTime = avgTime.toFixed(3).toString() + "秒";
    return avgTime;
  },
  //将处理的数据在处理
  processArray: function (cateGory, avgSumTimeArray, pv) {
    // var row = [];
    // var title = ["活动名称", "周总访问量", "周最大访问量", "周最小访问量","平均响应时间"];
    // row[0]=cateGory;
    // row[1] = pv.pvTotal?pv.pvToal:"";
    // row[2]=pv.max?pv.max:"";
    // row[3]=pv.min?pv.min:"";
    // row[4]=avgSumTimeArray;
    // rowsArray.push(row);
    // console.log("rows");
    // console.log(rows);
    //app.excelHttp(configData, title, rows, cateGory, this.callBack);
  },
  //回调函数
  //来源app.js
  callBack: function (res, cateGory, urlArray) {
    console.log(res);
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
  onCreateTap:function(){
    var rows = this.data.rowsArray;
    var rowsOld=wx.getStorageInfoSync("rowsOld")
    var title = ["活动名称", "周总访问量", "周最大访问量", "周最小访问量", "平均响应时间"];
    if(rows){
      if(rows==rowsOld){
        wx.showModal({
          title: '提醒',
          content: '数据已生成，青岛历史列表查看',
        })
      }else{
        app.excelHttp(configData, title, rows, this.data.time, this.callBack);
        wx.setStorageSync("rowsOld", rows)
      }
    }else{
      wx.showModal({
        title: '提醒',
        content: '请先点击右侧+号，添加图表',
      })
    }
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