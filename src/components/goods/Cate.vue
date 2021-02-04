<template>
  <main-layout>
      <template #title>
          商品管理
      </template>
      <template #title2>
          商品分类
      </template>
      <template #default>
          <div>
              <el-button type='primary' class="addBtn" @click="addDialogVisible = true">添加分类</el-button>
              <el-table :data='cateList' border stripe :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="cat_id" :indent='50' >
                <el-table-column type='index' label='序号' width='80px'></el-table-column>
                  <el-table-column prop='cat_name' label='分类名称' width='300px'></el-table-column>
                  <el-table-column  label='是否有效'>
                      <template slot-scope='scope'>
                          <i class="el-icon-circle-check icon-color" v-if="scope.row.cat_deleted === false"></i>
                          <i class="el-icon-circle-close icon-color" v-else></i>
                      </template>
                  </el-table-column>
                  <el-table-column prop='cat_level' label='排序'>
                      <template slot-scope='scope'>
                          <el-tag v-if="scope.row.cat_level === 0" type='primary' size='mini'>一级</el-tag>
                          <el-tag v-else-if="scope.row.cat_level === 1" type='success' size='mini'>二级</el-tag>
                          <el-tag v-else type='warning' size='mini'>三级</el-tag>
                      </template>
                  </el-table-column>
                  <el-table-column  label='操作' width='200px'>
                      <template slot-scope='scope'>
                          <el-button type='primary' size='mini' @click="editDialog(scope.row)">编辑</el-button>
                          <el-button type='danger' size='mini' @click="deleteCate(scope.row.cat_id)">删除</el-button>
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
              <!-- 添加分类 -->
                <el-dialog
                title="提示"
                :visible.sync="addDialogVisible"
                width="50%"
                >
                <el-form :model='addForm' :rules='addRules' ref="addForm">
                    <el-form-item prop='cat_name' label='分类名'>
                        <el-input v-model="addForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-cascader
                            class="el-cascader"
                            v-model="checkValue"
                            :options="cateList"
                            :props="{ expandTrigger: 'hover',label:'cat_name',children:'children',value:'cat_id',checkStrictly: true }"
                            clearable  ></el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogClose">取 消</el-button>
                    <el-button type="primary" @click="addDialogSubmit">确 定</el-button>
                </span>
                </el-dialog>
                <!-- 编辑分类 -->
                <el-dialog
                title="提示"
                :visible.sync="editDialogVisible"
                width="50%"
                >
                <el-form :model='editForm' :rules='addRules' ref="editForm">
                    <el-form-item prop='cat_name' label='分类名'>
                        <el-input v-model="editForm.cat_name"></el-input>
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
export default {
    components:{
        MainLayout
    },
    created(){
        this.getCateList()
    },
    data(){
        return {
            cateList:[],
            params:{
                type:3,
                pagenum:1,
                pagesize:10
            },
            total:0,
            /* 弹框 */
            addDialogVisible:false,
            editDialogVisible:false,
            /* 添加分类 */
            addForm:{
                cat_pid:'',
                cat_name:'',
                cat_level:''
            },
            addRules:{
                cat_name:[
                    { required: true, message: "请输入分类名", trigger: "blur" },
                    {
                        min: 3,
                        max: 10,
                        message: "长度在 3 到 10 个字符",
                        trigger: "blur",
                    },
                ]
            },
            checkValue:[],
            /* 编辑分类 */
            editForm:{
                cat_id:'',
                cat_name:''
            }

        }
    },
    methods:{
        async getCateList(){
            let {data:res} = await this.$http.get(`categories`,{
                params:this.params
            })
            if(res.meta.status !== 200){
                this.$mes.error(res.meta.msg)
            }else{
                console.log(res);
                this.cateList = res.data.result
                this.total = res.data.total
            }
        },
        /* 分页 */
        handleSizeChange(newsize){
            this.params.pagesize = newsize
            this.getCateList()
        },
        handleCurrentChange(newpage){
            this.params.pagenum = newpage
            this.getCateList()
        },
        /* 添加分类 */
        addDialogClose(){
            this.$refs.addForm.resetFields()
            this.checkValue = []
            this.addDialogVisible = false
        },
        addDialogSubmit(){
            this.$refs.addForm.validate(async valid =>{
                if(!valid){
                    this.$mes.error('请按要求填写表单')
                }else{
                    if( this.checkValue.length == 3){
                        this.$mes.error('请选择一二级分类')
                    }else{
                        if(this.checkValue.length === 1){
                            this.addForm.cat_pid = this.checkValue[0]
                            this.addForm.cat_level = 1
                        }else if(this.checkValue.length == 0){
                            this.addForm.cat_pid = 0
                            this.addForm.cat_level = 0
                        }else{
                            this.addForm.cat_pid = this.checkValue[1]
                            this.addForm.cat_level = 2
                        }
                        console.log(this.checkValue);
                        let {data:res} = await this.$http.post(`categories`,this.addForm)
                        if(res.meta.status !== 201){
                            this.$mes.error(res.meta.msg)
                        }else{
                            this.getCateList()
                            this.$refs.addForm.resetFields()
                            this.checkValue = []
                            this.addDialogVisible = false
                            this.$mes.success(res.meta.msg)
                        }
                    }
                }

                
            })
        },
        /* 编辑分类 */
        editDialog(row){
            console.log(row);
            for(let k in row){
                for(let key in this.editForm){
                    if(k === key){
                        this.editForm[key] = row[k]
                    }
                }
            }
            this.editDialogVisible = true
        },
        editDialogClose(){
            this.$refs.editForm.resetFields()
            this.editDialogVisible = false
        },
        editDialogSubmit(){
            this.$refs.editForm.validate(async valid =>{
                if(!valid){
                    this.$mes.error('请按要求填写表单')
                }else{
                    let {data:res} = await this.$http.put(`categories/${this.editForm.cat_id}`,this.editForm)
                    if(res.meta.status !== 200){
                        this.$mes.error(res.meta.msg)
                    }else{
                        this.$mes.success(res.meta.msg)
                        this.editDialogVisible = false
                        this.$refs.editForm.resetFields()
                        this.getCateList()
                    }
                }
            })
        },
        deleteCate(id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
            const {data:res} = await this.$http.delete(`categories/${id}`)
            if(res.meta.status !== 200){
                this.$mes.error(res.meta.msg)
            }else{
                this.$mes.success(res.meta.msg)
                this.getCateList()
            }
            }).catch(() => {
            this.$mes({
                type: 'info',
                message: '已取消删除'
            });          
            });
        }



    }
}
</script>

<style lang='less' scoped>
.addBtn{
    margin-bottom:20px
}
.icon-color{
    color:#67C23A;
    font-size: 16px;
}
.el-cascader{
    width: 100%;
}
.el-table{
    margin-bottom:20px
}
</style>