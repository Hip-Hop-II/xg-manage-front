<template>
  <el-form :inline="true" :model="formInline" class="divder-border" label-suffix=":">
    <el-form-item label="银行名称">
      <el-input v-model="formInline.bankName" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="卡用途类型">
      <el-select v-model="formInline.useType" placeholder="请选择">
        <el-option v-for="item in dictStore.bsDicts.bankCardUseType" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="formInline.statusCode" placeholder="请选择">
        <el-option v-for="item in dictStore.bsDicts.baseStatus" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="银行账号">
      <el-input v-model="formInline.bankCardNumber" type="number" placeholder="请输入" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useDictStore from '@/store/modules/dict';

const dictStore = useDictStore();

const initial = {
  bankName: '',
  useType: '',
  statusCode: '',
  bankCardNumber: ''
}
const formInline = ref({ ...initial })
const emit = defineEmits(['submit'])

const onSubmit = () => {
  emit('submit', formInline.value)
}

const onReset = () => {
  formInline.value = initial
  onSubmit()
}
defineExpose({
  onSubmit
})
</script>

<style scoped>
.el-input,
.el-select {
  width: 150px;
}
</style>
