<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 查询框 -->
    <el-card shadow="always">
      <el-input
        placeholder="请输入内容"
        v-model="selectInfo"
        class="input-with-select"
        style="width: 300px; margin-bottom: 20px;"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="selectInfoHandel"
        ></el-button>
      </el-input>
      <!-- tab展示表单 -->
      <el-table :data="ordersList" style="width: 100%; margin-bottom: 15px;">
        <el-table-column tyep="index" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay !== '0'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="orderShowHandel(scope.row)"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showWuliuJinDudialogVisible"
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
      <!-- 编辑地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="showOrderdialogVisible"
        width="50%"
      >
        <el-form
          ref="OrderformRef"
          :model="Orderform"
          label-width="120px"
          :rules="Orderrules"
        >
          <el-form-item label="省市区/县" prop="city">
            <el-cascader
              v-model="Orderform.city"
              :options="Orderoptions"
              :props="Orderoptionsprops"
              @change="cityhandleChange"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="location">
            <el-input v-model="Orderform.location"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showOrderdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="showOrderdialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 显示订单状态 -->
      <el-dialog
        title="物流进度"
        :visible.sync="WuliuJinDudialogVisible"
        width="50%"
      >
        <!-- <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline> -->
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import city from './citydata.js'
export default {
  data() {
    return {
      // 查询内容
      selectInfo: '',
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总条数
      total: 0,
      // order数据
      ordersList: [],
      // 显示修改地址对框框判断值
      showOrderdialogVisible: false,
      // 地址表单
      Orderform: {
        city: [],
        location: ''
      },
      // 级联数组
      Orderoptions: city,
      // 级联配置参数
      Orderoptionsprops: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      // 表单规则
      Orderrules: {
        city: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        location: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      // 物流进度显示框
      WuliuJinDudialogVisible: false
    }
  },
  methods: {
    selectInfoHandel() {
      this.queryInfo.query = this.selectInfo
      this.getOrderList()
    },
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('订单数据获取失败！')
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // pagenum改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    // 展示 订单地址框
    orderShowHandel(i) {
      this.showOrderdialogVisible = true
    },
    cityhandleChange() {},
    async showWuliuJinDudialogVisible() {
      // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      // console.log(res)
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped></style>
