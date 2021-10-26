<template>
  <div>
    <div>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
        <el-col :span="24">
          <el-button type="primary" size="small" icon="el-icon-back" @click="backToList()">返回列表</el-button>
        </el-col>
      </el-row>
      <div>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="在线发货" name="online">
            <el-form ref="onlineForm" :model="onlineSendOrderFrm" label-width="100px">
              <el-form-item label="物流公司" prop="logisticsCompanyId">
                <el-select v-model="logisticsCompany" size="small" @change="logisticsCompanySelectChange"
                  value-key="id">
                  <el-option v-for="(item) in logisticsCompanyList" :key="item.id" :value="item"
                    :label="item.expressName" />
                </el-select>
                <el-select v-model="logisticsCompanyTypeId" size="small">
                  <el-option v-for="(item) in logisticsCompanyTypeList" :key="item.id" :value="item.id"
                    :label="item.expressTypeName" />
                </el-select>
              </el-form-item>
              <div style="display: flex;flex-wrap: nowrap;">
                <el-form-item label="发货地址" prop="sendAddressId">
                  <el-select v-model="onlineSendOrderFrm.sendAddressId" placeholder="请选择" style="width:460px">
                    <el-option v-for="item in sendAddressList" :key="item.addrId"
                      :label="item.provincetext+item.citytext+item.areaText+item.addrDtl" :value="item.addrId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="退货地址" prop="returnAddressId">
                  <el-select v-model="onlineSendOrderFrm.returnAddressId" placeholder="请选择" style="width:460px">
                    <el-option v-for="item in returnAddressList" :key="item.addrId"
                      :label="item.provincetext+item.citytext+item.areaText+item.addrDtl" :value="item.addrId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-divider content-position="left" />
              <div v-for="item in onlineSendOrderFrm.onlineSendOrderParamList">
                <div style="display: flex;flex-wrap: nowrap;">
                  <el-form-item label="订单编号" prop="orderNo" style="width:460px">
                    <el-input v-model="item.orderNo" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="包裹数量" prop="quantity" style="width:460px">
                    <el-input type="number" v-model.number="item.quantity" @input="change($event)"
                      @change="packageNum(item)"></el-input>
                  </el-form-item>
                </div>
                <div style="display: flex;flex-wrap: nowrap;">
                  <el-form-item label="买家姓名" prop="buyerName" style="width:460px">
                    <el-input v-model="item.buyerName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="买家手机号" prop="buyerMobile" style="width:460px">
                    <el-input v-model="item.buyerMobile" disabled></el-input>
                  </el-form-item>
                </div>
                <el-divider content-position="left" />
              </div>
              <el-form-item>
                <el-button type="primary" @click="onlineSubmitSend()">立即发货</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>



          <el-tab-pane label="线下发货" name="offline">
            <el-form ref="form" :model="sendOrderFrm" label-width="100px">
              <el-form-item label="物流公司" prop="expressId">
                <el-select v-model="sendOrderFrm.expressCompanyCode" placeholder="请选择">
                  <el-option v-for="item in expressList" :key="item.id" :label="item.text" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div style="display: flex;flex-wrap: nowrap;">
                <el-form-item label="发货地址" prop="sendAddressId">
                  <el-select v-model="sendOrderFrm.sendAddressId" placeholder="请选择" style="width:460px">
                    <el-option v-for="item in sendAddressList" :key="item.addrId"
                      :label="item.provincetext+item.citytext+item.areaText+item.addrDtl" :value="item.addrId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="退货地址" prop="returnAddressId">
                  <el-select v-model="sendOrderFrm.returnAddressId" placeholder="请选择" style="width:460px">
                    <el-option v-for="item in returnAddressList" :key="item.addrId"
                      :label="item.provincetext+item.citytext+item.areaText+item.addrDtl" :value="item.addrId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-divider content-position="left" />
              <div v-for="item in sendOrderFrm.offlineSendOrderParamList">
                <div style="display: flex;flex-wrap: nowrap;">
                  <el-form-item label="订单编号" prop="orderNo" style="width:460px">
                    <el-input v-model="item.orderNo" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="买家姓名" prop="buyerName" style="width:460px">
                    <el-input v-model="item.buyerName" disabled></el-input>
                  </el-form-item>
                </div>
                <div style="display: flex;flex-wrap: wrap;">
                  <el-form-item label="买家手机号" prop="buyerMobile" style="width:460px">
                    <el-input v-model="item.buyerMobile" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="物流单号" prop="expressNo" style="width:460px">
                    <el-input v-model="item.expressNo"></el-input>
                  </el-form-item>
                </div>
                <el-divider content-position="left" />
              </div>
              <el-form-item>
                <el-button type="primary" @click="submitSend()">立即发货</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog title="包裹" :visible.sync="sendOrder" width="80%" v-if="sendOrder" @close="closeSendOrderDialog">
      <div v-for="(item,index) in packageGoodsList" :key="index" style="margin-bottom: 20px;">
        <div style="font-size: 18px;line-height: 40px;">{{item.sort}}号包裹</div>
        <div style="display: flex;flex-wrap: wrap;">
          <div class="check_" style="display: flex;flex-wrap: wrap;">
            <el-checkbox @change="changeGoodsChecked(goodsItem,index,goodsIndex)"
              v-for="(goodsItem,goodsIndex) in item.goodsList" :key="goodsIndex"
              :checked="goodsItem.isChecked?goodsItem.isChecked:false"
              :disabled="goodsItem.isDisabled?goodsItem.isDisabled:false">
              <div style="width: 150px;">
                <div style="width: 150px;height: 150px;">
                  <el-image :src="goodsItem.goodsImage" fit="fill" style="width: 100%;height:100%"></el-image>
                </div>
                <div style="font-size: 15px;line-height: 25px;white-space: normal;">
                  {{ goodsItem.goodsName }}
                </div>
              </div>
            </el-checkbox>
          </div>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="submitPackage">提交</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request'
  import {
    formatDate
  } from '@/api/tools.js'
  import {
    getToken
  } from '@/utils/auth.js'
  export default {
    components: {},
    data() {
      return {
        packageGoodsList: [],
        activeName: 'online',
        sendOrder: false,
        onlineSendOrderFrm: {
          sendAddressId: null,
          returnAddressId: null,
          logisticsCompanyId: null,
          logisticsCompanyTypeId: null,
          onlineSendOrderParamList: []
        },
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
        sendAddressList: [],
        returnAddressList: [],
        onlineOrderDtl: {
          orderNo: '',
          recUname: '',
          recPhone: '',
          recArea: '',
          recAddress: ''
        },
        expressCompany: null,
        sendOrderFrm: {
          sendAddressId: '',
          returnAddressId: '',
          expressCompanyName: '',
          expressCompanyCode: '',
          offlineSendOrderParamList: []
        },
        expressList: [{
            id: 'ZYE',
            text: '众邮快递'
          },
          {
            id: 'SF',
            text: '顺丰速运'
          },
          {
            id: 'HTKY',
            text: '百世快递'
          },
          {
            id: 'DBL',
            text: '德邦快递'
          },
          {
            id: 'STO',
            text: '申通快递'
          },
          {
            id: 'YTO',
            text: '圆通速递'
          },
          {
            id: 'YD',
            text: '韵达速递'
          },
          {
            id: 'EMS',
            text: 'EMS'
          },
          {
            id: 'HHTT',
            text: '天天快递'
          },
          {
            id: 'ZTO',
            text: '中通快递'
          },
          {
            id: 'UC',
            text: '优速快递'
          },
          {
            id: 'UAPEX',
            text: '全一快递'
          },
          {
            id: 'SURE',
            text: '速尔快递'
          },
          {
            id: 'KYSY',
            text: '跨越速运'
          },
          {
            id: 'TLWL',
            text: '腾林物流'
          },
          {
            id: 'YZBK',
            text: '邮政国内标快'
          },
          {
            id: 'YZPY',
            text: '邮政快递包裹'
          },
          {
            id: 'ZJS',
            text: '宅急送'
          },
          {
            id: 'XFEX',
            text: '信丰物流'
          },
          {
            id: 'LHT',
            text: '联昊通速递'
          },
          {
            id: 'YCWL',
            text: '远成快运'
          },
          {
            id: 'PJ',
            text: '品骏快递'
          },
          {
            id: 'JDKY',
            text: '京东快运'
          },
          {
            id: 'ANEKY',
            text: '安能快运'
          },
          {
            id: 'LB',
            text: '龙邦快运'
          },
          {
            id: 'DBLKY',
            text: '德邦快运'
          },
          {
            id: 'HTKYKY',
            text: '百世快运'
          },
          {
            id: 'CND',
            text: '承诺达'
          },
          {
            id: 'ZTOKY',
            text: '中通快运'
          },
          {
            id: 'HOAU',
            text: '天地华宇'
          },
          {
            id: 'CNEX',
            text: '佳吉快运'
          },
          {
            id: 'YDKY',
            text: '韵达快运'
          },
          {
            id: 'SX',
            text: '顺心捷达'
          },
          {
            id: 'JTSD',
            text: '极兔速递'
          },
          {
            id: 'DNWL',
            text: '丹鸟物流'
          },
          {
            id: 'SNWL',
            text: '苏宁物流'
          },
          {
            id: 'EST365',
            text: '东方汇'
          },
          {
            id: 'YMDD',
            text: '壹米滴答'
          },
          {
            id: 'JD',
            text: '京东快递'
          }
        ],
      }
    },
    computed: {},
    props: {
      editData: {
        type: Array,
        required: false,
      }
    },
    mounted() {
      console.log(this.editData)
      this.onlineSendOrderFrm.onlineSendOrderParamList = this.editData
      this.sendOrderFrm.offlineSendOrderParamList = this.editData
      this.quantityOne()
      // this.initLoad()
      this.initAddrList()
      this.loadLogisticsCompanyList()
      console.log(this.onlineSendOrderFrm, this.sendOrderFrm, '888')
    },
    created() {},
    methods: {
      change() {
        this.$forceUpdate();
      },
      quantityOne() {
        this.onlineSendOrderFrm.onlineSendOrderParamList.map((item, index) => {
          item.quantity = 1
        })
      },
      packageNum(val) {
        console.log('val', val);
        this.packageGoodsList = []
        this.onlineSendOrderFrm.onlineSendOrderParamList.map((item, index) => {
          if (val.orderNo == item.orderNo) {
            item.packageItemList = []
          }
        })
        console.log('66666', Number(val.quantity), Number(val.orderItemList.length));
        if (Number(val.quantity) > Number(val.orderItemList.length)) {
          this.$message({
            message: '包裹数不能大于商品数',
            type: 'warning'
          })
          val.quantity = 1
          this.$forceUpdate();
          console.log('31234564', val.quantity);
          return false
        }
        if (val.quantity > 1) {
          let arr = []
          this.sendOrder = true
          let onlyId = 1
          console.log(val.orderItemList)
          for (let j = 0; j < val.quantity; j++) {
            let goodsList = []
            val.orderItemList.forEach(i => {
              let goodsItem = {
                id: onlyId++,
                goodsImage: i.goodsImage,
                goodsName: i.goodsName,
                orderItemId: i.orderItemId,
                isChecked: false,
                isDisabled: false
              }
              goodsList.push(goodsItem)
            })
            let obj = {
              orderNo: val.orderNo,
              sort: j + 1.,
              goodsList: goodsList
            }
            arr.push(obj)
          }
          this.packageGoodsList = arr
        }
      },
      changeGoodsChecked(val, row, column) {
        console.log(val, row, column, 'val')
        val.isChecked = !val.isChecked
        if (val.isChecked == true) {
          this.packageGoodsList.map((item, index) => {
            item.goodsList.map((i, iIndex) => {
              if (val.orderItemId == i.orderItemId && i.isChecked != true) {
                i.isDisabled = true
              }
            })
          })
        } else {
          this.packageGoodsList.map((item, index) => {
            item.goodsList.map((i, iIndex) => {
              if (val.orderItemId == i.orderItemId) {
                i.isDisabled = false
              }
            })
          })
        }
        console.log('this.packageGoodsList', this.packageGoodsList, val.isChecked);
      },
      submitPackage() {
        console.log(this.packageGoodsList, this.onlineSendOrderFrm.onlineSendOrderParamList, 'onlineSendOrderFrm.list');
        let pkgArr = []
        this.packageGoodsList.map((item, index) => {
          let arr = []
          item.goodsList.map((i, iIndex) => {
            console.log(i)
            if (i.isChecked == true) {
              let obj = {
                orderItemId: i.orderItemId
              }
              arr.push(obj)
            }
          })
          pkgArr.push(arr)
        })
        console.log(pkgArr, 'ooooo')
        for (let j = 0; j < pkgArr.length; j++) {
          if (pkgArr[j].length == 0) {
            this.$message({
              message: '不能有空包裹',
              type: 'warning'
            })
            return false
          }
        }
        console.log(this.packageGoodsList, pkgArr, '3333333')
        this.onlineSendOrderFrm.onlineSendOrderParamList.map((item, index) => {
          if (item.orderNo == this.packageGoodsList[0].orderNo) {
            item.packageItemList = pkgArr
          }
        })
        this.sendOrder = false
        console.log(this.onlineSendOrderFrm.onlineSendOrderParamList,
          ' this.onlineSendOrderFrm.onlineSendOrderParamList')
      },

      onlineSubmitSend() {
        console.log(this.onlineSendOrderFrm, 'this.onlineSendOrderFrm')
        if (this.logisticsCompany == '' || this.logisticsCompany == null) {
          this.$message({
            message: '请选择物流公司',
            type: 'warning'
          })
          return false
        }
        if (this.logisticsCompanyTypeId == '' || this.logisticsCompanyTypeId == null) {
          this.$message({
            message: '请选择物流公司业务类型',
            type: 'warning'
          })
          return false
        }
        if (this.onlineSendOrderFrm.sendAddressId == '' || this.onlineSendOrderFrm.sendAddressId == null) {
          this.$message({
            message: '请选择发货地址',
            type: 'warning'
          })
          return false
        }
        if (this.onlineSendOrderFrm.returnAddressId == '' || this.onlineSendOrderFrm.returnAddressId == null) {
          this.$message({
            message: '请选择退货地址',
            type: 'warning'
          })
          return false
        }
        this.onlineSendOrderFrm.logisticsCompanyId = this.logisticsCompany.id
        this.onlineSendOrderFrm.logisticsCompanyTypeId = this.logisticsCompanyTypeId
        let param = {
          logisticsCompanyId: this.logisticsCompany.id,
          logisticsCompanyTypeId: this.logisticsCompanyTypeId,
          returnAddressId: this.onlineSendOrderFrm.returnAddressId,
          sendAddressId: this.onlineSendOrderFrm.sendAddressId,
        }
        let onlineSendOrderParamList = []

        for (let j = 0; j < this.onlineSendOrderFrm.onlineSendOrderParamList.length; j++) {
          if (this.onlineSendOrderFrm.onlineSendOrderParamList[j].quantity == '' || this.onlineSendOrderFrm
            .onlineSendOrderParamList[j].quantity == null) {
            this.$message({
              message: '请输入包裹数',
              type: 'warning'
            })
            return false
          }
          if (this.onlineSendOrderFrm.onlineSendOrderParamList[j].quantity > 1 && this.onlineSendOrderFrm
            .onlineSendOrderParamList[j].packageItemList.length == 0) {
            this.$message({
              message: '第' + (j + 1) + '个订单的包裹内商品为空',
              type: 'warning'
            })
            return false
          }
          let obj = {
            orderNo: this.onlineSendOrderFrm.onlineSendOrderParamList[j].orderNo,
            quantity: this.onlineSendOrderFrm.onlineSendOrderParamList[j].quantity,
            packageItemList: this.onlineSendOrderFrm.onlineSendOrderParamList[j].packageItemList,
          }
          onlineSendOrderParamList.push(obj)
        }
        param.onlineSendOrderParamList = onlineSendOrderParamList
        console.log(this.onlineSendOrderFrm, param, 'this.onlineSendOrderFrm')
        // return false
        this.$refs['onlineForm'].validate((valid) => {
          if (valid) {
            let loading = this.$loading({
              lock: true,
              text: '正在发货中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            postMethod('/express/batch-online-send-order', param).then(res => {
              if (res.data.length > 0) {
                // this.$message.error(res.data)
                this.$message({
                  message: res.data,
                  type: 'error'
                })
                loading.close()
                return
              } else {
                this.$message({
                  message: '发货成功',
                  type: 'success'
                })
                this.backToList()
                loading.close()
              }
            }).catch(err => {
              loading.close()
            })
          }
        })
      },
      submitSend() {
        if (this.sendOrderFrm.expressCompanyCode == '' || this.sendOrderFrm.expressCompanyCode == null) {
          this.$message({
            message: '请选择物流公司',
            type: 'warning'
          })
          return false
        }
        if (this.sendOrderFrm.sendAddressId == '' || this.sendOrderFrm.sendAddressId == null) {
          this.$message({
            message: '请选择发货地址',
            type: 'warning'
          })
          return false
        }
        if (this.sendOrderFrm.returnAddressId == '' || this.sendOrderFrm.returnAddressId == null) {
          this.$message({
            message: '请选择退货地址',
            type: 'warning'
          })
          return false
        }
        let express = this.expressList.find(item => item.id == this.sendOrderFrm.expressCompanyCode)
        this.sendOrderFrm.expressCompanyName = express.text
        let param = {
          expressCompanyCode: this.sendOrderFrm.expressCompanyCode,
          expressCompanyName: this.sendOrderFrm.expressCompanyName,
          returnAddressId: this.sendOrderFrm.returnAddressId,
          sendAddressId: this.sendOrderFrm.sendAddressId,
        }
        let offlineSendOrderParamList = []
        for (let j = 0; j < this.sendOrderFrm.offlineSendOrderParamList.length; j++) {
          if (this.sendOrderFrm.offlineSendOrderParamList[j].expressNo == '' || this.sendOrderFrm
            .offlineSendOrderParamList[j].expressNo == null) {
            this.$message({
              message: '请填写物流单号',
              type: 'warning'
            })
            return false
          }
          let obj = {
            orderNo: this.sendOrderFrm.offlineSendOrderParamList[j].orderNo,
            expressNo: this.sendOrderFrm.offlineSendOrderParamList[j].expressNo,
          }
          offlineSendOrderParamList.push(obj)
        }
        param.offlineSendOrderParamList = offlineSendOrderParamList
        console.log('this.sendOrderFrm', param);
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let scope = this
            let loading = this.$loading({
              lock: true,
              text: '正在发货中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            postMethod('/express/batch-offline-send-order', param).then(res => {
              if (res.data.length > 0) {
                this.$message({
                  message: res.data,
                  type: 'error'
                })
                // this.$message.error(res.data)
                loading.close()
                return
              } else {
                this.$message({
                  message: '发货成功',
                  type: 'success'
                })
                this.backToList()
                loading.close()
              }
            }).catch(err => {
              loading.close()
            })
          }
        })
      },
      closeSendOrderDialog() {
        this.packageGoodsList = []
        this.sendOrder = false
      },



      backToList() {
        this.$emit("backToList");
      },
      logisticsCompanySelectChange(val) {
        this.logisticsCompanyTypeList = val.deliveryTypeList
        this.logisticsCompanyTypeId=''
      },
      loadLogisticsCompanyList() {
        getMethod('/delivery/get-company-list', {
          status: '0',
          pageNum: 1,
          pageSize: 50
        }).then(res => {
          this.logisticsCompanyList = res.data.records
          this.logisticsCompanyList.map(i => {
            if (i.isDefault == 1) {
              this.logisticsCompany = i
              this.logisticsCompanySelectChange(i)
            }
          })
        })
      },
      initAddrList() {
        getMethod('/address/get-send-addr-list', {
          pageNum: 1,
          pageSize: 50,
          type: 1,
          enable: 1
        }).then(res => {
          this.sendAddressList = res.data.records
          this.sendAddressList.map(i => {
            if (i.isDefault == 1) {
              this.onlineSendOrderFrm.sendAddressId = i.addrId
              this.sendOrderFrm.sendAddressId = i.addrId
            }
          })
        })
        getMethod('/address/get-send-addr-list', {
          pageNum: 1,
          pageSize: 50,
          type: 2,
          enable: 1
        }).then(res => {
          this.returnAddressList = res.data.records
          this.returnAddressList.map(i => {
            if (i.isDefault == 1) {
              this.onlineSendOrderFrm.returnAddressId = i.addrId
              this.sendOrderFrm.returnAddressId = i.addrId
            }
          })
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .my-el-radio {
    width: 240px;
    height: 200px;

    .my-container {
      display: inline-block;
      width: 190px;
      height: 180px;

      .img {
        position: relative;
        width: 190px;
        height: 140px;
        border-radius: 10px;
        overflow: hidden;

        .img-mask {
          position: absolute;
          display: none;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1;
          color: white;

          .my-icon {
            position: absolute;
            display: inline-block;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 30px;
          }
        }
      }

      .title {
        width: 190px;
        height: 40px;
        line-height: 40px;
        text-align: center
      }

    }
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

  .step-container>>>.el-step__title.is-process {
    font-weight: normal;
    color: #C0C4CC;
  }


  .el-pagination {
    white-space: nowrap;
    padding: 2px 0px;
    color: #303133;
    font-weight: bold;
  }

  .el-pagination>>>.btn-prev {
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
    content: "";
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

  .content1>>>.el-table--border td:nth-child(2) {
    padding: 0;
  }

  .content1 /deep/ .el-table__row td:nth-child(n+3) .cell {
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
