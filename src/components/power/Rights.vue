<template>
  <main-layout>
    <template #title> 权限管理 </template>
    <template #title2> 权限列表 </template>
    <template #default>
      <el-table :data="rightsList" stripe border>
        <el-table-column
          type="index"
          label="序号"
          width="50px"
        ></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column  label="权限等级">
            <template slot-scope='scope'>
                <el-button size='mini' type='primary' v-if="scope.row.level === '0'">一级</el-button>
                <el-button size='mini' type='success' v-else-if="scope.row.level === '1'">二级</el-button>
                <el-button size='mini' type='warning' v-else>三级</el-button>
            </template>
        </el-table-column>
      </el-table>
    </template>
  </main-layout>
</template>

<script>
import MainLayout from "@/components/common/MainLayout.vue";
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  components: {
    MainLayout,
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list", {
        params: { type: "list" },
      });
      if (res.meta.status !== 200) {
        this.$mes.error(res.meta.msg);
      } else {
        this.rightsList = res.data;
      }
    },
  },
};
</script>

<style>
</style>