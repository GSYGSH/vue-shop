<template>
  <div class="users">
    <main-layout>
      <template #title> 用户管理 </template>
      <template #title2> 用户列表 </template>
      <template #default>
        <div>
          <el-row :gutter="10">
            <!-- 搜索框 -->
            <el-col :span="8">
              <el-input placeholder="请输入内容" class="input-with-select" v-model="params.query" clearable @clear='getUserList'>
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <!-- 添加按钮 -->
              <el-button type="primary" @click="addFormDialog"
                >添加用户</el-button
              >
            </el-col>
          </el-row>
          <!-- content -->
          <el-table :data="userList" border style="width: 100%" stripe>
            <el-table-column
              type="index"
              label="序号"
              width="50px"
            ></el-table-column>
            <el-table-column prop="username" label="用户名" width="180px">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180px">
            </el-table-column>
            <el-table-column prop="mobile" label="号码" width='180px'> </el-table-column>
            <el-table-column prop="role_name" label="角色" min-width='180px'> </el-table-column>
            <el-table-column prop="mg_state" label="状态" width="300px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="editFormDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" @click="deleteUserDialog(scope.row.id)"
                  >删除</el-button
                >
                <el-button size="mini" type="warning" @click="addRoleDialog(scope.row)">分配角色</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页功能 -->
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
          <!-- 添加用户对话框 -->
          <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%">
            <el-form
              ref="addUserForm"
              :model="addUserForm"
              label-width="80px"
              :rules="addFormRules"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addUserForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="addUserForm.password"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUserForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="addUserForm.mobile"></el-input>
              </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogClose">取 消</el-button>
              <el-button type="primary" @click="addDialogSubmit"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <!-- 编辑用户对话框 -->
          <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%">
            <el-form
              ref="editUserForm"
              :model="editUserForm"
              label-width="80px"
              :rules="addFormRules"
            >
              <el-form-item label="用户ID">
                <el-input v-model="editUserForm.id" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editUserForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="editUserForm.mobile"></el-input>
              </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogClose">取 消</el-button>
              <el-button type="primary" @click="editDialogSubmit"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <!-- 删除用户对话框 -->
          <el-dialog
            title="删除"
            :visible.sync="deleteDialogVisible"
            width="50%"
          >
            <span>是否删除该用户</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deleteDialogClose">取 消</el-button>
              <el-button type="primary" @click="deleteDialogSubmit"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <!-- 添加角色 -->
          <el-dialog
            title="分配角色"
            :visible.sync="addRoleDialogVisible"
            width="50%"
          >
          <el-form  >
            <el-form-item label='当前用户:'>
              {{addRoleForm.username}}
            </el-form-item>            
            <el-form-item label='当前角色:'>
              {{addRoleForm.role_name}}
            </el-form-item>            
            <el-form-item label='分配角色'>
              <el-select v-model="addRoleForm.rid" placeholder="请选择">
                <el-option
                  v-for="item in roleOption"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>                  
            </el-form-item>

          </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addRoleDialogClose">取 消</el-button>
              <el-button type="primary" @click="addRoleDialogSubmit"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </div>
      </template>
    </main-layout>
  </div>
</template>

