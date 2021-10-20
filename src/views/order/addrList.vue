<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>
              <el-button  type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
            <!--  <el-button v-if="false" plain type="primary" @click="remove('add')" icon="el-icon-document-add">删除
              </el-button> -->
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
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >

            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="addrName" label="地址名称">
              <template slot-scope="scope">
                {{ scope.row.addrName }}
                <el-tag
                  v-if="scope.row.type == 1"
                  effect="light"
                  size="mini"
                >
                  发货
                </el-tag>
                <el-tag
                  v-if="scope.row.type == 2"
                  effect="light"
                  size="mini"
                >
                  退货
                </el-tag>
                <el-tag
                  v-if="scope.row.isDefault == 1"
                  effect="light"
                  size="mini"
                >
                  默认
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="person" label="联系人" ></el-table-column>
            <el-table-column prop="mobilePhone" label="联系方式" width="150px"></el-table-column>
            <el-table-column label="所在城市" width="200px">
              <template slot-scope="scope">
                {{ `${scope.row.provincetext} ${scope.row.citytext} ${scope.row.areaText}` }}
              </template>
            </el-table-column>

            <el-table-column prop="addrDtl" label="详细地址"></el-table-column>
            <el-table-column prop="enable" label="状态" >
              <template slot-scope="scope">
                {{ scope.row.enable == '0' ? '禁用' : '启用' }}
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                  v-if="scope.row.enable=='0'"
                    @click="addOrEdit('edit',scope.$index, tableData)"
                    size="mini" type="primary"
                  >编辑
                  </el-button>
                  <el-button
                  v-if="scope.row.enable=='1'"
                    @click="addOrEdit('detail',scope.$index, tableData)"
                    size="mini" type="primary"
                  >详情
                  </el-button>
                  <el-button
                  v-if="scope.row.enable=='0'"
                    @click="enable('1',scope.$index, tableData)"
                    size="mini" type="primary"
                  >启用
                  </el-button>
                  <el-button
                  v-if="scope.row.enable=='1'"
                    @click="enable('0',scope.$index, tableData)"
                    size="mini" type="primary"
                  >禁用
                  </el-button>
                  <el-button
                  v-if="scope.row.enable=='0'"
                    @click="remove(scope.row.addrId)"
                    size="mini" type="danger"
                  >删除
                  </el-button>
                </el-button-group>
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
            :page-size="searchParam.pageSize"
            :current-page="searchParam.pageNum"
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
import { getMethod, postMethod } from '@/api/request'

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
        pageNum: 1
      },
      tableData: {
        list: []
      },
      dataList: []
    }
  },
  methods: {
    remove(ids) {
      postMethod('/address/delete?addrId='+ids).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.loadList()
      })
    },
    search() {
		this.searchParam.pageNum = 1;
      this.loadList()
    },
    addOrEdit(oper, rowIndex, data) {
      let scope = this

      if (oper == 'edit') {
        let param = {
          addrId: data.list[rowIndex].addrId
        }
        getMethod('/address/get-send-addr-info', param).then(res => {
          scope.editData = res.data
          this.showList = false
          this.showAddOrEdit = true
        })
      } else if (oper == 'detail') {
        let param = {
          addrId: data.list[rowIndex].addrId
        }
        getMethod('/address/get-send-addr-info', param).then(res => {
          scope.editData = res.data
          scope.editData.isDisabled = true
          this.showList = false
          this.showAddOrEdit = true
        })
      }else{
        scope.editData = {}
        this.showList = false
        this.showAddOrEdit = true
      }
    },
    enable(oper, rowIndex, data){
      if (oper == '0') {
        postMethod('/address/disable?addrId='+data.list[rowIndex].addrId).then(res => {
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
          this.loadList()
        })
      } else if (oper == '1') {
        postMethod('/address/enable?addrId='+data.list[rowIndex].addrId).then(res => {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
          this.loadList()
        })
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
      let scope = this
      getMethod('/address/get-send-addr-list', this.searchParam).then(
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
  .ly-tool-panel {
    padding: 10px 0px;
  }
}
</style>
