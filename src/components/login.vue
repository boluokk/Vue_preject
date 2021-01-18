<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 表单区域 -->
      <el-form
        :model="loginForm"
        ref="loginFormRef"
        :rules="loginFormRules"
        label-width="0"
        class="form_box"
      >
        <!-- 用户名 -->
        <el-form-item label="" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-ziyuan"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 登入重置按钮 -->
        <el-form-item label="" class="btn">
          <el-button type="primary" @click="login" class="login_button"
            >登入</el-button
          >
          <el-button type="info" @click="resetLoginForm" class="reset_button"
            >重置</el-button
          >
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
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('账户或密码错误')
        this.$message.success('登入成功')
        // 登入之后 token 保存到sessionStorage中
        //  console.log(res);
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  width: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    height: 130px;
    width: 130px;
    border: 15px double #eef;
    box-shadow: 0 0 10px #ddd;
    background-color: #ccc;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.form_box {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>
