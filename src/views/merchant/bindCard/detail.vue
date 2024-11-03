<template>
  <section class="page-container">
    <el-form :model="merchantForm" :rules="formRules" ref="formRuleRef" label-width="150" style="width: 800px;"
      :disabled="actionType === 'view'">

      <el-steps class="mb-4" style="max-width: 800px" :space="200" :active="activeIndex" simple
        v-if="actionType !== 'view'">
        <el-step title="基本信息" :icon="Edit"></el-step>
        <el-step title="证件信息" :icon="UploadFilled"></el-step>
      </el-steps>

      <div v-if="activeIndex === 0 || actionType === 'view'" style="margin-top: 20px">
        <el-form-item label="会员" prop="memberId">
          <el-select v-model="merchantForm.memberId" placeholder="请选择">
            <el-option v-for="item in memberList"
                       :key="item.id"
                       :label="item.memberName"
                       :value="item.id"
                       @click.native="memberNameChange(item.memberName, item.merchantNum.toString())"/>
          </el-select>
        </el-form-item>
        <el-form-item label="银行账户名称" prop="bankAccountName">
          <el-input v-model="merchantForm.bankAccountName" :disabled="bankAccountNameStatus" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="银行名称" prop="bankCode">
          <el-select v-model="merchantForm.bankCode" filterable clearable remote :remote-method="remoteSearch"
            @clear="changeBankName('')" placeholder="请检索关键字">
            <el-option v-for="item in bankOptions" :key="item.bankNum" :label="item.bankName" :value="item.bankNum"
              @click.native="changeBankName(item.bankName)" />
          </el-select>
        </el-form-item>
        <el-form-item label="开户行" prop="bankOpenName">
          <el-input v-model="merchantForm.bankOpenName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="银行账号" prop="bankCardNumber">
          <el-input v-model="merchantForm.bankCardNumber" type="number" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="银行卡类型" prop="cardType">
          <el-select v-model="merchantForm.cardType" placeholder="请选择">
            <el-option v-for="item in BankCardTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡用途类型" prop="useType">
          <el-select v-model="merchantForm.useType" placeholder="请选择" @change="useTypeChange">
            <el-option v-for="item in dictStore.bsDicts.bankCardUseType"
                       :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否默认转账卡" prop="defaultCard">
          <el-select v-model="merchantForm.defaultCard" placeholder="请选择">
            <el-option v-for="item in YesOrNoEnums" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="省/市/县" prop="provinceCode">
          <el-cascader v-model="areaCode" :options="areaList" ref="cascaderRef" @change="handleChange"
            style="width: 100%" />
        </el-form-item>
      </div>

      <div v-if="activeIndex === 1 || actionType === 'view'" style="margin-top: 20px">
        <el-form-item label="法人身份证正面" prop="legalLicenceFrontUrl">
          <image-Upload v-model="merchantForm.legalLicenceFrontUrl" :limit="1" :fileSize="1"
            :showFileList="actionType === 'view' ? false : true" :merchantNum="merchantForm.merchantNum"
            :bizType="'open'" />
        </el-form-item>
        <el-form-item label="法人身份证反面" prop="legalLicenceBackUrl">
          <image-Upload v-model="merchantForm.legalLicenceBackUrl" :limit="1" :fileSize="1"
            :showFileList="actionType === 'view' ? false : true" :merchantNum="merchantForm.merchantNum"
            :bizType="'open'" />
        </el-form-item>
        <el-form-item label="开户行" prop="openAccountLicenceUrl">
          <image-Upload v-model="merchantForm.openAccountLicenceUrl" :limit="1" :fileSize="1"
            :showFileList="actionType === 'view' ? false : true" :merchantNum="merchantForm.merchantNum"
            :bizType="'open'" />
        </el-form-item>
        <el-form-item label="银行卡正面" prop="bankCardFrontUrl">
          <image-Upload v-model="merchantForm.bankCardFrontUrl" :limit="1" :fileSize="1"
            :showFileList="actionType === 'view' ? false : true" :merchantNum="merchantForm.merchantNum"
            :bizType="'open'" />
        </el-form-item>
        <el-form-item label="银行卡反面" prop="bankCardBackUrl">
          <image-Upload v-model="merchantForm.bankCardBackUrl" :limit="1" :fileSize="1"
            :showFileList="actionType === 'view' ? false : true" :merchantNum="merchantForm.merchantNum"
            :bizType="'open'" />
        </el-form-item>
        <el-form-item label="合作协议" prop="agreementPhotoUrl" v-if="isShowAgreement">
          <image-Upload v-model="merchantForm.agreementPhotoUrl" :fileSize="1" :type="actionType"
                        :showFileList="actionType === 'view' ? false : true" :merchantNum="merchantForm.merchantNum"
                        :bizType="'open'" />
        </el-form-item>
      </div>
      <el-form-item>
        <el-space>
          <el-button type="primary" @click="activeIndex--" v-if="activeIndex !== 0">上一步</el-button>
          <el-button type="primary" @click="onSubmit(formRuleRef)" v-if="actionType !== 'view'">
            {{ activeIndex === 1 ? '提交' : '下一步' }}
          </el-button>
        </el-space>
      </el-form-item>
    </el-form>
    <el-form v-if="route.query.type === 'audit'" label-width="150" style="width: 800px;">
      <el-form-item label="理由" required>
        <el-input v-model="reason" :rows="3" type="textarea" placeholder="请输入"/>
      </el-form-item>
      <el-form-item>
        <el-space>
          <el-button type="primary" @click="approveClick('failed')">不通过</el-button>
          <el-button type="primary" @click="approveClick('success')">通过</el-button>
        </el-space>
      </el-form-item>
    </el-form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { Edit, UploadFilled } from '@element-plus/icons-vue'
