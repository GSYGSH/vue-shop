<template>
  <main-layout>
    <template #title> 数据统计 </template>
    <template #title2> 数据报表 </template>
    <template #default>
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" style="width: 750px; height: 400px"></div>
    </template>
  </main-layout>
</template>

<script>
import MainLayout from "@/components/common/MainLayout.vue";
import * as echarts from 'echarts';
export default {
  components: {
    MainLayout,
  },
  created() {},
  async mounted() {
        /* 获取数据 */
        let {data:res} = await this.$http.get(`reports/type/1`)
        if(res.meta.status !== 200){
            this.$mes.error(res.meta.msg)
            return false
        }else{
            console.log(res);


            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            
            /* 绘制图表，合并选项 */
            const result = Object.assign(this.options,res.data)
            console.log(result);
            result.xAxis[0].boundaryGap = false


            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(result);                 
        }

 
  },
  data() {
    return {
        /* 需要合并的数据 */
        options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
};
</script>

<style>
</style>