<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-card>
      <el-button type="primary" @click="showaddUser">添加角色</el-button>
    </el-card>
    <!-- 角色列表信息 -->
    <el-table :data="RolesList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级标题 -->
          <el-row
            :class="['rowBottom', i1 === 0 ? 'rowTop' : '']"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
          >
            <el-col :span="5">
              <el-tag closable @close="removeRights(scope.row, item1.id)">{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <!-- 二级标题 -->
              <el-row
                :class="[[i2 !== 0 ? 'rowTop' : '']]"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="removeRights(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级标题 -->
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    @close="removeRights(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showeditUser(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-delete"
            @click="showDeleteDialog(scope.row.id)"
            >删除</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-s-tools"
            @click="getRightsDialog(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限树控件 -->
    <el-dialog title="分配权限" :visible.sync="RightsdialogVisible" width="50%">
      <!-- 权限树 -->
      <el-tree
        :data="RolesTree"
        :props="rightsProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="TreeArr"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog
      :title="addOrEdit"
      :visible.sync="UserdialogVisible"
      width="50%"
      @close="addAndEditdialogClose"
    >
      <el-form
        :model="UserruleForm"
        :rules="UserruleFormrules"
        ref="UserruleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="UserruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="UserruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="UserdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RolesList: [],
      RightsdialogVisible: false,
      RolesTree: [],
      rightsProps: {
        children: 'children',
        label: 'authName'
      },
      TreeArr: [],
      rightsID: '',
      // 添加角色对话框判断值
      UserdialogVisible: false,
      UserruleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 修改还是添加角色
      addOrEdit: 'add',
      // 角色ID
      rolesID: 0,
      UserruleFormrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      var { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.RolesList = res.data
      // console.log(res.data)
    },
    // 删除权限
    async removeRights(roles, rightId) {
      var msg = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 删除失败
      if (msg !== 'confirm') {
        this.$message.error('取消删除')
        return
      }
      console.log('成功')
      const { data: stas } = await this.$http.delete(
        `roles/${roles.id}/rights/${rightId}`
      )
      if (stas.meta.status !== 200) {
        this.$message.error('删除失败')
        return
      }
      roles.children = stas.data
    },
    // 获取树控件数据
    async getRightsDialog(roles) {
      // rightsID
      this.rightsID = roles.id
      const { data: res } = await this.$http.get('rights/tree ')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限信息失败')
      }
      this.RolesTree = res.data
      this.RightsdialogVisible = true
      // 重置Tree 数组
      this.TreeArr = []
      this.getLeafRightsTree(roles, this.TreeArr)
    },
    // 获取个叶子节点
    getLeafRightsTree(roles, arr) {
      if (!roles.children) {
        return arr.push(roles.id)
      }
      roles.children.forEach(item => this.getLeafRightsTree(item, arr))
    },
    // 角色授权
    async allotRights() {
      var arrs = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const strArrs = arrs.join(',')
      // ！！！！
      const { data: msg } = await this.$http.post(
        `roles/${this.rightsID}/rights/`,
        {
          rids: strArrs
        }
      )
      if (msg.meta.status !== 200) {
        this.$message.error('更新失败')
      } else {
        this.$message.success('更新成功')
        this.RightsdialogVisible = false
        this.getRolesList()
      }
    },
    showaddUser() {
      this.UserdialogVisible = true
      this.addOrEdit = '添加角色'
    },
    async addUser() {
      if (this.addOrEdit === '添加角色') {
        this.$refs.ruleFormRef.validate(vali => {
          if (!vali) {
            return this.$message.error('请完成必要的参数填写')
          }
        })
        const { data: res } = await this.$http.post('roles', this.UserruleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功')
        this.$refs.UserruleFormRef.resetFields()
        this.UserdialogVisible = false
      } else {
        const { data: res } = await this.$http.put(
          `roles/${this.rolesID}`,
          this.UserruleForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败！')
        }
        this.$message.success('修改成功')
        this.UserdialogVisible = false
      }
      this.getRolesList()
      this.$refs.UserruleFormRef.resetFields()
    },
    showeditUser(role) {
      this.UserdialogVisible = true
      this.UserruleForm.roleName = role.roleName
      this.UserruleForm.roleDesc = role.roleDesc
      this.rolesID = role.id
      this.addOrEdit = '修改角色'
    },
    // 表单关闭时间
    addAndEditdialogClose() {
      this.$refs.UserruleFormRef.resetFields()
      this.UserruleForm.roleName = ''
      this.UserruleForm.roleDesc = ''
    },
    // 删除角色
    async showDeleteDialog(id) {
      const isOk = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).catch(err => err)
      if (isOk !== 'confirm') {
        return this.$message('删除取消')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        this.$message.warning('删除失败！')
      }
      this.$message.success('删除成功')
      this.getRolesList()
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less">
.rowTop {
  border-top: 1px solid #ddd;
}
.rowBottom {
  border-bottom: 1px solid #ddd;
}
.el-tag {
  margin: 7px;
}
</style>
