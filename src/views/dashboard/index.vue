<template>
  <div>
    <el-row :span="24" class="panel-group">
      <el-col :span="4" class="card-panel-col">
        <router-link to="/bc-goods/reject">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="no_pass" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                审核不通过
              </div>
              <count-to :start-val="0" :end-val="ordDtl.rejectGood" :duration="100" class="card-panel-num"/>
            </div>
            <el-divider></el-divider>
            <div class="card-panel-footer-text">点击查看</div>
          </div>
        </router-link>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4" class="card-panel-col">
        <router-link to="/bc-goods/saleList">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="on-sale" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                在售商品
              </div>
              <count-to :start-val="0" :end-val="ordDtl.onSale" :duration="100" class="card-panel-num"/>
            </div>
            <el-divider></el-divider>
            <div class="card-panel-footer-text">点击查看</div>
          </div>
        </router-link>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4" class="card-panel-col">
        <router-link to="/bc-order/ready">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="send-good" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待发货
              </div>
              <count-to :start-val="0" :end-val="ordDtl.reaySend" :duration="100" class="card-panel-num"/>
            </div>
            <el-divider></el-divider>
            <div class="card-panel-footer-text">点击查看</div>
          </div>
        </router-link>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4" class="card-panel-col">
        <router-link to="bc-order/readyPay">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="ready-pay" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待支付
              </div>
              <count-to :start-val="0" :end-val="ordDtl.reayPay" :duration="100" class="card-panel-num"/>
            </div>
            <el-divider></el-divider>
            <div class="card-panel-footer-text">点击查看</div>
          </div>
        </router-link>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4" class="card-panel-col">
        <!-- <router-link :to="{name:'/bc-order/ready', params: {id:1}}"> -->
        <router-link
          :to="{
                  path: '/bc-order/eval',
                  query: {
                      s: '1'
                  }
              }"
        >
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="eval-msg" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待回复订单
              </div>
              <count-to :start-val="0" :end-val="ordDtl.reayEval" :duration="100" class="card-panel-num"/>
            </div>
            <el-divider></el-divider>
            <div class="card-panel-footer-text">点击查看</div>
          </div>
        </router-link>
      </el-col>
    </el-row>
    <el-row :span="24" class="panel-group">
      <el-col :span="4" class="card-panel-col">
        <router-link to="bc-order/back">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="reject-good" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                退货中订单
              </div>
              <count-to :start-val="0" :end-val="ordDtl.reayReject" :duration="100" class="card-panel-num"/>
            </div>
            <el-divider></el-divider>
            <div class="card-panel-footer-text">点击查看</div>
          </div>
        </router-link>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4" class="card-panel-col">
        <router-link
          :to="{
                path: '/bc-order/list',
                query: {
                  dt: '1'
                }
            }"
        >
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="reject-good" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                昨日交易额
              </div>
              <!--              <span style="font-size:20px">{{ ordDtl.dealLast }}</span>-->
              <count-to :start-val="0" :end-val="ordDtl.dealLast" :duration="100" class="card-panel-num"/>
            </div>
            <el-divider></el-divider>
            <div class="card-panel-footer-text">点击查看</div>
          </div>
        </router-link>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4" class="card-panel-col">
        <router-link
          :to="{
                path: '/bc-order/list',
                query: {
                  dt: '2'
                }
            }"
        >
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="over-time" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                超期未付款
              </div>
              <count-to :start-val="0" :end-val="ordDtl.exceedOrd" :duration="100" class="card-panel-num"/>
            </div>
            <el-divider></el-divider>
            <div class="card-panel-footer-text">点击查看</div>
          </div>
        </router-link>
      </el-col>
    </el-row>

    <el-row :span="24">
    </el-row>

    <el-row :span="24" class="counter-area">
      <el-col :xs="24" :sm="24" :lg="12">
        <pie-chart/>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-tabs v-model="activeName">
          <el-tab-pane label="商品销量TOP10" name="salesNum">
            <div>
              <!--              <div class="analysis-title">商品销量TOP10</div>-->
              <div>
                <el-table
                  ref="settleEndData"
                  :data="bestSale"
                  style="width: 100%; margin-bottom: 20px;"
                  row-key="id"
                >
                  <el-table-column prop="goodName" label="商品名称" min-width="70%">
                  </el-table-column>
                  <el-table-column prop="dataCnt" label="销量" min-width="30%">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收藏量TOP10" name="startsNum">
            <div>
              <!--              <div class="analysis-title">收藏量TOP10</div>-->
              <div>
                <el-table
                  ref="settleEndData"
                  :data="bestFav"
                  style="width: 100%; margin-bottom: 20px;"
                  row-key="id"
                > <el-table-column>1</el-table-column>
                  <el-table-column prop="goodName" label="商品名称" min-width="70%">
                  </el-table-column>
                  <el-table-column prop="dataCnt" label="收藏量" min-width="30%">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>


      <!--      <el-col :span="6">-->
      <!--        <div style="padding: 0px 10px;">-->
      <!--          <div class="analysis-title">销售量后10名</div>-->
      <!--          <div>-->
      <!--            <el-table-->
      <!--              ref="settleEndData"-->
      <!--              :data="worseSale"-->
      <!--              style="width: 100%; margin-bottom: 20px;"-->
      <!--              row-key="id"-->
      <!--            >-->
      <!--              <el-table-column prop="goodName" label="商品名称" min-width="70%">-->
      <!--              </el-table-column>-->
      <!--              <el-table-column prop="dataCnt" label="销量" min-width="30%">-->
      <!--              </el-table-column>-->
      <!--            </el-table>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-col>-->


      <!--      <el-col :span="6">-->
      <!--        <div style="padding: 0px 10px;">-->
      <!--          <div class="analysis-title">收藏量后10名</div>-->
      <!--          <div>-->
      <!--            <el-table-->
      <!--              ref="settleEndData"-->
      <!--              :data="worseFav"-->
      <!--              style="width: 100%; margin-bottom: 20px;"-->
      <!--              row-key="id"-->
      <!--            >-->
      <!--              <el-table-column prop="goodName" label="商品名称" min-width="70%">-->
      <!--              </el-table-column>-->
      <!--              <el-table-column prop="dataCnt" label="收藏量" min-width="30%">-->
      <!--              </el-table-column>-->
      <!--            </el-table>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-col>-->

    </el-row>


  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'
