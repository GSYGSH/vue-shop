<template>
  <el-container class="home">
    <!-- 头部 -->
    <el-header class="header">
      <span>电商管理后台</span>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边与主体 -->
      <el-aside  class="aside" :style="{width : isCollapse===false?'200px':'64px'}">
          <!-- 折叠 -->
          <div class="collapse " :class="[isCollapse===false?'el-icon-caret-left':'el-icon-caret-right']" @click="isCollapse = !isCollapse"></div>
        <!-- 一级菜单 -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          router
          unique-opened
          :collapse='isCollapse'
          :collapse-transition='false'
          :default-active='activePath'
          
        >
          <el-submenu
            :index="item.id+''"
            v-for="item in MenuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="MenuIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + i.path"
              v-for="i in item.children"
              :key="i.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ i.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
  },
  data() {
    return {
      MenuList: [],
      MenuIcon: {
        125: "el-icon-s-custom",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-chat-dot-square",
      },
      isCollapse:false,
      activePath:''
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.replace({ path: "/login" });
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      this.MenuList = res.data;
    },
  },
  watch:{
    activePath(){
      if(this.$route.path === '/goods/add'){
        this.activePath = '/goods'
      }else{
        this.activePath = $route.path
      }
    }
  }
};
</script>

<style lang='less' scoped>
.home {
  height: 100vh;
  .header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
  }
  .aside {
      .collapse{
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #4A5064;
          height: 30px;
          cursor: pointer;
      }
      .collapse:hover{
          background-color:  #5a6179;
          transition: all .5s;
      }
    background-color: #333744;
    .el-menu-vertical-demo {
      border-right: 0;
    }
  }
  .aside:hover{
      transition: all .5s;
  }
  .main {
    background-color: #eaedf1;
  }
}
</style>