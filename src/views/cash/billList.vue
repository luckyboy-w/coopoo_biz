<template>
    <div style="padding-top:20px;width:100%">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" >
            <el-row style="line-height:40px;padding:10px 0px ">
                <el-col :span="1">流水号</el-col>
                <el-col :span="2"><el-input v-model="searchParam.billNo" placeholder=""></el-input></el-col>
                <el-col :span="1" style="padding-left:10px">订单号</el-col>
                <el-col :span="2"><el-input v-model="searchParam.orderNo" placeholder=""></el-input></el-col>
                <el-col :span="2" style="padding-left:10px">入账时间</el-col>
                <el-col :span="8">
                    <el-date-picker
                        v-model="searchParam.startTime"
                        type="date"
                        placeholder="开始日期">
                    </el-date-picker>
                    至
                    <el-date-picker
                        v-model="searchParam.endTime"
                        type="date"
                        placeholder="结束日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="8" style="padding-left:10px">
                      <el-button type="primary" @click="loadList()">搜索</el-button>
                      <el-button type="normal" @click="batchBill()" v-if="tabIndex == 0 && isCanBill">批量结算</el-button>
                      <el-button type="info" @click="exportData()">导出Excel</el-button>
                </el-col>
            </el-row>
             <el-row style="line-height:40px;padding:10px 0px ">
                <el-col v-if="!isCanBill" :span="24" style="color: red">今天不是结算日</el-col>
                <el-col :span="24">{{billDate}}</el-col>
            </el-row>
            <el-tab-pane label="可结算" name="readyBill" style="height:600px">
                <el-table
                    ref="noBillData"
                    :data="noBillData.list"
                    style="width: 100%; margin-bottom: 20px;"
                    row-key="id">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="billNo" label="流水号" min-width="24%"></el-table-column>
                    <el-table-column prop="orderNo" label="订单号" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="createTime" label="入账时间" min-width="24%">
                        <template slot-scope="scope">
                            {{scope.row.createTime | _formateDate}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderPrice" label="订单金额" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="实付金额" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="billMoney" label="结算金额" min-width="24%">
                    </el-table-column>
                    <el-table-column label="服务金额" min-width="24%">
                      <template slot-scope="scope">
                        {{ (scope.row.orderPrice - scope.row.billMoney).toFixed(2)  }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="pkBillId" label="操作" min-width="24%">
                      <template slot-scope="scope">
                        <el-link v-if="isCanBill" type="primary" @click="singleBill(scope.row)">结算</el-link>
                        <el-link type="primary" @click="showBillDetail(scope.row)">查看</el-link>
                      </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-show="noBillData.total != 0"
                    :total="noBillData.total"
                    background
                    layout="prev, pager, next"
                    @current-change="currentPage"
                    @prev-click="currentPage"
                    @next-click="currentPage"
                />
            </el-tab-pane>
            <!--<el-tab-pane label="未结算" name="noBill" style="height:600px">
                <el-table
                    ref="noBillData"
                    :data="noBillData.list"
                    style="width: 100%; margin-bottom: 20px;"
                    row-key="id">
                    <el-table-column prop="billNo" label="流水号" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="orderNo" label="订单号" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="createTime" label="入账时间" min-width="24%">
                        <template slot-scope="scope">
                            {{scope.row.createTime | _formateDate}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="billMoney" label="结算金额（元）" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="pkBillId" label="操作" min-width="24%">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="singleBill(scope.row)">结算</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-show="noBillData.total != 0"
                    :total="noBillData.total"
                    background
                    layout="prev, pager, next"
                    @current-change="currentPage"
                    @prev-click="currentPage"
                    @next-click="currentPage"
                />
            </el-tab-pane>-->
            <el-tab-pane label="结算中" name="settleFinsh" style="height:600px">
                <el-table
                    ref="settleFinshData"
                    :data="settleFinshData.list"
                    style="width: 100%; margin-bottom: 20px;"
                    row-key="id">
                     <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="billNo" label="流水号" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="orderNo" label="订单号" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="applyTime" label="申请时间" min-width="24%">
                        <template slot-scope="scope">
                            {{scope.row.applyTime | _formateDate}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="billMoney" label="结算金额（元）" min-width="24%">
                    </el-table-column>
                </el-table>
                 <el-pagination
                    v-show="settleFinshData.total != 0"
                    :total="settleFinshData.total"
                    background
                    layout="prev, pager, next"
                    @current-change="currentPage"
                    @prev-click="currentPage"
                    @next-click="currentPage"
                />
            </el-tab-pane>
            <el-tab-pane label="已结算" name="settleEnd" style="height:600px">
                <el-table
                    ref="settleEndData"
                    :data="settleEndData.list"
                    style="width: 100%; margin-bottom: 20px;"
                    row-key="id">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                   <el-table-column prop="billNo" label="流水号" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="orderNo" label="订单号" min-width="24%">
                    </el-table-column>
                    <el-table-column prop="billTime" label="结算时间" min-width="24%">
                        <template slot-scope="scope">
                            {{scope.row.billTime | _formateDate}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="billMoney" label="结算金额（元）" min-width="24%">
                    </el-table-column>
                </el-table>
                 <el-pagination
                    v-show="settleEndData.total != 0"
                    :total="settleEndData.total"
                    background
                    layout="prev, pager, next"
                    @current-change="currentPage"
                    @prev-click="currentPage"
                    @next-click="currentPage"
                />
            </el-tab-pane>
        </el-tabs>

      <el-dialog title="详情" :visible.sync="dialogTableVisible">
        <el-table :data="currentGoodsSkuInfoList">
          <el-table-column prop="goodName" label="商品名称"></el-table-column>
          <el-table-column prop="skuInfo" label="规格"></el-table-column>
          <el-table-column prop="goodSinglePrice" label="商品单价"></el-table-column>
          <el-table-column prop="goodNum" label="商品数量"></el-table-column>
          <el-table-column prop="goodCode" label="产品编号"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
</template>
<script>
import { getMethod, postMethod } from "@/api/request";
import { formatDate } from "@/api/tools.js"
import { getToken } from '@/utils/auth'


  export default {
    data() {
      return {
        dialogTableVisible: false,
        tabIndex:0,
        billDate:'',
        isCanBill: false,
        currentGoodsSkuInfoList: [],
        //10:未结算;20:结算中;30:已结算
        searchParam:{
            billType:'10',
            billNo:"",
            orderNo:"",
            startTime:null,
            endTime:null,
            pageSize:10,
            pageNum:1
        },
        activeName: 'readyBill',
        noBillData: {
            dataList:[],
            total:0
        },
        billCashData: {
            dataList:[],
            total:0
        },
        settleFinshData: {
            dataList:[],
            total:0
        },
        settleEndData: {
            dataList:[],
            total:0
        }
      };
    },
    filters:{
        _formateDate(time){
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm:ss')
        }
    },
    mounted() {
        this.searchParam.billType = "10"
        this.loadList();
        this.loadBillCfgData();;
    },
    methods: {
      exportData(){
          let jsonParam = JSON.stringify(this.searchParam)

            let param = [];
            for(let key in this.searchParam){
                if(null != this.searchParam[key]){
                    param.push(key+'='+this.searchParam[key])
                }
            }

          //window.open(process.env.VUE_APP_BASE_API+'/bu/orderBill/export?_messageId='+getToken()+"&"+param.join("&"));
          window.open(process.env.VUE_APP_BASE_API+'/bu/orderBill/export?_messageId='+getToken());
      },
      batchBill(){
        let selData = this.$refs.noBillData.selection
        let id = [];
        selData.forEach(data=>{
            id.push(data.pkBillId)
        });
        this.billOrd(id.join(","))
      },
      singleBill(row){
        let scope = this


        this.$confirm("是否进行结算操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "success"
        }).then(() => {
            scope.billOrd(row)
        });
      },
      showBillDetail(row){
        console.info(row.orderNo)
        this.dialogTableVisible = true
        let param = {
          orderNo: row.orderNo
        }
        postMethod("/bc/order/getOrdDtl", param).then(res => {
          this.currentGoodsSkuInfoList = res.data
          console.info(res)

        });
      },
      loadBillCfgData(){
          let scope = this
          getMethod("/bu/orderBill/findBillDate", {}).then(res => {
                let evalData = eval("("+res.data+")");
                if(evalData.length == 0){
                    scope.billDate  = '暂时没有最新的结算日'
                }else{
                  let now = new Date();
                  const day = String(now.getDate()).padStart(2,'0')

                  for (let i = 0; i < evalData.length; i++) {
                    let compareDay = evalData[i].split("-")[2]
                    evalData[i] = compareDay
                    if (!this.isCanBill) {
                      this.isCanBill = day == compareDay
                    }
                  }
                  scope.billDate  = '每月结算日是：'+evalData.join("，");
                }
          });
      },
      billOrd(bill){
        let scope = this
        let param = {
            pkBillId:bill.pkBillId,
            tenantId:bill.tenantId
        }
        postMethod("/bu/orderBill/billOrd", param).then(res => {
            // if(res.data == '-1'){
            //     this.$message.error("结算失败，今天不是结算日");
            // }else{
            //     scope.loadList()
            // }
            this.$message({
                message: "提交结算成功,请在结算中的页签查询结算进度.",
                type: "success"
            });
            scope.loadList()

        });
      },
      handleClick(tab, event) {
        this.tabIndex = tab.index
        if(tab.index == 0 ){
            this.searchParam.billType = "10"
        }else if(tab.index == 1 ){
            this.searchParam.billType = "10"
        }else if(tab.index == 2 ){
            this.searchParam.billType = "20"
        }else {
            this.searchParam.billType = "30"
        }
        this.loadList();
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      loadList(){
        let scope = this
        let param = this.searchParam
        postMethod("/bu/orderBill/findListPost", param).then(res => {
            if(scope.tabIndex == 0){
                scope.noBillData = res.data
                //scope.noBillData = res.data.total
            }else if(scope.tabIndex == 0){
                scope.noBillData = res.data
                //scope.noBillData = res.data.total
            }else if(scope.tabIndex == 2){
                scope.settleFinshData = res.data
                // scope.settleFinshData.dataList = res.data.list
                // scope.settleFinshData.total = res.data.total
            }else{
                scope.settleEndData = res.data
                // scope.settleEndData.dataList = res.data.list
                // scope.settleEndData.total = res.data.total
            }

        });
      }
    }
  };
</script>