import useDictStore from '@/store/modules/dict';
import imageUpload from '@/components/ImageUpload/index.vue'
import {
  bankCardSave,
  bankCardApply,
  bankCardDetail,
  bankCardUpdate,
  bankCardAudit

} from "@/api/merchant/bindCard";
import { memberPageList } from "@/api/member/index";
import { ElMessage } from "element-plus";
import { BankCardTypeList, YesOrNoEnums, formRules } from "./data.ts";

const { proxy } = getCurrentInstance();
const props = defineProps({
  isBack: { type: Boolean, default: true },
})

const dictStore = useDictStore();
let route = useRoute()
const actionType = ref(route.query.type === 'audit' ? 'view' : route.query.type)
const router = useRouter()
const activeIndex = ref(0)
const merchantForm = ref({
  id: null,
  memberId: '',
  memberName: '',
  merchantNum: '',
  bankAccountName: '',
  bankCardNumber: '',
  bankCode: '',
  bankName: '',
  bankOpenName: '',
  cardType: '',
  useType: '',
  defaultCard: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  areaCode: '',
  areaName: '',
  attachments: [
    { fileType: 'legalLicenceFrontUrl', filePath: '' },
    { fileType: 'legalLicenceBackUrl', filePath: '' },
    { fileType: 'openAccountLicenceUrl', filePath: '' },
    { fileType: 'bankCardFrontUrl', filePath: '' },
    { fileType: 'bankCardBackUrl', filePath: '' },
    { fileType: 'agreementPhotoUrl', filePath: '' }
  ],
  legalLicenceFrontUrl: '',
  legalLicenceBackUrl: '',
  bankCardFrontUrl: '',
  bankCardBackUrl: '',
  agreementPhotoUrl: ''
})
const formRuleRef = ref()
const cascaderRef = ref(null)
const areaCode = ref([])
const areaList = ref([])
const allOptions = ref([]); // 存储从接口获取的全部数据
const displayedOptions = ref([]); // 存储当前显示给用户的选项
const bankOptions = ref([])
const isShowAgreement = ref(false)
const bankAccountNameStatus = ref(false)
const reason = ref('')

areaList.value = JSON.parse(localStorage.getItem('areaList'))
allOptions.value = JSON.parse(localStorage.getItem('bankList'))
const newOptions = allOptions.value.slice(0, 50)
displayedOptions.value.push(...newOptions)
bankOptions.value = displayedOptions.value

const memberList = ref([])
const getMemberList = () => {
  memberPageList({
    pageNum: -1,
    pageSize: 50
  }).then(res => {
    if (res.code === 200) {
      memberList.value = res.data
    }
  })
}
getMemberList()

