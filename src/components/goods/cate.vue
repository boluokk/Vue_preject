<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <TableTree
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        :border="true"
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: green"
            v-if="scope.row.cat_deleted == false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button type="warning" size="mini">删除</el-button>
        </template>
      </TableTree>
      <!-- 分页展示 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="cateAdddialogVisible"
      width="50%"
      @closed="closedCate"
    >
      <!-- 分类名称 -->
      <el-form
        :model="CateruleForm"
        :rules="Caterules"
        ref="CaterulesForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="CateruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级目录">
          <el-cascader
            style="width: 100%;"
            expandTrigger="hover"
            v-model="setCateKey"
            :options="parenCatetList"
            :props="cateSetProps"
            @change="catehandleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateAdddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询信息
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品数组
      cateList: [],
      // 返回总条数
      total: 1,
      // 配置TableTree行数信息
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      cateAdddialogVisible: false,
      // 分类名称数据
      CateruleForm: {},
      // 表单规则
      Caterules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 分类父 ID
      cat_pid: 0,
      // 分类层级
      cat_level: 0,
      // 分类名臣
      cat_name: '',
      // 分类父级列表数据
      parenCatetList: [],
      // cascader级联参数
      cateSetProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联返回值
      setCateKey: []
    }
  },
  methods: {
    async getCateInfo() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 页大小改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateInfo()
    },
    // 页码改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateInfo()
    },
    // 分类权限分配对话框显示
    async showAddCate() {
      this.cateAdddialogVisible = true
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级参数失败')
      }
      this.parenCatetList = res.data
    },
    catehandleChange() {
      if (this.setCateKey.length > 0) {
        this.cat_level = this.setCateKey.length - 1
        this.cat_pid = this.setCateKey[this.setCateKey.length - 1]
      } else {
        this.cat_level = 0
        this.cat_pid = 0
      }
    },
    async addCate() {
      this.$refs.CaterulesForm.validate(async vali => {
        if (!vali) return this.$message.error('请正确填写分类名称')
        const { data: res } = await this.$http.post('categories', {
          cat_pid: this.cat_pid,
          cat_name: this.CateruleForm.cat_name,
          cat_level: this.cat_level
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.cateAdddialogVisible = false
        this.closedCate();
      })
    },
    closedCate() {
      this.setCateKey = []
      this.CateruleForm = {}
    }
  },
  created() {
    this.getCateInfo()
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
</style>
