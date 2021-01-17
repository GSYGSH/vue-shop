<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="login_avatar">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginForm"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            type="password"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- button -->
        <el-form-item class="button">
          <el-button type="primary" @click="formSubmit()">登陆</el-button>
          <el-button type="info" @click="formReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入名称", trigger: "blur" },
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
      },
    };
  },
  methods:{
      formReset(){
          this.$refs.loginForm.resetFields()
      },
      formSubmit(){
          this.$refs.loginForm.validate(async valid=>{
              if(!valid) return alert('登陆失败')
              const {data:res} = await this.$http.post('login',this.loginForm)
              if(res.meta.status !== 200)return this.$mes.error('登陆失败')
              else{
                  this.$mes.success('登陆成功')
                  sessionStorage.setItem('token',res.data.token)
                  this.$router.push({path:'/home'})
              }
          })
      }
  }
};
</script>

<style lang='less' scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-color: #2b4b6b;
  position: relative;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    .login_avatar {
      display: flex;
      justify-content: center;
      img {
        width: 80px;
        height: 80px;
        border: 10px solid #fff;
        border-radius: 50%;
        position: absolute;
        top: -40px;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      padding: 0 20px;
      margin-top: 30px;
      box-sizing: border-box;
      text-align: right;
    }
  }
}
</style>