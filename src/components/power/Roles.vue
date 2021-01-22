<template>
  <main-layout>
    <template #title> 角色管理 </template>
    <template #title2> 角色列表 </template>
    <template #default>
      <div>
        <el-button type="primary" class="addUserBtn" @click="addDialogVisible = true">添加角色</el-button>
        <el-table border stripe :data="rolesList">
          <el-table-column type="expand">
              <!-- tag标签展开项 -->
            <template slot-scope="scope">
              <el-row :gutter="10" v-for="item in scope.row.children" :key="item.id" class="vcenter">
                <!-- 一级菜单 -->
                <el-col :span="5">
                  <el-tag>{{ item.authName }}</el-tag>
                  <span class="el-icon-caret-right"></span>
                </el-col>
                <!-- 二三级菜单 -->
                <el-col :span='19'>
                  <el-row :gutter="10" v-for="item2 in item.children" :key='item2.id' class="vcenter">
                    <!-- 二级菜单 -->
                    <el-col :span="6">
                        <el-tag type='success'>{{item2.authName}}</el-tag>
                        <span class="el-icon-caret-right"></span>
                    </el-col>
                    <!-- 三级菜单 -->
                    <el-col :span="18">
                        <el-tag v-for="item3 in item2.children" :key='item3.id' type='warning' class="tag3" closable  @close="tagClose(scope.row,item3)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="50px">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column prop="" label="操作">
              <template  slot-scope='scope'>
                  <el-button type='primary' size='mini' @click="editDialog(scope.row)">编辑</el-button>
                  <el-button type='danger' size='mini' @click="deleteRole(scope.row)">删除</el-button>
                  <el-button type='warning' size='mini' @click="roleDialog(scope.row)">分配权限</el-button>
              </template>
          </el-table-column>
        </el-table>
        <!-- 添加角色对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="50%">
        <el-form ref="addRoleForm" :model="addRoleForm" label-width="80px" :rules='addRolesRules'>
          <el-form-item label="角色名称" prop='roleName'>
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop='roleDesc'>
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogClose">取 消</el-button>
            <el-button type="primary" @click="addDialogSubmit">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 编辑角色对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form ref="editRoleForm" :model="editRoleForm" label-width="80px" :rules='addRolesRules'>
          <el-form-item label="角色ID" >
            <el-input v-model="editRoleForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input v-model="editRoleForm.roleName" prop='roleName'></el-input>
          </el-form-item>
          <el-form-item label="角色描述" >
            <el-input v-model="editRoleForm.roleDesc" prop='roleDesc'></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogClose">取 消</el-button>
            <el-button type="primary" @click="editDialogSubmit">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog
          title="提示"
          :visible.sync="roleDialogVisible"
          width="50%">
          <el-tree :data="rightsTree" :props="treeProps" @node-click="nodeClick" show-checkbox default-expand-all node-key='id' :default-checked-keys='defaultCheckedID' ref="roleRightsTree">

          </el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="roleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="disRole">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </template>
  </main-layout>
</template>

