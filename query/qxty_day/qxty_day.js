import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    legend: {
      data: ['2015', '2016','2017'],
    },
    dataSet:{},
    xAxis: {
      type: 'category',
      data: ['A', 'B', 'C', 'D']
    },
    yAxis: {},
    series: [{
        type: 'bar',
        label: {
          normal: {
            show: true
          }
        }
      },
      {
        type: 'bar',
        label: {
          normal: {
            show: true
          }
        }
      },
      {
        type: 'bar',
        label: {
          normal: {
            show: true
          }
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
};

Page({
  onShareAppMessage: function(res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },

  onLoad: function(options) {},
});