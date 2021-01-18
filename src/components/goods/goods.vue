<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row style="margin-bottom: 20px;">
        <el-col :span="8" style="margin-right: 20px;">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryDataHandel"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="goodsList" border stripe style="margin-bottom: 20px;">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="125">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoodsHandel(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
      <!-- 编辑商品对话框 -->
      <el-dialog
        title="商品编辑"
        :visible.sync="goodsdialogVisible"
        width="50%"
      >
        <!-- 商品信息编辑表单 -->
        <el-form
          :model="goodsruleForm"
          :rules="goodsrules"
          ref="goodsruleFormRef"
          label-width="100px"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodsruleForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="goodsruleForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="goodsruleForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="goodsruleForm.goods_weight"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="goodsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGoodsBtn">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 渲染需要的表单数据
      goodsList: [],
      // 查询信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总页数
      total: 1,
      // 商品信息
      goodsruleForm: {
        goods_id: 0,
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0
      },
      // 商品表单规则
      goodsrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      goodsdialogVisible: false,
      goodsID: 0
    }
  },
  methods: {
    async getGoodsData() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取信息失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsData()
    },
    // pagenum改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsData()
    },
    // 关键字查询数据
    queryDataHandel() {
      this.getGoodsData()
    },
    // 删除商品
    async delGoodsHandel(item) {
      console.log(item)
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
      const { data: res } = await this.$http.delete(`goods/${item.goods_id}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsData()
    },
    addGoods() {
      this.$router.push('/goods/addGoods')
    },
    showEditDialog(goods) {
      this.goodsruleForm.goods_id = goods.goods_id
      this.goodsruleForm.goods_name = goods.goods_name
      this.goodsruleForm.goods_price = goods.goods_price
      this.goodsruleForm.goods_number = goods.goods_number
      this.goodsruleForm.goods_weight = goods.goods_weight
      this.goodsdialogVisible = true
    },
    // 提交编辑商品信息
    async addGoodsBtn() {
      const { data: res } = await this.$http.put(
        `goods/${this.goodsruleForm.goods_id}`,
        {
          goods_name: this.goodsruleForm.goods_name,
          goods_price: this.goodsruleForm.goods_price,
          goods_number: this.goodsruleForm.goods_number,
          goods_weight: this.goodsruleForm.goods_weight
        }
      )
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('编辑提交失败')
      }
      this.$message.success('编辑成功')
    }
  },
  created() {
    this.getGoodsData()
  }
}
</script>

<style lang="less" scoped></style>
