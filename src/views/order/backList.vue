<template>
  <div>
    <div v-if="showList">
      <div class="ly-container" v-if="!showOrdDtl">
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>订单编号：</div>
            <div><el-input v-model="searchParam.orderNo" width="180px" placeholder="请输入" /></div>
          </div>
          <div class="tabTd">
            <div>商品名称：</div>
            <div><el-input v-model="searchParam.goodsName" width="180px" placeholder="请输入" /></div>
          </div>
          <div class="tabTd">
            <div>买家姓名：</div>
            <div><el-input v-model="searchParam.buyerName" width="180px" placeholder="请输入" /></div>
          </div>
          <div class="tabTd">
            <div>买家手机号：</div>
            <div><el-input v-model="searchParam.buyerMobile" width="180px" placeholder="请输入" /></div>
          </div>
          <div class="tabTd">
            <div>门店名称：</div>
            <div><el-input v-model="searchParam.storeName" width="180px" placeholder="请输入" /></div>
          </div>
          <div class="tabTd">
            <div>支付方式：</div>
            <div>
              <el-select v-model="searchParam.payType" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="2" label="微信"></el-option>
                <el-option value="1" label="支付宝"></el-option>
                <el-option value="3" label="余额"></el-option>
              </el-select>
            </div>
          </div>
          <div class="tabTd">
            <div>注册手机号：</div>
            <div><el-input v-model="searchParam.registerPhoneNo" width="180px" placeholder="请输入" /></div>
          </div>
          <div class="tabTd">
            <div>下单时间：</div>
            <div><el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.orderStartTime" type="date" placeholder="开始时间"></el-date-picker></div>
            <div style="padding: 0 6px;">至</div>
            <div><el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.orderEndTime" type="date" placeholder="结束时间"></el-date-picker></div>
          </div>
          <div class="tabTd">
            <el-button icon="el-icon-search" type="primary" @click="search()">搜索</el-button>
            <!-- <el-button type="primary" icon="el-icon-download" @click="exportData()">导出</el-button> -->
          </div>
        </div>
        <!-- <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd">
            <div>
              <el-checkbox @change="allGoodsChecked(isChecked)" :checked="isChecked">&nbsp;&nbsp;全选</el-checkbox>
            </div>
          </div>
          <div class="tabTd">
            <el-button icon="el-icon-s-promotion" type="primary" @click="bulkDelivery()">
              批量发货
            </el-button>
          </div>
         </div> -->
        <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
          <div class="tabTd"><el-button type="primary" @click="returnGoods()">退货通知设置</el-button></div>
        </div>
        <div class="ly-table-panel">
          <div class="content1">
            <el-table :data="tableData.list" border row-key="orderId" style="width: 100%">
              <el-table-column width="1">
                <template slot-scope="scope">
                  <div class="item">
                    <span style="margin-left:150px">
                      <!-- <el-checkbox v-model="scope.row.isChecked" :checked="scope.row.isChecked?scope.row.isChecked:false" @change="changeGoodsChecked(scope.row)"></el-checkbox> -->
                      订单编号：{{ scope.row.orderNo }}
                    </span>
                    <span style="margin-left:150px">订单总额：{{ scope.row.orderPayAmount }}</span>
                    <span style="margin-left:150px">下单时间：{{ scope.row.createTime }}</span>
                    <span style="margin-left:150px">注册手机号：{{ scope.row.registerPhoneNo }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品" align="center" width="400">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty">
                    <div style="position: relative;">
                      <img class="imgSty" :src="item.goodsImage" alt="" />
                      <div v-if="scope.row.isVipOrder == 1" style="width: 50px;background-color: #409EFF;position: absolute;top: 0;right: 0;color:white;border-radius: 5px;">
                        专属
                      </div>
                    </div>
                    <div class="mesFont">
                      <p>{{ item.goodsName }}</p>
                      <p style="font-size: 12px;color:#909399;margin-top: 10px;">{{ item.skuText }}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="60" label="单价">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                    <div>{{ item.goodsPrice }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="60" label="数量">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                    <div>{{ item.goodsNum }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="70" label="商品状态">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                    <div>
                      <span style="line-height: 50px;">{{ item.orderItemStatus | goodsText }}</span>
                      <div v-if="item.orderItemStatus == 10 && scope.row.isVipOrder != 1">
                        <el-button type="primary" size="mini" @click="confirmReturn(item)">确认退货</el-button>
                      </div>
                      <div v-if="item.orderItemStatus == 12"><el-button type="primary" size="mini" @click="confirmRejection(item)">确认拒收</el-button></div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="70" label="实付金额">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                    <div>
                      {{ item.goodsPrice * item.goodsNum }}
                      <br />
                      <div v-if="scope.row.isEnjoyBeforePay == 1">先享后付</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="100" align="center" label="买家">
                <template slot-scope="scope">
                  <div class="mesSty2">
                    <div>
                      {{ scope.row.buyerName }}
                      <br />
                      {{ scope.row.buyerMobile }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="140" align="center" label="门店名称">
                <template slot-scope="scope">
                  <div class="mesSty2">{{ scope.row.storeName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center" fixed="right" min-width="230">
                <template slot-scope="scope">
                  <div class="mesSty2">
                    <template>
                      <div>
                        <div>{{ scope.row.orderStatus | statuts2Text }}</div>
                        <div><el-button type="text" size="mini" @click="getOrdDtl(scope.row)">订单详情</el-button></div>
                      </div>
                    </template>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="ly-data-pagination">
            <el-pagination
              v-show="!showPagination"
              :total="tableData.total"
              background
              layout="prev, pager, next"
              @current-change="currentPage"
              @prev-click="currentPage"
              @next-click="currentPage"
              :page-size="searchParam.pageSize"
              :current-page="searchParam.pageNum"
            />
          </div>
        </div>
        <div class="list-panel" />
      </div>

      <div v-if="showOrdDtl">
        <el-row :gutter="20" style="line-height:40px;font-size:12px">
          <el-col :span="24"><el-button type="primary" size="small" icon="el-icon-back" @click="handlerReturnPOrderList">返回列表</el-button></el-col>
        </el-row>
        <div class="notic-container">
          <span class="title">订单状态: {{ ordDtl.orderStatus | statuts2Text }}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="content">订单编号: {{ ordDtl.orderNo }}</span>
        </div>
        <div>
          <el-row>
            <el-table :data="ordDtl.orderItemList" border>
              <el-table-column align="center" header-align="center" prop="goodsImage" label="商品图片">
                <template slot-scope="scope">
                  <el-avatar shape="square" :size="150" :src="scope.row.goodsImage"></el-avatar>
                </template>
              </el-table-column>
              <el-table-column align="center" header-align="center" prop="goodsName" label="商品名称"></el-table-column>
              <el-table-column align="center" header-align="center" prop="skuText" label="规格"></el-table-column>
              <el-table-column align="center" header-align="center" prop="goodsPrice" label="商品单价"></el-table-column>
              <el-table-column align="center" header-align="center" prop="goodsNum" label="商品数量" width="150px"></el-table-column>
              <el-table-column align="center" header-align="center" label="商品总价">
                <template slot-scope="scope">
                  {{ (scope.row.goodsPrice * scope.row.goodsNum).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column align="center" header-align="center" prop="goodsCode" label="商品货号"></el-table-column>
            </el-table>
          </el-row>
        </div>

        <div class="info-container">
          <span class="main-title"><el-col :span="24">付款信息</el-col></span>
          <el-row :gutter="20" class="main-content">
            <el-col :span="6">付款方式：{{ ordDtl.payChannel | pay2Text }}</el-col>
            <el-col :span="6">订单金额：{{ ordDtl.orderAmount }}</el-col>
            <el-col :span="6">应付金额：{{ ordDtl.orderActualPayAmount }}</el-col>
            <el-col :span="6">第三方支付：{{ ordDtl.orderPayAmount }}</el-col>
          </el-row>
          <el-row :gutter="20" class="main-text">
            <el-col :span="6">优惠券金额：{{ ordDtl.couponFaceValue }}</el-col>
            <el-col :span="6">余额：{{ ordDtl.balance }}</el-col>
			<el-col :span="6">
			  专属折扣：{{ ordDtl.discountAmount?ordDtl.discountAmount:'0' }}
			</el-col>
          </el-row>
        </div>
        <div v-if="ordDtl.deliveryMethod == 1" class="info-container">
          <!--        收货人信息-->
          <span class="main-title"><el-col :span="24">收货信息</el-col></span>
          <el-row :gutter="20" class="main-content">
            <el-col :span="6">收货人：{{ ordDtl.receiverName }}</el-col>
            <el-col :span="6">收货人电话：{{ ordDtl.receiverPhone }}</el-col>
            <el-col :span="12">收货地址：{{ ordDtl.receiverProvince }}{{ ordDtl.receiverCity }}{{ ordDtl.receiverRegion }}{{ ordDtl.receiverAddress }}</el-col>
          </el-row>
        </div>
        <div v-if="ordDtl.deliveryMethod == 2" class="info-container">
          <!--        提货信息-->
          <span class="main-title"><el-col :span="24">提货信息</el-col></span>
          <el-row :gutter="20" class="main-content">
            <el-col :span="6">预约时间：{{ ordDtl.appointmentDate }}</el-col>
            <el-col :span="6">预留手机号：{{ ordDtl.appointmentMobile }}</el-col>
            <el-col :span="12">提货门店：{{ ordDtl.memberStoreName }}</el-col>
          </el-row>
          <el-row :gutter="20" class="main-content">
            <el-col :span="6">核销时间：{{ ordDtl.exchangeDate }}</el-col>
          </el-row>
        </div>

        <div v-if="ordDtl.receiptTitle" class="info-container">
          <!--        发票信息-->
          <span class="main-title"><el-col :span="24">发票信息</el-col></span>
          <el-row :gutter="20" class="main-content">
            <el-col :span="6">发票抬头：{{ ordDtl.receiptTitle == '1' ? '公司' : '个人' }}</el-col>
            <el-col :span="6">手机号码：{{ ordDtl.receiptMobile }}</el-col>
            <el-col :span="6">邮箱：{{ ordDtl.receiptEmail }}</el-col>
            <el-col :span="6">发票内容：{{ ordDtl.receiptContent }}</el-col>
          </el-row>
          <el-row :gutter="20" class="main-content">
            <el-col :span="6" v-if="ordDtl.receiptTitle == '1'">公司名称：{{ ordDtl.receiptCompanyName }}</el-col>
            <el-col :span="6" v-if="ordDtl.receiptTitle == '2'">开票人名称：{{ ordDtl.receiptPersonName }}</el-col>
            <el-col :span="6" v-if="ordDtl.receiptTitle == '1'">公司税号：{{ ordDtl.receiptCompanyTaxNo }}</el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </div>
        <!--        物流信息-->
        <div style="width: 100%;display: flex;">
          <div
            style="width: 60%; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
       padding:10px 20px;margin:20px 15px 10px 0;"
          >
            <el-carousel v-if="ordDtl.expressRouteInfoList && ordDtl.expressRouteInfoList.length >= 1" trigger="click" style="padding-bottom: 30px;">
              <el-carousel-item v-for="expressItem in ordDtl.expressRouteInfoList">
                <el-row :gutter="20" style="line-height:40px" class="main-title">
                  <el-col class="main-title" v-if="expressItem.type == 1" :span="18">发货物流</el-col>
                  <el-col v-if="expressItem.type == 2" :span="18">退货物流</el-col>
                  <el-col :span="6">共{{ ordDtl.expressRouteInfoList.length }}条</el-col>
                </el-row>
                <el-row :gutter="20" class="main-text">
                  <el-col :span="8">物流公司：{{ expressItem.expressCompanyName }}</el-col>
                  <el-col :span="10">快递单号：{{ expressItem.logisticCode }}</el-col>
                </el-row>
                <div>
                  <div v-if="!expressItem.traces||expressItem.traces==null">
                    物流单号错误
                  </div>
                  <div class="steps-view" v-if="expressItem.traces&&expressItem.traces!=null">
                    <div class="steps" v-for="tracesItem in expressItem.traces">
                      <div style="min-width: 100px;text-align: right;">
                        <div>{{ tracesItem.time1 }}</div>
                        <div>{{ tracesItem.time2 }}</div>
                      </div>
                      <div class="steps-node"></div>
                      <div>
                        <div>{{ tracesItem.text }}</div>
                        <div>{{ tracesItem.acceptStation }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <el-row :gutter="20" v-if="!ordDtl.expressRouteInfoList || ordDtl.expressRouteInfoList.length == 0" style="line-height:40px">
              <el-col style="font-size: 19px;font-weight: 600;" :span="24">物流信息</el-col>
            </el-row>
            <div v-if="!ordDtl.expressRouteInfoList || ordDtl.expressRouteInfoList.length == 0">暂无物流信息</div>
          </div>
          <div
            style="width: 40%; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
       padding:10px 20px;margin:20px 0px 10px 0;"
          >
            <el-row :gutter="20" style="line-height:40px"><el-col style="font-size: 19px;font-weight: 600;" :span="24">备注</el-col></el-row>
            <div>{{ ordDtl.remark ? ordDtl.remark : '暂无备注' }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="" :visible="sendEval" width="400px" :before-close="handleClose" :close-on-click-modal="false">
      <el-form ref="form" label-width="120px">
        <el-form-item label="退货通知手机号:"><el-input v-model="phoneNo" maxlength="11" clearable type="text" @blur="phoneNo = $event.target.value" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendReply()">保存</el-button>
          <el-button plain type="primary" @click="handleClose()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request';
import { formatDate } from '@/api/tools.js';
import { getToken } from '@/utils/auth.js';
export default {
  components: {},
  filters: {
    taxType2Text(type) {},
    _formatDate(time) {
      if (time == undefined) {
        return '尚未支付，暂无时间';
      }
      const date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    },
    pay2Text(pay) {
      if (pay == 1) {
        return '支付宝';
      } else if (pay == 2) {
        return '微信';
      } else if (pay == 3) {
        return '余额';
      }
      return '未支付';
    },
    statuts2Text(status) {
      // 订单状态 0:已取消 1:已提交 2:待支付 3:退款中 4:退款完成 5:待取件 6:待发货 7:待收货 8:交易完成 9:拒收 10:拒收完成 11:退货中 12:退货完成
      let statusText = '';
      if (status == '0') {
        statusText = '已取消';
      } else if (status == '1') {
        statusText = '已提交';
      } else if (status == '2') {
        statusText = '待支付';
      } else if (status == '3') {
        statusText = '退款中';
      } else if (status == '4') {
        statusText = '退款完成';
      } else if (status == '5') {
        statusText = '待取件';
      } else if (status == '6') {
        statusText = '待发货';
      } else if (status == '7') {
        statusText = '待收货';
      } else if (status == '8') {
        statusText = '交易完成';
      } else if (status == '9') {
        statusText = '拒收';
      } else if (status == '10') {
        statusText = '拒收完成';
      } else if (status == '11') {
        statusText = '退货中';
      } else if (status == '12') {
        statusText = '退货完成';
      } else if (status == '13') {
        statusText = '退货退款中';
      } else if (status == '14') {
        statusText = '拒收退款中';
      } else if (status == '15') {
        statusText = '待确认';
      }
      return statusText;
    },
    goodsText(status) {
      // 商品状态 0:已提交 1:可退款 2:发货中 3:退款中 4:退款失败 5:退款完成 6:待评价 7:已评价 8:退货待接单 9:退货已接单 10:退货中 11:退货完成 12:拒收 13:拒收完成 14:退货退款中 15:拒收退款中
      let statusText = '';
      if (status == '0') {
        statusText = '已提交';
      } else if (status == '1') {
        statusText = '可退款';
      } else if (status == '2') {
        statusText = '发货中';
      } else if (status == '3') {
        statusText = '退款中';
      } else if (status == '4') {
        statusText = '退款失败';
      } else if (status == '5') {
        statusText = '退款完成';
      } else if (status == '6') {
        statusText = '待评价';
      } else if (status == '7') {
        statusText = '已评价';
      } else if (status == '8') {
        statusText = '退货待接单';
      } else if (status == '9') {
        statusText = '退货已接单';
      } else if (status == '10') {
        statusText = '退货中';
      } else if (status == '11') {
        statusText = '退货完成';
      } else if (status == '12') {
        statusText = '拒收';
      } else if (status == '13') {
        statusText = '拒收完成';
      } else if (status == '14') {
        statusText = '退货退款中';
      } else if (status == '15') {
        statusText = '拒收退款中';
      }
      return statusText;
    }
  },
  data() {
    return {
      showList: true,
      showOrdDtl: false,
      sendEval: false,
      //物流轨迹信息数组
      logisticsList: [],
      showPagination: false,
      editData: [],
      phoneNo: '',
      searchParam: {
        registerPhoneNo: '',
        receiptStatus: '',
        buyerMobile: '',
        buyerName: '',
        goodsName: '',
        orderEndTime: '',
        orderNo: '',
        orderStartTime: '',
        orderStatus: '13',
        payType: '',
        storeName: '',
        pageSize: 10,
        pageNum: 1
      },
      tableData: {
        list: []
      }
    };
  },
  computed: {},
  mounted() {
    this.initLoad();
  },
  created() {},
  methods: {
    writeOff(row) {
      console.log(row);
      this.$confirm('是否确认核销订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/order/write-off-order?orderNo=' + row.orderNo).then(res => {
          this.loadList();
          this.$message('操作成功');
        });
      });
    },
    // 退货
    confirmReturn(row) {
      console.log(row);
      this.$confirm('该笔订单是否同意退货？', '提示', {
        confirmButtonText: '同意',
        cancelButtonText: '拒绝',
        type: 'warning'
      }).then(() => {
        this.$confirm('是否返还该商品库存?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        })
          .then(() => {
            getMethod('/express/confirm-return-order-item', { isReturnStock: 1, orderItemId: row.orderItemId }).then(res => {
              this.$message('操作成功');
              this.loadList();
            });
          })
          .catch(() => {
            getMethod('/express/confirm-return-order-item', { isReturnStock: 0, orderItemId: row.orderItemId }).then(res => {
              this.$message('操作成功');
              this.loadList();
            });
          });
      });
    },
    // 拒收
    confirmRejection(row) {
      console.log('row', row);
      this.$confirm('该笔订单是否同意拒收？', '提示', {
        confirmButtonText: '同意',
        cancelButtonText: '拒绝',
        type: 'warning'
      }).then(() => {
        this.$confirm('是否返还该商品库存?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        })
          .then(() => {
            getMethod('/express/confirm-reject-order-item', { isReturnStock: 1, orderItemId: row.orderItemId }).then(res => {
              this.$message('操作成功');
              this.loadList();
            });
          })
          .catch(() => {
            getMethod('/express/confirm-reject-order-item', { isReturnStock: 0, orderItemId: row.orderItemId }).then(res => {
              this.$message('操作成功');
              this.loadList();
            });
          });
      });
    },

    returnGoods() {
      getMethod('/order/get-notice-phone').then(res => {
        console.log(res);
        this.phoneNo = res.data;
        this.sendEval = true;
      });
    },
    handleClose(done) {
      this.phoneNo = '';
      this.sendEval = false;
    },
    sendReply() {
      let scope = this;
      console.log(scope.phoneNo);
      // return false
      if (scope.phoneNo == '') {
        this.$message({
          message: '请输入手机号',
          type: 'warning'
        });
        return false;
      }
      if (scope.phoneNo.length < 11) {
        this.$message({
          message: '请输入正确手机号',
          type: 'warning'
        });
        return false;
      }
      getMethod('/order/set-notice-phone?phoneNo=' + scope.phoneNo).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        });
        this.phoneNo = '';
        scope.sendEval = false;
      });
    },
    handlerReturnPOrderList() {
      this.showOrdDtl = false;
    },
    exportData() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = '';
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = '';
      }
      let param = {
        orderNo: this.searchParam.orderNo,
        recUname: this.searchParam.recUname,
        recMobile: this.searchParam.recMobile,
        isBackend: this.searchParam.isBackend,
        orderType: this.searchParam.orderType,
        isRequireTaxBill: this.searchParam.isRequireTaxBill,
        status: this.searchParam.status,
        startTime: this.searchParam.startTime,
        endTime: this.searchParam.endTime,
        riskOrder: this.searchParam.riskOrder,
        dataType: this.searchParam.dataType
      };
      if (param.payType == 3) {
        param.isBalanceOrder = 1;
        param.payType = '';
      } else {
        param.isBalanceOrder = '';
      }
      let exportParam = [];
      for (let key in param) {
        exportParam.push(key + '=' + param[key]);
      }
      //window.open( process.env.VUE_APP_BASE_API+'/backend/lyProvider/exportData?'+exportParam.join("&"))
      window.open(process.env.VUE_APP_BASE_API_NEW + '/order/export?token=' + getToken() + '&' + exportParam.join('&'));
    },
    async getOrdDtl(row) {
      const { data } = await getMethod('/order/goods-order-detail', {
        orderNo: row.orderNo
      });
      this.showOrdDtl = true;
      if (data.expressRouteInfoList && data.expressRouteInfoList.length >= 1) {
        data.expressRouteInfoList.forEach(item => {
          let arr = [];
          let text = '';
          let title = '';
          let status;
          item.traces.map(tracesItem => {
            if (tracesItem.acceptTime) {
              arr = tracesItem.acceptTime.split(' ');
            }
            tracesItem.time1 = arr[0].substring(0, 10);
            tracesItem.time2 = arr[1].substring(0, 8);
            status = tracesItem.action;
            if (status == 0) {
              tracesItem.text = '暂无轨迹信息';
            } else if (status == '1') {
              tracesItem.text = '已揽收';
            } else if (status == '2') {
              tracesItem.text = '运输中';
            } else if (status == 201) {
              tracesItem.text = '到达派件城市';
            } else if (status == 202) {
              tracesItem.text = '派件中';
            } else if (status == 211) {
              tracesItem.text = '已放入快递柜或驿站';
            } else if (status == 3) {
              tracesItem.text = '已签收';
            } else if (status == 301) {
              tracesItem.text = '已签收';
            } else if (status == 302) {
              tracesItem.text = '派件异常后最终签收';
            } else if (status == 304) {
              tracesItem.text = '代收签收';
            } else if (status == 311) {
              tracesItem.text = '快递柜或驿站签收';
            } else if (status == 4) {
              tracesItem.text = '问题件';
            } else if (status == 401) {
              tracesItem.text = '发货无信息';
            } else if (status == 402) {
              tracesItem.text = '超时未签收';
            } else if (status == 403) {
              tracesItem.text = '超时未更新';
            } else if (status == 404) {
              tracesItem.text = '拒收（退件）';
            } else if (status == 405) {
              tracesItem.text = '派件异常';
            } else if (status == 406) {
              tracesItem.text = '退货签收';
            } else if (status == 407) {
              tracesItem.text = '退货未签收';
            } else if (status == 412) {
              tracesItem.text = '快递柜或驿站超时未取';
            } else if (status == '001') {
              tracesItem.text = '已下单';
            } else if (status == '002') {
              tracesItem.text = '已发货';
            }
          });
        });
      }

      this.ordDtl = data;
    },
    search() {
      this.searchParam.pageSize = 10;
      this.searchParam.pageNum = 1;
      this.loadList();
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },
    initLoad() {
      this.loadList();
    },
    loadList() {
      const scope = this;
      let params = Object.assign({}, scope.searchParam);
      if (params.payType == 3) {
        params.isBalanceOrder = 1;
        params.payType = '';
      } else {
        params.isBalanceOrder = '';
      }
      postMethod('/order/goods-order-list', params).then(res => {
        res.data.records.forEach(item => {
          item.isChecked = false;
        });
        scope.tableData.list = res.data.records;
        scope.tableData.total = res.data.total;
        scope.showPagination = scope.tableData.total == 0;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.el-carousel__item {
  overflow-y: auto !important;
}

.ly-container {
  font-size: 14px;

  .ly-tool-panel {
    td {
      white-space: nowrap;
    }

    margin-bottom: 1vh;
  }
}

.tabTd {
  display: flex;
  flex-wrap: nowrap;
  margin: 7px 10px;
  align-items: center;
}

.step-container {
  height: 20vh;
  padding-top: 8vh;
  //background: #abc;

  .step-icon {
    padding: 5px;
    background: $heavyBGColor;
  }
}

.notic-container {
  overflow: hidden;
  line-height: 70px;
  background: $lightThemeColor;
  // text-align: center;
  padding-left: 20px;
  margin-bottom: 3vh;

  .avatar {
    width: 80px;
    height: 80px;
    margin: 20px auto;
  }

  .title {
    color: #545454;
    line-height: 42px;
    font-weight: 600;
    font-size: 20px;
    font-family: PingFang SC;
  }

  .content {
    margin-top: 20px;
    color: #545454;
    line-height: 28px;
    font-weight: 400;
    font-size: 20px;
    display: inline-block;
  }
}

.info-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 20px;
  margin-top: 20px;

  .main-title {
    display: inline-block;
    width: 100%;
    // margin-top: 3vh;
    font-size: 19px;
    font-weight: 600;
  }

  .main-content {
    font-weight: 400;
    font-size: 16px;
    line-height: 40px;
  }
}

.step-container >>> .el-step__title.is-process {
  font-weight: normal;
  color: #c0c4cc;
}

.el-pagination {
  white-space: nowrap;
  padding: 2px 0px;
  color: #303133;
  font-weight: bold;
}

.el-pagination >>> .btn-prev {
  margin: 0 5px 0 0;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}

.el-avatar {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
  color: #fff;
  background: transparent;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  text-align: -webkit-center;
}

.steps-view {
  padding: 0 20px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

.steps-view::before {
  content: '';
  position: absolute;
  width: 2px;
  background-color: #d8d8d8;
  height: calc(100% - 0px);
  left: 138px;
  z-index: 2;
}

.steps {
  display: flex;
  min-height: 60px;
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 20px;
  height: auto;
}

.steps-node {
  background-color: #d8d8d8;
  min-width: 18px;
  border-radius: 25px;
  height: 18px;
  margin: 0 30px 0 10px;
}
</style>
<style scoped>
.el-table--enable-row-transition /deep/ .cell {
  padding: 0;
}

.item {
  width: 100vw;
  background: #f1f1f1;
  position: absolute;
  top: 0;
  left: -55px;
  z-index: 1;
  height: 50px;
  line-height: 50px;
}
</style>
<style scoped>
.imgSty {
  width: 100px;
  height: 100px;
  display: block;
  margin-left: 10px;
}

.mesSty {
  height: 150px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 10px;
  border-bottom: 1px solid #ebeef5;
}

.mesSty:first-child {
  margin-top: 50px;
}

.mesSty:last-child {
  border-bottom: none;
}

.mesSty2 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1px;
  height: 150px;
  border-bottom: 1px solid #ebeef5;
}

.mesSty2:last-child {
  border-bottom: none;
}

.content1 >>> .el-table--border td:nth-child(2) {
  padding: 0;
}

.content1 /deep/ .el-table__row td:nth-child(n + 3) .cell {
  position: absolute !important;
  top: 50px !important;
  width: 100%;
  text-align: center;
}

.content1 /deep/ .el-table__row td:nth-child(1) .cell {
  position: absolute !important;
  top: 0px !important;
  z-index: 999;
  width: 100vw;
  height: 50px;
  line-height: 50px;
}

.pb_sty span {
  background: #1dc8de;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;
}

.mesFont p {
  text-align: left !important;
  margin-block-start: 0;
  margin-block-end: 0;
  padding: 0 10px;
}

.mesFont p:nth-child(2) {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
