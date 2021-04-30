<template>
  <div class="login_container">
    <div class="login">
      <!-- 头像区 -->
      <div class="avater">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区
      * prop="xx" 是验证规则生效的必要条件
      * ref="xx" ref表示引用，拿到的是表单的实例对象-->
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      // this 指的是Login组件
      // console.log(this);
      // loginFormRef 指的是表单的实例对象
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 表单预验证： valid 指的是验证结果（布尔值）
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;

        // 向后台发送请求 async/await
        const { data:res } = await this.$http.post("login", this.loginForm);
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error("登录失败");
        }
        this.$message.success("登录成功");

        // 保存 token,并跳转到后台主页
        sessionStorage.setItem("token", res.data.token);
        // 编程式导航
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
}
.avater {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
