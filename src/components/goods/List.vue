<template>
  <div>
    <!-- 面包屑导航区 -->
    <qyy-breadcrumb
      secondTitle="商品管理"
      thirdTitle="商品列表"
    ></qyy-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 搜索添加区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryParams.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="80px"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="120px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <qyy-pagination
        @size-change="sizeChange"
        @num-change="numChange"
        :pageInfo="queryParams"
        :total="total"
      >
      </qyy-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    /* 获取商品列表数据 */
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryParams,
      })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('获取商品列表数据成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    sizeChange(size) {
      // console.log(size);
      this.queryParams.pagesize = size
      this.getGoodsList()
    },
    numChange(num) {
      this.queryParams.pagenum = num
      this.getGoodsList()
    },
    /* 删除商品 */
    async removeById(goods_id) {
      try {
        await this.$confirm('确定删除该商品？')
        //  console.log('go');
        /* 点击确定走这里 */
        const { data: res } = await this.$http.delete(`goods/${goods_id}`)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUsersList()
      } catch (err) {
        /* 点击取消走这里 */
        console.log(err)
      }
    },
    goAddPage() {
      this.$router.push('/goods/add')
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin: 15px 0;
}
</style>