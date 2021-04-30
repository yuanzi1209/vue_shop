<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ secondTitle }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ thirdTitle }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'breadcrumb',
  props: {
    secondTitle: {
      type: String,
      required: true,
    },
    thirdTitle: {
      type: String,
      required: true,
    },
  },
}
</script>