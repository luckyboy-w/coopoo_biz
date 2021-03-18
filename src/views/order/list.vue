<template>
  <div>
    <div class="ly-container" v-if="!showOrdDtl">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <!-- <table>
          <tr> -->
        <div class="tabTd">
          <div>订单编号：</div>
          <div>
            <el-input v-model="searchParam.orderNo" width="180px"/>
          </div>
        </div>

        <div class="tabTd">
          <div>快递单号：</div>
          <div>
            <el-input v-model="searchParam.expressNo" width="180px"/>
          </div>
        </div>

        <div class="tabTd">
          <div>买家姓名：</div>
          <div>
            <el-input v-model="searchParam.recUname" width="180px"/>
          </div>
        </div>

        <div class="tabTd">
          <div>买家电话：</div>
          <div>
            <el-input v-model="searchParam.recPhone" width="180px"/>
          </div>

        </div>


        <div class="tabTd">
          <div>订单状态：</div>
          <div>
            <el-select v-model="searchParam.status" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="0" label="已取消"></el-option>
              <el-option value="10" label="待发货"></el-option>
              <el-option value="20" label="待收货"></el-option>
              <el-option value="30" label="待支付"></el-option>
              <el-option value="40" label="已退货"></el-option>
              <el-option value="41" label="退货中"></el-option>
              <el-option value="60" label="定制信息确认中"></el-option>
            </el-select>
          </div>
        </div>

        <div class="tabTd">
          <div>下单时间：</div>
          <div>
            <el-date-picker style="width:203px" value-format="yyyy-MM-dd" v-model="searchParam.startTime" type="date"
                            placeholder="开始时间"
            >
            </el-date-picker>
          </div>
          <div>至</div>
          <div>
            <el-date-picker style="width:195px" value-format="yyyy-MM-dd" v-model="searchParam.endTime" type="date"
                            placeholder="结束时间"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="tabTd">
          <div>是否需要开发票：</div>
          <div>
            <el-select v-model="searchParam.isRequireTaxBill" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="是"></el-option>
              <el-option value="0" label="否"></el-option>

            </el-select>
          </div>
        </div>

        <div class="tabTd">
          <div>是否超期未付款：</div>
          <div>
            <el-select v-model="searchParam.isOverDuePayment" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="是"></el-option>
              <el-option value="0" label="否"></el-option>
            </el-select>
          </div>
        </div>

        <div class="tabTd">
          <el-button icon="el-icon-search" @click="search()">搜索</el-button>
          <el-button icon="el-icon-download" @click="expordivata()">导出</el-button>
        </div>
        <div class="tabTd">
          <el-button v-if="searchParam.status == 10" @click="showOnlineBatchSendOrder()" type="primary">在线批量发货
          </el-button>
          <el-button v-if="searchParam.status == 10" @click="showOfflineBatchSendOrder()" type="primary">线下批量发货
          </el-button>
          <el-button @click="showBatchOrderPrintTemplateWindow()" type="primary">批量打印</el-button>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="orderId"
            border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  :data="props.row.supplierList[0].dtlList"
                  style="width: 100%; margin-bottom: 20px;"
                  border
                >
                  <el-table-column prop="goodName" label="商品名称" width="400px"></el-table-column>
                  <el-table-column prop="goodSinglePrice" label="商品单价" width="150px"></el-table-column>
                  <el-table-column prop="goodNum" label="商品数量" width="150px"></el-table-column>
                  <el-table-column prop="dtlStatus" label="商品状态" width="150px">
                    <template slot-scope="scope">
                      <!-- <span v-if="scope.row.dtlStatus == '0'">正常</span>
                       <span v-if="scope.row.dtlStatus == '10'">正常</span>
                       <span v-if="scope.row.dtlStatus == '20'">正常</span>
                       <span v-if="scope.row.dtlStatus == '30'">正常</span>
                       <span v-if="scope.row.dtlStatus == '40'">正常</span>
                       <span v-if="scope.row.dtlStatus == '50'">正常</span> -->
                      <span v-if="scope.row.dtlStatus != '60'&&'70'">正常</span>
                      <span v-if="scope.row.dtlStatus == '60'">退货中</span>
                      <span v-if="scope.row.dtlStatus == '70'">退货已完成</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="skuInfo" label="规格" width="150px"></el-table-column>
                  <el-table-column prop="goodCode" label="商品货号" width="150px"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="orderNo" label="订单编号" width="270px">
              <template slot-scope="scope">
                {{ scope.row.orderNo }}
                <el-tag
                  v-if="scope.row.isPrintedTemplate == '1'"
                  effect="light"
                  size="mini"
                >
                  已打印
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="expressNo" label="快递单号" width="220px"/>
            <el-table-column prop="createTime" label="下单时间" width="150px">
              <template slot-scope="scope">
                {{ scope.row.createTime | _formatDate }}
              </template>
            </el-table-column>
            <el-table-column prop="recUname" label="买家姓名" width="120px"/>
            <el-table-column prop="recPhone" label="买家手机号码" width="120px"/>
            <el-table-column prop="taxId" label="是否需要开发票" width="150px">
              <template slot-scope="scope">
                {{ scope.row.taxId != undefined && scope.row.taxId != '' ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="150px">
              <template slot-scope="scope">
                {{ scope.row | statuts2RowText }}
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="订单类型" width="150px">
              <template slot-scope="scope">
                {{ scope.row.orderType | type2Text }}
              </template>
            </el-table-column>

            <el-table-column prop="ordPrice" label="订单总价" width="150px">
              <template slot-scope="scope">
                {{ scope.row | fmtPrice }}
              </template>
            </el-table-column>
            <el-table-column prop="ordPayPrice" label="实付金额" width="150px">
              <template slot-scope="scope">
                {{ scope.row | fmtPayPrice }}
              </template>
            </el-table-column>
            <!-- 订单状态;0:订单被取消;10:已提交,待发货20;已发货,待收货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价; -->
            <el-table-column fixed="right" prop="id" label="操作" width="260px">
              <template slot-scope="scope">
                <el-button-group>
                  <template v-if="scope.row.orderType == 1 ">
                    <!--                  <el-link type="primary" v-if="scope.row.status == 10" @click="sendOrd(scope.row)">发货</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.status == 10"
                      @click="sendOrd(scope.row)"
                    >
                      发货
                    </el-button>

                    <!--                  <el-link type="primary" v-if="scope.row.status == 20" @click="updataOrd(scope.row)">修改快递</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.status == 20"
                      @click="updataOrd(scope.row)"
                    >
                      修改快递
                    </el-button>

                    <!-- 发货后七天可以手动确认 -->
                    <!--                  <el-link type="primary" v-if="scope.row.isRiskOrder == '1' && scope.row.status == 20" @click="dealOrd(scope.row)">确认收货</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.isRiskOrder == '1' && scope.row.status == 20"
                      @click="dealOrd(scope.row)"
                    >确认收货
                    </el-button>

                    <!--                  这个本来就是注释的 不改-->
                    <!--<el-link type="primary" v-if="scope.row.status == 20" @click="collect(scope.row)" >发起收款</el-link>-->

                    <!--                  <el-link type="primary" @click="cancelOrd(scope.row)" v-if="scope.row.status == 10">取消订单</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.status == 10"
                      @click="cancelOrd(scope.row)"
                    >
                      取消订单
                    </el-button>


                    <!--                  <el-link type="primary" @click="getOrdDtl(scope.row)">查看订单</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      @click="getOrdDtl(scope.row)"
                    >查看订单
                    </el-button>

                  </template>
                  <template v-if="scope.row.orderType == 2 ">
                    <!--                    <el-link type="primary" v-if="scope.row.status == 10" @click="sendOrd(scope.row)">发货</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.status == 10"
                      @click="sendOrd(scope.row)"
                    >
                      发货
                    </el-button>

                    <!--                    <el-link type="primary" v-if="scope.row.status == 20" @click="dealOrd(scope.row)">确认收货</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.status == 20"
                      @click="dealOrd(scope.row)"
                    >
                      确认收货
                    </el-button>

                    <!--                    <el-link type="primary" @click="cancelOrd(scope.row)" v-if="scope.row.status == 10">取消订单</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.status == 10"
                      @click="cancelOrd(scope.row)"
                    >
                      取消订单
                    </el-button>

                    <!--                    <el-link type="primary" @click="getOrdDtl(scope.row)">查看订单</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      @click="getOrdDtl(scope.row)"
                    >
                      查看订单
                    </el-button>
                  </template>
                  <template v-if="scope.row.orderType == 4 ">
                    <!--                    <el-link type="primary" v-if="scope.row.status == 10" @click="sendOrd(scope.row)">发货</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.status == 10"
                      @click="sendOrd(scope.row)"
                    >
                      发货
                    </el-button>

                    <!-- 发货后七天可以手动确认 -->
                    <!--                    <el-link type="primary" v-if="scope.row.isRiskOrder == '1' && scope.row.status == 20" @click="dealCustomOrd(scope.row)">确认收货</el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.isRiskOrder == '1' && scope.row.status == 20"
                      @click="dealCustomOrd(scope.row)"
                    >
                      确认收货
                    </el-button>

                    <!--                    <el-link type="primary" v-if="scope.row.status == 60" @click="collectCus(scope.row)">发起定价收款</el-link>-->
                    <el-button type="primary" size="mini" v-if="scope.row.status == 60" @click="collectCus(scope.row)">
                      发起定价收款
                    </el-button>

                    <!--                    <el-link type="primary" @click="getOrdDtl(scope.row)">查看订单</el-link>-->
                    <el-button type="primary" size="mini" @click="getOrdDtl(scope.row)">
                      查看订单
                    </el-button>

                    <!--                    <el-link type="primary" @click="cancelOrd(scope.row)" v-show="scope.row.status == 10 || scope.row.status == 60" >取消订单 </el-link>-->
                    <el-button
                      type="primary" size="mini"
                      v-if="scope.row.status == 10 || scope.row.status == 60"
                      @click="cancelOrd(scope.row)"
                    >
                      取消订单
                    </el-button>
                  </template>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-dialog title="商品定价" visible="dealPrice" v-if="dealPrice" @close="closeGoodDealingDialog">
          <el-form ref="form" :model="dealPriceFrm" label-width="80px">
            <el-form-item label="订单编号">
              <el-input v-model="dealPriceFrm.orderNo" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品单价">
              <el-input v-model="dealPriceFrm.ordPrice" @change="calcOrderAllPrice()"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="dealPriceFrm.goodNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="商品总价">
              <el-input v-model="ordAllPrice" disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitDealPrice()">提交定价</el-button>
              <el-button @click="closeGoodDealingDialog">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-dialog title="物流信息" :visible.sync="updataOrder" v-if="updataOrder">
          <el-form ref="form" :rules="rules" :model="sendOrderFrm" label-width="80px">
            <el-form-item label="订单编号">
              <el-input v-model="sendOrderFrm.orderNo" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="物流公司" prop="expressId">
              <el-select v-model="sendOrderFrm.expressId" placeholder="请选择">
                <el-option
                  v-for="item in expressList"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="物流单号" prop="expressNo">
              <el-input v-model="sendOrderFrm.expressNo"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitupdt()">确认修改</el-button>
              <el-button @click="updataOrder=false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

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
      <div class="list-panel"/>
    </div>

    <el-dialog v-if="pushStockBatch" title="补货">
      <el-table
        :data="props.row.skuPriceList"
        style="width: 100%; margin-bottom: 20px;"
        row-key="id"
        border
      >
        <el-table-column prop="skuText" label="SKU属性" width="260px"/>
        <el-table-column prop="stock" label="库存" width="150px"/>
        <el-table-column prop="salePrice" label="零售价" width="150px"/>
        <el-table-column prop="saleMemPrice" label="会员价" width="150px"/>
      </el-table>
    </el-dialog>

    <el-dialog v-if="pushStock" title="补货">
      <el-form ref="dataForm" :model="stockForm" label-width="100px">
        <el-form-item label="库存数量"/>
        <el-form-item>
          <el-button type="primary" @click="submitStock()">提交</el-button>
          <el-button @click="cancelStock()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="发货" :visible.sync="sendOrder" v-if="sendOrder" @close="closeSendOrderDialog">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="在线发货" name="online" style="height:600px">
          <el-form ref="onlineForm" :rules="onlineRules" :model="onlineSendOrderFrm" label-width="80px">
            <el-row :gutter="20" style="line-height:40px;" class="main-title">
              <el-col :span="12">
                订单编号: {{ onlineOrderDtl.orderNo }}
              </el-col>
            </el-row>
            <el-row :gutter="20" style="line-height:40px;" class="main-title">
              <el-col :span="12">
                收件人: {{ onlineOrderDtl.recUname }}
              </el-col>
              <el-col :span="12">
                买家手机号: {{ onlineOrderDtl.recPhone }}
              </el-col>
            </el-row>
            <el-row :gutter="20" style="line-height:40px;" class="main-title">
              <el-col :span="12">
                省市区: {{ onlineOrderDtl.recArea }}
              </el-col>
              <el-col :span="12">
                地址详情: {{ onlineOrderDtl.recAddress }}
              </el-col>
            </el-row>

            <el-form-item label="物流公司" prop="logisticsCompanyId">
              <el-select v-model="logisticsCompany" size="small" @change="logisticsCompanySelectChange" value-key="id">
                <el-option v-for="(item) in logisticsCompanyList" :key="item.id" :value="item"
                           :label="item.expressName"
                />
              </el-select>
              <el-select v-model="logisticsCompanyTypeId" size="small">
                <el-option v-for="(item) in logisticsCompanyTypeList" :key="item.id" :value="item.id"
                           :label="item.expressTypeName"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="发货地址" prop="addrId">
              <el-select v-model="onlineSendOrderFrm.addrId" placeholder="请选择" style="width:460px">
                <el-option
                  v-for="item in addrList"
                  :key="item.addrId"
                  :label="item.addrDtl"
                  :value="item.addrId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="包裹数量" prop="quantity" style="width:460px">
              <el-input v-model.number="onlineSendOrderFrm.quantity"></el-input>
            </el-form-item>

            <el-form-item label="备注">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="onlineSendOrderFrm.remark"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onlineSubmitSend()">立即发货</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="线下发货" name="offline" style="height:600px">
          <el-form ref="form" :rules="rules" :model="sendOrderFrm" label-width="80px">
            <el-form-item label="订单编号">
              <el-input v-model="sendOrderFrm.orderNo" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="物流公司" prop="expressId">
              <el-select v-model="sendOrderFrm.expressId" placeholder="请选择">
                <el-option
                  v-for="item in expressList"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货地址" prop="sendAddrId">
              <el-select v-model="sendOrderFrm.sendAddrId" placeholder="请选择" style="width:460px">
                <el-option
                  v-for="item in addrList"
                  :key="item.addrId"
                  :label="item.addrDtl"
                  :value="item.addrId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流单号" prop="expressNo">
              <el-input v-model="sendOrderFrm.expressNo"></el-input>
            </el-form-item>
            <el-form-item label="操作说明">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="sendOrderFrm.opContent"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSend()">立即发货</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog title="在线批量发货" :visible.sync="showOnlineOrderList" v-if="showOnlineOrderList"
               @close="closeSendOrderDialog"
    >
      <el-form ref="batchOnlineForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物流公司">
              <el-select v-model="logisticsCompany" size="small" @change="logisticsCompanySelectChange"
                         prop="logisticsCompanyId" value-key="id"
              >
                <el-option v-for="(item) in logisticsCompanyList" :key="item.id" :value="item"
                           :label="item.expressName"
                />
              </el-select>
              <el-select v-model="logisticsCompanyTypeId" size="small" prop="logisticsCompanyTypeId">
                <el-option v-for="(item) in logisticsCompanyTypeList" :key="item.id" :value="item.id"
                           :label="item.expressTypeName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货地址">
              <el-select v-model="addrId" placeholder="请选择">
                <el-option
                  v-for="item in addrList"
                  :key="item.addrId"
                  :label="item.addrDtl"
                  :value="item.addrId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-for="item in onlineOrderList" :key="item.orderId">
          <el-divider content-position="left">订单编号: {{ item.orderNo }}</el-divider>
          <el-row :gutter="20" style="line-height:40px;" class="main-title">
            <el-col :span="12">
              收件人: {{ item.recUname }}
            </el-col>
            <el-col :span="12">
              买家手机号: {{ item.recPhone }}
            </el-col>
          </el-row>

          <el-row :gutter="20" style="line-height:60px;">
            <el-col :span="12">
              <el-form-item label="包裹数量" prop="quantity">
                <el-input v-model.number="item.quantity"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitOnlineBatchSendOrder()">立即发货</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="线下批量发货" :visible.sync="showOfflineOrderList" v-if="showOfflineOrderList"
               @close="closeSendOrderDialog"
    >
      <el-form ref="batchOnlineForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物流公司">
              <el-select v-model="offlineExpressId" placeholder="请选择">
                <el-option
                  v-for="item in expressList"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货地址">
              <el-select v-model="offlineSendAddrId" placeholder="请选择" style="width:460px">
                <el-option
                  v-for="item in addrList"
                  :key="item.addrId"
                  :label="item.addrDtl"
                  :value="item.addrId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-for="item in offlineOrderList" :key="item.orderId">
          <el-divider content-position="left">订单编号: {{ item.orderNo }}</el-divider>
          <el-row :gutter="20" style="line-height:40px;" class="main-title">
            <el-col :span="12">
              收件人: {{ item.recUname }}
            </el-col>
            <el-col :span="12">
              买家手机号: {{ item.recPhone }}
            </el-col>
          </el-row>

          <el-row :gutter="20" style="line-height:60px;">
            <el-col :span="12">
              <el-form-item label="物流单号" prop="quantity">
                <el-input v-model="item.expressNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitOfflineBatchSendOrder()">立即发货</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div v-if="showOrdDtl">

      <el-row :gutter="20" style="line-height:40px;font-size:12px">
        <el-col :span="24">
          <el-button type="primary" size="small" icon="el-icon-back" @click="handlerReturnPOrderList">返回列表</el-button>
        </el-col>
      </el-row>

      <!--      line-height:40px;padding:25px 0px;-->
      <div class="step-container">
        <!--        ordStep-->
        <!--        :src="ordStep >= 1 ? waitDeliverPng : waitDeliverPngGrey "-->

        <!--        <el-steps :active="ordStep" align-center v-if="ptStep">-->
        <!--          <el-step title="待发货">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 1 ? waitDeliverPng : waitDeliverPngGrey "-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--          &lt;!&ndash;          wait / process / finish / error / success&ndash;&gt;-->
        <!--          <el-step title="待收货">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 2 ?waitReceivePng:waitReceivePngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--          <el-step title="待支付">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 3 ?waitPaymentPng:waitPaymentPngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--          <el-step :title="isCancelTitle">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 4?isCancelIconImg:isCancelIconImgGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--        </el-steps>-->

        <!--        <el-steps :active="ordStep" align-center v-if="lpStep">-->
        <!--          <el-step title="待支付">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 1?waitPaymentPng:waitPaymentPngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--          <el-step title="待发货">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 2?waitDeliverPng:waitDeliverPngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--          <el-step title="待收货">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 3?waitReceivePng:waitReceivePngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--          <el-step title="已完成">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 4?completePng:completePngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--        </el-steps>-->

        <!--        <el-steps :active="ordStep" align-center v-if="dzStep">-->
        <!--          <el-step title="待沟通">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 1?waitConfirmPng:waitConfirmPngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span></el-step>-->
        <!--          <el-step title="待发货">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 2?waitDeliverPng:waitDeliverPngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--          <el-step title="待收货">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 3?waitReceivePng:waitReceivePngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--          <el-step title="待支付">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 4?waitPaymentPng:waitPaymentPngGrey"-->
        <!--                >-->
        <!--                </el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--          <el-step title="已完成">-->
        <!--              <span slot="icon">-->
        <!--                <el-avatar-->
        <!--                  shape="square" :size="50"-->
        <!--                  class="step-icon"-->
        <!--                  :src="ordStep >= 5?completePng:completePngGrey"-->
        <!--                ></el-avatar>-->
        <!--              </span>-->
        <!--          </el-step>-->
        <!--        </el-steps>-->

        <el-steps :active="stepStatus" align-center>
          <el-step :title="item.title" v-for="(item,index) in stepList" :key="item">
            <span slot="icon">
              <el-avatar
                shape="square" :size="50"
                class="step-icon"
                :src="stepStatus > index ? item.image : item.imageGrey"
              ></el-avatar>
            </span>
          </el-step>
        </el-steps>
      </div>
      <div class="notic-container">
        <div class="avatar">
          <el-avatar
            shape="square"
            :size="80"
            :src="noticContainerImg"
          ></el-avatar>
        </div>
        <span class="title">
          订单状态: {{ ordDtl.status | statuts2Text }}
        </span>
        <br/>
        <span class="content">
         订单编号: {{ ordDtl.orderNo }}
        </span>
      </div>
      <div>
        <!--        style="padding-top:20px;"-->
        <el-row>
          <!--          style="width: 1180px; margin-bottom: 20px;font-size:12px;height:100%"-->
          <el-table
            :data="ordDtl.supplierList[0].dtlList"
            border
          >
            <el-table-column
              align="center"
              header-align="center"
              prop="goodImage" label="商品图片"
            >
              <template slot-scope="scope">
                <el-avatar
                  shape="square"
                  :size="150"
                  :src="scope.row.goodImage"
                ></el-avatar>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="goodName" label="商品名称"
            ></el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="goodSinglePrice" label="商品单价"
            ></el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="goodNum" label="商品数量" width="150px"
            ></el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="goodSinglePrice" label="商品总价"
            >
              <template slot-scope="scope">
                {{ (scope.row.goodSinglePrice * scope.row.goodNum).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="skuInfo" label="规格"
            ></el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="goodCode" label="商品货号"
            ></el-table-column>
          </el-table>
        </el-row>
      </div>

      <div class="info-container">
        <span class="main-title">
          <el-col :span="24">付款信息</el-col>
        </span>
        <el-row :gutter="20" class="main-content">
          <el-col :span="6">付款方式：{{ ordDtl.payType | pay2Text }}</el-col>
          <el-col :span="6">订单金额：{{ ordDtl.ordPrice }}</el-col>
          <el-col :span="6">应付金额：{{ ordDtl.ordPayPrice }}</el-col>
          <el-col :span="6">实付金额：{{ ordDtl.totalAmount }}</el-col>
        </el-row>
        <el-row :gutter="20" class="main-content">
          <el-col :span="6">运费：{{ ordDtl.expressPrice == '0' ? '0.00' : ordDtl.expressPrice }}</el-col>
          <el-col :span="6">优惠金额：{{ ordDtl.ordSubPrice == '0' ? '0.00' : ordDtl.ordSubPrice }}</el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
        </el-row>


        <!--        收货人信息-->
        <span class="main-title">
          <el-col :span="24">收货人信息</el-col>
        </span>
        <el-row :gutter="20" class="main-content">
          <el-col :span="6">收货人：{{ ordDtl.recUname }}</el-col>
          <el-col :span="6">收货地址：{{ `${ordDtl.recArea} - ${ordDtl.recAddress}` }}</el-col>
          <el-col :span="6">收货人电话：{{ ordDtl.recPhone }}</el-col>
          <el-col :span="6"></el-col>
        </el-row>

        <!--        支付配送信息-->
        <span class="main-title">
          <el-col :span="24">支付及配送信息</el-col>
        </span>
        <el-row :gutter="20" class="main-content">
          <el-col :span="6">付款方式：{{ ordDtl.payType | pay2Text }}</el-col>
          <el-col :span="6">支付时间：{{ ordDtl.payTime | _formatDate }}</el-col>
          <el-col :span="6">运费：{{ ordDtl.expressPrice }}</el-col>
          <el-col :span="6"></el-col>
        </el-row>

        <!--        物流信息-->
        <span class="main-title">
          <el-col :span="24">物流信息</el-col>
        </span>
        <el-row :gutter="20" class="main-content">
          <el-col :span="6">物流公司：{{ ordDtl.expressName }}</el-col>
          <el-col :span="6">快递单号：{{ ordDtl.expressNo }}</el-col>
          <el-col :span="6"></el-col>
        </el-row>

        <!--        发票信息-->
        <span class="main-title">
          <el-col :span="24">发票信息</el-col>
        </span>
        <el-row :gutter="20" class="main-content">
          <el-col :span="6">发票类型：普通发票</el-col>
          <el-col :span="6" v-if="ordDtl.tax && ordDtl.tax.taxTitle">发票抬头：{{ ordDtl.tax.taxTitle == '1' ? '公司' : '个人' }}
          </el-col>
          <el-col :span="6" v-if="ordDtl.tax && ordDtl.tax.compTaxNo">税号：{{ ordDtl.tax.compTaxNo }}</el-col>
          <el-col :span="6" v-if="ordDtl.tax && ordDtl.tax.companyName">{{
              ordDtl.tax.taxTitle == '1' ? '公司名称' : '姓名'
            }}：{{ ordDtl.tax.companyName }}
          </el-col>
        </el-row>
        <el-row :gutter="20" class="main-content">
          <el-col :span="6" v-if="ordDtl.tax && ordDtl.tax.email">邮箱：{{ ordDtl.tax.email }}</el-col>
          <el-col :span="6" v-if="ordDtl.tax && ordDtl.tax.phoneNo">手机号码：{{ ordDtl.tax.phoneNo }}</el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
        </el-row>


        <template v-if="ordDtl.ordDtlList && ordDtl.ordDtlList[0].goodCustom">
          <span class="main-title">
            <el-col :span="24">定制信息</el-col>
          </span>
          <el-row :gutter="24" class="main-content">
            <el-col :span="6">联系人：{{ ordDtl.ordDtlList[0].goodCustom.userName || '' }}</el-col>
            <el-col :span="6">联系电话：{{ ordDtl.ordDtlList[0].goodCustom.userPhone || '' }}</el-col>
            <el-col :span="12">定制内容：{{ ordDtl.ordDtlList[0].goodCustom.customInfo || '' }}</el-col>
          </el-row>
        </template>

        <!--        <div style="line-height:400px;height:20px">-->
        <!--          <el-row :gutter="24" style="line-height:40px;font-size:12px">-->
        <!--            <el-col :span="24">&nbsp;&nbsp;&nbsp;111</el-col>-->
        <!--          </el-row>-->
        <!--        </div>-->
      </div>

    </div>
    <object ref="LODOP" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width="0" height="0">
      <param name="Caption" value="显示区">
      <param name="Border" value="0">
      <param name="Color" value="white">
      <embed ref="LODOP_EM" TYPE="application/x-print-lodop" width="0" height="0" border="0" Color="white"
             PLUGINSPAGE="install_lodop.exe"
      >
    </object>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'
import { getToken } from '@/utils/auth.js'
import { getLodop } from '@/utils/lodop.js'

export default {
  components: {},
  filters: {
    taxType2Text(type) {

    },
    _formatDate(time) {
      if (time == undefined) {
        return '尚未支付，暂无时间'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    pay2Text(pay) {
      if (pay == 1) {
        return '支付宝'
      } else if (pay == 2) {
        return '微信'
      } else if (pay == 3) {
        return '微信'
      }
      return '未支付'
    },
    fmtPrice(row) {
      if (row.orderType != 4) {
        return row.ordPrice
      }
      if (row.ordPrice == 0) {
        return '待定价'
      }
      return row.ordPrice
    },
    fmtPayPrice(row) {
      if (row.orderType != 4) {
        return row.totalAmount
      }
      if (row.ordPayPrice == 0) {
        return '待定价'
      }
      return row.totalAmount
    },
    statuts2RowText(row) {
      let status = row.status
      let orderType = row.orderType
      let statusText = ''
      if (orderType == 1) {
        if (status == '0') {
          statusText = '已取消'
        } else if (status == '10') {
          statusText = '待发货'
        } else if (status == '20') {
          statusText = '待收货'
        } else if (status == '30') {
          statusText = '待支付'
        } else if (status == '40') {
          statusText = '已退货'
        } else if (status == '41') {
          statusText = '退货中'
        } else if (status == '60') {
          statusText = '定制信息确认中'
        } else if (status == '50' || status == '51' || status == '52') {
          statusText = '交易完成'
        }
      } else if (orderType == 2) {
        if (status == '0') {
          statusText = '已取消'
        } else if (status == '10') {
          statusText = '待发货'
        } else if (status == '20') {
          statusText = '待收货'
        } else if (status == '30') {
          statusText = '待支付'
        } else if (status == '40') {
          statusText = '已退货'
        } else if (status == '41') {
          statusText = '退货中'
        } else if (status == '60') {
          statusText = '定制信息确认中'
        } else if (status == '50' || status == '51' || status == '52') {
          statusText = '交易完成'
        }
      } else if (orderType == 4) {
        if (status == '0') {
          statusText = '已取消'
        } else if (status == '10') {
          statusText = '待发货'
        } else if (status == '20') {
          statusText = '待收货'
        } else if (status == '30') {
          statusText = '待支付'
        } else if (status == '40') {
          statusText = '已退货'
        } else if (status == '41') {
          statusText = '退货中'
        } else if (status == '60') {
          statusText = '定制信息确认中'
        } else if (status == '50' || status == '51' || status == '52') {
          statusText = '交易完成'
        }
      }
      return statusText
    },
    statuts2Text(status) {
      // 订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价;
      // 52:交易完成/退货
      let statusText = ''
      if (status == '0') {
        statusText = '已取消'
      } else if (status == '10') {
        statusText = '待发货'
      } else if (status == '20') {
        statusText = '待收货'
      } else if (status == '30') {
        statusText = '待支付'
      } else if (status == '40') {
        statusText = '已退货'//--
      } else if (status == '41') {
        statusText = '退货中'
      } else if (status == '60') {
        statusText = '定制信息确认中'
      } else if (status == '50' || status == '51' || status == '52') {
        statusText = '交易完成'
      }
      return statusText
    },
    type2Text(verifyStatus) {
      // 审核状态;10:待审核;20:已通过;30:被驳回
      if (verifyStatus == 1) {
        return '普通订单'
      } else if (verifyStatus == 2) {
        return '礼品订单'
      } else if (verifyStatus == 4) {
        return '定制订单'
      }
    }
  },
  data() {
    let quantityCheck = (rule, value, callback) => {
      if (value <= 0 || value > 300) {
        callback(new Error('包裹数量输入错误，只能1~300'))
      } else {
        callback()
      }
    }
    let expressCompanyCheck = (rule, value, callback) => {
      if (this.logisticsCompany == null) {
        callback(new Error('请选择物流公司'))
      } else if (this.logisticsCompanyTypeId == null) {
        callback(new Error('请选择物流公司业务类型'))
      } else {
        callback()
      }
    }
    return {
      waitConfirmPng: require('@/assets/order-status/waitConfirmPng.png'),
      waitConfirmPngGrey: require('@/assets/order-status/waitConfirmPngGrey.png'),

      waitDeliverPng: require('@/assets/order-status/waitDeliverPng.png'),
      waitDeliverPngGrey: require('@/assets/order-status/waitDeliverPngGrey.png'),

      waitReceivePng: require('@/assets/order-status/waitReceivePng.png'),
      waitReceivePngGrey: require('@/assets/order-status/waitReceivePngGrey.png'),

      waitPaymentPng: require('@/assets/order-status/waitPaymentPng.png'),
      waitPaymentPngGrey: require('@/assets/order-status/waitPaymentPngGrey.png'),

      cancelPng: require('@/assets/order-status/cancelPng.png'),
      cancelPngGrey: require('@/assets/order-status/cancelPngGrey.png'),

      returningPng: require('@/assets/order-status/returningPng.png'),
      returningPngGrey: require('@/assets/order-status/returningPngGrey.png'),

      completePng: require('@/assets/order-status/completePng.png'),
      completePngGrey: require('@/assets/order-status/completePngGrey.png'),

      logisticsCompanyList: [],
      logisticsCompany: null,
      logisticsCompanyTypeList: [],
      logisticsCompanyTypeId: null,
      addrId: null,
      showOnlineOrderList: false,
      onlineOrderList: [],
      showOfflineOrderList: false,
      offlineOrderList: [],
      offlineSendAddrId: null,
      offlineExpressId: null,
      activeName: 'online',
      ordAllPrice: '',
      showOrdDtl: false,
      dealPrice: false,
      addrList: [],
      ordStep: 1,
      ptStep: false,
      lpStep: false,
      dzStep: false,
      isCancelTitle: '已完成',
      isCancelIconImg: require('@/assets/order-status/completePng.png'),
      isCancelIconImgGrey: require('@/assets/order-status/completePngGrey.png'),
      dealPriceFrm: {
        orderNo: '',
        orderId: '',
        ordPrice: '',
        goodNum: '2'
      },
      //订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价
      ordMarks: {
        10: '待发货',
        20: '待收货',
        30: '待付款',
        60: '待沟通',
        50: '完成'
      },
      onlineSendOrderFrm: {
        orderNo: null,
        addrId: null,
        logisticsCompanyId: null,
        logisticsCompanyTypeId: null,
        quantity: null,
        remark: null
      },
      sendOrderFrm: {
        orderNo: '',
        expressId: '',
        expressName: '',
        sendAddress: '',
        expressNo: '',
        opContent: ''
      },
      ordDtl: {
        status: 10,
        tax: {
          taxTitle: ''
        },
        supplierList: [{
          dtlList: []
        }]
      },
      onlineOrderDtl: {
        orderNo: '',
        recUname: '',
        recPhone: '',
        recArea: '',
        recAddress: ''
      },
      expressList: [
        { id: 'SF', text: '顺丰速运' },
        { id: 'YZBK', text: '邮政国内标快' },
        { id: 'YZPY', text: '邮政快递包裹' },
        { id: 'STO', text: '申通快递' },
        { id: 'DBL', text: '德邦快递' },
        { id: 'JD', text: '京东快递' },
        { id: 'HHTT', text: '天天快递' },
        { id: 'JTSD', text: '极兔速递' },
        { id: 'SNWL', text: '苏宁物流' },
        { id: 'ZTO', text: '中通快递' },
        { id: 'YD', text: '韵达速递' },
        { id: 'HTKY', text: '百世快递' },
        { id: 'YTO', text: '圆通速递' }
      ],
      updataOrder: false,
      sendOrder: false,
      pushStockBatch: false,
      pushStock: false,
      toToken: '',
      typeIdList: [],
      typeId2List: [],
      goodBrandList: [],
      showPagination: false,
      editData: {},
      isGift: '1',
      stockForm: {
        stockNum: ''
      },
      searchParam: {
        orderNo: '',
        recUname: '',
        recMobile: '',
        isBackend: '',
        orderType: '',
        isRequireTaxBill: '',
        isPrintedTemplate: '',
        isOverDuePayment: '',
        status: '',
        startTime: '',
        endTime: '',
        riskOrder: '',
        dataType: '',
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      rules: {
        expressId: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
        sendAddrId: [{ required: true, message: '请选择退货地址', trigger: 'change' }],
        expressNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }]
      },
      onlineRules: {
        quantity: [{ required: true, validator: quantityCheck, trigger: 'blur' }],
        logisticsCompany: [{ required: true, validator: expressCompanyCheck, trigger: 'change' }],
        addrId: [{ required: true, message: '请选择发货地址', trigger: 'change' }]
      },
      orderId_: '',
      orderNo_: '',
      dataList: [],
      // routeFrom: {},
      fromRoutePath: '',

      stepStatus: 0,
      stepList: [
        // {
        //   title: '',
        //   image: '',
        //   imageGrey: ''
        // }

      ]
    }
  },
  computed: {
    noticContainerImg: function() {
      // 订单状态;
      // 0:订单被取消;
      // 10:已提交,待发货;
      // 20;已发货,待收货;
      // 30:已收货;待支付;
      // 40:退货完成;
      // 41:退货中;
      // 43/拒绝退货;
      // 50:交易完成/未评价;
      // 51:交易完成/已评价;
      // 60:定制订单/待沟通;
      // 订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价;
      // 52:交易完成/退货
      let statusImg = 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
      if (this.ordDtl.status == '0') {
        // statusImg = '已取消'
        statusImg = require('@/assets/order-status/cancelPngBlack.png')
      } else if (this.ordDtl.status == '10') {
        // statusImg = '待发货'
        statusImg = require('@/assets/order-status/waitDeliveryPngBlack.png')
      } else if (this.ordDtl.status == '20') {
        // statusImg = '待收货'
        statusImg = require('@/assets/order-status/waitReceivePngBlack.png')
      } else if (this.ordDtl.status == '30') {
        // statusImg = '待支付'
        statusImg = require('@/assets/order-status/waitPaymentPngBlack.png')
      } else if (this.ordDtl.status == '40') {
        // statusImg = '已退货'//--
        statusImg = require('@/assets/order-status/completePngBlack.png')
      } else if (this.ordDtl.status == '41') {
        // statusImg = '退货中'
        statusImg = require('@/assets/order-status/returningPngBlack.png')
      } else if (this.ordDtl.status == '60') {
        // statusImg = '定制信息确认中'
        statusImg = require('@/assets/order-status/waitConfirmPngBlack.png')
      } else if (this.ordDtl.status == '50' || status == '51' || status == '52') {
        // statusImg = '交易完成'
        statusImg = require('@/assets/order-status/completePngBlack.png')
      }
      return statusImg

    }
  },
  props: {
    orderStatus: {
      type: Object,
      required: false,
      default: null
    }
  },
  beforeMount() {
    this.jumpOrderDtl()
  },
  mounted() {
    // this.toToken=getToken()
    // console.log(this.toToken,'6666666')
    if (null != this.orderStatus) {
      this.searchParam.status = this.orderStatus.status
    }
    if (this.$route.query.dt != undefined) {
      this.searchParam.dataType = this.$route.query.dt
      if (this.searchParam.dataType == '2') {
        this.searchParam.riskOrder = 'all'
      }
    } else {
      this.searchParam.isBackend = '1'
    }

    this.initLoad()
    this.initAddrList()
    this.loadtypeIdList()
    this.loadLogisticsCompanyList()

  },
  created() {
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。

      // 用个屁 详情页面连路由都没有
      // if (from !== undefined) vm.routeFrom = from
    })
  },
  methods: {
    handlerReturnPOrderList() {
      if (this.fromRoutePath !== '') {
        this.$router.push({
          path: this.fromRoutePath
        })
      }
      this.fromRoutePath = ''
      this.showOrdDtl = false
    },
    jumpOrderDtl() {
      if (this.$route.query.orderNo) {
        this.showOrdDtl = true
        this.orderNo_ = this.$route.query.orderNo
        this.fromRoutePath = this.$route.query.fromRoutePath
        this.getOrdDtl_()
      }
    },
    exportData() {
      if (this.searchParam.startTime == null) {
        this.searchParam.startTime = ''
      }
      if (this.searchParam.endTime == null) {
        this.searchParam.endTime = ''
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
      }
      let exportParam = []
      for (let key in param) {
        exportParam.push(key + '=' + param[key])
      }
      //window.open( process.env.VUE_APP_BASE_API+'/backend/lyProvider/exportData?'+exportParam.join("&"))
      window.open(process.env.VUE_APP_BASE_API + '/bc/order/export?token=' + getToken() + '&' + exportParam.join('&'))
    },
    showOrdDtlClos() {
      this.showOrdDtl = false
      this.ptStep = false
      this.lpStep = false
      this.dzStep = false
    },
    getAddrLabel(val) {
      //locations是v-for里面的也是datas里面的值
      let obj = {}
      obj = this.addrList.find((item) => {
        return item.addrId === val
      })
      return obj.addrDtl
    },
    initAddrList() {
      getMethod('/bc/sendAddr/findList', { 'enable': 1, 'type': 1 }).then(res => {
        this.addrList = res.data
        if (res.data.length > 0) {
          this.addrId = res.data[0].addrId
          this.onlineSendOrderFrm.addrId = res.data[0].addrId
          this.sendOrderFrm.sendAddrId = res.data[0].addrId
          this.offlineSendAddrId = res.data[0].addrId
        }
      })
    },
    collect(row) {
      let scope = this
      let param = {
        orderNo: row.orderNo,
        orderId: row.orderId
      }
      postMethod('/bc/order/collectOrder', param).then(res => {
        this.$message('已经发起收款，请等待用户支付')
        scope.loadList()
      })
    },
    doneGiftOrd(row) {
      let scope = this
      let param = {
        orderNo: row.orderNo,
        orderId: row.orderId
      }
      postMethod('/bc/order/doneGiftOrd', param).then(res => {
        this.$message('已经发起收款，请等待用户支付')
        scope.loadList()
      })
    },
    collectCus(rowObj) {
      this.dealPriceFrm.orderNo = rowObj.orderNo
      this.dealPriceFrm.orderId = rowObj.orderId
      this.dealPriceFrm.goodNum = rowObj.supplierList[0].dtlList[0].goodNum
      this.dealPrice = true
    },
    calcOrderAllPrice() {
      this.ordAllPrice = this.dealPriceFrm.goodNum * this.dealPriceFrm.ordPrice
    },
    submitDealPrice() {
      let scope = this
      if (this.dealPriceFrm.ordPrice == '') {
        this.$message({
          message: '价格不能为空',
          type: 'warring'
        })
        return
      }

      postMethod('/bc/order/dealOrdPrice', this.dealPriceFrm).then(res => {
        scope.dealPrice = false
        scope.loadList()
        this.$message({
          message: '定价成功，请等待用户支付',
          type: 'success'
        })
      })
    },
    async getOrdDtl_() {
      const { data } = await postMethod('/bc/order/getOrdDtl', { orderNo: this.orderNo_ })
      this.showOrdDtl = true
      this.ordDtl = data
      this.generatorStepList()
    },
    generatorStepList() {
      this.stepStatus = 0
      this.stepList = []
      // 普通订单
      // 正常流程--> 待发货，待收货，待支付，交易完成
      // 取消流程--> 待发货，已取消
      // 退货流程--> 待发货，待收货，待支付，退货中，退货完成

      // 普通的订单
      if (this.ordDtl.orderType == 1) {
        // stepList
        this.stepList.push({
          title: '待发货',
          image: this.waitDeliverPng,
          imageGrey: this.waitDeliverPngGrey
        })
        if (this.ordDtl.status == 10) this.stepStatus = 1

        // 被取消
        if (this.ordDtl.status == 0) {
          this.stepList.push({
            title: '已取消',
            image: this.cancelPng,
            imageGrey: this.cancelPngGrey
          })
          if (this.ordDtl.status == 0) this.stepStatus = 2
          return
        }

        this.stepList.push({
          title: '待收货',
          image: this.waitReceivePng,
          imageGrey: this.waitReceivePngGrey
        })
        if (this.ordDtl.status == 20) this.stepStatus = 2

        this.stepList.push({
          title: '待支付',
          image: this.waitPaymentPng,
          imageGrey: this.waitPaymentPngGrey
        })
        if (this.ordDtl.status == 30) this.stepStatus = 3

        // 被取消
        if (this.ordDtl.status == 50 || this.ordDtl.status == 51) {
          this.stepList.push({
            title: '交易完成',
            image: this.completePng,
            imageGrey: this.completePngGrey
          })
          this.stepStatus = 4
          return
        }

        this.stepList.push({
          title: '退货中',
          image: this.returningPng,
          imageGrey: this.returningPngGrey
        })
        if (this.ordDtl.status == 41) this.stepStatus = 4

        this.stepList.push({
          title: '退货完成',
          image: this.completePng,
          imageGrey: this.completePngGrey
        })
        if (this.ordDtl.status == 40) this.stepStatus = 5
      }

      // 定制订单
      // 正常流程 待确认，待支付，待发货，待收货，交易完成
      // 取消流程 待确认，待支付，已取消
      //

      // 定制订单
      if (this.ordDtl.orderType == 4) {
        this.stepList.push({
          title: '待确认',
          image: this.waitConfirmPng,
          imageGrey: this.waitConfirmPngGrey
        })
        if (this.ordDtl.status == 60) this.stepStatus = 1

        this.stepList.push({
          title: '待支付',
          image: this.waitPaymentPng,
          imageGrey: this.waitPaymentPngGrey
        })
        if (this.ordDtl.status == 30) this.stepStatus = 2

        // 被取消
        if (this.ordDtl.status == 0) {
          this.stepList.push({
            title: '已取消',
            image: this.cancelPng,
            imageGrey: this.cancelPngGrey
          })
          this.stepStatus = 3
          return
        }

        this.stepList.push({
          title: '待发货',
          image: this.waitDeliverPng,
          imageGrey: this.waitDeliverPngGrey
        })
        if (this.ordDtl.status == 10) this.stepStatus = 3

        this.stepList.push({
          title: '待收货',
          image: this.waitReceivePng,
          imageGrey: this.waitReceivePngGrey
        })
        if (this.ordDtl.status == 20) this.stepStatus = 4

        this.stepList.push({
          title: '交易完成',
          image: this.completePng,
          imageGrey: this.completePngGrey
        })
        if (this.ordDtl.status == 50 || this.ordDtl.status == 51) this.stepStatus = 5

      }
    },
    async getOrdDtl(row) {
      const { data } = await postMethod('/bc/order/getOrdDtl', { orderId: row.orderId })
      this.showOrdDtl = true
      this.ordDtl = data
      this.generatorStepList()
    },
    dealOrd(row) {
      const param = {
        orderId: row.orderId
      }
      this.$confirm('是否确认收货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/bc/order/dealOrd', param).then(res => {
          this.loadList()
          this.$message(
            {
              message: '操作成功',
              type: 'success'
            })
        })
      })
    },
    dealCustomOrd(row) {
      const param = {
        orderId: row.orderId
      }
      this.$confirm('是否确认收货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/bc/order/dealCustomOrd', param).then(res => {
          this.loadList()
          this.$message(
            {
              message: '操作成功',
              type: 'success'
            })
        })
      })
    },
    cancelOrd(row) {
      const param = {
        orderId: row.orderId
      }
      this.$confirm('是否取消订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/bc/order/cancelOrd', param).then(res => {
          this.loadList()
          this.$message('操作成功')
        })
      })
    },
    logisticsCompanySelectChange() {
      this.logisticsCompanyTypeList = []
      this.logisticsCompanyTypeId = null
      this.loadLogisticsCompanyTypeList()
    },
    onlineSubmitSend() {
      this.onlineSendOrderFrm.logisticsCompanyId = this.logisticsCompany.id
      this.onlineSendOrderFrm.logisticsCompanyTypeId = this.logisticsCompanyTypeId
      this.$refs['onlineForm'].validate((valid) => {
        if (valid) {
          let loading = this.$loading({
            lock: true,
            text: '正在发货中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          postMethod('/bc/order/onlineSendOrder', this.onlineSendOrderFrm).then(res => {
            if (res.code != 200) {
              this.$message.error(res.message)
              return
            }
            this.$message({
              message: '发货成功',
              type: 'success'
            })
            this.sendOrder = false
            this.loadList()
            this.closeSendOrderDialog()
            loading.close()
          }).catch(err => {
            loading.close()
          })
        }
      })
    },
    closeSendOrderDialog() {
      this.onlineSendOrderFrm.orderNo = null
      this.onlineSendOrderFrm.quantity = null
      this.onlineSendOrderFrm.remark = null
      this.onlineSendOrderFrm.logisticsCompanyTypeId = null
      this.onlineSendOrderFrm.addrId = null
      this.logisticsCompanyTypeId = null
      this.addrId = null
      this.offlineExpressId = null
      this.offlineSendAddrId = null
      this.sendOrderFrm.expressNo = ''
      this.sendOrderFrm.opContent = ''
      this.sendOrderFrm.addrId = null
      this.sendOrderFrm.expressId = null
    },
    closeGoodDealingDialog() {
      this.dealPrice = false
      this.dealPriceFrm.ordPrice = null
    },
    submitSend() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let scope = this
          let addrId = this.sendOrderFrm.sendAddrId
          this.sendOrderFrm.sendAddress = this.getAddrLabel(addrId)
          let express = this.expressList.find(item => item.id == this.sendOrderFrm.expressId)
          this.sendOrderFrm.expressName = express.text
          let loading = this.$loading({
            lock: true,
            text: '正在发货中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          postMethod('/bc/order/offlineSendOrder', this.sendOrderFrm).then(res => {
            if (res.code != 200) {
              this.$message.error(res.message)
              return
            }
            this.$message({
              message: '发货成功',
              type: 'success'
            })
            this.sendOrder = false
            scope.loadList()
            this.closeSendOrderDialog()
            loading.close()
          }).catch(err => {
            loading.close()
          })
        }
      })
    },
    submitupdt() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let scope = this
          let addrId = this.sendOrderFrm.sendAddrId
          this.sendOrderFrm.sendAddress = this.getAddrLabel(addrId)
          let express = this.expressList.find(item => item.id == this.sendOrderFrm.expressId)
          this.sendOrderFrm.expressName = express.text
          postMethod('/bc/order/orderLogisticCode', this.sendOrderFrm).then(res => {
            if (res.code != 200) {
              this.$message.error(res.message)
              return
            }
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.updataOrder = false
            scope.loadList()
          })
        }
      })
    },
    sendOrd(rowObj) {
      this.sendOrder = true
      if (this.addrList.length > 0) {
        this.sendOrderFrm.sendAddrId = this.addrList[0].addrId
        this.onlineSendOrderFrm.addrId = this.addrList[0].addrId
      }

      this.sendOrderFrm.orderNo = rowObj.orderNo
      let param = {
        orderId: rowObj.orderId
      }
      postMethod('/bc/order/getOrdDtl', param).then(res => {
        if (res.code != 200) {
          this.$message.error(res.message)
          return
        }
        this.onlineOrderDtl = res.data
        this.onlineSendOrderFrm.orderNo = res.data.orderNo
      })
    },
    updataOrd(rowObj) {
      this.updataOrder = true
      if (this.addrList.length > 0) {
        this.sendOrderFrm.sendAddrId = this.addrList[0].addrId
      }

      this.sendOrderFrm.orderNo = rowObj.orderNo
    },
    cancelStock() {
      this.pushStockBatch = false
      this.pushStock = false
    },
    addStock(row, rowIndex) {
      this.pushStockBatch = false
      this.pushStock = false
      // 1:全局配置;2:局部配置
      if (row.stockType == 1) {
        this.pushStock = true
      } else {
        this.pushStockBatch = true
      }
    },
    loadtypeIdList() {
      const scope = this
      const param = {
        parentId: '-1'
      }
      getMethod('/bu/good/findType', param).then(res => {
        scope.typeIdList = res.data.list
      })
    },
    deleteRow(rowIndex, data) {
      const param = {
        id: data.list[rowIndex].id
      }
      this.$confirm('是否继续删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/bu/good/delete', param).then(res => {
          this.loadList()
          this.$message('删除成功')
        })
      })
    },
    batchDeleteRow(rowIndex, data) {
      const selectList = this.$refs.mainTable.selection
      const idArr = []
      for (let i = 0; i < selectList.length; i++) {
        idArr.push(selectList[i].id)
      }
      const param = {
        delType: '2',
        ids: idArr.join(',')
      }
      postMethod('/bu/good/delete', param).then(res => {
        scope.editData = res.data[0]
        this.showList = false
        this.showAddOrEdit = true
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
    },
    search() {
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
    },
    addOrEdit(oper, rowIndex, data) {
      const scope = this

      if (oper == 'edit') {
        const param = {
          id: data.list[rowIndex].id
        }
        getMethod('/bu/good/findObject', param).then(res => {
          scope.editData = res.data[0]
          this.showList = false
          this.showAddOrEdit = true
        })
      } else {
        scope.editData = {}
        this.showList = false
        this.showAddOrEdit = true
      }
    },
    showListPanel(isCancel) {
      this.showList = true
      this.showAddOrEdit = false
      this.loadList()
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },
    showOnlineBatchSendOrder() {
      this.onlineOrderList = JSON.parse(JSON.stringify(this.$refs.mainTable.selection))

      if (this.onlineOrderList.length <= 0) {
        this.$message({
          message: '请选择订单！',
          type: 'warning'
        })
        return
      }

      for (let i = 0; i < this.onlineOrderList.length; i++) {
        if (this.onlineOrderList[i].status != 10) {
          this.$message({
            message: `${this.onlineOrderList[i].orderNo} 不是待发货`,
            type: 'warning'
          })
          return
        }
      }

      if (this.addrList.length > 0) {
        this.addrId = this.addrList[0].addrId
      }
      this.showOnlineOrderList = true
    },

    downloadPrintSoftware() {
      window.open('http://download.coopoo.com/other/CLodop_Setup_for_Win64NT_4.118EN.exe')
    },

    showBatchOrderPrintTemplateWindow() {
      let mainTable = this.$refs.mainTable
      let selection = mainTable.selection
      const selectedOrderList = JSON.parse(JSON.stringify(selection))

      if (selectedOrderList.length <= 0) {
        this.$message({
          message: '请选择订单！',
          type: 'warning'
        })
        return
      }

      let loading = this.$loading({
        lock: true,
        text: '正在生成电子面单页面...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      postMethod('/bc/order/orderPrintTemplate', selectedOrderList).then(res => {
        if (res.data.length <= 0) {
          this.$message({
            message: '选中的订单没有电子面单',
            type: 'warning'
          })
          loading.close()
          return
        }

        const orderTemplateNo = res.data.map(item => item.orderNo)
        const selectedOrderNo = selectedOrderList.map(item => item.orderNo)

        let noTemplateOrderNo = selectedOrderNo.filter(x => !orderTemplateNo.includes(x))

        if (noTemplateOrderNo.length > 0) {
          this.$message({
            message: `${[...noTemplateOrderNo]} 没有电子面单`,
            type: 'warning'
          })
          let noTemplateOrderRow = selection.filter(item => orderTemplateNo.includes(item.orderNo))
          mainTable.clearSelection()
          noTemplateOrderRow.forEach(row => mainTable.toggleRowSelection(row, true))
          loading.close()
          return
        }

        LODOP = getLodop(document.getElementById('LODOP'), document.getElementById('LODOP_EM'))
        LODOP.PRINT_INIT('')

        for (let i = 0; i < res.data.length; i++) {
          LODOP.NewPage()
          let strFormHtml = '<body>' + res.data[i].printTemplate + '</body>'
          LODOP.ADD_PRINT_HTM(0, 1, '100%', '100%', strFormHtml)
        }
        LODOP.PREVIEW()
        loading.close()
      }).catch(err => {
        loading.close()
      })
    },

    submitOnlineBatchSendOrder() {
      for (let i = 0; i < this.onlineOrderList.length; i++) {
        const quantity = this.onlineOrderList[i].quantity
        if (quantity == undefined || quantity <= 0 || quantity > 300) {
          this.$message({
            message: `${this.onlineOrderList[i].orderNo} 包裹数量输入错误，只能1~300`,
            type: 'warning'
          })
          return
        }
      }

      if (this.addrId == null || this.addrId == undefined || this.addrId == '') {
        this.$message({
          message: '请选择发货地址',
          type: 'warning'
        })
        return
      }

      if (this.logisticsCompany == null || this.logisticsCompany == undefined || this.logisticsCompany == '') {
        this.$message({
          message: '请选择物流公司',
          type: 'warning'
        })
        return
      }

      if (this.logisticsCompanyTypeId == null || this.logisticsCompanyTypeId == undefined || this.logisticsCompanyTypeId == '') {
        this.$message({
          message: '请选择物流公司业务类型',
          type: 'warning'
        })
        return
      }

      let loading = this.$loading({
        lock: true,
        text: '正在发货中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      let param = {
        'logisticsDTOList': this.onlineOrderList,
        'logisticsCompanyId': this.logisticsCompany.id,
        'logisticsCompanyTypeId': this.logisticsCompanyTypeId,
        'addrId': this.addrId
      }

      postMethod('/bc/order/batchOnlineSendOrder', param).then(res => {
        if (res.data.length > 0) {
          this.$alert(res.data, '批量发送订单出现错误', {
            dangerouslyUseHTMLString: true
          })
          loading.close()
          return
        } else {
          this.$message({
            message: '发送成功',
            type: 'success'
          })
        }

        this.loadList()
        this.showOnlineOrderList = false
        this.closeSendOrderDialog()
        loading.close()
      }).catch(err => {
        loading.close()
      })
    },
    showOfflineBatchSendOrder() {
      this.offlineOrderList = JSON.parse(JSON.stringify(this.$refs.mainTable.selection))

      if (this.offlineOrderList.length <= 0) {
        this.$message({
          message: '请选择订单！',
          type: 'warning'
        })
        return
      }

      for (let i = 0; i < this.offlineOrderList.length; i++) {
        if (this.offlineOrderList[i].status != 10) {
          this.$message({
            message: `${this.offlineOrderList[i].orderNo} 不是待发货`,
            type: 'warning'
          })
          return
        }
      }

      if (this.addrList.length > 0) {
        this.offlineSendAddrId = this.addrList[0].addrId
      }
      this.showOfflineOrderList = true
    },
    submitOfflineBatchSendOrder() {
      if (this.offlineSendAddrId == null || this.offlineSendAddrId == undefined || this.offlineSendAddrId == '') {
        this.$message({
          message: '请选择发货地址',
          type: 'warning'
        })
        return
      }

      if (this.offlineExpressId == null || this.offlineExpressId == undefined || this.offlineExpressId == '') {
        this.$message({
          message: '请选择物流公司',
          type: 'warning'
        })
        return
      }

      for (let i = 0; i < this.offlineOrderList.length; i++) {
        const expressNo = this.offlineOrderList[i].expressNo
        if (expressNo == undefined || expressNo == '') {
          this.$message({
            message: `${this.offlineOrderList[i].orderNo} 订单号输入错误`,
            type: 'warning'
          })
          return
        }
        this.offlineOrderList[i].sendAddrId = this.offlineSendAddrId
        this.offlineOrderList[i].sendAddress = this.getAddrLabel(this.offlineSendAddrId)
        let express = this.expressList.find(item => item.id == this.offlineExpressId)
        this.offlineOrderList[i].expressName = express.text
        this.offlineOrderList[i].expressId = this.offlineExpressId
      }

      let loading = this.$loading({
        lock: true,
        text: '正在发货中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      postMethod('/bc/order/batchOfflineSendOrder', this.offlineOrderList).then(res => {
        if (res.data.length > 0) {
          this.$alert(res.data, '批量发送订单出现错误', {
            dangerouslyUseHTMLString: true
          })
          loading.close()
          return
        }
        this.$message({
          message: '发送成功',
          type: 'success'
        })
        this.loadList()
        this.showOfflineOrderList = false
        this.closeSendOrderDialog()
        loading.close()
      })
    },
    initLoad() {
      this.loadList()
    },
    loadList() {

      const scope = this

      this.sendOrderFrm = {
        orderNo: '',
        expressName: '',
        sendAddrId: '',
        sendAddress: '',
        expressNo: '',
        opContent: ''
      },
        postMethod('/bc/order/bizOrderList', this.searchParam).then(res => {
          scope.tableData = res.data
          scope.sendOrder = false
          scope.updataOrder = false
          scope.showPagination = scope.tableData.total == 0
        })
    },
    loadLogisticsCompanyList() {
      getMethod('/bu/delivery/companyNameList').then(res => {
        this.logisticsCompanyList = res.data
        if (res.data.length > 0) {
          this.logisticsCompany = res.data[0]
        }
        this.loadLogisticsCompanyTypeList()
      })
    },
    loadLogisticsCompanyTypeList() {
      const param = {
        companyId: this.logisticsCompany.companyId
      }
      getMethod('/bu/delivery/companyTypeList', param).then(res => {
        this.logisticsCompanyTypeList = res.data
        if (res.data.length == 1) {
          this.logisticsCompanyTypeId = res.data[0].id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.ly-container {
  font-size: 14px;

  .ly-tool-panel {
    td {
      white-space: nowrap;
    }

    margin-bottom: 3vh;
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
  height: 25vh;
  background: $lightThemeColor;
  text-align: center;
  margin-bottom: 5vh;

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
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  padding: 20px;
  margin-top: 5vh;

  .main-title {
    display: inline-block;
    width: 100%;
    margin-top: 3vh;
    font-size: 19px;
    font-weight: 600;
  }

  .main-content {
    font-weight: 400;
    font-size: 16px;
    line-height: 40px;
  }
}

.step-container > > > .el-step__title.is-process {
  font-weight: normal;
  color: #C0C4CC;
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

</style>
