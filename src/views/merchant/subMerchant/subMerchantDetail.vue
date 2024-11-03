<template>
  <section class="page-container">
    <el-form :model="merchantForm" label-width="150" style="width: 600px;" disabled>
      <el-form-item label="商户名称">
        <el-input v-model="merchantForm.merchantName"/>
      </el-form-item>
      <el-form-item label="商户简称">
        <el-input v-model="merchantForm.merchantShortName"/>
      </el-form-item>
      <el-form-item label="商户类型">
        <el-select v-model="merchantForm.merchantType">
          <el-option v-for="item in dictStore.bsDicts.merchantType"
                     :key="item.value"
                     :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="服务角色">
        <el-select v-model="merchantForm.subMerchantRole">
          <el-option v-for="item in subMerchantRoleList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="法人名称">
        <el-input v-model="merchantForm.lawPersonName"/>
      </el-form-item>
      <el-form-item label="法人联系电话">
        <el-input v-model="merchantForm.lawPersonTelephone"/>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="merchantForm.contractUserName"/>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="merchantForm.contractTelephone"/>
      </el-form-item>
      <el-form-item label="联系邮箱">
        <el-input v-model="merchantForm.contractEmail"/>
      </el-form-item>
      <el-form-item label="合作开始时间">
        <el-date-picker v-model="merchantForm.collaborateStartDate"
                        value-format="x"
                        type="date"
                        style="width: 100%"/>
      </el-form-item>
      <el-form-item label="合作结束时间">
        <el-date-picker v-model="merchantForm.collaborateEndDate"
                        value-format="x"
                        type="date"
                        style="width: 100%"/>
      </el-form-item>
      <el-form-item label="银行账户名称">
        <el-input v-model="merchantForm.bankAccountName"/>
      </el-form-item>
      <el-form-item label="银行账号">
        <el-input v-model="merchantForm.bankCardNumber"/>
      </el-form-item>
      <el-form-item label="银行名称">
        <el-input v-model="merchantForm.bankName"/>
      </el-form-item>
      <el-form-item label="开户行">
        <el-input v-model="merchantForm.bankOpenName"/>
      </el-form-item>
      <el-form-item label="省级">
        <el-input v-model="merchantForm.provinceName"/>
      </el-form-item>
      <el-form-item label="市级">
        <el-input v-model="merchantForm.cityName"/>
      </el-form-item>
      <el-form-item label="区/县">
        <el-input v-model="merchantForm.areaName"/>
      </el-form-item>
      <el-form-item label="营业执照">
        <image-Upload v-model="licenceUrl"
                      :limit="1"
                      :fileSize="1"
                      :showFileList="false"/>
      </el-form-item>
      <el-form-item label="法人身份证正面">
        <image-Upload v-model="legalLicenceFrontUrl"
                      :limit="1"
                      :fileSize="1"
                      :showFileList="false"/>
      </el-form-item>
      <el-form-item label="法人身份证反面">
        <image-Upload v-model="legalLicenceBackUrl"
                      :limit="1"
                      :fileSize="1"
                      :showFileList="false"/>
      </el-form-item>
      <el-form-item label="开户行">
        <image-Upload v-model="openAccountLicenceUrl"
                      :limit="1"
                      :fileSize="1"
                      :showFileList="false"/>
      </el-form-item>
      <el-form-item label="手机端支付流程截图">
        <image-Upload v-model="screenshotOfPaymentProcessUrl"
                      :fileSize="1"
                      :showFileList="false"
                      :type="'view'"
                      :merchantNum="merchantForm.merchantNum"
                      :bizType="'open'"/>
      </el-form-item>
      <el-form-item label="付款场景">
        <image-Upload v-model="paymentScene"
                      :fileSize="1"
                      :showFileList="false"
                      :type="'view'"
                      :merchantNum="merchantForm.merchantNum"
                      :bizType="'open'"/>
      </el-form-item>
      <el-form-item label="手持营业执照在经营场所的照片">
        <image-Upload v-model="handLicenceUrl"
                      :fileSize="1"
                      :showFileList="false"
                      :type="'view'"
                      :merchantNum="merchantForm.merchantNum"
                      :bizType="'open'"/>
      </el-form-item>
      <el-form-item label="场景照">
        <image-Upload v-model="scenePhotoUrl"
                      :fileSize="1"
                      :showFileList="false"
                      :type="'view'"
                      :merchantNum="merchantForm.merchantNum"
                      :bizType="'open'"/>
      </el-form-item>
    </el-form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useRoute} from 'vue-router'
