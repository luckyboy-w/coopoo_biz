<template>
  <div v-loading="loading" class="update-form-panel">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">

        <el-form ref="dataForm" :model="dataForm" label-width="100px" label-position="left">
          <el-form-item label="商品名称">
            <el-input
              v-model="dataForm.goodName" style="width:260px"
              placeholder="请输入商品名称"
              :disabled="isHiddenEditGood"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="所属分类">
            <el-select v-model="dataForm.typeId" placeholder="请选择分类" @change="loadtypeId2List()"
                       :disabled="isHiddenEditGood"
            >
              <el-option
                v-for="item in typeIdList"
                :key="item.id"
                :value-key="item.typeName"
                :label="item.typeName"
                :value="item.id"
              />
            </el-select>
            <el-select v-model="dataForm.typeId2" placeholder="请选择" @change="loadSkuAttr()"
                       :disabled="isHiddenEditGood"
            >
              <el-option
                v-for="item in typeId2List"
                :key="item.id"
                :value-key="item.typeName"
                :label="item.typeName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="属性选择">
            <div v-for="(item, index) in dbAttrList" :key="index">
              <div class="attr-title">{{ item.specName }}:</div>
              <div class="attr-save">
                <el-input
                  size="mini"
                  style="width:200px;margin-right: 30px"
                  :disabled="isHiddenEditGood"
                  placeholder="请输入自定义值"
                  v-model="item.newAttrValue"
                />
                <el-button
                  type="primary" size="mini"
                  @click="saveAttrData(item)"
                  :disabled="isHiddenEditGood"
                >新建
                </el-button>
              </div>

              <div class="attr-content">
                <el-checkbox
                  v-for="valItem in item.skuObj"
                  :key="valItem.skuId"
                  :label="valItem.skuId"
                  :checked="valItem.isChecked"
                  @change="changeAttrList(valItem)"
                  :disabled="isHiddenEditGood"
                >
                  {{ valItem.skuText }}
                </el-checkbox>
              </div>


            </div>
          </el-form-item>
          <el-form-item label="新SKU配置">
            <el-table
              style="width: 100%; margin-bottom: 20px;"
              :data="tableList"
              :span-method="objectSpanMethod"
              border
            >
              <el-table-column
                align="center"
                v-for="(item,index) in columnList"
                :key="index"
                :label="item"
                width=""
              >
                <template slot-scope="scope">
                  {{ scope.row.tdList[index].value }}
                  <!--                  {{ `${index} , ${scope.$index}` }}-->
                </template>
              </el-table-column>
              <el-table-column align="center" prop="stock" label="库存">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.stock" :disabled="dataForm.stockType==1 || isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="salePrice" label="建议零售价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.salePrice" :disabled="isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="saleMemPrice" label="建议会员价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.saleMemPrice" :disabled="isHiddenEditGood"/>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="skuImg" label="SKU展示图">
                <template slot-scope="scope">
                  <img :src="scope.row.skuImg" width="60px" height="60px"
                       onerror="this.src='https://bluemobi-lanyu.oss-cn-shanghai.aliyuncs.com/static/black_bg.png' "
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" prop="id" label="上传图片">
                <template slot-scope="scope">
                  <el-upload
                    :disabled="isHiddenEditGood"
                    class="avatar-uploader"
                    :action="uploadSkuImgUrl"
                    :show-file-list="false"
                    :on-success="handleSuccessSkuImg"
                    :before-upload="beforeUploadSkuImg"
                  >
                    <i class="el-icon-plus avatar-uploader-icon" @click="uploadClk(scope)"/>
                  </el-upload>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="库存类型" v-show="false">
            <!-- <el-radio v-model="dataForm.stockType" label="1" @change="stockChange">全局</el-radio> -->
            <el-radio v-model="dataForm.stockType" label="2" @change="stockChange" :disabled="isHiddenEditGood">局部
            </el-radio>
          </el-form-item>
          <el-form-item v-if="dataForm.stockType==1" label="库存数量">
            <el-input v-model="dataForm.stockNum" style="width:260px" @keyup.native="syncGlobalStock"
                      :disabled="isHiddenEditGood"
            />
          </el-form-item>
          <el-form-item label="商品产地">
            <el-input v-model="dataForm.goodOrigin" style="width:260px" placeholder="输入商品产地"
                      :disabled="isHiddenEditGood"
            />
          </el-form-item>
          <el-form-item label="商品编码">
            <el-input v-model="dataForm.goodCode" style="width:260px" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item label="所属品牌">
            <el-select v-model="dataForm.goodBrand" :disabled="isHiddenEditGood">
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :value-key="item.brandName"
                :label="item.brandName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="封面图片">
            <div id="front-img">
              <el-input v-show="false" v-model="dataForm.goodFrontImage" :disabled="isHiddenEditGood"/>
              <el-upload
                :action="uploadGoodFrontImageUrl"
                list-type="picture-card"
                :on-preview="handleGoodImagePreview"
                :before-upload="beforeGoodFrontImageUpload"
                :on-success="handleGoodFrontImageSuccess"
                :class="{hide:hideGoodFrontImageUpload}"
                :file-list="uploadGoodFrontImageList"
                :on-remove="handleGoodFrontImageRemove"
                :disabled="isHiddenEditGood"
              >
                <i :class="addFrontCls"/>
              </el-upload>
              <el-dialog>
                <img width="100%" :src="imageUrl" alt>
              </el-dialog>
            </div>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-input v-show="false" v-model="dataForm.goodImage" :disabled="isHiddenEditGood"/>
            <el-upload
              :action="uploadGoodImageUrl"
              list-type="picture-card"
              :on-preview="handleGoodImagePreview"
              :before-upload="beforeGoodImageUpload"
              :on-success="handleGoodImageSuccess"
              :class="{hide:hideGoodImageUpload}"
              :file-list="uploadGoodImageList"
              :on-remove="handleGoodImageRemove"
              :disabled="isHiddenEditGood"
            >
              <i class="el-icon-plus"/>
            </el-upload>
            <el-dialog>
              <img width="100%" :src="imageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-dialog center :visible.sync="goodSaleDescImgVisible">
            <img width="100%" :src="goodSaleDescImgUrl" alt>
          </el-dialog>
          <el-form-item label="售后说明图片">
            <el-radio-group v-model="dataForm.afterSaleId" :disabled="isHiddenEditGood">
              <el-radio
                class="my-el-radio"
                v-for="(item,index) in goodSaleDescList"
                :key="item.id"
                :label="item.id"
              >
                <div class="my-container">
                  <div class="img"
                       @mouseover="changeImgMask(index,true)"
                       @mouseout="changeImgMask(index,false)"
                  >
                    <div ref="imgMask" class="img-mask">
                      <i class="el-icon-zoom-in my-icon" @click="showBigImg(item.imgUrl)"></i>
                    </div>
                    <el-image
                      :src="item.imgUrl"
                      fit="fill"
                      style="width: 100%;height:100%"
                    ></el-image>
                  </div>
                  <div class="title">
                    {{ item.name }}
                  </div>
                </div>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品卖点">
            <el-input v-model="dataForm.goodMerit"
                      style="width:260px"
                      placeholder="请输入卖点"
                      maxlength="50"
                      show-word-limit
                      :disabled="isHiddenEditGood"
            />
          </el-form-item>
          <el-form-item label="价格核算">
            <el-row>
              <el-col :span="2">
                成本价:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.primeCost" placeholder="成本价" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
              <el-col :span="2">
                包装成本:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.packageCost" placeholder="包装成本" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
              <el-col :span="2">
                加工成本:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.processCost" placeholder="加工成本" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2">
                物流成本:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.expressCost" placeholder="物流成本" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
              <el-col :span="2">
                利润:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.profit" placeholder="利润" style="width:80px" :disabled="isHiddenEditGood"/>
              </el-col>
              <el-col :span="2">
                预估报价:
              </el-col>
              <el-col :span="6">
                <el-input v-model="dataForm.predictFee" placeholder="预估报价" style="width:80px"
                          :disabled="isHiddenEditGood"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-show="false" label="是否礼品">
            <el-input v-model="isGift" inactive-value="0" active-value="1" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-switch v-model="dataForm.recommend" inactive-value="0" active-value="1" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item label="是否定制">
            <el-switch v-model="dataForm.custom" inactive-value="0" active-value="1" :disabled="isHiddenEditGood"/>
          </el-form-item>
          <el-form-item label="商品风格专场">
            <el-checkbox-group v-model="goodStyleList" @change="changeStyle" :disabled="isHiddenEditGood">
              <el-checkbox v-for="styleText in styleList" :key="styleText" :label="styleText">{{
                  styleText
                }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="商家承偌服务">
            <el-checkbox-group v-model="serviceRuleList" :disabled="isHiddenEditGood">
              <el-checkbox v-for="obj in buServiceList" :key="obj" :label="obj">{{ obj }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="商品详情">
            <qEditor
              ref="refEditor"
              :content="detail.detailContent"
              module-name="detailContent"
              @changeContent="changeContent"
            />
          </el-form-item>
          <el-form-item v-show="false" label="售后保障">
            <qEditor1
              ref="refEditor1"
              :content-q1="detail.postSale"
              module-name="postSale"
              @changePostSaleContent="changePostSaleContent"
              :disabled="isHiddenEditGood"
            />
          </el-form-item>
          <el-form-item v-show="false" label="商品清单">
            <qEditor2
              ref="refEditor2"
              :q2content="detail.listDetail"
              module-name="listDetail"
              @changeListDetailContent="changeListDetailContent"
              :disabled="isHiddenEditGood"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitUpdate" :disabled="isHiddenEditGood">提交</el-button>
            <el-button @click="cancelUpdate">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/util'
import { getMethod, postMethod, getUploadUrl } from '@/api/request'
import { isInteger } from '@/utils/validate'
import qEditor from '@/components/RichText/quill-editor'
import qEditor1 from '@/components/RichText/quill-editor_1'
import qEditor2 from '@/components/RichText/quill-editor_2'

export default {
  components: { qEditor, qEditor1, qEditor2 },
  props: {
    editData: {
      type: Object,
      required: false
    },
    isGift: {
      type: String,
      required: true,
      default: '1'
    },
    isHiddenEditGood: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      goodSaleDescImgVisible: false,
      goodSaleDescImgUrl: '',
      goodSaleDescList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false,
      addFrontCls: 'el-icon-plus',
      styleList: ['新品上架', '七星睡眠'],
      goodStyleList: [],
      buServiceList: ['正品保证', '全场包邮', '无理由退货', '超时赔偿'],
      serviceRuleList: [],
      typeIdList: [],
      typeId2List: [],
      brandList: [],
      uploadGoodImageList: [],
      hideGoodImageUpload: false,
      uploadGoodImageUrl: '',
      uploadGoodFrontImageList: [],
      hideGoodFrontImageUpload: false,
      uploadGoodFrontImageUrl: '',
      uploadSkuImgUrl: getUploadUrl() + '?groupId=-1',
      fileSortImage: 0,
      imageUrl: '',
      fileList: [],
      rowIndex: -1,
      detail: {
        detailContent: '',
        postSale: '',
        listDetail: ''
      },
      dataForm: {
        afterSaleId: '',
        goodName: '',
        goodOrigin: '',
        goodMerit: '',
        stockNum: 0,
        primeCost: '',
        packageCost: '',
        processCost: '',
        expressCost: '',
        predictFee: '',
        profit: '',
        goodCode: '',
        typeId2: '',
        typeId: '',
        goodBrand: '',
        recommend: true,
        custom: true,
        skuPriceList: [],
        goodStyle: '',
        serviceRule: '',
        stockType: '2',
        goodImage: '',
        goodFrontImage: '',
        skuJsonStr: '',
        checkRuleStr: '',
        detailStr: '',
        isGift: '',
        id: ''
      },
      list: [], // {规格名称, 规格值列表}
      checkList: [], // 已选择的规格值 {规格名称, [规格值ID]}
      skuArray: [], //已选择sku Id数组
      skuList: [], // good value sku配置（选完规格值之后生成的）
      skuIdToText: {}, //key 规格值ID（skuId） {//规格值文本  //规格名称}
      skuIdList: [], // 点击checkbox后选择的skuId

      // 数据库返回的属性列表
      dbAttrList: [],
      columnList: [],
      tableList: []
    }
  },
  computed: {},
  mounted() {
    this.initData()
  },
  created() {
  },
  methods: {
    // 初始化整个页面数据
    initData() {
      this.loadGoodBrandList()
      this.buildGoodImageGroupId()
      this.buildGoodFrontImageGroupId()
      this.loadtypeIdList()
      this.loadGoodSaleDescList()

      this.loadEditData()
    },
    changeImgMask(index, flag) {
      this.$refs.imgMask[index].style = flag ? 'display:block' : 'display:none'
    },
    showBigImg(url) {
      this.goodSaleDescImgUrl = url
      this.goodSaleDescImgVisible = true
    },
    syncGlobalStock() {
      if (isNaN(this.dataForm.stockNum)) {
        this.$message({
          message: '库存数量输入有误',
          type: 'warning'
        })
        return
      }

      if (this.dataForm.stockNum < 0) {
        this.$message({
          message: '库存不能输入负数',
          type: 'warning'
        })
        return
      }

      if (this.skuList.length == 0) {
        this.$message({
          message: '请选勾选规格',
          type: 'warning'
        })
        return
      }

      for (let i = 0; i < this.skuList.length; i++) {
        const skuObj = this.skuList[i]
        skuObj.stock = this.dataForm.stockNum
      }
    },
    changeStyle(value) {

    },
    stockChange() {
      if (this.dataForm.stockType == '1') {
        for (let i = 0; i < this.skuList.length; i++) {
          const skuObj = this.skuList[i]
          skuObj.stock = this.dataForm.stockNum
        }
      }
    },
    uploadClk(row) {
      this.rowIndex = row.$index
    },
    handleSuccessSkuImg(res, file) {
      this.tableList[this.rowIndex].skuImg = res.data.url
      this.loading = false
    },
    beforeUploadSkuImg(file, row) {
      this.loading = true
    },
    changeListDetailContent(val) {
      this.detail.listDetail = val
    },
    changePostSaleContent(val) {
      this.detail.postSale = val
    },
    changeContent(val) {
      this.detail.detailContent = val
    },
    // 递归获取每条SKU数据
    getSkuData(skuArr = [], i, list) {
      for (let j = 0; j < list[i].length; j++) {
        if (i < list.length - 1) {
          skuArr[i] = list[i][j]
          skuArr[i] = this.getSkuKey(skuArr[i])
          this.getSkuData(skuArr, i + 1, list) // 递归循环
        } else {
          skuArr[i] = this.getSkuKey(list[i][j])

          const titleText = [...skuArr].join(';')

          let stockSingle = 0
          // 如果是全局库存
          if (this.dataForm.stockType == 1) {
            stockSingle = this.dataForm.stockNum
          }
          const column = {
            skuText: titleText,
            skuCompareText: this.getSkuText(titleText),
            skuCompareId: this.skuIdList.join(','),
            stock: stockSingle,
            salePrice: '',
            saleMemPrice: '',
            supplyPrice: '',
            skuImg: ''
          }
          this.skuList.push(column) // 扩展运算符，连接两个数组
        }
      }
    },
    getSkuText(titleText) {
      const newArr = []
      const titleArr = titleText.split(';')
      titleArr.forEach(titleObj => {
        newArr.push(titleObj.split(':')[1])
      })
      return newArr.join(':')
    },
    getSkuKey(skuId) {
      this.skuIdList.push(skuId)
      const skuObj = this.skuIdToText[skuId]
      return skuObj['typeName'] + ':' + skuObj['skuText']
    },
    loadtypeIdList() {
      const scope = this
      const param = {
        parentId: '-1'
      }
      getMethod('/bu/good/findType', param).then(res => {
        scope.typeIdList = res.data
      })
    },

    async loadGoodSaleDescList() {
      const res = await getMethod('/bu/good/findAllSaleList')

      this.goodSaleDescList = res.data

      if (this.dataForm.afterSaleId == '' && this.goodSaleDescList.length > 0) {
        this.dataForm.afterSaleId = this.goodSaleDescList[0].id
      }
    },
    loadGoodBrandList() {
      const scope = this

      getMethod('/bu/good/findBrand', null).then(res => {
        scope.brandList = res.data
      })
    },
    buildGoodImageGroupId() {
      getMethod('/bu/oss/groupId', null).then(res => {
        this.uploadGoodImageUrl = getUploadUrl() + '?groupId=' + (this.dataForm.goodImage || res.data)
        this.dataForm.goodImage = this.dataForm.goodImage || res.data
      })
    },
    handleGoodImagePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleGoodImageRemove(res) {
      for (let i = 0; i < this.uploadGoodImageList.length; i++) {
        if (
          this.uploadGoodImageList[i].filePath ==
          (res.filePath || res.response.data.filePath)
        ) {
          this.uploadGoodImageList.splice(i, 1)
          break
        }
      }
      this.hideGoodImageUpload = false
    },
    handleGoodImageSuccess(res, file) {
      res.data.fileType = file.raw.type
      res.data.sort = this.fileSortImage++
      this.uploadGoodImageList.push(res.data)
      const groupId = res.data.groupId
      let imageCnt = 0
      for (let i = 0; i < this.uploadGoodImageList.length; i++) {
        if (this.uploadGoodImageList[i].groupId == groupId) {
          imageCnt++
        }
      }

      // if (imageCnt >= 5) {
      // 	this.hideGoodImageUpload = true;
      // }
      this.loading = false
    },
    beforeGoodImageUpload(file) {
      // this.loading = true
      const fileTypeVerify =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!fileTypeVerify) {
        this.$message.error('上传文件格式错误!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return fileTypeVerify && isLt2M
    },
    buildGoodFrontImageGroupId() {
      getMethod('/bu/oss/groupId', null).then(res => {
        this.uploadGoodFrontImageUrl = getUploadUrl() + '?groupId=' + (this.dataForm.goodFrontImage || res.data)
        this.dataForm.goodFrontImage = this.dataForm.goodFrontImage || res.data
      })
    },
    handleGoodFrontImagePreview() {
    },
    handleGoodFrontImageRemove(res) {
      for (let i = 0; i < this.uploadGoodFrontImageList.length; i++) {
        if (
          this.uploadGoodFrontImageList[i].filePath ==
          (res.filePath || res.response.data.filePath)
        ) {
          this.uploadGoodFrontImageList.splice(i, 1)
          break
        }
      }
      document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display = 'block'
    },
    handleGoodFrontImageSuccess(res, file) {
      this.loading = false
      res.data.fileType = file.raw.type
      res.data.sort = this.fileSortImage++
      this.uploadGoodFrontImageList.push(res.data)
      const groupId = res.data.groupId
      let imageCnt = 0
      for (let i = 0; i < this.uploadGoodFrontImageList.length; i++) {
        if (this.uploadGoodFrontImageList[i].groupId == groupId) {
          imageCnt++
        }
      }

      if (this.uploadGoodFrontImageList.length >= 1) {
        this.$nextTick(function() {
          document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display = 'none'
        })
      }
    },
    beforeGoodFrontImageUpload(file) {
      // this.loading = true
      const fileTypeVerify =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!fileTypeVerify) {
        this.$message.error('上传文件格式错误!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return fileTypeVerify && isLt2M
    },
    initDefaultImage() {
      this.fileList = this.dataForm.files
      for (let i = 0; i < this.dataForm.files.length; i++) {
        const imageObj = this.dataForm.files[i]
        if (imageObj.groupId == this.dataForm.goodImage) {
          this.uploadGoodImageList.push(imageObj)
        }
        if (imageObj.groupId == this.dataForm.goodFrontImage) {
          this.uploadGoodFrontImageList.push(imageObj)
        }
      }
      this.uploadGoodImageList = this.uploadGoodImageList.reverse()
      if (this.uploadGoodFrontImageList.length >= 1) {
        document.getElementById('front-img').getElementsByClassName('el-upload--picture-card')[0].style.display = 'none'
      }
    },
    isMoney(amount, type, errorMsg) { // 22,111,22.11   判断是否是金额
      if (errorMsg != '') {
        return errorMsg
      }
      if (amount == '0.0' ||
        amount == '0.00' ||
        amount == '0.') {
        return type + '的金额格式有误'
      }

      if (amount != null && amount != '' && amount != '0') {
        var exp = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/
        if (!exp.test(amount)) {
          return type + '的金额格式有误'
        }
      } else {
        return type + '金额不能为空或0'
      }
      return ''

      // if(arg == undefined){
      // 	return false
      // }
      // if(arg.split(".").length >= 2){
      // 	return false
      // }

      // if(arg.split(".").length == 1){
      // 	if(arg.split(".").length > 2){
      // 		return false;
      // 	}
      // }
      // arg = arg.toString();
      // let argChar = "0123456789.";
      // var beginArg = arg.substring(0,1);
      // if(beginArg == "." || beginArg==","){
      // 	return false;
      // }

      // for(let i = 0;i<arg.length;i++){
      // 	if(argChar.indexOf(arg.substring(i,i+1)) == -1)  return false;
      // }
      // return true;
    },
    async saveObject() {
      let errorMsg = ''

      if (this.uploadGoodImageList.length == 0) {
        errorMsg = '请上传商品图片'
      }

      if (this.uploadGoodFrontImageList.length == 0) {
        errorMsg = '请上传商品封面图'
      }

      if (this.detail.detailContent == '') {
        errorMsg = '请上传商品详情'
      }

      if (this.tableList.length == 0) {
        errorMsg = '请选择SKU'
      }

      if (errorMsg != '') {
        this.$message.warning(errorMsg)
        return
      }

      let feeMsg = ''
      for (let i = 0; i < this.tableList.length; i++) {
        const rowObj = this.tableList[i]
        feeMsg = this.isMoney(rowObj.salePrice, '零售价', '')
        feeMsg = this.isMoney(rowObj.saleMemPrice, '会员价', feeMsg)

        if (feeMsg != '') {
          this.$message.warning(feeMsg)
          return
        }

        if (rowObj.stock < 0) {
          errorMsg = '库存不能为空'
        }

        if (rowObj.salePrice == '') {
          errorMsg = '零售价不能为空'
        }

        if (rowObj.saleMemPrice == '') {
          errorMsg = '会员价不能为空'
        }

        if (rowObj.saleMemPrice - rowObj.salePrice > 0) {
          errorMsg = '会员价不能大于等于零售价'
        }
      }

      if (errorMsg.trim() != '') {
        this.$message.warning(errorMsg)
        return
      }

      // primeCost:成本价
      // packageCost:包装成本
      // processCost:加工成本
      // expressCost:物流成本
      // profit:利润
      // predictFee:预估报价
      // let priceFrm = this.dataForm
      // if(this.dataForm.primeCost != ''){
      // 	feeMsg =  this.isMoney(priceFrm.primeCost,'成本价',feeMsg)
      // }

      // if(this.dataForm.packageCost != ''){
      // 	feeMsg =  this.isMoney(priceFrm.packageCost,'包装价',feeMsg)
      // }

      // if(this.dataForm.processCost != ''){
      // 	feeMsg =  this.isMoney(priceFrm.processCost,'加工成本',feeMsg)
      // }

      // if(this.dataForm.expressCost != ''){
      // 	feeMsg =  this.isMoney(priceFrm.primeCost,'加工成本',feeMsg)
      // }

      // if(this.dataForm.profit != ''){
      // 	feeMsg =  this.isMoney(priceFrm.primeCost,'利润',feeMsg)
      // }

      // if(this.dataForm.predictFee != ''){
      // 	feeMsg =  this.isMoney(priceFrm.predictFee,'预估价',feeMsg)
      // }

      if (feeMsg != '') {
        this.$message.warning(feeMsg)
        return
      }

      if (this.validate()) {
        delete this.dataForm.createTime
        delete this.dataForm.createBy

        let fileList = []
        fileList = fileList.concat(this.uploadGoodImageList)
        fileList = fileList.concat(this.uploadGoodFrontImageList)

        this.dataForm.fileJsonStr = JSON.stringify(fileList)
        this.dataForm.files = []
        this.dataForm.detailStr = JSON.stringify(this.detail)
        this.dataForm.skuJsonStr = JSON.stringify(this.tableList)
        this.dataForm.goodStyle = this.goodStyleList.join(',')
        this.dataForm.serviceRule = this.serviceRuleList.join(',')
        // 把ID转换成Text
        // [{"name":"颜色","list":["1298268253058621441","1298268253058621441"]},{"name":"尺寸","list":["1298268035080642561"]}]

        const textList = []
        for (let i = 0; i < this.dbAttrList.length; i++) {
          let pushData = {
            name: '',
            list: []
          }

          let dbSkuList = this.dbAttrList[i].skuObj
          for (let j = 0; j < dbSkuList.length; j++) {
            if (dbSkuList[j].isChecked) {
              pushData.list.push(dbSkuList[j].skuText)
            }
          }

          pushData.name = this.dbAttrList[i].specName
          textList.push(pushData)
        }

        this.dataForm.checkRuleStr = JSON.stringify(textList)

        this.dataForm.isGift = this.isGift
        const param = JSON.stringify(this.dataForm)

        // console.log(param)

        const { data } = await postMethod('/bu/good/update', param)
        this.typeList = data
        this.detail = {}
        this.$message.success('操作成功')
        this.$emit('showListPanel', true)
      }
    },
    validate() {
      const dataFrm = this.dataForm
      if (dataFrm['goodName'] == '') {
        this.$message({
          message: '商品名称不能为空',
          type: 'warning'
        })
        return false
      }

      if (dataFrm['goodCode'] == '') {
        this.$message({
          message: '商品货号不能为空',
          type: 'warning'
        })
        return false
      }

      if (dataFrm['goodMerit'] == '') {
        this.$message({
          message: '卖点不能为空',
          type: 'warning'
        })
        return false
      }

      // const needInt = [
      // 	"primeCost",
      // 	"packageCost",
      // 	"processCost",
      // 	"expressCost",
      // 	"profit"
      // ];
      // for (let i = 0; i < needInt.length; i++) {
      // 	if (!isInteger(this.dataForm[needInt[i]])) {
      // 		this.$message({
      // 			message: "请输入正整数",
      // 			type: "warning"
      // 		});
      // 		return false;
      // 	}
      // }

      return true
    },
    cancelUpdate() {
      this.$emit('showListPanel', true)
    },
    submitUpdate() {
      this.saveObject()
    },

    // 装配编辑数据
    loadEditData() {
      if (this.editData.id) {
        this.goodStyleList = this.editData.goodStyle.split(',')
        this.serviceRuleList = this.editData.serviceRule.split(',')
        this.dataForm = this.editData
        this.detail = this.editData.detail
        this.initDefaultImage()
        this.loadtypeId2List(this.dataForm.typeId2)
        this.$refs['refEditor'].setContent(this.detail.detailContent)
        this.$refs['refEditor1'].setContent(this.detail.postSale)
        this.$refs['refEditor2'].setContent(this.detail.listDetail)
        this.loadTableList()
      }
    },

    // 加载SKU表格的数据
    loadTableList() {
      this.columnList = []

      let tempTableList = []
      for (let i = 0; i < this.dataForm.skuPriceList.length; i++) {
        tempTableList[i] = deepCopy(this.dataForm.skuPriceList[i])
        tempTableList[i].tdList = []

        const attrName2ValueList = tempTableList[i].skuText.split(';')

        for (let j = 0; j < attrName2ValueList.length; j++) {
          const [specName, specValue] = attrName2ValueList[j].split(':')
          // 填充一次动态列
          if (i === 0) {
            this.columnList.push(specName)
          }

          // 原理 本列上一行的值一样 合并行
          // 因为线上已经有老结构数据 所以新结构无法存储数据库 更加无法回显 出此下策
          let thisRowSpan = 1
          let thisRowSpanShow = true

          if (i > 0) {
            let tempIndex = i - 1
            let preData = tempTableList[tempIndex].tdList[j]

            // 本行和同列上一行的值相等
            if (preData.value === specValue) {
              // 找到最近的上级节点
              while (tempIndex >= 0) {
                preData = tempTableList[tempIndex].tdList[j]
                if (preData.rowSpanShow) {
                  // 更改他的行数
                  preData.rowSpan++
                  break
                }

                tempIndex--
              }

              thisRowSpan = 1
              thisRowSpanShow = false
            }
          }

          tempTableList[i].tdList.push({
            name: specName,
            value: specValue,
            rowSpan: thisRowSpan,
            rowSpanShow: thisRowSpanShow
          })
        }
      }

      this.tableList = tempTableList
    },
    // 按分类加载Sku属性
    async loadtypeId2List(typeId2) {
      this.dataForm.typeId2 = typeId2 || ''
      const { data } = await getMethod('/bu/good/findType', { parentId: this.dataForm.typeId })
      this.typeId2List = data

      if (this.editData.id) {
        this.loadSkuAttr(true)
      }
    },

    // 加载 Sku 的属性列表
    async loadSkuAttr(autoChecked) {
      const { data } = await getMethod('/bu/good/findTypeBySpec', { id: this.dataForm.typeId2 })

      this.dbAttrList = data
      autoChecked && this.loadAttrChecked(autoChecked)

    },
    // 回显已选中的属性
    loadAttrChecked() {
      const allPriceList = []
      let allPriceText = ''
      this.dataForm.skuPriceList.forEach(priceObj => {
        allPriceList.push(priceObj.skuText)
      })

      allPriceText = allPriceList.join(';')

      for (let i = 0; i < this.dbAttrList.length; i++) {
        let dbSkuList = this.dbAttrList[i].skuObj
        for (let j = 0; j < dbSkuList.length; j++) {
          if (allPriceText.indexOf(dbSkuList[j].typeName + ':' + dbSkuList[j].skuText) != -1) {
            dbSkuList[j].isChecked = true
          }
        }
      }
    },

    // 修改选中属性，生成拼装输入框数据
    changeAttrList(valItem) {
      valItem.isChecked = valItem.isChecked == true ? true : false
      valItem.isChecked = !valItem.isChecked
      this.generatorSkuList()
    },
    // 生成SKU列表
    generatorSkuList() {
      this.columnList = []
      this.tableList = []

      for (let i = this.dbAttrList.length - 1; i >= 0; i--) {
        this.tableList = this.addColumn(this.tableList, this.dbAttrList[i].specName, this.dbAttrList[i].skuObj)
      }
    },
    // 添加列
    addColumn(dataList, specName, specValue) {

      // 此属性规格是否有选中值 有的话 添加到动态列中
      let isAddColume = false

      // TODO: 暂时还未更改  skuCompareId
      let newDataList = []
      for (let i = 0; i < specValue.length; i++) {
        // 当前规格未选中
        if (!specValue[i].isChecked) {
          continue
        }

        isAddColume = true

        // 初始化数组
        if (dataList.length === 0) {
          newDataList.push({
            tdList: [{ name: specName, value: specValue[i].skuText, rowSpan: 1, rowSpanShow: true }],
            skuText: `${specName}:${specValue[i].skuText}`,
            skuCompareText: specValue[i].skuText,
            skuCompareId: '',
            stock: '',
            salePrice: '',
            saleMemPrice: '',
            supplyPrice: '',
            skuImg: ''
          })
          continue
        }

        // 进行乘积
        for (let j = 0; j < dataList.length; j++) {
          newDataList.push({
            tdList: [{
              name: specName,
              value: specValue[i].skuText,
              rowSpan: dataList.length,
              rowSpanShow: j === 0 ? true : false
            }, ...dataList[j].tdList],
            // 注意拼接顺序同上 之前的后拼
            skuText: `${specName}:${specValue[i].skuText};${dataList[j].skuText}`,
            skuCompareText: `${specValue[i].skuText}:${dataList[j].skuCompareText}`,
            skuCompareId: dataList[j].skuCompareId,
            stock: dataList[j].stock,
            salePrice: dataList[j].salePrice,
            saleMemPrice: dataList[j].saleMemPrice,
            supplyPrice: dataList[j].supplyPrice,
            skuImg: dataList[j].skuImg
          })
        }
      }

      // 当前属性有规格被选中 添加动态列
      if (isAddColume) {
        this.columnList = [specName, ...this.columnList]
      }

      // 拼装过了 返回拼装的新结构
      // 没拼装过 返回老数据结构
      return newDataList.length > 0 ? newDataList : dataList
    },

    // 控制合并表格的行和列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.tableList[rowIndex].tdList[columnIndex] === undefined) {
        // 超出了 tdList 的长度 不属于动态列的范围 正常显示
        return {
          rowspan: 1,
          colspan: 1
        }
      }

      // 如果不展示 则把此单元格合并到0 即消掉 不显示
      if (!this.tableList[rowIndex].tdList[columnIndex].rowSpanShow) {
        return {
          rowspan: 0,
          colspan: 1
        }
      }

      // 否则 按照计算好的行数来合并
      return {
        rowspan: this.tableList[rowIndex].tdList[columnIndex].rowSpan,
        colspan: 1
      }
    },

    // 保存属性数据
    async saveAttrData(item) {

      let handleParam = {
        id: item.skuObj[0].typeId,
        typeDataStr: item.id,
        specName: item.specName,
        skuList: []
      }

      for (let i = 0; i < item.skuObj.length; i++) {
        handleParam.skuList.push({
          sort: i,
          skuText: item.skuObj[i].skuText,
          type: 'spec'
        })
      }

      handleParam.skuList = [
        ...handleParam.skuList,
        {
          sort: item.skuObj.length,
          skuText: item.newAttrValue,
          type: 'spec'
        }
      ]

      let param = {
        jsonParam: JSON.stringify(handleParam)
      }
      const { data } = await postMethod('/bu/goodSpec/update', param)

      this.$message.success('操作成功')

      this.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
.update-form-panel {
  padding: 30px 20px;
  width: 100%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  // font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.avatar {
  width: 60px;
  height: 60px;
  display: block;
}

$attrTitleWidth: 3vw;
$attrContentWidth: 60vw;

.attr-title {
  display: inline-block;
  overflow: hidden;
  font-size: 17px;
  font-weight: 500;


  width: $attrTitleWidth;
  //background: #2ac06d;
}

.attr-save {
  display: inline-block;
  overflow: hidden;
  width: $attrContentWidth;
}

.attr-content {
  display: flex;
  flex-wrap: wrap;
  width: $attrContentWidth;
  margin-left: calc(#{$attrTitleWidth} + 4px);
  margin-bottom: 3vh;
}


// input 字数限制样式调整
.card-panel-col > > > .el-input__count {
  height: 100%;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #D0D0D0;
  font-size: 12px;

  position: absolute;
  transform: translate(-100%, 50%);
}
</style>
<style lang="scss">
.hide .el-upload--picture-card, .hide {
  display: none;
}

.el-radio__input {
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: top;
}

.my-el-radio {
  width: 240px;
  height: 200px;

  .my-container {
    display: inline-block;
    width: 190px;
    height: 180px;

    .img {
      position: relative;
      width: 190px;
      height: 140px;
      border-radius: 10px;
      overflow: hidden;

      .img-mask {
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 1;
        color: white;

        .my-icon {
          position: absolute;
          display: inline-block;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 30px;
        }
      }
    }

    .title {
      width: 190px;
      height: 40px;
      line-height: 40px;
      text-align: center
    }

  }
}

</style>