const getDetail = () => {
  bankCardDetail({
    id: route.query.id
  }).then(res => {
    if (res.code === 200) {
      formRuleRef.value?.resetFields()
      merchantForm.value = res.data
      merchantForm.value.merchantNum = res.data.merchantNum.toString()
      areaCode.value = [res.data.provinceCode, res.data.cityCode, res.data.areaCode]
      if(res.data.attachments && res.data.attachments.length>0){
        res.data.attachments.map(item=>{
          if(item.fileType === 'legalLicenceFrontUrl'){
            merchantForm.value.legalLicenceFrontUrl = item.filePath
          }
          if(item.fileType === 'legalLicenceBackUrl'){
            merchantForm.value.legalLicenceBackUrl = item.filePath
          }
          if(item.fileType === 'openAccountLicenceUrl'){
            merchantForm.value.openAccountLicenceUrl = item.filePath
          }
          if(item.fileType === 'bankCardFrontUrl') {
            merchantForm.value.bankCardFrontUrl = item.filePath
          }
          if(item.fileType === 'bankCardBackUrl'){
            merchantForm.value.bankCardBackUrl = item.filePath
          }
          if(item.fileType === 'agreementPhotoUrl'){
            merchantForm.value.agreementPhotoUrl = item.filePath
            isShowAgreement.value = true
          }
        })
      }
    }
  })
}
route.query?.id && getDetail()

const onSubmit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if (activeIndex.value === 1) {
        merchantForm.value.attachments.forEach(attachment => {
          if (attachment.fileType === 'legalLicenceFrontUrl') {
            attachment.filePath = merchantForm.value.legalLicenceFrontUrl
          }
          if (attachment.fileType === 'legalLicenceBackUrl') {
            attachment.filePath = merchantForm.value.legalLicenceBackUrl
          }
          if (attachment.fileType === 'openAccountLicenceUrl') {
            attachment.filePath = merchantForm.value.openAccountLicenceUrl
          }
          if (attachment.fileType === 'bankCardFrontUrl') {
            attachment.filePath = merchantForm.value.bankCardFrontUrl
          }
          if (attachment.fileType === 'bankCardBackUrl') {
            attachment.filePath = merchantForm.value.bankCardBackUrl
          }
          if (attachment.fileType === 'agreementPhotoUrl') {
            attachment.filePath = merchantForm.value.agreementPhotoUrl
          }
        })
        if(route.query.id){
          bankCardUpdate(merchantForm.value).then(res => {
            if (res.code === 200) {
              ElMessage.success('修改成功')
              close()
            }
          })
        }else {
          bankCardApply(merchantForm.value).then(res => {
            if (res.code === 200) {
              ElMessage.success('新增成功')
              close()
            }
          })
        }
      } else if (activeIndex.value === 0) {
        // 暂存
        bankCardSave({
          id: merchantForm.value.id?merchantForm.value.id.toString():'',
          memberId: merchantForm.value.memberId,
          memberName: merchantForm.value.memberName,
          useType: merchantForm.value.useType,
          defaultCard: merchantForm.value.defaultCard,
          bankAccountName: merchantForm.value.bankAccountName,
          bankCardNumber: merchantForm.value.bankCardNumber,
          bankCode: merchantForm.value.bankCode,
          bankName: merchantForm.value.bankName,
          bankOpenName: merchantForm.value.bankOpenName,
          cardType: merchantForm.value.cardType,
          provinceCode: merchantForm.value.provinceCode,
          provinceName: merchantForm.value.provinceName,
          cityCode: merchantForm.value.cityCode,
          cityName: merchantForm.value.cityName,
          areaCode: merchantForm.value.areaCode,
          areaName: merchantForm.value.areaName
        }).then(merchantForm.value).then(res => {
          if (res.code === 200) {
            merchantForm.value.id = res.data.data
            activeIndex.value++
          }
        })
      } else {
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
  if (label === '') {
    bankOptions.value = displayedOptions.value
  }
}

const approveClick = (statusCode) => {
  if(reason.value === ''){
    ElMessage.warning('请输入理由')
    return
  }
  bankCardAudit({
    id: merchantForm.value.id || route.query.id,
    statusCode: statusCode,
    statusMsg: reason.value
  }).then(res => {
    if (res.code === 200) {
      ElMessage.success('提交成功')
      close()
    }
  })
}

const memberNameChange = (label, id) => {
  merchantForm.value.memberName = label
  merchantForm.value.bankAccountName = label
  merchantForm.value.merchantNum = id
}

const useTypeChange = () => {
  console.log(merchantForm.value.useType)
  if(merchantForm.value.useType === 'settle' && merchantForm.value.bankAccountName !== merchantForm.value.memberName){
    isShowAgreement.value = true
  }else if(merchantForm.value.useType === 'withdraw'){
    merchantForm.value.bankAccountName = merchantForm.value.memberName
    bankAccountNameStatus.value = true
  }else {
    bankAccountNameStatus.value = false
  }
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
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 260px;
}
</style>