import useDictStore from '@/store/modules/dict';
import imageUpload from '@/components/ImageUpload/index.vue'
import {getAreaList, getBankList} from '@/api/login'
import {postSaasDetailSubMerchantApi} from '@/api/merchant/platMerchant'

const dictStore = useDictStore();
let route = useRoute()
const merchantForm = ref({
  merchantName: '',
  merchantShortName: '',
  merchantType: '',
  platformRole: 'subMerchant',
  subMerchantRole: '',
  lawPersonName: '',
  lawPersonTelephone: '',
  contractUserName: '',
  contractTelephone: '',
  contractEmail: '',
  collaborateStartDate: '',
  collaborateEndDate: '',
  provinceName: '',
  cityName: '',
  areaName: '',
  bankCards: [],
  bankAccountName: '',
  bankCardNumber: '',
  bankName: '',
  bankOpenName: '',
  attachments: [
    {fileType: 'handLicenceUrl', filePath: ''},
    {fileType: 'legalLicenceFrontUrl', filePath: ''},
    {fileType: 'legalLicenceBackUrl', filePath: ''},
    {fileType: 'openAccountLicenceUrl', filePath: ''},
    {fileType: 'screenshotOfPaymentProcessUrl', filePath: ''},
    {fileType: 'paymentScene', filePath: ''},
    {fileType: 'handLicenceUrl', filePath: ''},
    {fileType: 'scenePhotoUrl', filePath: ''}
  ]
})
const licenceUrl = ref('')
const legalLicenceFrontUrl = ref('')
const legalLicenceBackUrl = ref('')
const openAccountLicenceUrl = ref('')
const screenshotOfPaymentProcessUrl = ref('')
const paymentScene = ref('')
const handLicenceUrl = ref('')
const scenePhotoUrl = ref('')
const subMerchantRoleList = [
  {value: 'supply', label: '供应商'},
  {value: 'channel', label: '渠道商'},
  {value: 'technical', label: '技术服务商'}
]

onMounted(()=>{
  if(route.query && route.query.id){
    getSassDetailSubMerchant()
  }
})
const getSassDetailSubMerchant = () => {
  postSaasDetailSubMerchantApi({
    merchantNum: Number(route.query.id)
  }).then(res => {
    if(res.code === 200) {
      merchantForm.value = res.data
      if(merchantForm.value.bankCards){
        merchantForm.value.bankAccountName = merchantForm.value.bankCards[0].bankAccountName
        merchantForm.value.bankCardNumber = merchantForm.value.bankCards[0].bankCardNumber
        merchantForm.value.bankName = merchantForm.value.bankCards[0].bankName
        merchantForm.value.bankOpenName = merchantForm.value.bankCards[0].bankOpenName
      }
      if(res.data.attachments && res.data.attachments.length>0){
        res.data.attachments.map(item=>{
          if(item.fileType === 'licenceUrl'){
            handLicenceUrl.value = item.filePath
          }
          if(item.fileType === 'legalLicenceFrontUrl'){
            legalLicenceFrontUrl.value = item.filePath
          }
          if(item.fileType === 'legalLicenceBackUrl'){
            legalLicenceBackUrl.value = item.filePath
          }
          if(item.fileType === 'openAccountLicenceUrl'){
            openAccountLicenceUrl.value = item.filePath
          }
          if(item.fileType === 'screenshotOfPaymentProcessUrl') {
            screenshotOfPaymentProcessUrl.value = item.filePath
          }
          if(item.fileType === 'paymentScene'){
            paymentScene.value = item.filePath
          }
          if(item.fileType === 'handLicenceUrl'){
            handLicenceUrl.value = item.filePath
          }
          if(item.fileType === 'scenePhotoUrl'){
            scenePhotoUrl.value = item.filePath
          }
        })
      }
    }
  })
}
</script>

<style scoped>
:deep(.el-upload--picture-card),
:deep(.el-upload-list--picture-card .el-upload-list__item){
  width: 260px;
}
</style>
