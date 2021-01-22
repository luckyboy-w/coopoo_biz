<template>
  <div class="update-form-panel">
    <el-form ref="dataForm" :model="dataForm" label-width="100px">
      <el-form-item label="地址名称">
        <el-input v-model="dataForm.addrName"/>
      </el-form-item>
      <!--      <el-form-item label="地址类型">-->
      <!--        <el-input value="退货地址" disabled/>-->
      <!--        &lt;!&ndash; <el-select v-model="dataForm.type"> &ndash;&gt;-->
      <!--        &lt;!&ndash; <el-option value="1" label="发货地址" /> &ndash;&gt;-->
      <!--        &lt;!&ndash; <el-option value="2" label="退货地址" />-->
      <!--       </el-select> &ndash;&gt;-->
      <!--      </el-form-item>-->
      <el-form-item label="地址序号">
        <el-input v-model="dataForm.addrSeq"/>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="dataForm.person"/>
      </el-form-item>
      <el-form-item label="联系人手机号">
        <el-input v-model="dataForm.mobilePhone"/>
      </el-form-item>
      <el-form-item label="地区号">
        <el-input v-model="dataForm.areaNo"/>
      </el-form-item>
      <el-form-item label="所在城市" style="width: 1000px">
        <el-select v-model="selectProvince" size="small" value-key="provinceid" placeholder="请选择省份"
                   @change="selectProvinceFun"
        >
          <el-option v-for="(item) in city" :key="item.provinceid" :value="item" :label="item.province"/>
        </el-select>
        <el-select v-model="selectCity" size="small" value-key="cityid" placeholder="请选择城市" @change="selectCityFun">
          <el-option v-for="(item) in cityList" :key="item.cityid" :value="item" :label="item.city"/>
        </el-select>
        <el-select v-model="selectArea" size="small" value-key="areaid" placeholder="请选择区县" @change="selectAreaFun">
          <el-option v-for="(item) in areaList" :key="item.areaid" :value="item" :label="item.area"/>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="dataForm.addrDtl"/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="dataForm.enable" inactive-value="0" active-value="1"/>
      </el-form-item>
      <el-form-item label="是否默认">
        <el-switch v-model="dataForm.isDefault" inactive-value="0" active-value="1"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">添加</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
import { isInteger } from '@/utils/validate'

export default {
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
      selectProvince: '',
      selectCity: '',
      selectArea: '',
      selectedOptions: [],
      fileSortImage: 0,
      imageUrl: '',
      fileList: [],
      dataForm: {
        isDefault: '0',
        type: '1',
        addrName: '',
        addrSeq: '',
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
        enable: true,
        id: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.loadProvinceList()
    this.$nextTick(function() {
      if (this.editData.addrId) {
        this.dataForm = this.editData
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
      const scope = this
      getMethod('/bc/province/findProvince').then(res => {
        scope.city = res.data
      })
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
        delete this.dataForm.createTime
        delete this.dataForm.createBy
        postMethod('/bc/sendAddr/update', this.dataForm).then(
          res => {
            scope.typeList = res.data
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$emit('showListPanel', true)
          }
        )
      }
    },
    validate() {
      const notNvl = {
        'addrName': '地址名称不能为空',
        'person': '联系人不能为空',
        'mobilePhone': '联系人手机号不能为空',
        'addrDtl': '地址不能为空',
        'citytext': '省份信息不能为空',
        'provincetext': '省份信息不能为空',
        'areaText': '省份信息不能为空'
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
