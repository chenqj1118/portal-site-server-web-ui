"use strict";
/* The implementations */
/** Define the export point for module */

var echarts =require('echarts');
/*定义一个方法，通过传参数引用组件*/
var showcharts=function(chartsid,option){
    var myChart = echarts.init(chartsid);
    myChart.setOption(option);
}
module.exports = {
    showcharts: showcharts
}

