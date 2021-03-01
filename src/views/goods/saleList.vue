<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>商品名称:</td>
            <td>
              <el-input v-model="searchParam.goodName" width="180px"/>
            </td>
            <td>货号:</td>
            <td>
              <el-input v-model="searchParam.goodCode" width="180px"/>
            </td>
            <td>
              <el-button icon="el-icon-search" @click="search()">搜索</el-button>
              <!--              <el-button plain type="primary" icon="el-icon-add" @click="addOrEdit('add')">新增</el-button>-->
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            row-key="id"
            border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  :data="props.row.skuPriceList"
                  row-key="id"
                  border
                >
                  <el-table-column prop="skuText" label="SKU属性" width="260px"></el-table-column>
                  <el-table-column prop="stock" label="库存" width="150px"></el-table-column>
                  <el-table-column prop="salePrice" label="零售价" width="150px"></el-table-column>
                  <el-table-column prop="saleMemPrice" label="会员价" width="150px"></el-table-column>
                  <el-table-column prop="saleCount" label="销量" width="150px"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="goodName" label="商品名称" width="350px"/>
            <el-table-column prop="goodMerit" label="商品分类" width="150px">
              <template slot-scope="scope">
                {{ scope.row.typeName }} -> {{ scope.row.typeName2 }}
              </template>
            </el-table-column>
            <el-table-column prop="goodBrand" label="是否推荐" width="150px">
              <template slot-scope="scope">
                {{ scope.row.recommend == '0' ? '未推荐' : '已推荐' }}
              </template>
            </el-table-column>
            <el-table-column prop="verifyStatus" label="状态" width="150px">
              <template slot-scope="scope">
                {{ scope.row | parseStatus }}
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="总销量" width="80px">
              0
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间" width="120px">
              <template slot-scope="scope">
                {{ scope.row.createTime | _formatDate }}
              </template>
            </el-table-column>

            <el-table-column prop="id" label="操作" width="200px" v-if="showOp">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button v-if="scope.row.verifyStatus == 10 || scope.row.verifyStatus == 20 "
                             type="primary" size="mini" @click="addOrEdit('edit',scope.$index, tableData, true)"
                  >查看详情
                  </el-button>
                  <!--5:在仓库;10:待审核;20:已通过;30:被驳回;40:违规下架;-->
                  <el-button v-if="scope.row.verifyStatus == 20" type="primary" size="mini"
                             @click.native.prevent="addStock(scope.row)"
                  >补货
                  </el-button>
                  <el-button v-if="scope.row.verifyStatus == 5" type="primary" size="mini"
                             @click="modityGood(scope.row,'verifyStatus','10')"
                  >提交审核
                  </el-button>
                  <el-button v-if="scope.row.verifyStatus == 10" type="primary" size="mini"
                             @click="modityGood(scope.row,'verifyStatus','5')"
                  >取消审核
                  </el-button>
                  <el-button
                    v-if="scope.row.verifyStatus == 30 || scope.row.verifyStatus == 5 || scope.row.isSale == 3 "
                    type="primary" size="mini" @click="addOrEdit('edit',scope.$index, tableData)"
                  >编辑
                  </el-button>
                  <el-button v-if="scope.row.verifyStatus == 20 && scope.row.isSale == 1 " type="primary" size="mini"
                             @click="offLine(scope.row,'3')"
                  >下架
                  </el-button>
                  <el-button v-if="scope.row.isSale == 3"
                             type="primary" size="mini" @click="deleteRow(scope.$index,tableData)"
                  >删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination
            :total="tableData.total"
            v-show="!showPagination"
            background
            layout="prev, pager, next"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
          />
        </div>
      </div>
      <div class="list-panel"/>
    </div>

    <el-dialog title="补货"
               :visible.sync="pushStockBatch" v-if="pushStockBatch" width="800px"
    >
      <el-row :gutter="20" style="line-height:40px;font-size:14px;padding:0px 0px 20px 0px" v-if="stockType == 1">
        <el-col :span="4">
          库存数量：
        </el-col>
        <el-col :span="4">
          <el-input v-model="stockNum" @keyup.native="syncStockNum"></el-input>
        </el-col>
        <el-col :span="16"></el-col>
      </el-row>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
        <el-table
          :data="addStockList"

          style="width:1200px; margin-bottom: 20px;"
          row-key="id"
          border
        >
          <el-table-column prop="skuText" label="SKU属性" width="260px"></el-table-column>
          <el-table-column prop="stock" label="库存" width="120px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" :disabled="stockType == 1"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="salePrice" label="零售价" width="120px"></el-table-column>
          <el-table-column prop="saleMemPrice" label="会员价" width="120px"></el-table-column>
        </el-table>
      </el-row>
      <el-row :gutter="20" style="line-height:40px;font-size:12px">
        <el-col :span="8">
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="submitStock()">提交</el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="cancelStock()">取消</el-button>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="补货" v-if="pushStock">
      <el-form ref="dataForm" :model="stockForm" label-width="100px">
        <el-form-item label="库存数量">

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitStock()">提交</el-button>
          <el-button @click="cancelStock()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <saveOrEdit v-if="showAddOrEdit" :edit-data="editData" :isGift="isGift" :isHiddenEditGood="isHiddenEditGood"
                @showListPanel="showListPanel"
    />
  </div>
