<template>
  <section class="page-container">
    <el-form :model="formData" label-width="8em" style="width: 600px;" ref="formRef" :rules="rules">
      <el-form-item label="入账方" prop="toMemberId">
        <el-select-v2 size="large" v-model="formData.toMemberId" remote filterable :options="toMemberIdoptions"
          :loading="loading" placeholder="请输入入账方名称搜索" :remote-method="debounce({delay: 300}, queryToMemberIds)" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="账户类型" prop="accountType">
        <el-select size="large" v-model="formData.accountType" placeholder="请选择账户类型" style="width: 100%;">
          <el-option
            v-for="item in dictStore.bsDicts.accountType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.value === 'self'"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转账类型" prop="settleType">
        <el-select size="large" :disabled="!formData.toMemberId||!formData.accountType" v-model="formData.settleType" placeholder="请选择转账类型" style="width: 100%;" @change="onSettleTypeChange">
          <el-option
            v-for="item in dictStore.bsDicts.fundSettleType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入账方账户" prop="toAccountId" v-if="formData.settleType === 'account'" :rules="[{
    required: formData.settleType === 'account', message: '请选择入账方账户',trigger: 'blur'
  }]">
        <el-select size="large" v-model="formData.toAccountId" placeholder="请选择入账方账户" style="width: 100%;">
          <el-option
            v-for="item in toAccountIdoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入账方银行卡" prop="bankCardNum" :rules="[{
    required: formData.settleType === 'bank', message: '请选择入账方银行卡',trigger: 'blur'
  }]" v-if="formData.settleType === 'bank'">
        <el-input v-model="formData.bankCardNum" readonly size="large" />
      </el-form-item>
      <el-form-item label="转账金额" prop="settleMoney">
        <el-input-number v-model="formData.settleMoney" :min="1" :max="100000" style="width: 100%;" :precision="2"
          size="large" :controls="false" />
      </el-form-item>
      <el-form-item label="转账说明" prop="remark">
        <el-input v-model="formData.remark" style="width: 100%" type="textarea"
          :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入转账说明" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item>
        <el-space>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-space>
      </el-form-item>
    </el-form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import useDictStore from '@/store/modules/dict';
import request from '@/utils/request';
import { useRouter } from 'vue-router';
import { debounce } from 'radash'

const router = useRouter();
const dictStore = useDictStore();
const initial = {
  settleType: '',
  toMemberId: '',
  toAccountId: '',
  toBankCardId: '',
  bankCardNum: '',
  accountType: '',
  settleMoney: 1,
  remark: ''
};
const formData = ref({ ...initial });
const formRef = ref();
const toMemberIdoptions = ref([])
const toAccountIdoptions = ref([])
const loading = ref(false)
const rules = reactive({
  settleType: [{
    required: true, message: '请选择转账类型',trigger: 'blur'
  }],
  accountType: [{
    required: true, message: '请选择账户类型',trigger: 'blur'
  }],
  toMemberId: [{
    required: true, message: '请选择入账方',trigger: 'blur'
  }],
  settleMoney: [{
    required: true, message: '请输入转账金额',trigger: 'blur'
  }],
  remark: [{
    required: true, message: '请输入转账说明',trigger: 'blur'
  }]
});

const onReset = () => {
  formData.value = {
    ...initial
  }
}

const onSubmit = async () => {
  await formRef.value.validate();
  const res = await request({
    url: '/platform/fund/settle/v1/add',
    method: 'post',
    data: formData.value
  });
  await request({
    url: '/platform/fund/settle/v1/submit',
    method: 'post',
    data: {
      id: res.data.id,
      reason: '创建转账申请'
    }
  });
  ElMessage.success('转账申请已提交');
  onReset();
  router.push('/platform/fund/settle/list');
}

const onSettleTypeChange = async (v) => {
  if (v === 'account') {
    const res = await request({
      url: '/platform/memAcc/v1/pageList',
      method: 'post',
      data: {
        notSearchCount: true,
        statusCode: 'enable',
        accountType: formData.value.accountType,
        memberId: formData.value.toMemberId,
        pageNum: 1,
        pageSize: 10
      }
    });
    toAccountIdoptions.value = res.data.map(item => ({value: item.id, label: dictStore.getBsDict('accountType', item.accountType)?.label || item.outMerchantNo || item.memberName}));
    formData.value.bankCardNum = '';
    formData.value.toBankCardId = '';
  } else if (v === 'bank') {
    const res = await request({
      url: '/platform/merchant/bankCard/v1/pageList',
      method: 'post',
      data: {
        memberId: formData.value.toMemberId,
        notSearchCount: true,
        statusCode: 'success',
        defaultCard: 1,
        useType: 'settle',
        pageNum: 1,
        pageSize: 10
      }
    });
    formData.value.toBankCardId = res.data[0]?.id;
    formData.value.bankCardNum = res.data[0]?.bankCardNumber || res.data[0]?.bankAccountName||res.data[0]?.bankName;
    formData.value.toAccountId = '';
  }
}

const queryToMemberIds = async (merchantName) => {
  if (merchantName !== '') {
    try {
      loading.value = true;
      const res = await request({
        url: '/platform/member/v1/pageList',
        method: 'post',
        headers:{
          skipLoading: true
        },
        data: {
          merchantName,
          pageNum: 1,
          pageSize: 10
        }
      });
      loading.value = false;
      toMemberIdoptions.value = res.data.map(item => ({label: item.merchantName,value: item.id}));
    } catch (error) {
      loading.value = false;
    }
  } else {
    toMemberIdoptions.value = []
  }
}
</script>