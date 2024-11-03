<template>
  <el-form :inline="true" :model="formInline" class="divder-border" label-suffix=":">
    <el-form-item label="商户名称">
      <el-input v-model="formInline.merchantName" placeholder="请输入"/>
    </el-form-item>
    <el-form-item label="商户类型">
      <el-select v-model="formInline.merchantType" placeholder="请选择">
        <el-option v-for="item in dictStore.bsDicts.merchantType"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="平台角色">
      <el-select v-model="formInline.platformRole" placeholder="请选择">
        <el-option v-for="item in platformRoleList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="服务角色">
      <el-select v-model="formInline.subMerchantRole" placeholder="请选择">
        <el-option v-for="item in subMerchantRoleList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="规则类型">
      <el-select v-model="formInline.ruleType" placeholder="请选择">
        <el-option v-for="item in dictStore.bsDicts.settleRuleType"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="formInline.statusCode" placeholder="请选择">
        <el-option v-for="item in dictStore.bsDicts.baseStatus"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="创建时间">
      <el-date-picker
          v-model="createTime"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD"
          value-format="x"
          style="width: 300px"
      />
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
import useDictStore from '@/store/modules/dict';

const dictStore = useDictStore();

const initial = {
  merchantNum: '',
  merchantName: '',
  merchantType: '',
  statusCode: '',
  createTimeBegin: '',
  createTimeEnd: '',
  platformMerchantNum: 0,
  platformRole: "",
  subMerchantRole: ""
}
const createTime = ref('')
const formInline = ref({ ...initial })
const emit = defineEmits(['submit'])
const platformRoleList = [
  {value: 'saas', label: '服务商'},
  {value: 'platform', label: '平台商'},
  {value: 'subMerchant', label: '子商户'}
]
const subMerchantRoleList = [
  {value: 'supply', label: '供应商'},
  {value: 'channel', label: '渠道商'},
  {value: 'technical', label: '技术服务商'}
]

const onSubmit = () => {
  if(createTime.value>0){
    initial.createTimeBegin = createTime.value[0]
    initial.createTimeEnd = createTime.value[1]
  }else {
    initial.createTimeBegin = ''
    initial.createTimeEnd = ''
  }
  emit('submit', formInline.value)
}

const onReset = () => {
  createTime.value = ''
  formInline.value = initial
  onSubmit()
}
defineExpose({
  onSubmit
})
</script>
<style scoped>
.el-input, .el-select {
  width: 150px;
}
</style>
