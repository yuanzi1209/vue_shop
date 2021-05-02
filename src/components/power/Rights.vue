<template>
  <div>
    <!-- 面包屑导航区 -->
    <qyy-breadcrumb
      secondTitle="权限管理"
      thirdTitle="权限列表"
    ></qyy-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 权限列表 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <!-- <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag> -->
            <el-tag :type="levelObj[scope.row.level]['type']">
              {{ levelObj[scope.row.level]['text'] }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      levelObj: {
        0: {
          type: 'primary',
          text: '一级',
        },
        1: {
          type: 'success',
          text: '二级',
        },
        2: {
          type: 'warning',
          text: '三级',
        },
      },
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      // 获取权限列表
      const { data: res } = await this.$http.get(`rights/list`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.rightsList = res.data
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>