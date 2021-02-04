<template>
  <main-layout>
      <template #title> 
          商品管理
      </template>
      <template #title2>
          商品列表
      </template>
      <template #default>
          <div>
              <el-row :gutter='10'>
                  <el-col :span='8'>
                      <el-input placeholder="请输入内容" v-model="params.query" class="input-with-select" clearable @clear='getGoodsList()'>
                      <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
                      </el-input>
                  </el-col>
                  <el-col :span='4'>
                      <el-button type='primary' class="addBtn" @click="addGoods">添加商品</el-button>
                  </el-col>
              </el-row>
              <el-table :data='goodsList' border stripe>
                  <el-table-column type='index' label='序号' width='50px'></el-table-column>
                  <el-table-column  label='商品名称' prop='goods_name' min-width='700px'></el-table-column>
                  <el-table-column  label='商品价格' prop='goods_price' width='150px'></el-table-column>
                  <el-table-column  label='商品重量' prop='goods_weight' width='150px'></el-table-column>
                  <el-table-column  label='创建时间' width='200px'>
                      <template slot-scope='scope'>
                          {{scope.row.add_time | dateFormat}}
                      </template>
                  </el-table-column>
                  <el-table-column  label='操作' width='300px'>
                      <template slot-scope='scope'>
                          <div>
                              <el-button type='primary' size='mini' @click="editGoods">编辑</el-button>
                              <el-button type='danger' size='mini' @click="deleteGoods(scope.row.goods_id)">删除</el-button>
                          </div>
                      </template>
                  </el-table-column>
              </el-table>
              <!-- 分页 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="params.pagenum"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="params.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    background>
                </el-pagination> 
          </div>
      </template>
  </main-layout>
</template>

<script>
import MainLayout from "@/components/common/MainLayout.vue";
export default {    
    components:{
        MainLayout
    },
    data(){
        return {
            goodsList:[],
            params:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        async getGoodsList(){
            let {data:res} = await this.$http.get('goods',{
                params:this.params
            })
            if(res.meta.status !== 200){
                this.$mes.error(res.meta.msg)
            }else{
                this.goodsList = res.data.goods
                this.total = res.data.total
                console.log(res);
            }
        },
        handleSizeChange(newSize){
            this.params.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage){
            this.params.pagenum = newPage
            this.getGoodsList()
        },
        addGoods(){
            /* this.$router.push('/goods/add') */
        },
        editGoods(){
            this.$router.push('/goods/edit')
        },
        deleteGoods(id){
            this.$confirm('是否删除删除商品,是否继续?','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).then(async ()=>{
                let {data:res} = await this.$http.delete(`goods/${id}`)
                if(res.meta.status !== 200){
                    this.$mes.error(res.meta.msg)
                }else{
                    this.$mes.success(res.meta.msg)
                    this.getGoodsList()
                }
            }).catch(()=>{
                this.$mes.info('已取消删除')
            })
        },
    }
}
</script>

<style lang='less' scoped>
.addBtn{
    margin-bottom: 20px;
}
.el-table{
    margin-bottom: 20px;
}
</style>