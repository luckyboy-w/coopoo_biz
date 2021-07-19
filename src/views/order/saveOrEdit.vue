<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="100px">
      <el-form-item label="地址类型" >
        <el-select v-model="dataForm.type" :disabled="isDisabled||disabled">
          <el-option value="1" label="发货地址" />
          <el-option value="2" label="退货地址" />
          <el-option value="3" label="发货和退货" />
        </el-select>
      </el-form-item>
      <el-form-item label="地址名称">
        <el-input v-model="dataForm.addrName" :disabled="isDisabled"/>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="dataForm.person" :disabled="isDisabled"/>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="dataForm.mobilePhone" :disabled="isDisabled" />
      </el-form-item>
      <el-form-item label="地区号">
        <el-input v-model="dataForm.areaNo" :disabled="isDisabled"/>
      </el-form-item>
      <el-form-item label="所在城市" style="width: 1000px">
        <el-select v-model="selectProvince" size="small" value-key="provinceid" placeholder="请选择省份" :disabled="isDisabled"
          @change="selectProvinceFun">
          <el-option v-for="(item) in city" :key="item.provinceid" :value="item" :label="item.province" />
        </el-select>
        <el-select v-model="selectCity" size="small" value-key="cityid" placeholder="请选择城市" :disabled="isDisabled" @change="selectCityFun">
          <el-option v-for="(item) in cityList" :key="item.cityid" :value="item" :label="item.city" />
        </el-select>
        <el-select v-model="selectArea" size="small" value-key="areaid" placeholder="请选择区县" :disabled="isDisabled" @change="selectAreaFun">
          <el-option v-for="(item) in areaList" :key="item.areaid" :value="item" :label="item.area" />
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="dataForm.addrDtl" :disabled="isDisabled" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="dataForm.enable" inactive-value="0" active-value="1"  :disabled="isDisabled"/>
      </el-form-item>
      <el-form-item label="是否默认">
        <el-switch v-model="dataForm.isDefault" inactive-value="0" active-value="1" :disabled="isDisabled"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate" :disabled="isDisabled">添加</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request'
  import addressData from "@/utils/address.json"
  import {
    isInteger
  } from '@/utils/validate'

  export default {
    props: {
      editData: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
		  disabled:false,
        city: [],
        cityList: [],
        areaList: [],
        selectProvince: '',
        selectCity: '',
        selectArea: '',
        selectedOptions: [],
        fileSortImage: 0,
        imageUrl: '',
        phoneType: '2',
        fileList: [],
        isDisabled:false,
        dataForm: {
          isDefault: '0',
          type: '1',
          addrName: '',
          person: '',
          mobilePhone: '',
          areaNo: '',
          provinceid: '',
          provincetext: '',
          cityid: '',
          citytext: '',
          areaId: '',
          areaText: '',
          addrDtl: '',
          enable: '0',
          id: ''
        }
      }
    },
    computed: {},
    mounted() {
      this.loadProvinceList()
      console.log(this.editData)
      this.$nextTick(function() {
        if (this.editData.addrId) {
          this.disabled=true
          this.dataForm = this.editData
          this.isDisabled = this.editData.isDisabled
          this.dataForm.type=this.dataForm.type+''
          this.dataForm.enable = this.dataForm.enable == 1 ? '1' : '0'
          this.dataForm.isDefault = this.dataForm.isDefault == 1 ? '1' : '0'
        }
      })
    },
    created() {
      this.selectProvince = this.editData.provincetext
      this.selectCity = this.editData.citytext
      this.selectArea = this.editData.areaText
    },
    methods: {
      loadProvinceList() {
        console.log('addressData', addressData);
        const scope = this
        // getMethod('/bc/province/findProvince').then(res => {
          scope.city = addressData.data
        // })
      },
      selectProvinceFun(event) {
        this.selectCity = ''
        this.selectArea = ''
        this.dataForm.citytext = ''
        this.dataForm.areaText = ''
        if (event) {
          this.cityList = event.cityList
        } else {
          this.cityList = []
        }
        this.dataForm.provinceid = event.provinceid
        this.dataForm.provincetext = event.province
      },
      selectCityFun(event) {
        this.selectArea = ''
        this.dataForm.areaText = ''
        if (event) {
          this.areaList = event.areasList
        } else {
          this.areaList = []
        }
        this.dataForm.cityid = event.cityid
        this.dataForm.citytext = event.city
      },
      selectAreaFun(event) {
        this.dataForm.areaId = event.areaid
        this.dataForm.areaText = event.area
      },
      saveObject() {
        const scope = this
        if (this.validate()) {
        console.log('this.dataForm',this.dataForm);
          delete this.dataForm.createTime
          delete this.dataForm.createBy
          if (this.editData.addrId&&this.editData.addrId!='') {
            postMethod('/address/update-send-addr', this.dataForm).then(
              res => {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$emit('showListPanel', true)
              }
            )
          } else{
            postMethod('/address/add-send-addr', this.dataForm).then(
            res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$emit('showListPanel', true)
            }
          )
          }

        }
      },
      validate() {
        const notNvl = {
          'addrName': '地址名称不能为空',
          'person': '联系人不能为空',
          'mobilePhone': '联系方式不能为空',
          'areaNo': '地区号不能为空',
          'citytext': '省份信息不能为空',
          'provincetext': '省份信息不能为空',
          'areaText': '省份信息不能为空',
          'addrDtl': '详细地址不能为空',
        }
        for (const key in notNvl) {
          if (this.dataForm[key] == '') {
            this.$message({
              message: notNvl[key],
              type: 'warning'
            })
            return false
          }
        }

          if (this.dataForm.mobilePhone == '' || this.dataForm.mobilePhone == undefined || this.dataForm.mobilePhone ==
            null) {
            this.$message({
              message: "手机号格式如:138xxxx8754",
              type: 'warning'
            })
            return false
          }else{
            const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
          const isPhone = reg.test(this.dataForm.mobilePhone);
          let value = Number(this.dataForm.mobilePhone); //转换为数字
          if (typeof value === "number" && !isNaN(value)) { //判断是否为数字
            value = value.toString(); //转换成字符串
            if (value.length < 0 || value.length > 12 || !isPhone) { //判断是否为11位手机号
              this.$message({
                message: "手机号格式如:138xxxx8754",
                type: 'warning'
              })
              return false
            }
          } else {
            this.$message({
              message: "手机号输入错误",
              type: 'warning'
            })
            return false
          }
          }

        if (this.dataForm.addrDtl == null || this.dataForm.addrDtl == undefined || this.dataForm.addrDtl.length > 50) {
          this.$message({
            message: "详细地址输入错误",
            type: 'warning'
          })
          return false
        }

        const needInt = []
        for (let i = 0; i < needInt.length; i++) {
          if (!isInteger(this.dataForm[needInt[i]])) {
            this.$message({
              message: '请输入正整数',
              type: 'warning'
            })
            return false
          }
        }

        return true
      },
      cancelUpdate() {
        this.$emit('showListPanel', true)
      },
      submitUpdate() {
        this.saveObject()
      }
    }
  }
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
