<template>
  <div class="wel">
      <main-layout>
        <template #title>
          welcome
        </template>
        <template #title2>
          <div></div>
        </template>
        <template #default>
          <div class="wel-box">
            <div class="left">
              <h1>欢迎回来</h1>
              <span>项目基于vue + Element-UI + eCharts + Axios + less</span>
            </div>
            <div class="echarts right" ref="echarts_box">

            </div>
          </div>
        </template>
      </main-layout>
  </div>
</template>

<script>
import MainLayout from "@/components/common/MainLayout.vue";
import * as echarts from 'echarts';
export default {
  components:{
    MainLayout
  },
  data(){
    return {
      myChart:null,
      cateData:[],
      currentIndex:0,
      timerID:null
    }
  },
  destroyed() {
    clearInterval(this.timerID)
    window.removeEventListener('resize',this.resize)
  },
  async mounted(){
    this.myChart = echarts.init(this.$refs.echarts_box)
    this.myChart.showLoading() 
    await this.getCateData()
    this.myChart.hideLoading()
    let option = {
      title:{
        text:this.cateTitle,
        right:5,
        bottom:5,
        textStyle:{
          color:'#666'
        }
      },
      series:[
        {
          type:'pie',
          roseType:'radius',
          center:['50%','50%']
        }
      ]
    }
    this.myChart.setOption(option)
    this.updateChart()
     this.echartMove()
     window.addEventListener('resize',this.resize)
  },
  computed:{
    cateTitle(){
      return this.cateData[this.currentIndex].cat_name
    }
  },
  methods:{
    updateChart(){
      let legendArr = this.cateData[this.currentIndex].children.map(item=>{
        return item.cat_name
      })
      let optionArr = this.cateData[this.currentIndex].children.map(item=>{
        return {
          name:item.cat_name,
          value:item.children.length,
          children:item.children
        }
      })

      let updateOption = {
        title:{
          text:`商品分类:${this.cateTitle}`
        },
        legend:{
          data:legendArr
        },
        series:[
          {
            data:optionArr,
            emphasis:{
              label:{
                formatter:(arg)=>{
                  return `包含${arg.value}个三级分类\n\n占比${arg.percent}%`
                },
                fontWeight:'bold',
                color:'#666'
              }
            }
          }
        ]
      }
      this.myChart.setOption(updateOption)
      this.myChart.on('mouseover',()=>{
        clearInterval(this.timerID)
      })
      this.myChart.on('mouseout',()=>{
        this.echartMove()
      })
    },
    async getCateData(){
      const {data:ret} = await this.$http.get(`categories`)
      this.cateData = ret.data

    },
    echartMove(){
      if(this.timerID){
        clearInterval(this.timerID)
      }
      this.timerID = setInterval(() => {
        this.currentIndex++
        if(this.currentIndex > this.cateData.length){
          this.currentIndex = 0
        }
          this.updateChart()
      }, 2000);
    },
    resize(){
      this.myChart.resize()
    }

  }
}
</script>

<style scoped lang='less'>
h2{
    color:#333;
    margin: 0;
    padding: 0;
}
.wel-box{
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: space-evenly;
    div{
      background-color: #eee;
      border-radius:20px;
    }
    .left{
      width: 50%;
      margin-right:20px;
      text-align: center;
      padding-top: 150px;
    }
    .right{
      width: 50%;
      height: 100%;
    }
}
</style>