</template>

<script>
import saveOrEdit from './publish/saveOrEdit'
import { getMethod, postMethod } from '@/api/request'
import { formatDate } from '@/api/tools.js'

export default {
  components: {
    saveOrEdit
  },
  data() {
    return {
      isHiddenEditGood: true,
      stockType: '',
      stockNum: '',
      showOp: true,
      showList: true,
      showAddOrEdit: false,
      pushStockBatch: false,
      pushStock: false,
      typeIdList: [],
      typeId2List: [],
      goodBrandList: [],
      addStockList: [],
      showPagination: false,
      editData: {},
      isGift: '1',
      stockForm: {
        stockNum: ''
      },
      searchParam: {
        typeName: '',
        pageSize: 10,
        pageNum: 0,
        verifyStatus: '20',
        isSale: '1'
      },
      tableData: {
        list: []
      },
      dataList: []
    }
  },
  props: {
    dataSource: {
      type: String,
      required: false
    },
    goodStatus: {
      type: Object,
      required: false
    },
    giftStatus: {
      type: String,
      required: false,
      default: '1'
    }
  },
  computed: {},
  mounted() {
    if (this.dataSource != undefined) {
      this.searchParam.verifyStatus = this.goodStatus.verifyStatus
      this.searchParam.isSale = this.goodStatus.isSale
    }
    if (this.verifyStatus == '10') {
      this.showOp = false
    }
    this.isGift = this.giftStatus
    this.initLoad()
  },
  filters: {
    _formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    parseStatus(row) {
      let verifyStatus = row.verifyStatus
      //审核状态;10:待审核;20:已通过;30:被驳回
      if (verifyStatus == 5) {
        return '待提交审核'
      } else if (verifyStatus == 10) {
        return '待审核'
      } else if (verifyStatus == 30) {
        return '被驳回'
      } else if (verifyStatus == 40) {
        return '违规下架'
      } else {
        return '已通过'
      }
    }
  },
  created() {
  },
  methods: {
    syncStockNum() {
      if (isNaN(this.stockNum)) {
        this.$message({
          message: '库存数量输入有误',
          type: 'warning'
        })
        return
      }

      if (this.stockNum < 0) {
        this.$message({
          message: '库存不能为负数',
          type: 'warning'
        })
        return
      }

      debugger

      for (let i = 0; i < this.addStockList.length; i++) {
        let skuObj = this.addStockList[i]
        skuObj.stock = this.stockNum
      }
    },
    submitStock() {
      let scope = this
      let param = {
        stockType: this.stockType,
        skuPriceList: this.addStockList
      }
      for (let i = 0; i < this.addStockList.length; i++) {
        let rowObj = this.addStockList[i]
        if (rowObj.stock == '') {
          this.$message({
            message: '库存不能为空',
            type: 'warning'
          })
          return
        }
        if (isNaN(rowObj.stock)) {
          this.$message({
            message: '库存输入有误',
            type: 'warning'
          })
          return
        }

        if (rowObj.stock < 0) {
          this.$message({
            message: '库存不能为负数',
            type: 'warning'
          })
          return
        }

        if ((rowObj.stock + '').indexOf('.') != -1) {
          this.$message({
            message: '库存不能是小数',
            type: 'warning'
          })
          return
        }
      }

      postMethod('/bu/good/modityGoodStock', param).then(res => {
        this.$message({
          message: '补货成功',
          type: 'success'
        })
        scope.cancelStock()
        scope.loadList()
      })
    },
    cancelStock() {
      this.pushStockBatch = false
      this.pushStock = false
    },
    addStock(row, rowIndex) {
      this.stockType = row.stockType
      this.addStockList = row.skuPriceList
      //1:全局配置;2:局部配置
      this.pushStockBatch = true
    },
    loadtypeIdList() {
      let scope = this
      let param = {
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
      this.loadList()
    },
    modityGood(row, type, v) {
      let scope = this
      let param = {
        id: row.id
      }
      param[type] = v
      if (v == '2') {
        param['verifyStatus'] = '10'
      }

      if (type == 'verifyStatus' && v == 10) {
        param['isSale'] = 2
      }
      postMethod('/bu/good/updateStatus', param).then(res => {
        scope.loadList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    offLine(row, isSale) {
      console.log(row.isSale, '9898989')
      console.log(isSale, '3333333')
      let scope = this
      let param = {
        id: row.id,
        verifyStatus: '40',//下架退回到待审核
        isSale: isSale
      }
      postMethod('/bu/good/updateStatus', param).then(res => {
        scope.loadList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    addOrEdit(oper, rowIndex, data, hidden) {
      this.isHiddenEditGood = hidden
      const scope = this

      if (oper == 'edit') {
        const param = {
          id: data.list[rowIndex].id
        }
        getMethod('/bu/good/findObject', param).then(res => {
          scope.editData = res.data[0]
          scope.editData.verifyStatus = '5' //只要重新提交编辑，状态都变成去仓库
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
    initLoad() {
      this.loadList()
    },
    loadList() {
      const scope = this
      getMethod('/bu/good/findPage?isGift=' + this.isGift, this.searchParam).then(res => {
        scope.tableData = res.data
        scope.showPagination = scope.tableData.total == 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container {
  .ly-tool-panel {
    padding: 10px 0px;

  }
}
</style>
