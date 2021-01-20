<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>
              <el-button plain type="danger" @click="remove()" icon="el-icon-delete">
                删除
              </el-button>

              <el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">
                新建
              </el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            @selection-change="handleSelectionChange"
          >

            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="快递公司">
              <template slot-scope="scope">
                {{ scope.row.expressName }}
                <el-tag
                  v-if="scope.row.isDefault == 1"
                  effect="light"
                  size="mini"
                >
                  默认
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="业务类型">
              <template slot-scope="scope">
                <el-tag
                  v-for="item in scope.row.deliveryTypeList"
                  :key="item.id"
                  effect="light"
                  class="my-tag"
                >
                  {{ item.expressTypeName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="付款方式">
              <template slot-scope="scope">
                {{ scope.row.paymentMethod == 1 ? '到付' : '' }}
                {{ scope.row.paymentMethod == 2 ? '现付' : '' }}
                {{ scope.row.paymentMethod == 3 ? '月结' : '' }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                {{ scope.row.status == '0' ? '启用' : '禁用' }}
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="addOrEdit('edit',scope.$index, tableData)"
                  type="text"
                  size="small"
                >编辑
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  v-if="scope.row.status == 0"
                  @click.native.prevent="disable(scope.row.id)"
                  type="text"
                  size="small"
                >禁用
                </el-button>
                <el-button
                  v-else-if="scope.row.status == 1"
                  @click.native.prevent="enable(scope.row.id)"
                  type="text"
                  size="small"
                >启用
                </el-button>
              </template>
            </el-table-column>
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
            :page-size="this.searchParam.pageSize"
          ></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
  </div>
</template>

<script>
import saveOrEdit from './saveOrEdit'
import { getMethod, postMethod, putMethod, deleteMethod } from '@/api/request'

export default {
  computed: {},
  mounted() {
    this.initLoad()
  },
  components: { saveOrEdit },
  created() {
  },
  data() {
    return {
      showList: true,
      showAddOrEdit: false,
      showPagination: false,
      editData: {},
      searchParam: {
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      multipleSelection: []
    }
  },
  methods: {
    async enable(id) {
      let res = await putMethod('/bu/delivery/enable', { id })
      if (res.code !== 200) {
        this.$message.error('操作失败')
        return
      }
      this.$message.success('操作成功')
      this.loadList()
    },
    async disable(id) {
      let res = await putMethod('/bu/delivery/disable', { id })
      if (res.code !== 200) {
        this.$message.error('操作失败')
        return
      }
      this.$message.success('操作成功')
      this.loadList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async remove() {
      const removeIds = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        removeIds.push(this.multipleSelection[i].id)
      }

      if (removeIds.length == 0) {
        this.$message.warning('要删除的元素不能为空')
        return
      }
      try {
        await this.$confirm('是否继续删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        let res = await deleteMethod('/bu/delivery/company', { ids: removeIds })
        if (res.code !== 200) {
          this.$message.error('删除失败')
          return
        }

        this.loadList()
        this.$message.success('删除成功')
      } catch (e) {
      }
    },
    batchDeleteRow(rowIndex, data) {
      let selectList = this.$refs.mainTable.selection
      let idArr = []
      for (let i = 0; i < selectList.length; i++) {
        idArr.push(selectList[i].id)
      }
      let param = {
        delType: '2',
        ids: idArr.join(',')
      }
      postMethod('/backend/sendAddr/delete', param).then(res => {
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
    addOrEdit(oper, rowIndex, data) {
      let scope = this

      if (oper == 'edit') {
        let param = {
          addrId: data.list[rowIndex].addrId
        }
        getMethod('/bc/sendAddr/findObject', param).then(res => {
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
    initLoad() {
      this.loadList()
    },
    async loadList() {
      let res = await getMethod('/bu/delivery/companyList', this.searchParam)
      this.tableData = res.data
      this.showPagination = this.tableData.total == 0
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container {
  padding: 10px 20px;
  font-size: 14px;

  .ly-tool-panel {
    div {
      display: inline;
    }

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

.my-tag {
  margin-right: 5px;
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
