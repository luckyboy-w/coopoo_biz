<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="100px">
			<el-form-item label="地址名称">
				<el-input v-model="dataForm.addrName"></el-input>
			</el-form-item>
			<el-form-item label="地址序号">
				<el-input v-model="dataForm.addrSeq"></el-input>
			</el-form-item>
			<el-form-item label="联系人">
				<el-input v-model="dataForm.person"></el-input>
			</el-form-item>
			<el-form-item label="联系人手机号">
				<el-input v-model="dataForm.mobilePhone"></el-input>
			</el-form-item>
			<el-form-item label="发货公司">
				<el-input v-model="dataForm.sendCom" disabled=""></el-input>
			</el-form-item>
			<el-form-item label="发货地区号">
				<el-input v-model="dataForm.areaNo"></el-input>
			</el-form-item>
			<el-form-item label="发货地址">
				<el-input v-model="dataForm.addrDtl"></el-input>
			</el-form-item>
			<el-form-item label="省份" v-if="false">
				<el-select v-model="dataForm.province">
					<el-option
						v-for="item in provinceList"
						:key="item.provinceid"
						:value-key="item.province"
						:label="item.province"
						:value="item.provinceid"
					></el-option>
				</el-select>

				<el-select v-model="dataForm.city">
					<el-option
						v-for="item in cityList"
						:key="item.cityid"
						:value-key="item.city"
						:label="item.city"
						:value="item.cityid"
					></el-option>
				</el-select>

			</el-form-item>
			<el-form-item label="是否启用">
				<el-switch v-model="dataForm.enable" inactive-value="0" active-value="1"></el-switch>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitUpdate">添加</el-button>
				<el-button @click="cancelUpdate">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { getMethod, postMethod, getUploadUrl } from "@/api/request";
import { isInteger } from "@/utils/validate";

export default {
	computed: {},
	mounted() {
		this.loadcityList();
		this.loadprovinceList();
		this.$nextTick(function() {
			if (this.editData.addrId) {
				this.dataForm = this.editData;
				this.initDefaultImage();
			}
		});
	},
	created() {},
	props: {
		editData: {
			type: Object,
			required: false
		}
	},
	data() {
		return {
			cityList: [],
			provinceList: [],

			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				addrName: "",
				addrSeq: "",
				person: "",
				mobilePhone: "",
				sendCom: "顺丰",
				areaNo: "",
				cityid: "",
				city: "",
				province: "",
				enable: true,
				id: ""
			}
		};
	},
	methods: {
		loadcityList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			// getMethod("/backend//areas/findCity", param).then(res => {
			// 	scope.cityList = res.data;
			// });
		},
		loadprovinceList() {
			let scope = this;
			let param = {
				parentId: "-1"
			};
			// getMethod("/backend//areas/findProvince", param).then(res => {
			// 	scope.provinceList = res.data;
			// });
		},
		initDefaultImage() {
			this.fileList = this.dataForm.files;
			for (let i = 0; i < this.dataForm.files.length; i++) {
				let imageObj = this.dataForm.files[i];
			}
		},
		saveObject() {
			let scope = this;
			if (this.validate()) {
				delete this.dataForm.createTime;
				delete this.dataForm.createBy;

				let fileList = [];

				this.dataForm.fileJsonStr = JSON.stringify(fileList);
				this.dataForm.files = [];

				postMethod("/bc/sendAddr/update", this.dataForm).then(
					res => {
						scope.typeList = res.data;
						this.$message({
							message: "操作成功",
							type: "success"
						});
						this.$emit("showListPanel", true);
					}
				);
			}
		},
		validate() {
			let notNvl = {
				"addrName":"发货地址不能为空",
				"person":"联系人不能为空",
				"mobilePhone":"联系人手机号不能为空"
			};

			for(let key in notNvl){
				if (this.dataForm[key] == "") {
					this.$message({
						message: notNvl[key],
						type: "warning"
					});
					return false;
				}
			}

			/*for (let i = 0; i < notNvl.length; i++) {
				if (this.dataForm[notNvl[i]] == "") {
					this.$message({
						message: "字段不能为空",
						type: "warning"
					});
					return false;
				}
			}*/

			let needInt = [];
			for (let i = 0; i < needInt.length; i++) {
				if (!isInteger(this.dataForm[needInt[i]])) {
					this.$message({
						message: "请输入正整数",
						type: "warning"
					});
					return false;
				}
			}

			return true;
		},
		cancelUpdate() {
			this.$emit("showListPanel", true);
		},
		submitUpdate() {
			this.saveObject();
		}
	}
};
</script>
<style lang="scss" scoped>
.update-form-panel {
	padding: 30px 20px;
	width: 600px;
}
</style>
<style lang="scss">
.hide .el-upload--picture-card {
	display: none;
}
</style>