<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pageInfo.pagenum"
    :page-sizes="[1, 2, 5, 10]"
    :page-size="pageInfo.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  >
  </el-pagination>
</template>

<script>
export default {
  props: {
    pageInfo: {
      type: Object,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  methods: {
    handleSizeChange(size) {
      // console.log(size)
      this.$emit('size-change',size)
    },
    handleCurrentChange(num) {
      // console.log(num)
      this.$emit('num-change',num)
    },
  },
}
</script>