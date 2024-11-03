<template>
  <section class="page-container">
    <el-form :model="formData" label-width="6em" style="width: 600px;" ref="formRef" :rules="rules">
      <!-- <el-form-item label="商户" prop="merchantNum">
        <merchant-select v-model="formData.merchantNum" @change="onMerchantChange" style="width: 100%;" />
      </el-form-item> -->
      <!-- <el-form-item label="账户类型" prop="accountType">
        <el-select v-model="formData.accountType" placeholder="请选择账户类型" style="width: 100%;">
          <el-option
            v-for="item in dictStore.bsDicts.accountType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.value === 'self'"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="充值方式" prop="rechargeType">
        <el-select v-model="formData.rechargeType" placeholder="请选择充值方式" style="width: 100%;"
          @change="onRechargeTypeChange">
          <el-option v-for="item in dictStore.bsDicts.fundRechargeType" :key="item.value" :label="item.label"
            :value="item.value" :disabled="item.value !== 'offline'" />
        </el-select>
      </el-form-item>
      <el-form-item label="充值银行卡">
        <el-input readonly v-model="formData.bankCardNumber" />
      </el-form-item>
      <!-- <el-form-item label="入账账户" prop="accountId">
        <el-select v-model="formData.accountId" placeholder="请选择入账账户" style="width: 100%;">
          <el-option
            v-for="item in dictStore.bsDicts.accountType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="充值金额" prop="money">
        <el-input-number v-model="formData.money" :min="1" :max="100000" style="width: 100%;" :precision="2"
          size="large" :controls="false" />
      </el-form-item>
      <el-form-item label="充值说明" prop="remark">
        <el-input v-model="formData.remark" style="width: 100%" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }"
          placeholder="请输入充值说明" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item>
        <el-space>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-space>
      </el-form-item>
    </el-form>
    <offline-recharge ref="offlineRef" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
// import MerchantSelect from '@/components/MerchantSelect';
import useDictStore from '@/store/modules/dict';
import request from '@/utils/request';
// import { useRouter } from 'vue-router';
import OfflineRecharge from './components/OfflineRecharge.vue';

const formRef = ref();
// const router = useRouter();
const dictStore = useDictStore();
const rules = reactive({
  // merchantNum: [{
  //   required: true, message: '请选择商户',trigger: 'blur'
  // }],
  // accountType: [{
  //   required: true, message: '请选择账户类型',trigger: 'blur'
  // }],
  rechargeType: [{
    required: true, message: '请选择充值方式', trigger: 'blur'
  }],
  // accountId: [{
  //   required: true, message: '请选择入账账户',trigger: 'blur'
  // }],
  money: [{
    required: true, message: '请输入充值金额', trigger: 'blur'
  }],
  remark: [{
    required: true, message: '请输入充值说明', trigger: 'blur'
  }],
});
const initial = {
  bankCardId: '',
  rechargeType: '',
  bankCardNumber: '',
  // accountId: '',
  // merchantNum: '',
  // accountType: '',
  money: 1,
  remark: ''
};
const offlineRef = ref();
const offlineAccount = ref();
const formData = ref({ ...initial });
// const onMerchantChange = data => {
//   formData.value.merchantNum = data.merchantNum;
// }
const onReset = () => {
  formData.value = { ...initial };
}
const onSubmit = async () => {
  await formRef.value.validate();
  const res = await request({
    url: '/platform/fund/recharge/v1/add',
    method: 'post',
    data: {
      ...formData.value,
      money: formData.value.money * 100,
    }
  });
  if (formData.value.rechargeType === 'offline') {
    offlineAccount.value = {
      ...offlineAccount.value,
      ...res.data,
      bankTransferMoney: formData.value.money,
      remark: formData.value.remark,
    }
    offlineRef.value?.open(offlineAccount.value);
  }
}
const onRechargeTypeChange = async (v) => {
  if (v === 'offline') {
    const res = await request({
      url: '/platform/fund/recharge/v1/getRechargeAccount',
      method: 'post',
    });
    offlineAccount.value = {
      bankAccountName: res.data.bankAccountName,
      bankCardNumber: res.data.bankCardNumber,
      bankName: res.data.bankName,
    };
    formData.value.bankCardId = res.data.id;
    formData.value.bankCardNumber = res.data.bankCardNumber;
  }
};
</script>