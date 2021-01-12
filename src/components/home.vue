<template>
  <div id="app">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header class="header">
        <div>
          <img src="" class="iconfont icon-boluo" alt="" />
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="quit">退出</el-button>
      </el-header>
      <!-- 页面主题区域 -->
      <el-container>
        <!-- 侧边栏  -->
        <el-aside :width="isCollapse ? '64px' : '201px'">
          <div :class="Collpaseicon" @click="toggle"></div>
          <el-menu
            background-color="#eee"
            text-color="#000"
            active-text-color="#22a6f2"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activeVal"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <template slot="title">
                <!-- 图片 -->
                <i :class="iconlist[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                v-for="item in item.children"
                :key="item.id"
                :index="'/' + item.path "
                @click="saveActive('/' + item.path)"
              >
                <template slot="title">
                  <!-- 图片 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ item.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconlist: {
        125: 'el-icon-s-custom',
        103: 'el-icon-coin',
        101: 'el-icon-suitcase-1',
        102: 'el-icon-collection-tag',
        145: 'el-icon-monitor'
      },
      isCollapse: false,
      Collpaseicon: 'toggle-collapse iconfont icon-anniu_jiantouxiangzuo',
      activeVal: ''
    }
  },
  mounted() {
    this.getMenuList()
    this.activeVal = window.sessionStorage.getItem('activeVal');
  },
  methods: {
    quit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (!res) return this.$message.error(res.meta.msg)
      // console.log(res.data)
      this.menulist = res.data
      // console.log(res)
    },
    toggle() {
      this.isCollapse = !this.isCollapse
      if (!this.isCollapse) {
        this.Collpaseicon =
          'toggle-collapse iconfont icon-anniu_jiantouxiangzuo'
      } else {
        this.Collpaseicon =
          'toggle-collapse iconfont icon-anniu-jiantouxiangyou'
      }
    },
    saveActive(val) {
     window.sessionStorage.setItem('activeVal', val);
     this.activeVal = window.sessionStorage.getItem('activeVal');
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header,
.el-aside {
  background-color: #eee;
  padding-left: 0;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      font-size: 25px;
      margin-left: 10px;
    }
  }
}
.iconfont {
  font-size: 50px;
}
.icon-anniu_jiantouxiangzuo,
.icon-anniu-jiantouxiangyou {
  font-size: 25px;
}
.toggle-collapse {
  text-align: center;
}
</style>
