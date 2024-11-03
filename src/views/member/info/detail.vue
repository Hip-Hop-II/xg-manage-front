<template>
  <section class="page-container">
    <el-form :model="merchantForm" :rules="formRules" ref="formRuleRef"
             label-width="150" style="width: 800px;"
             :disabled="route.query.type === 'view'">
      <el-steps class="mb-4" style="max-width: 800px" :space="200" :active="activeIndex" simple
                v-if="route.query.type !== 'view'">
        <el-step title="基本信息" :icon="Edit"></el-step>
        <el-step title="银行信息" :icon="Edit"></el-step>
        <el-step title="证件信息" :icon="UploadFilled"></el-step>
        <el-step title="其他材料" :icon="UploadFilled"></el-step>
      </el-steps>
      <div v-if="activeIndex === 0 || route.query.type === 'view'" style="margin-top: 20px">
        <el-form-item label="商户名称" prop="merchantName">
          <el-input v-model="merchantForm.merchantName" @change="merchantNameChange" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="商户简称" prop="merchantShortName">
          <el-input v-model="merchantForm.merchantShortName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="商户类型" prop="merchantType">
          <el-select v-model="merchantForm.merchantType" placeholder="请选择">
            <el-option v-for="item in dictStore.bsDicts.merchantType"
                       :key="item.value"
                       :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="法人名称" prop="lawPersonName">
          <el-input v-model="merchantForm.lawPersonName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="法人联系电话" prop="lawPersonTelephone">
          <el-input v-model="merchantForm.lawPersonTelephone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系人" prop="contractUserName">
          <el-input v-model="merchantForm.contractUserName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="contractTelephone">
          <el-input v-model="merchantForm.contractTelephone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="contractEmail">
          <el-input v-model="merchantForm.contractEmail" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="合作开始时间" prop="collaborateStartDate">
          <el-date-picker v-model="merchantForm.collaborateStartDate"
                          type="date"
                          value-format="x"
                          placeholder="请选择"
                          style="width: 100%"/>
        </el-form-item>
        <el-form-item label="合作结束时间" prop="collaborateEndDate">
          <el-date-picker v-model="merchantForm.collaborateEndDate"
                          type="date"
                          value-format="x"
                          placeholder="请选择"
                          style="width: 100%"/>
        </el-form-item>
      </div>
      <div v-if="activeIndex === 1 || route.query.type === 'view'" style="margin-top: 20px">
        <el-form-item label="银行账户名称" prop="bankAccountName">
          <el-input v-model="merchantForm.bankAccountName" disabled placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankCardNumber">
          <el-input v-model="merchantForm.bankCardNumber" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="银行名称" prop="bankCode">
          <el-select v-model="merchantForm.bankCode"
                     filterable
                     clearable
                     remote
                     :remote-method="remoteSearch"
                     @clear="changeBankName('')"
                     placeholder="请检索关键字">
            <el-option v-for="item in bankOptions"
                       :key="item.bankNum"
                       :label="item.bankName"
                       :value="item.bankNum"
                       @click.native="changeBankName(item.bankName)"/>
          </el-select>
        </el-form-item>
        <el-form-item label="开户行" prop="bankOpenName">
          <el-input v-model="merchantForm.bankOpenName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="银行卡类型" prop="cardType">
          <el-select v-model="merchantForm.cardType" placeholder="请选择">
            <el-option value="debit" label="借记卡"></el-option>
            <el-option value="credit" label="信用卡"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省/市/县" prop="provinceCode">
          <el-cascader v-model="areaCode" :options="areaList"
                       ref="cascaderRef"
                       @change="handleChange" style="width: 100%"/>
        </el-form-item>
      </div>
      <div v-if="activeIndex === 2 || route.query.type === 'view'" style="margin-top: 20px">
        <el-form-item label="营业执照" prop="licenceUrl">
          <image-Upload v-model="merchantForm.licenceUrl"
                        :limit="1"
                        :fileSize="1"
                        :showFileList="route.query.type === 'view'?false:true"
                        :merchantNum="merchantForm.merchantNum"
                        :bizType="'open'"/>
        </el-form-item>
        <el-form-item label="法人身份证正面" prop="legalLicenceFrontUrl">
          <image-Upload v-model="merchantForm.legalLicenceFrontUrl"
                        :limit="1"
                        :fileSize="1"
                        :showFileList="route.query.type === 'view'?false:true"
                        :merchantNum="merchantForm.merchantNum"
                        :bizType="'open'"/>
        </el-form-item>
        <el-form-item label="法人身份证反面" prop="legalLicenceBackUrl">
          <image-Upload v-model="merchantForm.legalLicenceBackUrl"
                        :limit="1"
                        :fileSize="1"
                        :showFileList="route.query.type === 'view'?false:true"
                        :merchantNum="merchantForm.merchantNum"
                        :bizType="'open'"/>
        </el-form-item>
        <el-form-item label="开户行" prop="openAccountLicenceUrl">
          <image-Upload v-model="merchantForm.openAccountLicenceUrl"
                        :limit="1"
                        :fileSize="1"
                        :showFileList="route.query.type === 'view'?false:true"
                        :merchantNum="merchantForm.merchantNum"
                        :bizType="'open'"/>
        </el-form-item>
      </div>
      <div v-if="activeIndex === 3 || route.query.type === 'view'" style="margin-top: 20px">
        <el-form-item label="手机端支付流程截图" prop="screenshotOfPaymentProcessUrl">
          <image-Upload v-model="merchantForm.screenshotOfPaymentProcessUrl"
                        :fileSize="1"
                        :type="route.query.type"
                        :showFileList="route.query.type === 'view'?false:true"
                        :merchantNum="merchantForm.merchantNum"
                        :bizType="'open'"/>
        </el-form-item>
        <el-form-item label="付款场景" prop="paymentScene">
          <image-Upload v-model="merchantForm.paymentScene"
                        :fileSize="1"
                        :type="route.query.type"
                        :showFileList="route.query.type === 'view'?false:true"
                        :merchantNum="merchantForm.merchantNum"
                        :bizType="'open'"/>
        </el-form-item>
        <el-form-item label="手持营业执照在经营场所的照片" prop="handLicenceUrl">
          <image-Upload v-model="merchantForm.handLicenceUrl"
                        :fileSize="1"
                        :type="route.query.type"
                        :showFileList="route.query.type === 'view'?false:true"
                        :merchantNum="merchantForm.merchantNum"
                        :bizType="'open'"/>
        </el-form-item>
        <el-form-item label="场景照" prop="scenePhotoUrl">
          <image-Upload v-model="merchantForm.scenePhotoUrl"
                        :fileSize="1"
                        :type="route.query.type"
                        :showFileList="route.query.type === 'view'?false:true"
                        :merchantNum="merchantForm.merchantNum"
                        :bizType="'open'"/>
        </el-form-item>
      </div>
      <el-form-item>
        <el-space>
          <el-button type="primary" @click="activeIndex--"
                     v-if="activeIndex !== 0">上一步</el-button>
          <el-button type="primary" @click="onSubmit(formRuleRef)" v-if="route.query.type !== 'view'">
            {{activeIndex === 3? '提交': '下一步'}}
          </el-button>
        </el-space>
      </el-form-item>
    </el-form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router'
