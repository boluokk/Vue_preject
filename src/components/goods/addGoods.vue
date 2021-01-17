<template>
  <div>
    <el-card>
      <el-row style="margin-bottom: 15px;"
        ><el-alert title="添加商品信息" type="info" center show-icon> </el-alert
      ></el-row>
      <!-- 步骤条 -->
      <el-steps
        :active="active"
        finish-status="success"
        align-center
        style="margin-bottom: 15px"
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
        :model="primaryRuleForm"
        :rules="primaryrules"
        ref="primaryruleForm"
        label-width="100px"
        label-position="top"
      >
        <!-- tab 标签页 -->
        <el-tabs
          tab-position="left"
          :before-leave="TabschangeBeforeLeave"
          @tab-click="tabChangeClick"
        >
          <el-tab-pane label="基本信息">
            <!-- 基本信息表单 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="primaryRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="primaryRuleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="primaryRuleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="primaryRuleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="primaryRuleForm.goods_cat"
                :options="CateList"
                :props="cateSetProps"
                @change="CatehandleChange"
                expandTrigger="hover"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item
              :label="item.attr_name"
              v-for="item in tabManyData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in tabOnlyData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals[0]"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-remove="handleRemove"
              :on-success="handelSuccess"
              :headers="headersObject"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor
              class="editorText"
              v-model="primaryRuleForm.goods_introduce"
            />
            <el-button type="primary" style="margin-top: 85px" @click="add"
              >添加</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入lodash
import _ from 'lodash'

export default {
  data() {
    return {
      // step选中内容
      active: 0,
      // 基本信息表单数据
      primaryRuleForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类
        goods_cat: [],
        // 图片路径
        pics: [],
        // 商品介绍
        goods_introduce: '',
        // 静态/动态参数
        attrs: []
      },
      // 基本信息表单数据规则
      primaryrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 分类列表数据
      CateList: [],
      // 级联选择器规则对应属性
      cateSetProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      tabManyData: [],
      tabOnlyData: [],
      headersObject: {
        Authorization: ''
      },
      content: ''
    }
  },
  methods: {
    // tab改变调用的函数
    TabschangeBeforeLeave(activeName, oldActiveName) {
      if (
        oldActiveName === '0' &&
        this.primaryRuleForm.goods_cat.length !== 3
      ) {
        this.$message.error('请选择对应三级商品分类!')
        return false
      }
      this.active = Number(activeName)
    },
    CatehandleChange() {},
    // 获取Cate数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.CateList = res.data
    },
    async tabChangeClick() {
      // 获取动态参数数据
      if (this.active === 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.primaryRuleForm.goods_cat[2]}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数数据失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []
        })
        this.tabManyData = res.data
      } else if (this.active === 2) {
        // 获取静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.primaryRuleForm.goods_cat[2]}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数数据失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []
        })
        this.tabOnlyData = res.data
      } else if (this.active === 3) {
        this.headersObject.Authorization = window.sessionStorage.getItem(
          'token'
        )
      }
    },
    handleRemove(file) {
      this.primaryRuleForm.pics = this.primaryRuleForm.pics.filter(
        item => item.pic !== file.response.data.tmp_path
      )
    },
    handelSuccess(response) {
      const uploadObj = {
        pic: ''
      }
      uploadObj.pic = response.data.tmp_path
      this.primaryRuleForm.pics.push(uploadObj)
    },
    // 开始添加表单
    async add() {
      this.$refs.primaryruleForm.validate(vali => {
        if (!vali) {
          return this.$message.error('请填写必要项参数！')
        }
      })
      const addValue = _.cloneDeep(this.primaryRuleForm)
      addValue.goods_cat = addValue.goods_cat.join(',')
      // 动态参数参数转换
      this.tabManyData.forEach(item => {
        const manyDataObj = {
          attr_id: '',
          attr_value: ''
        }
        manyDataObj.attr_id = item.attr_id
        manyDataObj.attr_value = item.attr_vals[0]
        addValue.attrs.push(manyDataObj)
      })
      // 静态属性属性转换
      this.tabOnlyData.forEach(item => {
        const manyDataObj = {
          attr_id: '',
          attr_value: ''
        }
        manyDataObj.attr_id = item.attr_id
        manyDataObj.attr_value = item.attr_vals[0]
        addValue.attrs.push(manyDataObj)
      })
      const { data: res } = await this.$http.post('goods', addValue)
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加失败')
      }
      this.$router.push('/goods')
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.editorText {
  height: 150px;
}
</style>
