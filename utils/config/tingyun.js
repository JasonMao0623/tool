var config = [
  {
    "url": "https://route.showapi.com/1346-2",
    "appid": "44635",
    "sign":"96b6f3a2e6b641da9ca890fb9014cf28",
  }
];
var chartObj = {};
chartObj.server = [
  {
    id: "application-webaction-topn",
    name: '最耗时WEB应用过程'
  },
  {
    id: "application-external-topn",
    name: '最耗时外部应用操作'
  },
  {
    id: "application-database-topn",
    name: '最耗时SQL操作'
  },
];
chartObj.network = [
  {
    id: "locationByTime",
    name: '城市性能曲线图'
  },
  {
    id: "compPerfByTime",
    name: '性能指标历史曲线图'
  },
  {
    id: "perfByTime",
    name: '性能历史曲线图'
  },
  {
    id: "componentsByTask",
    name: '汇总概况图'
  },
  {
    id: "cdnPerfByHostSummary",
    name: '主机分布性能汇总图'
  },
  {
    id: "errorTypeByTask",
    name: '错误概况图'
  },
];
chartObj.app = [
  {
    id: "mobile-application-performance",
    name: '应用响应时间'
  },
  {
    id: "mobile-application-device",
    name: '活跃设备数'
  },
  {
    id: "mobile-application-top-host-performance",
    name: '最慢主机性能曲线图'
  },
  {
    id: "mobile-application-top-host-http-error",
    name: '主机 HTTP 错误'
  },
  {
    id: "mobile-application-crash-percent",
    name: '崩溃数据汇总'
  },
  {
    id: "mobile-application-crash-app-version-percent",
    name: 'TOP5崩溃最多版本'
  },
  {
    id: "mobile-application-top-isp-performance",
    name: '运营商性能'
  },
  {
    id: "mobile-application-top-interaction-performance",
    name: '最慢应用交互性能'
  },
];
chartObj.browser = [
  {
    id: "browser-page-load-time",
    name: '页面加载分解图'
  },
  {
    id: "browser-pv-total",
    name: '访问量统计图'
  },
];
module.exports = {
  tyConfig: config,
  chartObj:chartObj
}