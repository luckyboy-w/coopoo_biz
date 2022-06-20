<template>
  <div>
    <div class="ly-container">
     <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
       <div class="tabTd">
         <div>结算单号：</div>
         <div>
           <el-input v-model="searchParam.settleNo" width="180px" placeholder="请输入" />
         </div>
       </div>
       <div class="tabTd">
         <div>门店名称：</div>
         <div>
           <el-input v-model="searchParam.storeName" width="180px" placeholder="请输入" />
         </div>
       </div>
       <div class="tabTd">
         <div>入账时间：</div>
         <div>
           <el-date-picker
                 v-model="searchParam.accountTime"
                 type="month"
                 value-format="yyyy-MM"
                 placeholder="选择月">
               </el-date-picker>
         </div>
       </div>
       <div class="tabTd">
         <div>商品名称：</div>
         <div>
           <el-input v-model="searchParam.goodsName" width="180px" placeholder="请输入" />
         </div>
       </div>
       <div class="tabTd">
         <el-button type="primary" @click="search()" icon="el-icon-search">搜索</el-button>
         <el-button type="primary" icon="el-icon-download" style="margin-left:20px" @click="exportData()">导出明细</el-button>
         <el-button type="primary" icon="el-icon-download" style="margin-left:20px" @click="exportStoreData()">导出统计表</el-button>
       </div>
      </div>
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;color: red;">
        &nbsp;&nbsp;&nbsp; * 2021年结算数据由供应商结算给门店，故供应商结算金额与门店结算金额大于订单金额。
        </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="id" border
          >
            <!-- <el-table-column prop="settleNo" label="结算单号" ></el-table-column> -->
            <el-table-column prop="orderNo" label="订单编号"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称" >
              <template slot-scope="scope">
                {{scope.row.goodsName}}
                <el-tag effect="light" style="color: white;background-color: #409EFF;" size="mini" v-if="scope.row.isVipOrder==1">
                  专属
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deliveryMethod" label="配送方式" >
              <template slot-scope="scope">
                <span v-if="scope.row.deliveryMethod==1">邮寄</span>
                <span v-if="scope.row.deliveryMethod==2">自提</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsNum" label="商品数量"></el-table-column>
            <el-table-column prop="goodsPrice" label="商品单价" ></el-table-column>
            <el-table-column prop="orderAmount" label="订单金额" ></el-table-column>
            <el-table-column prop="accountTime" label="入账时间"></el-table-column>
            <el-table-column prop="storeName" label="门店名称" ></el-table-column>
            <el-table-column prop="supplierPrice" label="供应金额" ></el-table-column>
            <el-table-column prop="supplierPreSettlePrice" label="供应商预计结算金额"></el-table-column>
            <el-table-column prop="supplierPlatformPrice" label="供应商平台服务费" ></el-table-column>
            <el-table-column prop="supplierSettlePrice" label="供应商实际结算金额" ></el-table-column>
            <el-table-column prop="storeProfitRatio" label="门店利润分佣比例"></el-table-column>
            <el-table-column prop="storePreSettlePrice" label="门店预计分佣金额" ></el-table-column>
            <el-table-column prop="storePlatformPrice" label="门店平台服务费" ></el-table-column>
            <el-table-column prop="test" label="分销佣金" ></el-table-column>
            <el-table-column prop="storeSettlePrice" label="门店实际分佣金额"></el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination
            background
            v-show="!showPagination"
            layout="prev, pager, next"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
            :total="tableData.total"
            :page-size="searchParam.pageSize"
            :current-page="searchParam.pageNum"
          ></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import {
    getToken
  } from '@/utils/auth.js'

export default {
  computed: {},
  created() {
  },
  data() {
    return {
      showPagination: false,
      searchParam: {
        accountTime:'',
        goodsName:'',
        settleNo:'',
        storeName:'',
        pageSize: 10,
        pageNum: 1
      },
      tableData: {
        list: []
      },
    }
  },
  mounted() {
    this.initLoad()
  },
  methods: {
    search() {
		this.searchParam.pageNum = 1;
      this.loadList()
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },
    initLoad() {
      this.loadList()
    },
    exportData() {
      let exportParam = [];

      let param = JSON.parse(JSON.stringify(this.searchParam));
      delete param.pageSize
      delete param.pageNum

      for (let key in param) {
        exportParam.push(key + "=" + param[key]);
      }
      exportParam.push("token=" + getToken())
      window.open(process.env.VUE_APP_BASE_API + "/excel/order-detail-settlement/export?" + exportParam.join("&"));
    },
    exportStoreData(){
      let exportParam = [];

      let param = JSON.parse(JSON.stringify(''));
      delete param.pageSize
      delete param.pageNum

      for (let key in param) {
        exportParam.push(key + "=" + param[key]);
      }
      exportParam.push("token=" + getToken())
      console.log(process.env.VUE_APP_BASE_API + "/excel/supplier-goods-settlement/export?" + exportParam.join("&"))
      window.open(process.env.VUE_APP_BASE_API + "/excel/supplier-goods-settlement/export?" + exportParam.join("&"));
    },
    loadList() {
      let scope = this
      getMethod('/settlement/order-detail-settlement-list', this.searchParam).then(
        res => {
          scope.tableData.list = res.data.records
          scope.tableData.total = res.data.total
          scope.showPagination = scope.tableData.total == 0
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container {
  padding: 10px 20px;
  font-size: 14px;

  .ly-tool-panel {

    line-height: "60px";
    height: "60px";
    width: 100%;
    padding: 10px 10px;

    .ly-tool-btn {
      padding-left: 20px;
      display: inline;
    }
  }
}
 .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }

.el-pagination {
  white-space: nowrap;
  padding: 2px 0px;
  color: #303133;
  font-weight: bold;
}

.el-pagination > > > .btn-prev {
  margin: 0 5px 0 0;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}

</style>
