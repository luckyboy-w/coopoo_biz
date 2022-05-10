<template>
  <div>
    <div class="ly-container">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>商品名称：</div>
          <div>
            <el-input v-model="searchParam.goodsName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>物料编码：</div>
          <div>
            <el-input v-model="searchParam.goodsCode" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <el-button type="primary" @click="search()" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;"
            border @sort-change="onSortChange">
            <el-table-column prop="goodsName" label="商品名称">
              <template slot-scope="scope">
                <span>{{scope.row.goodsName}}</span>
                <el-tag effect="light" size="mini" v-if="scope.row.goodsType==2">
                  专属
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="skuText" label="商品规格"></el-table-column>
            <el-table-column prop="goodsCode" label="物料编码"></el-table-column>
            <el-table-column prop="stock" label="可用库存" sortable="custom"></el-table-column>
            <el-table-column prop="lockedStock" label="锁定库存"></el-table-column>
            <el-table-column fixed="right" prop="skuId" label="操作">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button @click="replyMsg(scope.row)" size="mini" type="primary">补货
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage"
            @prev-click="currentPage" @next-click="currentPage" :total="tableData.total"
            :page-size="searchParam.pageSize" :current-page="searchParam.pageNum"></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <el-dialog title="补货" :visible="sendEval" v-if="sendEval" :before-close="handleClose">
      <el-form ref="form" :model="replyFrm" label-width="80px">
        <el-form-item label="商品规格">
          <el-input disabled v-model="replyFrm.skuText">
          </el-input>
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input disabled v-model="replyFrm.goodsCode">
          </el-input>
        </el-form-item>
        <el-form-item label="现有库存">
          <el-input type="number" placeholder="请输入" disabled v-model="replyFrm.stock">
          </el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio v-model="replyFrm.opType" label="1">增加</el-radio>
          <el-radio v-model="replyFrm.opType" label="2">减少</el-radio>
        </el-form-item>
        <el-form-item label="库存">
          <el-input type="number" style="width: 300px;" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入" v-model="replyFrm.changeStock">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendReply()">保存</el-button>
          <el-button plain type="primary" @click="handleClose()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request'
import store from '@/store'
  export default {
    computed: {},
    props: {
      replyMsgStatusParent: {
        type: String,
        required: false,
        default: ''
      }
    },
    filters: {},
    created() {},
    data() {
      return {
        sendEval: false,
        showPagination: false,
        replyFrm: {

        },
        searchParam: {
          supplierId:store.getters.supplierId,
          goodsCode: '',
          goodsName: '',
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
       // console.log(store.getters.supplierId,store.getters.supplierName)
    },
    methods: {
      onSortChange({
        prop,
        order
      }) {
        console.log(prop, order)
        if (order == "descending") {
          this.searchParam.pageNum = 1
          this.searchParam.stockOrder = 1
          this.loadList()
        } else if (order == "ascending") {
          this.searchParam.pageNum = 1
          this.searchParam.stockOrder = 2
          this.loadList()
        } else if (order == null) {
          this.searchParam.pageNum = 1
          this.searchParam.stockOrder = ''
          this.loadList()
        }
      },

      handleClose(done) {
        this.replyFrm= {}
        this.sendEval = false
      },
      sendReply() {
        let scope = this
        console.log(scope.replyFrm);
        if(!scope.replyFrm.opType){
         this.$message({
           message: "请选择类型",
           type: "warning"
         });
         return false
        }
        if(scope.replyFrm.opType==2&&Number(scope.replyFrm.stock)<Number(scope.replyFrm.changeStock)){
         this.$message({
           message: "减少库存不能大于现有库存",
           type: "warning"
         });
         return false
        }
        if (scope.replyFrm.changeStock== ''||!scope.replyFrm.changeStock) {
          scope.replyFrm.changeStock = 0
        }
        let param = {
          skuId: scope.replyFrm.skuId,
          stock: scope.replyFrm.changeStock,
          opType:scope.replyFrm.opType,
        }
        getMethod('/goods/modify-sku-stock', param).then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          scope.loadList()
          scope.sendEval = false
        })
      },
      replyMsg(row) {
        this.sendEval = true
        this.replyFrm = row
      },
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
      loadList() {
        let scope = this
        postMethod('/goods/sku-list', this.searchParam).then(
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

  .el-pagination>>>.btn-prev {
    margin: 0 5px 0 0;
    background-color: #f4f4f5;
    color: #606266;
    min-width: 30px;
    border-radius: 2px;
  }
</style>
