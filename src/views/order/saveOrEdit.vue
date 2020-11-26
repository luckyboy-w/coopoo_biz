<template>
	<div class="update-form-panel">
		<el-form ref="dataForm" :model="dataForm" label-width="100px">
			<el-form-item label="地址名称">
				<el-input v-model="dataForm.addrName"></el-input>
			</el-form-item>
      <el-form-item label="地址类型">
        <el-select v-model="dataForm.type">
          <el-option value="1" label="发货地址"></el-option>
          <el-option value="2" label="退货地址"></el-option>
        </el-select>
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
			<el-form-item label="地区号">
				<el-input v-model="dataForm.areaNo"></el-input>
			</el-form-item>
			<el-form-item label="地址">
				<el-input v-model="dataForm.addrDtl"></el-input>
			</el-form-item>
			<el-form-item label="省份" style="width: 1000px">
          <el-select v-model="selectProvince" size="small" value-key="provinceid" @change="selectProvinceFun" placeholder="请选择省份">
              <el-option v-for="(item) in city" :value="item" :key="item.provinceid" :label="item.province"></el-option>
          </el-select>
          <el-select v-model="selectCity" size="small" value-key="cityid" @change="selectCityFun" placeholder="请选择城市">
              <el-option v-for="(item) in cityList" :value="item" :key="item.cityid" :label="item.city"></el-option>
          </el-select>
        <el-select v-model="selectArea" size="small" value-key="areaid" @change="selectAreaFun" placeholder="请选择区县">
              <el-option v-for="(item) in areaList" :value="item" :key="item.areaid" :label="item.area"></el-option>
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
import { getMethod, postMethod } from "@/api/request";
import { isInteger } from "@/utils/validate";

export default {
	computed: {},
	mounted() {
		this.loadProvinceList();
		this.$nextTick(function() {
			if (this.editData.addrId) {
				this.dataForm = this.editData;
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
			city: [],
      cityList: [],
      areaList: [],
      selectProvince: {},
      selectCity: {},
      selectArea: {},
      selectedOptions: [],
			fileSortImage: 0,
			imageUrl: "",
			fileList: [],
			dataForm: {
				addrName: "",
				addrSeq: "",
				person: "",
				mobilePhone: "",
				areaNo: "",
        provinceid: "",
        provincetext: "",
        cityid: "",
				citytext: "",
        areaId: "",
				areaText: "",
				enable: true,
				id: ""
			}
		};
	},
	methods: {
    loadProvinceList() {
      let scope = this;
      getMethod("/bc/province/findProvince").then(res => {
      	scope.city = res.data;
      });
    },
    selectProvinceFun(event) {
      if (event) {
        this.cityList = event.cityList
      } else {
        this.cityList = []
      }
      this.dataForm.provinceid = event.provinceid
      this.dataForm.provincetext = event.province
    },
    selectCityFun(event) {
      console.info(event)
      if (event) {
        this.areaList = event.areasList
      } else {
        this.areaList = []
      }
      this.dataForm.cityid = event.cityid
      this.dataForm.citytext = event.city
    },
    selectAreaFun (event) {
      this.dataForm.areaId = event.areaid
      this.dataForm.areaText = event.area
      console.info(event)
    },
		saveObject() {
			let scope = this;
			if (this.validate()) {
				delete this.dataForm.createTime;
				delete this.dataForm.createBy;
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
