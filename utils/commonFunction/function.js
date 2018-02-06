var app =getApp();
var  status = app.login["status"];
if (!status){
  wx.showModal({
    title: '注意',
    content: '请允许用户授权',
  })
}