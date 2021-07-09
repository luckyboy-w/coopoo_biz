<template>
  <div>
    <div class="ly-container">
     <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
       <div class="tabTd">
         <div>评价状态：</div>
         <div>
           <el-select v-model="searchParam.replyStatus" placeholder="请选择">
             <el-option value="" label="全部"></el-option>
             <el-option value="1" label="已回复"></el-option>
             <el-option value="0" label="未回复"></el-option>
           </el-select>
         </div>
       </div>
       <div class="tabTd">
         <el-button type="primary" @click="search()" icon="el-icon-search">搜索</el-button>
       </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="id" border
          >
            <el-table-column prop="orderNo" label="订单号" ></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop="conform" label="描述相符评价">
              <template slot-scope="scope">
                {{ scope.row.conform | type2Text }}
              </template>
            </el-table-column>
            <el-table-column prop="manner" label="服务态度评价" >
              <template slot-scope="scope">
                {{ scope.row.manner | type2Text }}
              </template>
            </el-table-column>
            <el-table-column prop="efficiency" label="发货速度评价">
              <template slot-scope="scope">
                {{ scope.row.efficiency | type2Text }}
              </template>
            </el-table-column>
            <el-table-column prop="memberNickname" label="评价人" ></el-table-column>
            <el-table-column prop="isShow" label="是否显示"  width="150px">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isShow" active-value="1" inactive-value="0"
                  @change="isShow(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column fixed="right" prop="id" label="操作" >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    @click="replyMsg(scope.row)"
                    v-if="scope.row.replyStatus == 0"
                    size="mini" type="primary"
                  >回复
                  </el-button>
                  <el-button
                    @click="replyMsg(scope.row)"
                    v-if="scope.row.replyStatus == 1"
                    size="mini" type="primary"
                  >查看
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
    <el-dialog title="评价信息" :visible="sendEval" v-if="sendEval" :before-close="handleClose">
      <el-form ref="form" :model="replyFrm" label-width="80px">
        <el-form-item label="用户评价">
          <el-input
            type="textarea"
            :rows="4"
            v-model="replyFrm.commentContent"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入回复信息"
            v-model="replyFrm.replyContent"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="replyFrm.replyStatus==0" @click="sendReply()">回复</el-button>
          <el-button plain type="primary" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'

export default {
  computed: {},
  props: {
    replyMsgStatusParent: {
      type: String,
      required: false,
      default: ''
    }
  },
  filters: {
    msg2Text(status) {
      if (status == '0') {
        return '未回复'
      } else {
        return '已回复'
      }
    },
    type2Text(verifyStatus) {
      // 描述相符;1:满意;2:一般;3:不满意
      // 审核状态;10:待审核;20:已通过;30:被驳回
      if (verifyStatus == 1) {
        return '满意'
      } else if (verifyStatus == 2) {
        return '一般'
      } else {
        return '不满意'
      }
    }
  },
  created() {
  },
  data() {
    return {
      sendEval: false,
      showPagination: false,
      replyFrm: {

      },
      searchParam: {
        replyStatus: '',
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
    handleClose(done) {
      this.sendEval = false
    },
    sendReply() {
      let scope = this
      console.log(this.replyFrm);
      let param = {
        id:this.replyFrm.id,
        isShow:this.replyFrm.isShow,
        replyContent:this.replyFrm.replyContent
      }
      if (param.replyContent=='') {
        this.$message({
            message: "回复内容不能为空",
            type: "success"
        });
        return false;
      }else{
        postMethod('/order/reply-goods-comment', param).then(res => {
        this.$message({
            message: "回复成功",
            type: "success"
        });
        this.loadList()
        scope.sendEval = false
      })
      }
    },
    isShow(row){
      let scope = this
      if (row.isShow=="1") {
        postMethod('/order/reply-goods-comment', {id:row.id,isShow:'1'}).then(res => {
          scope.loadList()
          scope.$message({
            message: "操作成功",
            type: "success"
          });
        });
      } else if(row.isShow=="0"){
      postMethod('/order/reply-goods-comment', {id:row.id,isShow:'0'}).then(res => {
        scope.loadList()
        scope.$message({
          message: "操作成功",
          type: "success"
        });
      });
      }
    },
    replyMsg(row) {
      console.log(row, '这是回复')
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
      getMethod('/order/get-goods-comment-list', this.searchParam).then(
        res => {
          scope.tableData.list = res.data.records
          scope.tableData.list.forEach(i=>{
            i.isShow=String(i.isShow)
          })
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

.el-pagination > > > .btn-prev {
  margin: 0 5px 0 0;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}

</style>
