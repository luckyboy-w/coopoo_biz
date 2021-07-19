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
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="skuId"
            border @sort-change="onSortChange">
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
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
        <el-form-item label="库存">
          <el-input type="number" placeholder="请输入库存数" v-model="replyFrm.stock">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendReply()">保存</el-button>
          <el-button plain type="primary" @click="handleClose">取消</el-button>
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
        this.sendEval = false
      },
      sendReply() {
        let scope = this
        console.log(this.replyFrm);
        if (this.replyFrm.stock == '') {
          this.replyFrm.stock = 0
        }
        let param = {
          skuId: this.replyFrm.skuId,
          stock: this.replyFrm.stock
        }
        getMethod('/goods/modify-sku-stock', param).then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.loadList()
          scope.sendEval = false
        })
      },
      replyMsg(row) {
        this.sendEval = true
        this.replyFrm = row
      },
      search() {
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
