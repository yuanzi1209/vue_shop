<template>
  <div>
    <!-- 面包屑导航区 -->
    <qyy-breadcrumb
      secondTitle="订单管理"
      thirdTitle="订单列表"
    ></qyy-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 搜索区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="250px"
        ></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag
              type=""
              effect="dark"
              v-if="scope.row.pay_status === '1'"
              size="mini"
              >已付款
            </el-tag>
            <el-tag type="danger" effect="dark" v-else size="mini"
              >未付款
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改订单地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showModAddressDialog"
              ></el-button
            ></el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="物流信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location-outline"
                size="mini"
                @click="showProcessDialog"
              ></el-button
            ></el-tooltip>
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

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="modAddressDialogVisible"
      width="50%"
      @close="modAddressDialogClose"
    >
      <el-form
        :model="modAddressForm"
        :rules="modAddressRules"
        ref="modAddressRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="modAddressForm.address1"
            :options="cityData"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="modAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modAddressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="processDialogVisible"
      width="50%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="processDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      modAddressDialogVisible: false,
      modAddressForm: {
        address1: [],
        address2: '',
      },
      modAddressRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      cityData,
      cascaderProps: {
        expandTrigger: 'hover',
      },
      processDialogVisible: false,
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryParams,
      })
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取订单列表失败')
      this.$message.success('获取订单列表成功')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    sizeChange(size) {
      this.queryParams.pagesize = size
    },
    numChange(num) {
      this.queryParams.pagenum = num
    },
    showModAddressDialog() {
      this.modAddressDialogVisible = true
    },
    modAddressDialogClose() {
      this.$refs.modAddressRef.resetFields()
    },
    async showProcessDialog() {
      /* 获取物流信息--失败*/
      const { data: res } = await this.$http.get(`/kuaidi/804909574412544580`)
      console.log(res)
      //   if (res.meta.status !== 200)
      //     return this.$message.error('获取订单列表失败')
      //   this.$message.success('获取订单列表成功')

      this.processDialogVisible = true
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