<script>
import MainLayout from "@/components/common/MainLayout.vue";
export default {
  data() {
    return {
      rolesList: [],
      rightsList:[],
      rightsID:null,
      /* 对话框显示隐藏 */
      addDialogVisible:false,
      editDialogVisible:false,
      roleDialogVisible:false,

      /* 添加角色 */
      addRoleForm:{
        roleName:'',
        roleDesc:''
      },
      addRolesRules:{
        roleName:[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc:[
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
      },
      /* 编辑角色 */
      editRoleForm:{
        id:'',
        roleName:'',
        roleDesc:''
      },
      /* 分配角色 */
      rightsTree:[],
      treeProps:{
        label:'authName',
        children:'children'
      },
      defaultCheckedID:[],
      roleID:''
    };
  },
  components: {
    MainLayout,
  },
  created() {
    this.getRolesList();
    this.getRightsList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$mes.error(res.meta.msg);
      } else {
        this.rolesList = res.data;
      }
    },
    async getRightsList() {
      let { data: res } = await this.$http.get(`rights/list`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.rightsList = res.data;
      /* 权限树 */
      let { data: res2 } = await this.$http.get(`rights/tree`);
      if (res2.meta.status !== 200) {
        return this.$message.error(res2.meta.msg);
      }
      this.rightsTree = res2.data;
    },
    /* 删除标签 */
    async tagClose(row,item3){
        let rightsList = this.rightsList
        console.log(row);

        /* 获取rightsID */
        for(let i in rightsList){
            for(let k in rightsList[i]){
                let obj = rightsList[i]
                if(item3.authName === obj[k]){
                    this.rightsID = obj.id
                    console.log(this.rightsID);
                }
            }
        }
        const {data:res} = await this.$http.delete(`roles/${row.id}/rights/${this.rightsID}`)
        if(res.meta.status !== 200){
            this.$mes.error(res.meta.msg)
        }else{
            console.log(res);
            this.$mes.success(res.meta.msg)
            /* this.rolesList[3].children = res.data */
            row.children = res.data
        }
        
    },
    /* 添加角色操作 */
    addDialogClose(){
      this.$refs.addRoleForm.resetFields()
      this.addDialogVisible = false
    },
    addDialogSubmit(){
      this.$refs.addRoleForm.validate(async valid=>{
        if(!valid){
          this.$mes.error('请按要求填写表单')
        }else{
          const {data:res} = await this.$http.post(`roles`,this.addRoleForm)
          if(res.meta.status !== 201){
            this.$mes.error(res.meta.msg)
          }else{
            this.addDialogVisible = false
            this.$refs.addRoleForm.resetFields()
            this.$mes.success(res.meta.msg)
            this.getRolesList()
            console.log(res);
          }
        }
      })  
    },
    /* 编辑角色操作 */
    editDialog(row){
      console.log(row);
      for(let k in row){
        for(let key in this.editRoleForm){
          if(k === key){
            this.editRoleForm[key] = row[k]
          }
        }
      }
      this.editDialogVisible = true
    },
    editDialogClose(){
      this.$refs.editRoleForm.resetFields()
      this.editDialogVisible = false
    },
    editDialogSubmit(){
      this.$refs.editRoleForm.validate(async valid=>{
        if(!valid){
          this.$mes.error('请按要求填写表单')
        }else{
          const {data:res} = await this.$http.put(`roles/${this.editRoleForm.id}`,this.editRoleForm)
          if(res.meta.status !== 200){
            this.$mes.error(res.meta.msg)
          }else{
            this.editDialogVisible = false
            this.$refs.editRoleForm.resetFields()
            this.$mes.success(res.meta.msg)
            this.getRolesList()
          }
        }
      }) 
    },
    /* 删除角色操作 */
    deleteRole(row){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`roles/${row.id}`)
          if(res.meta.status !== 200){
            this.$mes.error(res.meta.msg)
          }else{
            this.$mes.success(res.meta.msg)
            this.getRolesList()
          }
        }).catch(() => {
          this.$mes({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    /* 分配角色 */
    roleDialog(row){
      this.getRolesList()
      let {children:role} = row
      role.forEach(item=>{
        item.children.forEach(item2=>{
          item2.children.forEach(item3=>{
            this.defaultCheckedID.push(item3.id)
          })
        })
      })
      this.roleID=row.id
      this.roleDialogVisible = true
    },
    nodeClick(data){

    },
    async disRole(){
      let arr = []
      /* 获取所有三级key节点和半选节点 */
      let checkedKey = arr.concat(this.$refs.roleRightsTree.getHalfCheckedKeys(),this.$refs.roleRightsTree.getCheckedKeys())
      let checkedKeyStr = checkedKey.join(',')
      let {data:res}  = await this.$http.post(`roles/${this.roleID}/rights`,{rids:checkedKeyStr})
      if(res.meta.status !== 200){
        this.$mes.error(res.meta.msg)
      }else{
        this.roleID = ''
        this.defaultCheckedID = []
        this.roleDialogVisible = false
        this.$mes.success(res.meta.msg)
        this.getRolesList()
      }
      

    }
  },
};
</script>

<style lang='less' scoped>
.addUserBtn {
  margin-bottom: 20px;
}
.el-table{
    min-width: 1500px;
    .vcenter{
    display: flex;
    align-items: center;
    margin: 10px;
    .tag3{
        margin: 0 5px;
    }
}
}

</style>