<template>
  <section class="page-container">
    <el-form :model="merchantForm" :rules="formRules" ref="formRuleRef" label-width="150" style="width: 600px;">
      <el-form-item label="商户编号" prop="merchantNum">
        <el-select v-model="merchantForm.merchantNum"
                   :disabled="merchantForm.id"
                   placeholder="请选择">
          <el-option v-for="item in userStore.merchants"
                     :key="item.merchantNum"
                     :label="item.merchantName"
                     :value="item.merchantNum"
                     @click.native="merchantChange(item.merchantName)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="规则类型" prop="ruleType">
        <el-select v-model="merchantForm.ruleType" placeholder="请选择">
          <el-option v-for="item in dictStore.bsDicts.settleRuleType"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="手续费承担方" prop="feeUndertakeType">
        <el-select v-model="merchantForm.feeUndertakeType" placeholder="请选择">
          <el-option v-for="item in dictStore.bsDicts.feeUndertakeType"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="服务费收取方式" prop="feeType">
        <el-select v-model="merchantForm.feeType" placeholder="请选择">
          <el-option v-for="item in dictStore.bsDicts.feeType"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="费率" prop="feeRate">
        <el-input v-model="merchantForm.feeRate" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="状态" v-if="merchantForm.id" prop="statusCode">
        <el-select v-model="merchantForm.statusCode" placeholder="请选择">
          <el-option v-for="item in dictStore.bsDicts.baseStatus"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-space>
          <el-button type="primary" @click="onSubmit(formRuleRef)">提交</el-button>
        </el-space>
      </el-form-item>
    </el-form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router'
import useDictStore from '@/store/modules/dict';
import useUserStore from "@/store/modules/user";
import { postAddMerchantFeeApi, postUpdateMerchantFeeApi } from "@/api/merchant/merchantFee";
import {ElMessage} from "element-plus";

const { proxy } = getCurrentInstance();
const props = defineProps({
  isBack: { type: Boolean, default: true },
})
const dictStore = useDictStore();
const userStore = useUserStore();
let route = useRoute()
const router = useRouter()
const merchantForm = ref({
  merchantNum: '',
  merchantName: '',
  ruleType: '',
  feeUndertakeType: '',
  feeType: '',
  feeRate: '',
  statusCode: ''
})
const formRuleRef = ref()
const formRules ={
  merchantNum: [{ required: true, message: '请选择商户编号', trigger: 'change' }],
  ruleType: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
  feeUndertakeType: [{ required: true, message: '请选择手续费承担方', trigger: 'change' }],
  feeType: [{ required: true, message: '请选择服务费收取方式', trigger: 'change' }],
  feeRate: [{ required: true, message: '请输入费率', trigger: 'blur' }],
  statusCode: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

onMounted(()=>{
  if(route.query){
    merchantForm.value = route.query
    merchantForm.value.merchantNum = merchantForm.value.merchantNum ? +merchantForm.value.merchantNum : ''
  }
  formRuleRef.value?.resetFields()
})

const onSubmit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if(merchantForm.value.id){
        postUpdateMerchantFeeApi(merchantForm.value).then(res => {
          if(res.code === 200){
            ElMessage.success('修改成功')
            close()
          }
        })
      }else {
        postAddMerchantFeeApi(merchantForm.value).then(res => {
          if(res.code === 200){
            ElMessage.success('新增成功')
            close()
          }
        })
      }
    }
  })
}
const merchantChange = (label) => {
  merchantForm.value.merchantName = label
}
function close() {
  if (props.isBack) {
    proxy.$tab.closeOpenPage();
    router.go(-1);
  }
}
</script>