import PieChart from '@/views/dashboard/admin/components/PieChart'

export default {
  name: '',
  props: [''],
  data() {
    return {
      activeName: 'salesNum',
      readyEval: '/bc-order/readyEval',
      bestSale: [],
      worseSale: [],
      bestFav: [],
      worseFav: [],
      ordDtl: {
        rejectGood: 0,
        reaySend: 0,
        onSale: 0,
        reayPay: 0,
        reayEval: 0,
        reayReject: 0,
        dealLast: 0,
        exceedOrd: 0
      },
      orgOptions: {},
      lineDate: {
        dateList: [],
        ordListL: [],
        payList: []
      }
    }
  },
  components: {
    CountTo,
    PieChart
  },
  computed: {},
  beforeMount() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      let scope = this

      getMethod('/bc/analysis/findOrdLine', {}).then(res => {

        let resData = res.data

        for (let rowIndex in resData.dtlData) {
          let rowData = resData.dtlData[rowIndex]
          if (rowData.dataType == 'dealLast') {

            scope.ordDtl[rowData.dataType] = parseInt(rowData.siteData)
          } else {
            scope.ordDtl[rowData.dataType] = parseInt(rowData.siteData)
          }

        }
      })

      getMethod('/bc/analysis/findAnalysisList', {}).then(res => {

        let resData = res.data
        resData.forEach((rowObj) => {
          if (rowObj.dataType == 'bestSale') {
            scope.bestSale = rowObj.analysisList
          } else if (rowObj.dataType == 'worseSale') {
            scope.worseSale = rowObj.analysisList
          } else if (rowObj.dataType == 'bestFav') {
            scope.bestFav = rowObj.analysisList
          } else {
            scope.worseFav = rowObj.analysisList
          }
        })
      })

    }
  },
  watch: {}
}

</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.analysis-title {
  font-family: 'Arial Negreta', 'Arial';
  font-size: 16px;
  color: #333333;
  text-align: center;
  line-height: 45px;
  font-weight: 700;
  background: #F0F0F0;
}

.panel-group {
  //margin-top: 18px;
  margin-top: 4vh;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    //height: 108px;
    height: 150px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    border-color: rgba(0, 0, 0, .05);
    transition: .2s;

    &:hover {
      box-shadow: 0px 4px 10px #ccc;
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: right;
      //margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: right;
      font-size: 48px;
    }

    .card-panel-description {
      font-weight: bold;
      margin-top: 26px;
      padding-left: 20px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 15px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 30px;
      }
    }

    .card-panel-footer-text {
      color: rgba(0, 0, 0, 0.45);
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }
  }

}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

.counter-area {
  background: $heavyBGColor;
  width: 100%;
  min-height: 50vh;
  margin-top: 4vh;
  padding: 5vh 2vw 5vh 2vw;
  transition: .2s;

  &:hover {
    box-shadow: 0px 4px 10px #ccc;
  }

}


.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 14px 0;
}
</style>
