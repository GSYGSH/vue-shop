<template>
  <main-layout>
      <template #title>
          商品管理
      </template>
      <template #title2>
          分类参数
      </template>
      <template #default>
          <div>
            <el-alert
                title="注意！只允许第三级分类设置相关参数"
                type="warning"
                show-icon>
            </el-alert>
            <el-row>
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                        v-model="checkValue"
                        :options="cateList"
                        :props="{ expandTrigger: 'hover',label:'cat_name',children:'children',value:'cat_id' }"
                        @change="checkChange">
                    </el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="params.attr_sel" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type='primary' :disabled='checkValue.length === 0' @click="addDialogVisible = true">动态参数</el-button>
                    <el-table :data='paramsList' border stripe >
                        <el-table-column type='expand'>
                            <template slot-scope='scope'>
                                <div>
                                    <el-tag
                                    :key="item" v-for="item in scope.row.attr_vals" closable :disable-transitions="false" @close="tagsClose(scope.row,item)" class="tags">
                                    {{item}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+添加</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column type='index' label='序号' width='50px' > 
                        </el-table-column>
                        <el-table-column prop='attr_name' label='参数名称'  > 
                        </el-table-column>
                        <el-table-column  label='操作' width='300px'> 
                            <template slot-scope='scope'>
                                <el-button type='primary' size='mini' @click='editDialog(scope.row)'>编辑</el-button>
                                <el-button type='danger' size='mini' @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button type='primary' :disabled='checkValue.length === 0' @click="addDialogVisible = true">静态属性</el-button>
                    <el-table :data='paramsList' border stripe >
                        <el-table-column type='expand'>
                            <template slot-scope='scope'>
                                <div>
                                    <el-tag
                                    :key="item" v-for="item in scope.row.attr_vals" closable :disable-transitions="false" @close="tagsClose(scope.row,item)" class="tags">
                                    {{item}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+添加</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column type='index' label='序号' width='50px' > 
                        </el-table-column>
                        <el-table-column prop='attr_name' label='属性名称'  > 
                        </el-table-column>
                        <el-table-column  label='操作' width='300px'> 
                            <template slot-scope='scope'>
                                <el-button type='primary' size='mini' @click='editDialog(scope.row)'>编辑</el-button>
                                <el-button type='danger' size='mini' @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
                    <!-- 添加Params弹框 -->
                        <el-dialog
                        title="提示"
                        :visible.sync="addDialogVisible"
                        width="50%">
                        <el-form :model='addParamsForm' label-width="80px" ref="addForm" :rules='addRules'>
                            <el-form-item label='参数名称' prop='attr_name'>
                                <el-input v-model="addParamsForm.attr_name"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="addDialogClose">取 消</el-button>
                            <el-button type="primary" @click="addDialogSubmit">确 定</el-button>
                        </span>
                        </el-dialog>
                    <!-- 编辑Params弹框 -->
                        <el-dialog
                        title="提示"
                        :visible.sync="editDialogVisible"
                        width="50%">
                        <el-form :model='editParamsForm' label-width="80px" ref="editForm" :rules='addRules'>
                            <el-form-item label='参数名称' prop='attr_name'>
                                <el-input v-model="editParamsForm.attr_name"></el-input>
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
        return{
            cateList:[],
            paramsList:[],
            /* 级联选择器分类ID */
            checkValue:[],
            /* 请求参数 */
            params:{
                cateID:'',
                attr_sel:'many',
                attr_name:'',
                attr_vals:''
            },
            /* 添加Params */
            addDialogVisible:false,
            addParamsForm:{
                attr_name:'',
                attr_sel:'',
                attr_vals:''
            },
            addRules:{
                attr_name:[
                    { required: true, message: "请输入分类名", trigger: "blur" },
                    {min: 3,max: 10,message: "长度在 3 到 10 个字符",trigger: "blur"},
                ]
            },
            /* 编辑Params */
            editDialogVisible:false,
            editParamsForm:{
                attr_id:'',
                attr_name:'',
                attr_sel:'',
            }

            
        }
    },
    methods:{
        /* 获取Params */
        async getParamsList(){
            if(this.checkValue.length !== 3 ){
                this.$mes.error('只允许第三级分类设置相关参数')
                this.checkValue = []
            }else{
                let id = this.checkValue[this.checkValue.length - 1 ]
                console.log(id);
                let {data:res} = await this.$http.get(`categories/${id}/attributes`,{
                    params:{sel:this.params.attr_sel}
                })
                if(res.meta.status !== 200){
                    this.$mes.error(res.meta.msg)
                }else{
                    this.paramsList = res.data
                    res.data.forEach((item,index)=>{
                        for(let k  in item){
                            if(k === 'attr_vals'){
                            
                                /* 内部添加要 绑定的值和显示隐藏值 */
                                if(item[k] === ''){
                                    this.$set(this.paramsList[index],'attr_vals',[])
                                }else{
                                    this.$set(this.paramsList[index],'attr_vals',item[k].split(','))
                                }
                                this.$set(this.paramsList[index],'inputVisible',false)
                                this.$set(this.paramsList[index],'inputValue','')
                                /* this.paramsList.forEach(i =>{}) */
                                /* this.paramsList[index].inputVisible = false                                
                                this.paramsList[index].inputValue = '' */
                            }
                        }

                    })
                    console.log(this.paramsList);
                }
            }   

            
        },
        async getCateList(){
            let {data:res} = await this.$http.get(`categories`)
            if(res.meta.status !== 200){
                this.$mes.error(res.meta.msg)
            }else{
                this.cateList = res.data
                console.log(res);
                
            }
        },
        /* 级联选择器三级选项 */
        checkChange(){
            this.getParamsList()
        },
        /* Tabs切换 */
        handleTabsClick(){
            this.getParamsList()
        },
        /* 处理动态属性标签 */
        async tagsClose(row,item){
            let id = this.checkValue[this.checkValue.length -1]
            row.attr_vals.splice(row.attr_vals.indexOf(item),1)
            let vals = row.attr_vals.join()

            let {data:res} = await this.$http.put(`categories/${id}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:vals
            })
            if(res.meta.status !== 200){
                console.log(res);
                this.$mes.error(res.meta.msg)
            }else{
                this.$mes.success(res.meta.msg)
            }
        },
        async handleInputConfirm(row){
            let i = row.attr_vals.find(item => item === row.inputValue)
            if(i){
                this.$mes.error('请勿添加重复属性')
            }else{
                if(row.inputValue.trim().length === 0){
                    return;
                }else{
                    let newValue = row.inputValue
                    /* 将数组转换成字符串 */
                    row.attr_vals.push(newValue)
                    let vals = row.attr_vals.join()

                    let id = this.checkValue[this.checkValue.length -1]
                    let {data:res} = await this.$http.put(`categories/${id}/attributes/${row.attr_id}`,{
                        attr_name:row.attr_name,
                        attr_sel:row.attr_sel,
                        attr_vals:vals
                    })
                    if(res.meta.status !== 200){
                        this.$mes.error(res.meta.msg)
                    }else{
                        this.$mes.success(res.meta.msg)
                        row.inputValue = ''
                        row.inputVisible = false
                    }
                }   
            }
       
        },
        showInput(row){
            console.log(row);
            row.inputVisible = true
            this.$nextTick(()=>{
                 this.$refs.saveTagInput.$refs.input.focus();
            })
        },
        /* 添加参数 */
        addDialogClose(){
            this.$refs.addForm.resetFields()
            this.addDialogVisible = false
        },
        addDialogSubmit(){
            this.$refs.addForm.validate(async valid=>{
                if(!valid){
                    this.$mes.error('请按要求填写表单')
                }else{
                    /* 获取分类id和attr_sel */
                    let id = this.checkValue[this.checkValue.length - 1]
                    this.addParamsForm.attr_sel = this.params.attr_sel

                    let {data:res} = await this.$http.post(`categories/${id}/attributes`,this.addParamsForm)
                    if(res.meta.status !== 201){
                        this.$mes.error(res.meta.msg)
                    }else{
                        this.$mes.success(res.meta.msg)
                        this.getParamsList()
                        this.addDialogVisible = false
                        this.$refs.addForm.resetFields()
                    }
                }
            })
        },
        /* 编辑参数 */
        editDialog(row){
            for(let k in row){
                for(let key in this.editParamsForm){
                    if(k === key){
                        this.editParamsForm[key] = row[k]
                    }
                }
            }
            this.editDialogVisible = true
        },
        editDialogClose(){
            this.$refs.editForm.resetFields()
            this.editDialogVisible = false
        },
        editDialogSubmit(row){
            this.$refs.editForm.validate(async valid=>{
                if(!valid){
                    this.$mes.error('请按要求填写表单')
                }else{
                    let id = this.checkValue[this.checkValue.length - 1]
                    let {data:res} = await this.$http.put(`categories/${id}/attributes/${this.editParamsForm.attr_id}`,this.editParamsForm)
                    if(res.meta.status !== 200){
                        this.$mes.error(res.meta.msg)
                    }else{
                        this.$mes.success(res.meta.msg)
                        this.getParamsList()
                        this.editDialogVisible = false
                        this.$refs.editForm.resetFields()
                    }
                }
            })
        },
        /* 删除参数 */
        deleteParams(row){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).then(async ()=>{
                let id = this.checkValue[this.checkValue.length - 1]
                let {data:res} = await this.$http.delete(`categories/${id}/attributes/${row.attr_id}`)
                if(res.meta.status !== 200){
                    this.$mes.error(res.meta.msg)
                }else{
                    this.$mes.success(res.meta.msg)
                    this.getParamsList()
                }
            }).catch(()=>{
                this.$mes.info('已取消操作')
            })
        }
    },
}
</script>

<style lang='less' scoped>
.el-alert{
    margin-bottom: 20px;
}
.el-row{
    margin-bottom:20px
}
.el-button{
    margin-bottom:20px
}
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .tags{
      margin: 5px;
  }
</style>