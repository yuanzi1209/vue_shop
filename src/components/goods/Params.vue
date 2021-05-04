<template>
  <div>
    <!-- 面包屑导航区 -->
    <qyy-breadcrumb
      secondTitle="商品管理"
      thirdTitle="分类参数"
    ></qyy-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 警告框 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区-->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            :options="cateList"
            :props="cascaderProps"
            v-model="selectedCateKeys"
            @change="handleChange"
            clearable
            checkStrictly
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tab区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isbtnDisabled"
            @click="showManyDialog"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  >{{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isbtnDisabled"
            @click="showOnlyDialog"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  >{{ item }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数对话框 -->
    <el-dialog
      title="添加动态参数"
      :visible.sync="manyDialogVisible"
      width="50%"
    >
      <el-form
        :model="addManyParamsForm"
        label-width="80px"
        :rules="addManyParamsFormRules"
        ref="addManyParamsFormRef"
      >
        <el-form-item label="动态参数" prop="cat_name">
          <el-input v-model="addManyParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加静态属性对话框 -->
    <el-dialog
      title="添加静态属性"
      :visible.sync="onlyDialogVisible"
      width="50%"
    >
      <el-form
        :model="addOnlyParamsForm"
        label-width="80px"
        :rules="addOnlyParamsFormRules"
        ref="addOnlyParamsFormRef"
      >
        <el-form-item label="静态属性" prop="cat_name">
          <el-input v-model="addOnlyParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onlyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyTabData: [],
      onlyTabData: [],
      manyDialogVisible: false,
      addManyParamsForm: {
        attr_name: '',
      },
      addManyParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' },
        ],
      },
      onlyDialogVisible: false,
      addOnlyParamsForm: {
        attr_name: '',
      },
      addOnlyParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.cateList = res.data
    },
    /* 级联选择框change时 */
    async handleChange() {
      // console.log(this.selectedCateKeys)
      this.getParamsData()
    },
    handleTabClick() {
      // console.log(this.activeName)
      this.getParamsData()
    },
    /* 获取参数列表数据 */
    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      // console.log(res.data)

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    showManyDialog() {
      this.manyDialogVisible = true
    },
    showOnlyDialog() {
      this.onlyDialogVisible = true
    },
    async addParams() {
      try {
        await this.$refs.addManyParamsFormRef.validate()
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addManyParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        if (this.activeName === 'many') {
          this.manyDialogVisible = false
        } else {
          this.onlyDialogVisible = false
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleInputConfirm(row) {
      // console.log('ok')
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
  },
  computed: {
    isbtnDisabled() {
      if (!this.selectedCateKeys) {
        return true
      } else {
        return false
      }
    },
    cateId() {
      if (this.selectedCateKeys) {
        return this.selectedCateKeys[2]
      }
    },
  },
}
</script>


<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-alert {
  margin-bottom: 15px;
}
.el-tabs {
  margin-top: 20px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>