import { Edit, UploadFilled } from '@element-plus/icons-vue'
import useDictStore from '@/store/modules/dict';
import imageUpload from '@/components/ImageUpload/index.vue'
import {
  postAddPlatMerchantApi,
  postDetailPlatMerchantApi,
  postPlatMerchantSaveApi
} from "@/api/merchant/platMerchant";
import {ElMessage} from "element-plus";

const { proxy } = getCurrentInstance();
const props = defineProps({
  isBack: { type: Boolean, default: true },
})
const dictStore = useDictStore();
let route = useRoute()
const router = useRouter()
const activeIndex = ref(0)
const merchantForm = ref({
  merchantNum: null,
  merchantName: '',
  merchantShortName: '',
  merchantType: '',
  platformRole: 'platform',
  lawPersonName: '',
  lawPersonTelephone: '',
  contractUserName: '',
  contractTelephone: '',
  contractEmail: '',
  collaborateStartDate: '',
  collaborateEndDate: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  areaCode: '',
  areaName: '',
  bankAccountName: '',
  bankCardNumber: '',
  bankCode: '',
  bankOpenName: '',
  cardType: '',
  attachments: [
    {fileType: 'licenceUrl', filePath: ''},
    {fileType: 'legalLicenceFrontUrl', filePath: ''},
    {fileType: 'legalLicenceBackUrl', filePath: ''},
    {fileType: 'openAccountLicenceUrl', filePath: ''},
    {fileType: 'screenshotOfPaymentProcessUrl', filePath: ''},
    {fileType: 'paymentScene', filePath: ''},
    {fileType: 'handLicenceUrl', filePath: ''},
    {fileType: 'scenePhotoUrl', filePath: ''}
  ],
  licenceUrl: '',
  legalLicenceFrontUrl: '',
  legalLicenceBackUrl: '',
  openAccountLicenceUrl: '',
  screenshotOfPaymentProcessUrl: '',
  paymentScene: '',
  handLicenceUrl: '',
  scenePhotoUrl: ''
})
const formRuleRef = ref()
const validatePhone = (rule, value, callback) => {
  const phoneRegex = /^1[3456789]\d{9}$/;
  if (!phoneRegex.test(value)) {
    return callback(new Error('请输入正确的电话号码'));
  }
  callback();
}
const formRules ={
  merchantName: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
  merchantShortName: [{ required: true, message: '请输入商户简称', trigger: 'blur' }],
  merchantType: [{ required: true, message: '请选择商户类型', trigger: 'change' }],
  lawPersonName: [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
  lawPersonTelephone: [
      {required: true, message: '请输入法人联系电话', trigger: 'blur'},
      {validator: validatePhone, trigger: 'blur'}
  ],
  contractUserName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contractTelephone: [
    {required: true, message: '请输入联系电话', trigger: 'blur'},
    {validator: validatePhone, trigger: 'blur'}
  ],
  contractEmail: [
    {required: true, message: '请输入邮箱', trigger: 'blur' },
    {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
  ],
  collaborateStartDate: [{ required: true, message: '请选择合作开始时间', trigger: 'change' }],
  collaborateEndDate: [{ required: true, message: '请选择合作结束时间', trigger: 'change' }],
  bankAccountName: [{ required: true, message: '请输入银行账户名称', trigger: 'blur' }],
  bankCardNumber: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
  bankCode: [{ required: true, message: '请选择银行', trigger: 'change' }],
  bankOpenName: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
  cardType: [{ required: true, message: '请选择银行卡类型', trigger: 'change' }],
  provinceCode: [{ required: true, message: '请选择省市区', trigger: 'change' }],
  licenceUrl: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
  legalLicenceFrontUrl: [{ required: true, message: '请上传法人身份证正面', trigger: 'change' }],
  legalLicenceBackUrl: [{ required: true, message: '请上传法人身份证反面', trigger: 'change' }],
  openAccountLicenceUrl: [{ required: true, message: '请上传开户行', trigger: 'change' }],
  screenshotOfPaymentProcessUrl: [{ required: true, message: '请上传手机端支付流程截图', trigger: 'change' }],
  paymentScene: [{ required: true, message: '请上传付款场景', trigger: 'change' }],
  handLicenceUrl: [{ required: true, message: '请上传手持营业执照在经营场所的照片', trigger: 'change' }],
  scenePhotoUrl: [{ required: true, message: '请上传场景照', trigger: 'change' }],
}
const cascaderRef = ref(null)
const areaCode = ref([])
const areaList = ref([])
const allOptions = ref([]); // 存储从接口获取的全部数据
const displayedOptions = ref([]); // 存储当前显示给用户的选项
const bankOptions = ref([])
areaList.value = JSON.parse(localStorage.getItem('areaList'))
allOptions.value = JSON.parse(localStorage.getItem('bankList'))
const newOptions = allOptions.value.slice(0, 50)
displayedOptions.value.push(...newOptions)
bankOptions.value = displayedOptions.value

onMounted(()=>{
  if(route.query && route.query.id){
    getDetailPlatMerchant()
  }
})
const getDetailPlatMerchant = () => {
  postDetailPlatMerchantApi({
    merchantNum: Number(route.query.id)
  }).then(res => {
    if(res.code === 200) {
      merchantForm.value = res.data
      if(res.data.provinceCode && res.data.cityCode && res.data.areaCode){
        areaCode.value = [res.data.provinceCode, res.data.cityCode, res.data.areaCode]
      }
      if(res.data.bankCards){
        merchantForm.value.bankAccountName = res.data.bankCards[0].bankAccountName
        merchantForm.value.bankCardNumber = res.data.bankCards[0].bankCardNumber
        merchantForm.value.bankCode = res.data.bankCards[0].bankCode
        merchantForm.value.bankOpenName = res.data.bankCards[0].bankOpenName
        merchantForm.value.cardType = res.data.bankCards[0].cardType
        if(merchantForm.value.bankCode){
          let option = allOptions.value.filter(item => {
            return item.bankNum.indexOf(merchantForm.value.bankCode) > -1
          })
          displayedOptions.value.unshift(...option)
          bankOptions.value = displayedOptions.value
        }
      }
      if(res.data.attachments && res.data.attachments.length>0){
        res.data.attachments.map(item=>{
          if(item.fileType === 'licenceUrl'){
            merchantForm.value.licenceUrl = item.filePath
          }
          if(item.fileType === 'legalLicenceFrontUrl'){
            merchantForm.value.legalLicenceFrontUrl = item.filePath
          }
          if(item.fileType === 'legalLicenceBackUrl'){
            merchantForm.value.legalLicenceBackUrl = item.filePath
          }
          if(item.fileType === 'openAccountLicenceUrl'){
            merchantForm.value.openAccountLicenceUrl = item.filePath
          }
          if(item.fileType === 'screenshotOfPaymentProcessUrl') {
            merchantForm.value.screenshotOfPaymentProcessUrl = item.filePath
          }
          if(item.fileType === 'paymentScene'){
            merchantForm.value.paymentScene = item.filePath
          }
          if(item.fileType === 'handLicenceUrl'){
            merchantForm.value.handLicenceUrl = item.filePath
          }
          if(item.fileType === 'scenePhotoUrl'){
            merchantForm.value.scenePhotoUrl = item.filePath
          }
        })
      }
      formRuleRef.value?.resetFields()
    }
  })
}
const onSubmit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if(activeIndex.value === 3) {
        merchantForm.value.attachments.forEach(attachment => {
          if (attachment.fileType === 'licenceUrl') {
            attachment.filePath = merchantForm.value.licenceUrl
          }
          if(attachment.fileType === 'legalLicenceFrontUrl'){
            attachment.filePath = merchantForm.value.legalLicenceFrontUrl
          }
          if(attachment.fileType === 'legalLicenceBackUrl'){
            attachment.filePath = merchantForm.value.legalLicenceBackUrl
          }
          if(attachment.fileType === 'openAccountLicenceUrl'){
            attachment.filePath = merchantForm.value.openAccountLicenceUrl
          }
          if(attachment.fileType === 'screenshotOfPaymentProcessUrl') {
            attachment.filePath = merchantForm.value.screenshotOfPaymentProcessUrl
          }
          if(attachment.fileType === 'paymentScene'){
            attachment.filePath = merchantForm.value.paymentScene
          }
          if(attachment.fileType === 'handLicenceUrl'){
            attachment.filePath = merchantForm.value.handLicenceUrl
          }
          if(attachment.fileType === 'scenePhotoUrl'){
            attachment.filePath = merchantForm.value.scenePhotoUrl
          }
        })
        postAddPlatMerchantApi(merchantForm.value).then(res=>{
          if(res.code === 200) {
            ElMessage.success('新增成功')
            close()
          }
        })
      }else if(activeIndex.value === 0) {
        // 暂存
        postPlatMerchantSaveApi({
          merchantNum: merchantForm.value.merchantNum,
          merchantName: merchantForm.value.merchantName,
          merchantShortName: merchantForm.value.merchantShortName,
          merchantType: merchantForm.value.merchantType,
          platformRole: merchantForm.value.platformRole,
          lawPersonName: merchantForm.value.lawPersonName,
          lawPersonTelephone: merchantForm.value.lawPersonTelephone,
          contractUserName: merchantForm.value.contractUserName,
          contractTelephone: merchantForm.value.contractTelephone,
          contractEmail: merchantForm.value.contractEmail,
          collaborateStartDate: merchantForm.value.collaborateStartDate,
          collaborateEndDate: merchantForm.value.collaborateEndDate
        }).then(merchantForm.value).then(res=>{
          if(res.code === 200) {
            merchantForm.value.merchantNum = res.data.merchant
            activeIndex.value++
          }
        })
      }else {
        activeIndex.value++
      }
    }
  })
}
const remoteSearch = (query) => {
  if (query !== '') {
    setTimeout(() => {
      bankOptions.value = allOptions.value.filter(item => {
        return item.bankName.indexOf(query) > -1
      })
    }, 200)
  }
}
const changeBankName = (label) => {
  merchantForm.value.bankName = label
  if(label === ''){
    bankOptions.value = displayedOptions.value
  }
}
const merchantNameChange = () => {
  merchantForm.value.bankAccountName = merchantForm.value.merchantName
}
const handleChange = (value) => {
  const regionList = cascaderRef.value.getCheckedNodes()[0].pathLabels
  merchantForm.value.provinceCode = value[0]
  merchantForm.value.cityCode = value[1]
  merchantForm.value.areaCode = value[2]
  merchantForm.value.provinceName = regionList[0]
  merchantForm.value.cityName = regionList[1]
  merchantForm.value.areaName = regionList[2]
}
function close() {
  if (props.isBack) {
    proxy.$tab.closeOpenPage();
    router.go(-1);
  }
}
</script>

<style scoped>
:deep(.el-upload--picture-card),
:deep(.el-upload-list--picture-card .el-upload-list__item){
  width: 260px;
}
</style>
