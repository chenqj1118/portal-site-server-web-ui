var echarts =require('..');

window.doTest = function(){
  /*--------------------test1 柱状图*/
          var test0 = document.getElementById('test0');
          // 指定图表的配置项和数据
          var option = {
            title: {
              text: 'ECharts 柱状图示例'  /*标题可以指定副标题subtext，可以指定对齐方式*/
            },
            tooltip: {}, /*提示框组件*/
            legend: {/*图例组件*/
              data:['销量']
            },
            xAxis: { /*X轴*/
              data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},/*Y轴*/
            series: [{ /*数据信息*/
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }]
          };
          // 使用刚指定的配置项和数据显示图表。
          echarts.showcharts(test0,option);

  /*----------------------饼状图*/
    var test1 = document.getElementById('test1');
    var     option1 = {
          title : {
            text: '某站点用户访问来源----饼状图实例',
            subtext: '纯属虚构',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
          },
          series : [
            {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

      echarts.showcharts(test1,option1);
  /*----------------test2：折线图*/
}