<script>
import MainLayout from "@/components/common/MainLayout.vue";
export default {
  components: {
    MainLayout,
  },
  data() {
    let emailValidate = (rule, value, callback) => {
      const reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
      if (value === "") {
        return callback(new Error("请输入邮箱"));
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确邮箱格式"));
      }
    };
    let mobileValidate = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value === "") {
        return callback(new Error("请输入手机号"));
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入合法手机号"));
      }
    };
    return {
      /* 请求数据相关 */
      userList: [],
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      /* 对话框 */
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible:false,
      addRoleDialogVisible:false,
      /* 添加用户数据 */
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [{ validator: emailValidate, trigger: "blur" }],
        mobile: [{ validator: mobileValidate, trigger: "blur" }],
      },
      /* 编辑用户数据 */
      editUserForm: {
        id: "",
        email: "",
        mobile: "",
      },
      /* 删除用户 */
      deleteID:'',
      /* 分配角色 */
      addRoleForm:{
        id:'',
        rid:'',
        role_name:'',
        username:'',
      },
      roleOption:[]
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.params,
      });
      if (res.meta.status !== 200) {
        return this.$mes.error(res.meta.mes);
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
      }
    },
    /* 处理分页 */
    handleSizeChange(newsize) {
      this.params.pagesize = newsize;
      this.getUserList();
    },
    handleCurrentChange(newpage) {
      this.params.pagenum = newpage;
      this.getUserList();
    },
    /* 添加表单操作 */
    addFormDialog() {
      this.addDialogVisible = true;
    },
    addDialogClose() {
      this.$refs.addUserForm.resetFields();
      this.addDialogVisible = false;
    },
    addDialogSubmit() {
      this.$refs.addUserForm.validate(async (valid) => {
        if (!valid) {
          return this.$mes.error("请按要求填写表单");
        } else {
          const { data: res } = await this.$http.post(
            "users",
            this.addUserForm
          );
          if (res.meta.status !== 201) {
            return this.$mes.error(res.meta.msg);
          } else {
            this.$mes.success(res.meta.msg);
            this.getUserList();
            this.$refs.addUserForm.resetFields();
            this.addDialogVisible = false;
          }
        }
      });
    },
    /* 编辑用户操作 */
    editFormDialog(row) {
      for (let k in row) {
        for (let key in this.editUserForm) {
          if (k === key) {
            this.editUserForm[key] = row[k];
          }
        }
      }
      this.editDialogVisible = true;
    },
    editDialogClose() {
      this.$refs.editUserForm.resetFields();
      this.editDialogVisible = false;
    },
    editDialogSubmit() {
      this.$refs.editUserForm.validate(async (valid) => {
        if (!valid) {
          return this.$mes.error("请按要求填写表单");
        } else {
          const { data: res } = await this.$http.put(
            `users/${this.editUserForm.id}`,
            this.editUserForm
          );
          if (res.meta.status !== 200) {
            return this.$mes.error(res.meta.msg);
          } else {
            this.$mes.success(res.meta.msg);
            this.getUserList();
            this.$refs.editUserForm.resetFields();
            this.editDialogVisible = false;
          }
        }
      });
    },
    /* 删除用户操作 */
    deleteUserDialog(id){
        console.log(id);
        this.deleteID = id
        this.deleteDialogVisible = true
    },
    deleteDialogClose(){
        this.deleteDialogVisible = false
        this.deleteID = ''
        this.$mes.info('已取消操作')
    },
    async deleteDialogSubmit() {
        const {data:res} = await this.$http.delete(`users/${this.deleteID}`,{id:this.deleteID})
        if (res.meta.status !== 200) {
            return this.$mes.error(res.meta.msg);
          } else {
            this.$mes.success(res.meta.msg);
            this.getUserList();
            this.deleteDialogVisible = false;
          }
    },
    /* 添加角色 */
    async addRoleDialog(row){
      let {data:res} = await this.$http.get(`roles`)
      if(res.meta.status !== 200){
        this.$mes.error(res.meta.msg)
      }else{
        console.log(res);
        this.roleOption = res.data
      }
      
      for(let k in row){
        for(let key in this.addRoleForm){
          if(k === key){
            this.addRoleForm[key] = row[k]
          }
        }
      }
      this.addRoleDialogVisible = true
    },
    addRoleDialogClose(){
      this.addDialogVisible = false
    },
    async addRoleDialogSubmit(){
      let {data:res} = await this.$http.put(`users/${this.addRoleForm.id}/role`,this.addRoleForm)
      console.log(res);
      if(res.meta.status !== 200){
        this.$mes.error(res.meta.msg)
      }else{
        for(let k in this.addRoleForm){
          this.addRoleForm[k] = ''
        }
        this.$mes.success(res.meta.msg)
        this.getUserList()
        this.addRoleDialogVisible = false
      }
    }
    
  },
};
</script>

<style scoped lang='less'>
.el-row {
  margin-bottom: 20px;
}
.el-table {
  margin-bottom: 20px;
}
</style>