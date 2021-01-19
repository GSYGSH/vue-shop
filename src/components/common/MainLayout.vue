<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><slot name="title">1</slot></el-breadcrumb-item>
      <el-breadcrumb-item><slot name="title2">2</slot></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="card">
        <slot name="default"></slot>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.el-breadcrumb{
    margin-bottom: 20px;
}
</style>