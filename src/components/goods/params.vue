<template>
  <div>
    <el-card>
      <el-row class="rowHeight">
        <el-col>
          <el-alert
            show-icon
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
          >
          </el-alert
        ></el-col>
      </el-row>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            style="width: 20%;"
            expandTrigger="hover"
            v-model="setCateKey"
            :options="CatetList"
            :props="cateSetProps"
            @change="catehandleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" @click="showaddParamsDialog"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" @click="showaddParamsDialog"
            >添加参数</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog title="添加" :visible.sync="addParamsdialogVisible" width="50%">
      <el-form
        :model="ParamsruleForm"
        :rules="Paramsrules"
        ref="ParamsruleForm"
        label-width="150px"
      >
        <el-form-item :label="labelName" prop="attr_name">
          <el-input v-model="ParamsruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- table显示栏 -->
    <el-table :data="ParamstableData" stripe style="width: 100%">
      <el-table-column type="expand" align="center">
        <!-- tag标签 参数/属性 -->
        <template slot-scope="scope">
          <el-tag
            :key="i"
            v-for="(item, i) in scope.row.attr_valsList"
            closable
            :disable-transitions="false"
            @close="deleteParams(item, scope.row)"
          >
            {{ item }}
          </el-tag>
          <!-- new Tag标签 -->
          <el-input
            class="input-new-tag"
            v-if="scope.row.ParamsinputVisible"
            v-model="scope.row.ParamsinputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)"
            style="width: 100px;"
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
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column
        prop="attr_name"
        label="参数名称"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editParams(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-delete"
            size="mini"
            @click="deleteParms(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改对话框 -->
    <el-dialog title="修改" :visible.sync="editParamsdialogVisible" width="50%">
      <el-form
        :model="editParamsruleForm"
        :rules="editParamsrules"
        ref="editParamsruleForm"
        label-width="150px"
      >
        <el-form-item :label="labelName" prop="attr_name">
          <el-input v-model="editParamsruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表
      CatetList: [],
      // 分类列表参数
      cateSetProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联列表选择后的数据数组
      setCateKey: [],
      // 静态/动态参数选项
      activeName: 'many',
      // 添加参数/属性提示框
      addParamsdialogVisible: false,
      // 参数表单
      ParamsruleForm: {},
      // 表单规则
      Paramsrules: {
        attr_name: [
          { required: true, message: '请输入添加内容', trigger: 'blur' }
        ]
      },
      // 表单名称
      labelName: '',
      // table 数据
      ParamstableData: [],
      // 修改提示框的
      editParamsdialogVisible: false,
      // 修改数据对象
      editParamsruleForm: {
        attr_name: ''
      },
      // 提交规则
      editParamsrules: {
        attr_name: [
          { required: true, message: '请输入修改内容', trigger: 'blur' }
        ]
      },
      // 显示input输入框
      inputVisible: false,
      // 输入框值
      inputValue: ''
    }
  },
  methods: {
    // 获取cata分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.CatetList = res.data
    },
    // 级联选择器改变后触发的方法
    catehandleChange() {
      this.getCateAttributes()
    },
    // tabs标签页改变后触发的方法
    handleClick() {
      this.getCateAttributes()
    },
    // 获取属性参数数据
    async getCateAttributes() {
      if (this.setCateKey.length !== 3) {
        return (this.ParamstableData = [])
      }
      const { data: res } = await this.$http.get(
        `categories/${this.setCateKey[this.setCateKey.length - 1]}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      res.data.forEach(item => {
        item.attr_valsList =
          item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []
        item.ParamsinputVisible = false
        item.ParamsinputValue = ''
      })
      this.ParamstableData = res.data
    },
    // 添加参数对话框
    showaddParamsDialog() {
      this.labelName = this.getLabelName
      this.addParamsdialogVisible = true
    },
    // 添加
    async addParams() {
      if (this.setCateKey.length !== 3) {
        return this.$message.error('注意：只允许为第三级分类设置相关参数！')
      }
      const { data: res } = await this.$http.post(
        `categories/${this.setCateKey[this.setCateKey.length - 1]}/attributes`,
        {
          attr_name: this.ParamsruleForm.attr_name,
          attr_sel: this.activeName
        }
      )
      if (res.meta.status !== 201) {
        return this.$message.error('创建失败！')
      }
      this.catehandleChange()
      this.ParamsruleForm = {}
      this.addParamsdialogVisible = false
      return this.$message.success('创建成功！')
    },
    // 渲染修改参数对话框一些数据
    editParams(para) {
      this.editParamsruleForm.attr_name = para.attr_name
      this.editParamsruleForm.attr_id = para.attr_id
      this.editParamsruleForm.cat_id = para.cat_id
      this.labelName = this.getLabelName
      this.editParamsdialogVisible = true
    },
    // 提交修改参数
    editSubParams() {
      this.$refs.editParamsruleForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          `categories/${this.editParamsruleForm.cat_id}/attributes/${this.editParamsruleForm.attr_id}`,
          {
            attr_name: this.editParamsruleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.getCateAttributes()
        this.editParamsdialogVisible = false
        this.$message.success('修改成功')
      })
    },
    // 小叉叉删除参数/属性
    async deleteParams(para, val) {
      const msg = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (msg !== 'confirm') {
        this.$message.error('取消删除')
        return
      }
      const arr = val.attr_valsList.filter(item => item !== para)
      const str = arr.join(' ')
      const { data: res } = await this.$http.put(
        `categories/${val.cat_id}/attributes/${val.attr_id}`,
        {
          attr_name: val.attr_name,
          attr_sel: this.activeName,
          attr_vals: str
        }
      )
      val.attr_valsList = arr
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
    },
    // new Tag添加属性
    async handleInputConfirm(item) {
      if (item.ParamsinputValue.trim() === '') {
        return (item.ParamsinputVisible = !item.ParamsinputVisible)
      }
      console.log(item)
      item.attr_valsList.push(item.ParamsinputValue)
      const str = item.attr_valsList.join(' ')
      const { data: res } = await this.$http.put(
        `categories/${item.cat_id}/attributes/${item.attr_id}`,
        {
          attr_name: item.attr_name,
          attr_sel: item.attr_sel,
          attr_vals: str
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      item.ParamsinputValue = ''
      item.ParamsinputVisible = !item.ParamsinputVisible
    },
    // 显示输入文本框
    showInput(item) {
      item.ParamsinputVisible = !item.ParamsinputVisible
    },
    // 删除参数
    async deleteParms(item) {
      const { data: res } = await this.$http.delete(
        `categories/${item.cat_id}/attributes/${item.attr_id}`
      )
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getCateAttributes()
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    getLabelName() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.rowHeight {
  margin-bottom: 20px;
}
</style>
