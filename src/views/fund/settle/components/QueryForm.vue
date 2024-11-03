<template>
  <el-form :inline="true" :model="formData" class="divder-border" label-suffix=":">
    <el-form-item label="商户">
      <merchant-select :value="formData.merchantNum" @change="onMerchantChange" />
    </el-form-item>
    <el-form-item label="转账单号">
      <el-input v-model="formData.orderNum" placeholder="请输入转账单号" />
    </el-form-item>
    <el-form-item label="出账方">
      <el-input v-model="formData.fromMemberName" placeholder="请输入出账方名称" />
    </el-form-item>
    <el-form-item label="入账方">
      <el-input v-model="formData.toMemberName" placeholder="请输入入账方名称" />
    </el-form-item>
    <el-form-item label="账户类型">
      <el-select v-model="formData.settleType" placeholder="请选择账户类型" style="width: 150px;">
        <el-option v-for="item in dictStore.bsDicts.fundSettleType" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="转账状态">
      <el-select v-model="formData.statusCode" placeholder="请选择转账状态" style="width: 150px;">
        <el-option v-for="item in dictStore.bsDicts.fundOrderStatus" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import MerchantSelect from '@/components/MerchantSelect';
import useDictStore from '@/store/modules/dict';

const dictStore = useDictStore();
const initial = {
  merchantNum: '',
  orderNum: '',
  fromMemberName: '',
  toMemberName: '',
  settleType: 'account',
  statusCode: '',
};
const formData = ref({ ...initial });

const emit = defineEmits(['submit']);

const onMerchantChange = data => {
  formData.value.merchantNum = data.merchantNum;
}
const onSubmit = () => {
  emit('submit', formData.value);
}

const onReset = () => {
  formData.value.orderNum = '';
  formData.value.fromMemberName = '';
  formData.value.toMemberName = '';
  formData.value.settleType = 'account';
  formData.value.statusCode = '';
  onSubmit();
}

defineExpose({
  onSubmit
})
</script>