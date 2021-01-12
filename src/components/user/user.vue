<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="Usersinfo.query"
            clearable
            @clear="clearReInfo"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="SearchInfo"
            ></el-button></el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="changedialogVisible"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-table :data="tableData" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="role_name" label="管理权限"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="create_time" label="创建时间"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作" width="180px">
        <template slot-scope="scope">
          <!-- 编辑用户 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editdialog(scope.row.id)"
          >
          </el-button>
          <!-- 角色删除 -->
          <el-button
            type="warning"
            icon="el-icon-delete"
            size="mini"
            @click="deleteUser(scope.row.id)"
          ></el-button>
          <el-tooltip
            effect="dark"
            content="角色编辑"
            placement="top"
            :enterable="false"
          >
            <!-- 设置 -->
            <el-button
              type="info"
              icon="el-icon-setting"
              size="mini"
              @click="setUserEditDialogVistible(scope.row)"
            ></el-button>
          </el-tooltip>
          <!-- 设置用户提示框 -->
          <el-dialog
            title="提示"
            :visible.sync="userEditdialogVisible"
            width="50%"
            @closed="cleanRolesList"
          >
            <div>
              <p>{{ userInfo.username }}</p>
              <p>{{ userInfo.role_name }}</p>
              <el-select v-model="rolesListValueID" placeholder="请选择">
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="userEditdialogVisible = false"
                >取 消</el-button
              >
              <el-button type="primary" @click="userEditdialogSub"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Usersinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="Usersinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Usersinfo.total"
      >
      </el-pagination>
    </div>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="AdddialogVisible"
      width="50%"
      @close="closeAddFormRef"
    >
      <el-form
        ref="AddFormRef"
        :model="AddForm"
        label-width="80px"
        size="mini"
        :rules="AddFormRules"
      >
        <el-form-item label="名称" prop="username">
          <el-input v-model="AddForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="AddForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="AddForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AdddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="closeEditForm"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        size="mini"
        :rules="editFormRules"
      >
        <el-form-item label="名称">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 手机号验证
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regPhone.test(value)) {
        callback()
      }
      callback(new Error('请正确填写手机号'))
    }
    return {
      // 用户数据
      Usersinfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      tableData: [],
      // 控制用户对话框的显示与隐藏
      AdddialogVisible: false,
      // 控制用户编辑对话框的显示与隐藏
      editdialogVisible: false,
      AddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑查询用户数据
      editForm: {},
      // 添加用户规则
      AddFormRules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { mix: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 设置用户框开关
      userEditdialogVisible: false,
      // 用户信息
      userInfo: '',
      // 角色列表
      rolesList: '',
      rolesListValueID: ''
    }
  },
  methods: {
    async getUserInfo() {
      const { data: info } = await this.$http.get('users', {
        params: this.Usersinfo
      })
      // 用户总数
      this.Usersinfo.total = info.data.total
      var user = info.data.users
      var users = []
      for (var i = 0; i < user.length; i++) {
        users.push(user[i])
      }
      this.tableData = users
    },
    handleSizeChange(newSize) {
      this.Usersinfo.pagesize = newSize
      this.getUserInfo()
    },
    handleCurrentChange(newPage) {
      this.Usersinfo.pagenum = newPage
      this.getUserInfo()
    },
    async changeState(newInfo) {
      const { data: res } = await this.$http.put(
        `users/${newInfo.id}/state/${newInfo.mg_state}`
      )
      if (res.meta.status === 200) {
        return this.$message.success('修改成功')
      } else {
        newInfo.mg_state = !newInfo.mg_state
        return this.$message.error('修改失败')
      }
    },
    SearchInfo() {
      this.getUserInfo()
    },
    clearReInfo() {
      this.getUserInfo()
    },
    changedialogVisible() {
      this.AdddialogVisible = true
    },
    // 用户编辑对话框
    async editdialog(id) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询失败')
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 关闭添加用户对话框，清空表单
    closeAddFormRef() {
      this.$refs.AddFormRef.resetFields()
    },
    // 关闭编辑用户对话框，清空表单
    closeEditForm() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加用户校验提交
    addUser() {
      this.$refs.AddFormRef.validate(async vali => {
        if (!vali) return
        // 校验成功则添加用户
        const { data: res } = await this.$http.post('users', this.AddForm)
        if (res.meta.status === 201) {
          this.AdddialogVisible = false
          this.getUserInfo()
          return this.$message.success('创建成功')
        }
        this.AdddialogVisible = false
        return this.$message.error('创建失败')
      })
    },
    // 编辑用户校验提交
    editUser() {
      this.$refs.editFormRef.validate(async vali => {
        if (!vali) return
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status === 200) {
          this.editdialogVisible = false
          this.getUserInfo()
          return this.$message.success('修改成功')
        }
        this.$message.error('修改失败')
      })
    },
    async deleteUser(id) {
      const confirmResults = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).catch(err => err)
      if (confirmResults === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status === 200) {
          this.$message.success('删除成功')
          this.getUserInfo()
        }
      }
    },
    // 设置用户提示框
    async setUserEditDialogVistible(user) {
      const { data: allRoles } = await this.$http.get('roles')
      if (allRoles.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.rolesList = allRoles.data;
      this.userInfo = user;
      this.userEditdialogVisible = true
    },
     // 分配用户角色
    async userEditdialogSub() {
      this.userEditdialogVisible = false;
      const { data: msg } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.rolesListValueID })
      if (msg.meta.status !== 200) {
        this.$message.error('设置角色失败')
      } else if (msg.meta.status === 200) {
        this.$message.success('设置角色成功')
      }
    },
    // 清空上次选择角色
    cleanRolesList() {
      this.rolesList = ''
      this.rolesListValue = ''
    }
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
}
.block {
  margin-top: 15px;
}
</style>
