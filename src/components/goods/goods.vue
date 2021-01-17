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
      total: 1
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
    delGoodsHandel(item) {
      console.log(item)
    },
    addGoods() {
      this.$router.push('/goods/addGoods')
    }
  },
  created() {
    this.getGoodsData()
  }
}
</script>

<style lang="less" scoped></style>
