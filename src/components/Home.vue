<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/cat.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 菜单区
        * unique-opened 表示每次只能展开一个
        * collapse 是否折叠菜单
        * collapse-transition 是否开启折叠动画
        * router 开启路由模式 以 index 作为 path 进行路由跳转
        * default-active 当前激活菜单的 index-->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#399BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单
          * index 唯一标志 string/null  -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name:'Home',
  data() {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath: '',
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logOut() {
      // sessionStorage.removeItem('token')
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = sessionStorage.getItem('activePath')
    },
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #313743;
  // padding-left: 0;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 10px;
  }
  img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
.el-aside {
  background-color: #313743;
  .toggle-button {
    background-color: #495065;
    text-align: center;
    height: 24px;
    line-height: 24px;
    color: #e9edf1;
    font-size: 10px;
    // 间距
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  // 解决边框问题
  .el-menu {
    border-right: 0;
  }
}
.el-submenu .iconfont {
  margin-right: 10px;
}
.el-main {
  background-color: #e9edf1;
}
</style>
