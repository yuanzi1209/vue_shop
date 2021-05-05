<template>
  <div>
    <!-- 面包屑导航区 -->
    <qyy-breadcrumb
      secondTitle="商品管理"
      thirdTitle="添加商品"
    ></qyy-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 提示框 -->
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="+activeIndex"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeLeaveTab"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addForm.goods_cate"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item2.attr_name"
              v-for="item2 in onlyTabData"
              :key="item2.attr_id"
            >
              <el-input v-model="item2.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3"
            ><el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload></el-tab-pane
          >
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片弹出框 -->
    <el-dialog title="预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewURL" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cate: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
        ],
        goods_cate: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      manyTabData: [],
      onlyTabData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: sessionStorage.getItem('token'),
      },
      previewURL: '',
      previewDialogVisible: false,
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
    handleChange() {
      // console.log(this.addForm.goods_cate)
    },
    beforeLeaveTab(newTab, oldTab) {
      // console.log(newTab, oldTab)
      if (oldTab === '0' && this.addForm.goods_cate.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked() {
      // console.log(this.activeIndex)
      /* 注意：必须是字符串'1' */
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cate[2]}/attributes`,
          {
            params: {
              sel: 'many',
            },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('获取动态参数成功')
        // console.log(res.data)

        /* 处理 */
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.split(' ')
        })
        // console.log(res.data)

        this.manyTabData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cate[2]}/attributes`,
          {
            params: {
              sel: 'only',
            },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('获取静态属性成功')
        console.log(res.data)

        this.onlyTabData = res.data
      }
    },
    handlePreview(file) {
      // console.log(file)
      this.previewURL = file.response.data.url
      this.previewDialogVisible = true
    },
    handleRemove(file) {
      // console.log(file)
      const tem_path = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex((item) => item.pic === tem_path)
      // console.log(index)
      /* 根据索引号删除数组里的元素 */
      this.addForm.pics.splice(index, 1)
      // console.log(this.addForm)
    },
    handleSuccess(response) {
      // console.log(response)
      const picObj = { pic: response.data.tmp_path }
      this.addForm.pics.push(picObj)
      // console.log(this.addForm)
    },
    async addGoods() {
      /* 提交前对表单进行预验证 */
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
      })
      /* 后台：添加商品 */

      /* 易错处
      this. addForm.goods_cate=this. addForm.goods_cate.join(',')
      console.log(this. addForm); */

      /* 深拷贝 */
      const form = _.cloneDeep(this.addForm)
      /* 处理 goods_cate 格式 */
      form.goods_cate = form.goods_cate.join()
      // console.log(form)

      /* 处理 attrs */
      this.manyTabData.forEach((item) => {
        const newInfo1 = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(),
        }
        this.addForm.attrs.push(newInfo1)
      })
      this.onlyTabData.forEach((item) => {
        const newInfo2 = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        }
        this.addForm.attrs.push(newInfo2)
      })
      form.attrs = this.addForm.attrs
      console.log(form)

      const { data: res } = await this.$http.post('goods', form)
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加商品失败')
      }
      this.$message.success('添加商品成功')
      /* 跳转到商品列表页面 */
      this.$router.push('/goods')
    },
  },
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-steps {
  margin: 15px 0;
}
.el-tabs {
  margin: 50px 0;
}
.el-checkbox {
  margin-right: 15px;
}
.el-button {
  margin-top: 15px;
}
</style>