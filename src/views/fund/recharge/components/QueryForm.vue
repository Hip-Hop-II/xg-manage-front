<template>
  <el-form :inline="true" :model="formData" class="divder-border" label-suffix=":">
    <el-form-item label="商户">
      <merchant-select :value="formData.merchantNum" @change="onMerchantChange" />
    </el-form-item>
    <el-form-item label="充值单号">
      <el-input v-model="formData.orderNum" placeholder="请输入充值单号" />
    </el-form-item>
    <el-form-item label="会员名称">
      <el-input v-model="formData.memberName" placeholder="请输入会员名称" />
    </el-form-item>
    <el-form-item label="充值状态">
      <el-select v-model="formData.statusCode" placeholder="请选择充值状态" style="width: 150px;">
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
  memberName: '',
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
  formData.value.memberName = '';
  formData.value.statusCode = '';
  onSubmit();
}

defineExpose({
  onSubmit
})
</script>