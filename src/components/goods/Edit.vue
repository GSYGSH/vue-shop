<template>
  <main-layout>
      <template #title>
        商品管理
      </template>
      <template #title2>
        编辑商品
      </template>
      <template #default>
          <div>
            <el-alert
                title="请按顺序依次填写"
                type="warning"
                show-icon
                center>
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="1000" :active="tabsNum - 0" finish-status="success" align-center >
                <el-step title="基本信息" icon="el-icon-edit"></el-step>
                <el-step title="商品参数" icon='el-icon-price-tag'></el-step>
                <el-step title="商品属性" icon='el-icon-discount'></el-step>
                <el-step title="商品照片" icon='el-icon-picture-outline'></el-step>
                <el-step title="商品内容" icon='el-icon-tickets'></el-step>
                <el-step title="完成" icon='el-icon-circle-check'></el-step>
            </el-steps>
            <!-- tabs -->
            <el-form :model='editForm' :rules='editRules' ref="editForm">
                <el-tabs tab-position="left" style="height: 100%;" v-model="tabsNum" @tab-click='tabsClick' :before-leave='tabsLeave'>
                    <el-tab-pane label="基本信息" name='0'>
                            <el-form-item label='商品名称' prop='goods_name'>
                                <el-input v-model="editForm.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label='商品价格(元)' prop='goods_price'>
                                <el-input v-model="editForm.goods_price" type='number'></el-input>
                            </el-form-item>
                            <el-form-item label='商品重量(g)' prop='goods_weight'>
                                <el-input v-model="editForm.goods_weight" type='number'></el-input>
                            </el-form-item>
                            <el-form-item label='商品数量' prop='goods_number'>
                                <el-input v-model="editForm.goods_number" type='number'></el-input>
                            </el-form-item>
                            <el-form-item label='商品分类'>
                                <br>
                                <el-cascader
                                    v-model="checkValue"
                                    :options="cateList"
                                    :props="{ expandTrigger: 'hover',children:'children',label:'cat_name',value:'cat_id' }"
                                    clearable
                                    >
                                </el-cascader>
                            </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name='1'>
                        <div v-for="item in manyList" :key="item.attr_id">
                            <div class="paramsTitle">{{item.attr_name}}</div>
                            <el-checkbox-group v-model="item.attr_vals" >
                                <el-checkbox v-for='item2 in item.attr_vals' :label="item2" :key='item2' border size="small"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name='2'>
                        <el-form-item
                        v-for="item in onlyList"
                        :key="item.attr_id"
                        :label="item.attr_name"
                        >
                        <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品照片" name='3'>
                        <el-upload
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :headers='headerObj'
                        list-type="picture"
                        :on-success='handleSuccess'>
                        <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name='4'>
                          <quill-editor v-model="editForm.goods_introduce"/>
                          <el-button class="editBtn" type='primary' @click="editGoodsForm">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <el-dialog
            title="图片预览"
            :visible.sync="previewDialogVisible"
            width="50%"
            @close='previewClose'>
            <img :src="imgUrl" alt="" style="width:100%">
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
            /* 级联选择器 */
            checkValue:[],
            /* 添加表单 */
            editForm:{
                goods_name:'',
                goods_cat:'',
                goods_price:'',
                goods_weight:'',
                goods_number:'',
                goods_introduce:'',
                pics:[],
                attrs:[]
            },
            editRules:{
                goods_name: [
                    { required: true, message: "请输入商品名称", trigger: "blur" },
                    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
                ],
                goods_price: [
                    { required: true, message: "请输入商品价格", trigger: "blur" },
                ],
                goods_weight: [
                    { required: true, message: "请输入商品重量", trigger: "blur" },
                ],
                goods_number: [
                    { required: true, message: "请输入商品数量", trigger: "blur" },
                ],  
            },
            tabsNum:'',
            /* 商品动态参数和静态属性 */
            manyList:[],
            onlyList:[],
            /* 图片上传地址 */
            uploadURL:this.$http.defaults.baseURL + 'upload',
            headerObj:{ Authorization: window.sessionStorage.getItem("token") },
            previewDialogVisible:false,
            imgUrl:'',

        }
    },
    computed:{
        cateID(){
            return Number(this.checkValue[this.checkValue.length - 1])
        }
    },
    methods:{
        async getCateList(){
            let {data:res} = await this.$http.get(`categories`)
            if(res.meta.status !== 200){
                this.$mes.error(res.meta.msg)
            }else{
                this.cateList = res.data
                console.log(res);
            }
        },
        tabsLeave(activeName,oldActiveName){
            if(oldActiveName === '0'&& this.checkValue.length !== 3){
                this.$mes.error("请选择三级分类")
                return false;
            }
            if(activeName === '0'){

            }else if(activeName == Number(oldActiveName) + 1 || activeName < oldActiveName){

            }else{
                this.$mes.error('请按顺序依次填写')
                return false;
            }
        },
        async tabsClick(){
                if(this.tabsNum === '1'){
                    /* 请求商品参数 */
                    let {data:res} = await this.$http.get(`categories/${this.cateID}/attributes`,{
                        params:{sel:'many'}
                    })
                    if(res.meta.status !== 200){
                        this.$mes.error(res.meta.msg)
                    }else{
                        res.data.forEach(item =>{
                            if(item.attr_vals !== ''){
                                item.attr_vals = item.attr_vals.split(',')
                            }
                        })
                        this.manyList = res.data
                        console.log(res);
                    }
                }else if(this.tabsNum === '2'){
                    /* 请求商品属性 */
                    let {data:res} = await this.$http.get(`categories/${this.cateID}/attributes`,{
                        params:{sel:'only'}
                    })
                    if(res.meta.status !== 200){
                        this.$mes.error(res.meta.msg)
                    }else{
/*                         res.data.forEach(item =>{
                            if(item.attr_vals !== ''){
                                item.attr_vals = item.attr_vals.split(',')
                            }
                        }) */
                        this.onlyList = res.data
                        console.log(res);
                    }
                } 
        },
        /* 图片上传处理 */
        handlePreview(file){
            this.imgUrl = file.url
            this.previewDialogVisible = true
        },
        handleRemove(file){
            /* 找到pics图片位置 */
            let i = this.editForm.pics.findIndex(item=>{
                return item['pic'] === file.tmp_path
            })
            /* 去除 */
            this.editForm.pics.splice(i,1)
        },
        handleSuccess(res){
            console.log(res);
            let picsInfo = { pics:res.data.tmp_path }
            this.editForm.pics.push(picsInfo)
        },
        previewClose(){
            this.previewDialogVisible = false
            this.imgUrl = ''
        },
        editGoodsForm(){
            this.$refs.editForm.validate(async valid =>{
                if(!valid){
                    this.$mes.error('请按要求填写信息')
                }else{
                    /* 处理goods_cat */
                    this.editForm.goods_cat = this.checkValue.join()
                    console.log(this.manyList);
                    /* 处理attrs */
                    this.manyList.forEach(item=>{
                            if(item.attr_vals === ''){

                            }else{
                                let attr = {
                                    'attr_id':item.attr_id,
                                    'attr_value':item.attr_vals.join(),
                                }
                                this.editForm.attrs.push(attr)
                            }
                    })

                    this.onlyList.forEach(item=>{
                        if(item.attr_vals === ''){

                        }else{
                            let attr = {
                                'attr_id':item.attr_id,
                                'attr_value':item.attr_vals
                            }
                            this.editForm.attrs.push(attr)
                        }
                    })
                 
                    let {data:res} = await this.$http.post(`goods`,this.editForm)
                    if(res.meta.status !== 201){
                        this.$mes.error(res.meta.msg)
                    }else{
                        this.$mes.success(res.meta.msg)
                        this.$refs.editForm.resetFields();
                        this.editForm.goods_cat = ''
                        this.checkValue = []
                        this.$router.push({path:'/goods'})
                    }
                }
            })
        }

    }
}
</script>

<style  lang='less' scoped>
.paramsTitle{
    font-weight: 600;
    color: #666;
}
.el-checkbox-group{
    margin: 10px 0;
    .el-checkbox{
        margin: 5px 5px 5px 10px;
    }
}
.editBtn{
    margin-top: 10px;
}
</style>