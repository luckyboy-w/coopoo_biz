<template>
	<div>
		<saveOrEdit v-if="showAddOrEdit" :edit-data="editData" :isGift="isGift" @showListPanel="showListPanel" />
	</div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import { getMethod, postMethod } from "@/api/request";

export default {
	components: { saveOrEdit },
	data() {
		return {
			loading:false,
			typeIdList: [],
			typeId2List: [],
			typeIdList: [],
			goodBrandList: [],
			showList: false,
			showAddOrEdit: true,
			showPagination: false,
			editData: {},
			isGift:'1',
			searchParam: {
				typeName: "",
				pageSize: 10,
				pageNum: 0
			},
			tableData: {
				list: []
			},
			dataList: []
		};
	},
	props:{
		giftStatus:{
			type:String,
			required:false,
			default:'1'
		}
	},
	computed: {},
	mounted() {
		this.isGift = this.giftStatus
		// this.initLoad();
		this.loadtypeIdList();
	},
	created() {},
	methods: {
		loadtypeIdList() {
      		let scope = this
			let param = {
				parentId: "-1"
			};
			getMethod("/bu/good/findType", param).then(res => {
				scope.typeIdList = res.data.list;
			});
		},
		deleteRow(rowIndex, data) {
			const param = {
				id: data.list[rowIndex].id
			};
			this.$confirm("是否继续删除操作?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				postMethod("/bu/good/delete", param).then(res => {
					this.loadList();
					this.$message("删除成功");
				});
			});
		},
		batchDeleteRow(rowIndex, data) {
			const selectList = this.$refs.mainTable.selection;
			const idArr = [];
			for (let i = 0; i < selectList.length; i++) {
				idArr.push(selectList[i].id);
			}
			const param = {
				delType: "2",
				ids: idArr.join(",")
			};
			postMethod("/bu/good/delete", param).then(res => {
				scope.editData = res.data[0];
				this.showList = false;
				this.showAddOrEdit = true;
				this.$message({
					message: "删除成功",
					type: "success"
				});
			});
			this.searchParam.pageSize = 10;
			this.searchParam.pageNum = 0;
			this.loadList();
		},
		search() {
			this.loadList();
		},
		addOrEdit(oper, rowIndex, data) {

			const scope = this;
			this.loading = true
			if (oper == "edit") {
				const param = {
					id: data.list[rowIndex].id
				};
				getMethod("/bu/good/findObject", param).then(res => {
					this.loading = false
					scope.editData = res.data[0];
					this.showList = false;
					this.showAddOrEdit = true;
				});
			} else {
				scope.editData = {};
				this.showList = false;
				this.showAddOrEdit = true;
			}
		},
		showListPanel(isCancel) {
			this.showList = true;
			this.showAddOrEdit = false;
			this.$nextTick(()=>{
				this.showList = false;
				this.showAddOrEdit = true;
			})

			this.loadList();
			this.loading = false
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
			getMethod("/bu/good/findPage?isGift=1", this.searchParam).then(res => {
				scope.tableData = res.data;
				scope.showPagination = scope.tableData.total == 0;
				this.loading = false
			});
		}
	}
};
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
</style>
