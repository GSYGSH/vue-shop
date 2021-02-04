<template>
  <main-layout>
      <template #title>
          订单管理
      </template>
      <template #title2>
          订单列表
      </template>
      <template #default>
          <div>
          <el-row :gutter="10">
            <!-- 搜索框 -->
            <el-col :span="8">
              <el-input placeholder="请输入内容" class="input-with-select" v-model="params.query" clearable @clear='getOrdersList()'>
                <el-button slot="append" icon="el-icon-search" @click="getOrdersList()"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <!-- table -->
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column label="序号" type="index" width="50px">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="220px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_price" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width='300px'>
          <template slot-scope="scope" >
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width='300px'>
          <template>
            <el-button
              type="primary"
              size="mini"
              class="el-icon-edit"
              @click="editDialog"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              class="el-icon-location-outline"
              @click="addressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
      <!-- 编辑对话框 -->
        <el-dialog
        title="修改地址"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form :model='editForm' :rules='editRules' label-width='100px'>
            <el-form-item label='省市区/县' prop='address1'>
                <el-cascader
                    v-model="editForm.address1"
                    :options="city"
                    :props="{ expandTrigger: 'hover',label:'label',children:'children' }"
                    @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label='详细地址' prop='address2'>
                <el-input v-model="editForm.address2"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogClose">取 消</el-button>
            <el-button type="primary" @click="editDialogSubmit">确 定</el-button>
        </span>
        </el-dialog>
          </div>
      </template>
  </main-layout>
</template>

<script>
import MainLayout from "@/components/common/MainLayout.vue";
import city from '@/components/orders/citydata.js'
export default {
    components:{
        MainLayout
    },
    created(){
        this.getOrdersList()
    },
    data(){
        return{
            ordersList:[],
            params:{
                query:'',
                pagenum:1,
                pagesize:10,
            },
            total:0,
            /* 编辑 */
            editDialogVisible:false,
            editForm:{
                address1:[],
                address2:''
            },
            editRules:{
                address1: [
                { required: true, message: "请选择省市区县", trigger: "blur" },
                ],
                address2: [
                { required: true, message: "请填写详细地址", trigger: "blur" },
                ],
            },
            city,
        }
    },
    methods:{
        async getOrdersList(){
            let {data:res} = await this.$http.get(`orders`,{
                params:this.params
            })
            if(res.meta.status !== 200){
                this.$mes.error(res.meta.msg)
            }else{
                this.ordersList = res.data.goods
                this.total = res.data.total
                console.log(res);
            }
        },
        handleSizeChange(newSize){
            this.params.pagesize = newSize
            this.getOrdersList()
        },
        handleCurrentChange(newPage){
            this.params.pagenum = newPage
            this.getOrdersList()
        },
        editDialog(){
            this.editDialogVisible = true
        },
        editDialogClose(){
            this.editDialogVisible = false
        },
        editDialogSubmit(){
            this.$mes.success('编辑成功')
            this.editDialogVisible = false
        },
        handleChange(){

        },
        addressDialog(){

        },

    }

}
</script>

<style scoped lang='less'>
.el-table{
    margin-top: 20px;
}
.el-pagination{
    margin-top: 20px;
}
</style>