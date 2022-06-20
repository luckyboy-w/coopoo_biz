<template>
  <div class="bill-tab-list" >
    <div v-if="showList">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未分佣" name="readyBill">
        <span slot="label" class="my-tab-label">未分佣</span>
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>门店名称：</div>
            <div>
             <el-input @keyup.enter.native="search()" v-model="searchParam.storeName" width="180px"/>
            </div>
          </div>
          <div class="tabTd">
            <el-button type="primary" style="margin-left:20px" @click="search()">搜索</el-button>
            <!-- <el-button type="primary" style="margin-left:20px" @click="exportDtl()">导出Excel</el-button> -->
          </div>
        </div>
        <el-table
          ref="noBillData"
          :data="noBillData.list"
          style="width: 100%; margin: 20px 0;"
          row-key="id" border
        >
          <el-table-column prop="storeName" label="门店名称" >
          </el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" >
          </el-table-column>
          <el-table-column prop="orderPayAmount" label="实付金额" >
          </el-table-column>
          <el-table-column prop="settleAmount" label="分佣金额" >
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showBillDetail(scope.row)">查看明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="noBillData.total"
          background
          layout="prev, pager, next"
          @current-change="currentPage"
          @prev-click="currentPage"
          @next-click="currentPage"
          :page-size="searchParam.pageSize"
          :current-page="searchParam.pageNum"
        />
      </el-tab-pane>
      <el-tab-pane label="待分佣" name="settleFinsh">
        <span slot="label" class="my-tab-label">待分佣</span>
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>结算单号：</div>
            <div>
             <el-input @keyup.enter.native="searchOne()" v-model="searchParam.settleNo" width="180px"/>
            </div>
          </div>
          <!-- <div class="tabTd">
            <div>申请时间：</div>
            <div>
             <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始日期">
               </el-date-picker>
             至
               <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束日期">
               </el-date-picker>
            </div>
          </div> -->
          <div class="tabTd">
            <div>入账月份：</div>
            <div>
              <el-date-picker
                    v-model="searchParam.accountDate"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择月">
                  </el-date-picker>
            </div>
          </div>
          <div class="tabTd">
            <el-button type="primary" style="margin-left:20px" @click="searchOne()">搜索</el-button>
            <el-button type="primary" @click="exportData()">导出Excel</el-button>
          </div>
        </div>
        <el-table ref="settleFinshData" :data="settleFinshData.list" style="width: 100%; margin: 20px 0;"
                  row-key="id" border
        >
          <el-table-column prop="settleNo" label="结算单号">
          </el-table-column>
          <el-table-column prop="storeName" label="门店名称">
          </el-table-column>
          <el-table-column prop="accountDate" label="入账月份">
          </el-table-column>
          <!-- <el-table-column prop="applySettleDate" label="申请时间">
            <template slot-scope="scope">
              {{ scope.row.applySettleDate | _formateDate }}
            </template>
          </el-table-column> -->
          <el-table-column prop="orderAmount" label="订单金额" >
          </el-table-column>
          <el-table-column prop="orderPayAmount" label="实付金额" >
          </el-table-column>
          <el-table-column prop="test" label="预计分佣金额">
          </el-table-column>
          <el-table-column prop="test" label="平台服务金额">
          </el-table-column>
          <el-table-column prop="test" label="分销佣金">
          </el-table-column>
          <el-table-column prop="test" label="实际分佣金额">
          </el-table-column>
          <el-table-column prop="isConfirm" label="状态">
            <template slot-scope="scope">
              {{scope.row.isConfirm==1?'已确认':'未确认'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showBillDetail(scope.row)">查看明细</el-button>
              <!-- <el-button size="mini" type="primary" v-if="scope.row.isConfirm==1" @click="confirmed(scope.row)">结算</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="settleFinshData.total"
          background
          layout="prev, pager, next"
          @current-change="currentPageOne"
          @prev-click="currentPageOne"
          @next-click="currentPageOne"
          :page-size="searchParam.pageSize"
          :current-page="searchParam.pageNum"
        />
      </el-tab-pane>
      <el-tab-pane label="已分佣" name="settleEnd">
        <span slot="label" class="my-tab-label">已分佣</span>
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>结算单号：</div>
            <div>
             <el-input @keyup.enter.native="searchTwo()" v-model="searchParam.settleNo" width="180px"/>
            </div>
          </div>
          <div class="tabTd">
            <div>结算时间：</div>
            <div>
             <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始日期">
               </el-date-picker>
             至
               <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束日期">
               </el-date-picker>
            </div>
          </div>
          <div class="tabTd">
            <div>入账月份：</div>
            <div>
              <el-date-picker
                    v-model="searchParam.accountDate"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择月">
                  </el-date-picker>
            </div>
          </div>
          <div class="tabTd">
            <el-button type="primary" style="margin-left:20px" @click="searchTwo()">搜索</el-button>
            <!-- <el-button type="primary" @click="exportData_()">导出Excel</el-button> -->
          </div>
        </div>
        <el-table ref="settleEndData" :data="settleEndData.list" style="width: 100%; margin: 20px 0;" border row-key="id">
          <el-table-column prop="settleNo" label="结算单号" >
          </el-table-column>
          <el-table-column prop="storeName" label="门店名称" >
          </el-table-column>
          <el-table-column prop="settleDate" label="结算时间" >
            <template slot-scope="scope">
              {{ scope.row.settleDate | _formateDate }}
            </template>
          </el-table-column>
          <el-table-column prop="accountDate" label="入账月份" >
          </el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" >
          </el-table-column>
          <el-table-column prop="orderPayAmount" label="实付金额" >
          </el-table-column>
          <el-table-column prop="test" label="预计分佣金额">
          </el-table-column>
          <el-table-column prop="test" label="平台服务金额">
          </el-table-column>
          <el-table-column prop="test" label="分销佣金">
          </el-table-column>
          <el-table-column prop="test" label="实际分佣金额">
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showBillDetail(scope.row)">查看明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="settleEndData.total"
          background
          layout="prev, pager, next"
          @current-change="currentPageTwo"
          @prev-click="currentPageTwo"
          @next-click="currentPageTwo"
          :page-size="searchParam.pageSize"
          :current-page="searchParam.pageNum"
        />
      </el-tab-pane>

      <el-tab-pane label="明细" name="dataDtl" v-if="dataDtl" >
        <span slot="label" class="my-tab-label">明细</span>
            <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
            <el-button v-if="!back" type="primary" icon="el-icon-back" @click="backTo()">
              返回列表
            </el-button>
            </div>
          <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
            <div class="tabTd">
              <div>订单编号：</div>
              <div>
                <el-input placeholder="请输入"  v-model="searchParam.orderNo" width="180px"/>
              </div>
            </div>
            <div class="tabTd">
              <div>入账月份：</div>
              <div>
                <el-date-picker
                      v-model="searchParam.accountDate"
                      type="month"
                      value-format="yyyy-MM"
                      placeholder="选择月">
                    </el-date-picker>
              </div>
            </div>
            <div class="tabTd">
              <el-button type="primary" style="margin-left:20px" @click="searchDtl()">搜索</el-button>
              <!-- <el-button type="primary" @click="exportDataDtl()">导出Excel</el-button> -->
            </div>
          </div>
          <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
            <div class="tabTd">
             <div>门店名称：</div>
             <div>
               {{storeName}}
             </div>
           </div>
           <div v-if="settleNo!=''" class="tabTd">
             <div>结算单号：</div>
             <div>
               {{settleNo}}
             </div>
           </div>
          </div>
        <el-table :data="billCashData.list" style="width: 100%; margin: 20px 0;" border row-key="id">
          <el-table-column prop="orderNo" label="订单编号" width="200">
            <template slot-scope="scope">
              {{scope.row.orderNo}}
              <el-tag effect="light" style="color: white;background-color: #409EFF;" size="mini" v-if="scope.row.isVipOrder==1">
                专属
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="accountTime" label="入账月份">
            <template slot-scope="scope">
              {{ scope.row.accountTime  }}
            </template>
          </el-table-column>
         <!-- <el-table-column v-if="only=='1'" prop="applySettleDate" label="申请时间" >
            <template slot-scope="scope">
              {{ scope.row.applySettleDate | _formateDate }}
            </template>
          </el-table-column> -->
          <!-- <el-table-column v-if="only=='2'" prop="settleDate" label="结算时间" >
            <template slot-scope="scope">
              {{ scope.row.settleDate | _formateDate }}
            </template>
          </el-table-column> -->
          <el-table-column prop="orderAmount" label="订单金额" >
          </el-table-column>
          <el-table-column prop="orderPayAmount" label="实付金额" >
          </el-table-column>
          <el-table-column prop="test" label="预计分佣金额">
          </el-table-column>
          <el-table-column prop="test" label="平台服务金额">
          </el-table-column>
          <el-table-column prop="test" label="分销佣金">
          </el-table-column>
          <el-table-column prop="test" label="实际分佣金额">
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="orderDtl(scope.row)">订单详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="billCashData.total != 0"
          :total="billCashData.total"
          background
          layout="prev, pager, next"
          @current-change="currentPageDetail"
          @prev-click="currentPageDetail"
          @next-click="currentPageDetail"
          :page-size="searchParam.pageSize"
          :current-page="searchParam.pageNum"
        />
      </el-tab-pane>

    </el-tabs>
    </div>
    <orderDtl v-if="!showList" ref="orderDtl" :orderNo="orderNo" @backToList="backToList" />
  </div>
</template>
<script>
import {
  getMethod,
  postMethod
} from '@/api/request'
  import orderDtl from './orderDtl'
import {
  formatDate
} from '@/api/tools.js'
import {
  getToken
} from '@/utils/auth'

export default {
  components: {
    orderDtl
  },
  data() {
    return {
      only: '',
      billMem: '',
      back: true,
      dataDtl: false,
      dialogTableVisible: false,
      tabIndex: 0,
      billDate: '',
      isCanBill: false,
      showList:true,
      storeName:'',
      settleNo:'',
      currentGoodsSkuInfoList: [],
      //10:未结算;20:结算中;30:已结算
      searchParam: {
        orderNo: '',
        storeName:'',
        accountDate:'',
        settleNo:'',
        startTime: '',
        endTime: '',
        pageSize: 10,
        pageNum: 1
      },
      activeName: 'readyBill',
      noBillData: {
        dataList: [],
        total: 0
      },
      billCashData: {
        dataList: [],
        total: 0
      },
      settleFinshData: {
        dataList: [],
        total: 0
      },
      settleEndData: {
        dataList: [],
        total: 0
      }
    }
  },
  filters: {
    _formateDate(time) {
      if (time == '' ||
        time == undefined) {
        return ''
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    _formateDateWithoutSeconds(time) {
      if (time == '' ||
        time == undefined) {
        return ''
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  mounted() {
    this.loadList()
    // this.loadBillCfgData();;
  },
  methods: {
    searchDtl() {
      let that = this
      let param = this.searchParam
      getMethod('/settlement/wait-detail-list', param).then(res => {
        console.log(res, '数据')
        this.$set(this.billCashData, 'list', res.data.records)
        // this.billCashData.list = res.data.records
        this.billCashData.total = res.data.total
        this.showPagination = this.billCashData.total == 0
      })
    },
    search() {
      this.searchParam.pageNum=1
      this.loadList()
    },
    searchOne() {
      this.searchParam.pageNum=1
      this.loadListOne()
    },
    searchTwo() {
     this.searchParam.pageNum=1
     this.loadListTwo()
    },
    //可结算导出
    exportDtl() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
      }
      let param = {
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        orderNo: this.searchParam.orderNo
      }
      let exportParam = []
      for (let key in param) {
        exportParam.push(key + '=' + param[key])
      }
      console.log(exportParam, '传的参')
      window.open(process.env.VUE_APP_BASE_API + '/bu/orderBill/exportWaitingBillDtl?token=' + getToken() + '&' +
        exportParam.join('&'))
    },
    //待审核导出
    exportData() {
     let exportParam = [];

     let param = JSON.parse(JSON.stringify(this.searchParam));
     delete param.pageSize
     delete param.pageNum

     for (let key in param) {
       exportParam.push(key + "=" + param[key]);
     }
     exportParam.push("token=" + getToken())
     window.open(process.env.VUE_APP_BASE_API + '/excel/store-settlement/export?' + exportParam.join("&"))
    },
    //已结算导出
    exportData_() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
      }
      let param = {
        billType: this.searchParam.billType,
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        orderNo: this.searchParam.orderNo
      }
      let exportParam = []
      for (let key in param) {
        exportParam.push(key + '=' + param[key])
      }
      console.log(exportParam, '传的参')
      window.open(process.env.VUE_APP_BASE_API + '/bu/orderBill/exportBill?token=' + getToken() + '&' + exportParam.join(
        '&'))
    },
    //结算明细导出
    exportDataDtl() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
      }
      let param = {
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        billNo: this.searchParam.billNo,
        billMem: this.billMem,
        billType: this.searchParam.billType
      }
      let exportParam = []
      for (let key in param) {
        exportParam.push(key + '=' + param[key])
      }
      console.log(exportParam, '传的参')
      window.open(process.env.VUE_APP_BASE_API + '/bu/orderBill/exportBillDtl?token=' + getToken() + '&' +
        exportParam.join('&'))
    },
    confirmed(row) {
      let scope = this
      this.$confirm('是否进行结算操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        postMethod('/settlement/do-store-settlement?settleNo='+row.settleNo).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          scope.loadListOne()
        })
      })
    },
    orderDtl(row) {
      console.log(row)
      let scope = this
      scope.orderNo=row.orderNo
      scope.showList = false
      // this.$router.push({
      //   path: '/bc-order/list',
      //   query: { ...row, openDtl: true, fromRoutePath: this.$route.path }
      // })
    },
    backToList() {
      this.showList = true
    },
    showBillDetail(row) {
      this.dataDtl = true
      this.back = false
      if (this.activeName == 'readyBill') {
        this.only = '0'
        this.billMem = '未分佣'
        this.searchParam.settleStatus=1
      } else if (this.activeName == 'settleFinsh') {
        this.only = '1'
        this.billMem = '待分佣'
        this.searchParam.settleStatus=2
      } else if (this.activeName == 'settleEnd') {
        this.only = '2'
        this.billMem = '已分佣'
        this.searchParam.settleStatus=3
      }
      this.settleNo=row.settleNo?row.settleNo:''
      this.storeName=row.storeName
      this.activeName = 'dataDtl'
      this.searchParam.settleNo = row.settleNo
      this.searchParam.storeId = row.storeId
      this.searchParam.pageNum=1
      let param = this.searchParam
      getMethod('/settlement/wait-detail-list', param).then(res => {
        console.log(res, '数据')
        this.$set(this.billCashData, 'list', res.data.records)
        // this.billCashData.list = res.data.records
        this.billCashData.total = res.data.total
        this.showPagination = this.billCashData.total == 0
      })
    },
    backTo() {
      this.searchParam= {
        storeName:'',
        orderNo: '',
        settleNo:'',
        startTime: '',
        endTime: '',
        pageSize: 10,
        pageNum: 1
      }
      if (this.only == '0') {
        this.activeName = 'readyBill'
        this.loadList()
      } else if (this.only == '1') {
        this.activeName = 'settleFinsh'
        this.loadListOne()
      } else if (this.only == '2') {
        this.activeName = 'settleEnd'
        this.loadListTwo()
      }
      this.back = true
      this.dataDtl = false
    },
    handleClick(tab, event) {
      this.searchParam= {
        storeName:'',
        orderNo: '',
        settleNo:'',
        startTime: '',
        endTime: '',
        pageSize: 10,
        pageNum: 1
      },
      this.tabIndex = tab.index
      if (tab.index == 0) {
        this.back = true
        this.dataDtl = false
        this.loadList()
      } else if (tab.index == 1) {
        this.back = true
        this.dataDtl = false
        this.loadListOne()
      } else if (tab.index == 2) {
        this.back = true
        this.dataDtl = false
        this.loadListTwo()
      }
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },
    currentPageOne(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadListOne()
    },
    currentPageTwo(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadListTwo()
    },
    currentPageDetail(pageNum) {
      this.searchParam.pageNum = pageNum
      this.searchDtl()

    },
    loadList() {
      let scope = this
      let param = this.searchParam
      getMethod('/settlement/store-wait-list', param).then(res => {
        if (scope.tabIndex == 0) {
          this.$set(this.noBillData, 'list', res.data.records)
          // scope.noBillData.list = res.data.records
          scope.noBillData.total = res.data.total
          scope.showPagination = scope.noBillData.total == 0
        }

      })
    },
    loadListOne() {
      let scope = this
        let param = this.searchParam
        param.settleStatus=1
        getMethod('/settlement/store-process-list', param).then(res => {
          this.$set(this.settleFinshData, 'list', res.data.records)
          // scope.settleFinshData.list = res.data.records
          scope.settleFinshData.total = res.data.total
          scope.showPagination = scope.settleFinshData.total == 0
        })
    },
    loadListTwo() {
      let scope = this
      let param = this.searchParam
      param.settleStatus=2
      getMethod('/settlement/store-process-list', param).then(res => {
        this.$set(this.settleEndData, 'list', res.data.records)
          // scope.settleEndData.list = res.data.records
          scope.settleEndData.total = res.data.total
          scope.showPagination = scope.settleEndData.total == 0
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

$table-list-height: 6vh;

.my-tab-label {
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 30px;
  //color: $fontColor;
  font-size: 16px;
  padding: 0px 10px;
}

.bill-tab-list > > > .el-tabs__nav-wrap {
  overflow: hidden;
  margin-bottom: -1px;
  position: relative;
  background: $lightBGColor;
}

.bill-tab-list > > > .el-tabs__nav-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
  z-index: 1;
}

.bill-tab-list > > > .el-tabs__nav-scroll {
  overflow: hidden;
  height: $table-list-height;
  padding-left: 10px;
}

.bill-tab-list > > > .el-tabs__item {
  padding: 0 20px;
  height: $table-list-height;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: $table-list-height;
  display: inline-block;
  list-style: none;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 600;
  //color: #939393;
  position: relative;
}
.tabTd {
  display: flex;
  flex-wrap: nowrap;
  margin: 7px 10px;
  align-items: center;

}

</style>
