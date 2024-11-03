<template>
  <section class="page-container">
    <el-form :model="formData" label-width="6em" style="width: 600px;" ref="formRef" :rules="rules">
      <el-form-item label="商户" prop="merchantNum">
        <merchant-select :value="formData.merchantNum" @change="onMerchantChange" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="账户类型" prop="accountType">
        <el-select v-model="formData.accountType" placeholder="请选择账户类型" style="width: 100%;">
          <el-option v-for="item in dictStore.bsDicts.accountType" :key="item.value" :label="item.label"
            :value="item.value" :disabled="item.value === 'self'" />
        </el-select>
      </el-form-item>
      <el-form-item label="提现金额" prop="money">
        <el-input-number v-model="formData.money" :min="1" :max="100000" style="width: 100%;" :precision="2"
          size="large" :controls="false" />
      </el-form-item>
      <el-form-item label="提现说明">
        <el-input v-model="formData.remark" style="width: 100%" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }"
          placeholder="请输入提现说明" maxlength="100" show-word-limit />
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
import { ref } from 'vue';
import MerchantSelect from '@/components/MerchantSelect';
import useDictStore from '@/store/modules/dict';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const formRef = ref();
const router = useRouter();
const dictStore = useDictStore();
const rules = reactive({
  merchantNum: [{
    required: true, message: '请选择商户', trigger: 'blur'
  }],
  accountType: [{
    required: true, message: '请选择账户类型', trigger: 'blur'
  }],
  money: [{
    required: true, message: '请输入提现金额', trigger: 'blur'
  }]
});
const initial = {
  merchantNum: '',
  accountType: '',
  money: 1,
  remark: ''
};
const formData = ref({ ...initial });
const onMerchantChange = data => {
  formData.value.merchantNum = data.merchantNum;
}
const onReset = () => {
  formData.value.accountType = '';
  formData.value.money = 1;
  formData.value.remark = '';
}
const onSubmit = async () => {
  await formRef.value.validate();
  const res = await request({
    url: '/platform/fund/withdraw/v1/add',
    method: 'post',
    data: formData.value
  });
  await request({
    url: '/platform/fund/withdraw/v1/submit',
    method: 'post',
    data: {
      id: res.data.id,
      reason: '创建提现申请'
    }
  });
  ElMessage.success('提现申请已提交');
  onReset();
  router.push('/platform/fund/withdraw/list');
}
</script>