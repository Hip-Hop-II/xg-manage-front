<template>
  <el-dialog v-model="visible" title="线下转账" width="500" destroy-on-close :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form :model="offlineData" label-suffix=":" class="offline-form">
      <el-form-item label="本次汇款转账码">
        <b style="font-size: 30px;">{{ offlineData?.bankTransferCode }}</b>
      </el-form-item>
      <p style="font-size: 12px;">注意：<span style="color: red;">*请在线下转账附言中填写此码</span></p>
      <el-form-item label="收款名称">
        {{ offlineData?.bankAccountName }}
      </el-form-item>
      <el-form-item label="收款账号">
        {{ offlineData?.bankCardNumber }}
      </el-form-item>
      <el-form-item label="开户银行">
        {{ offlineData?.bankName }}
      </el-form-item>
      <el-form-item label="充值金额">
        {{ offlineData?.bankTransferMoney }}元
      </el-form-item>
      <el-form-item label="充值说明">
        {{ offlineData?.remark }}
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消汇款</el-button>
        <el-button type="primary" @click="onComplete">
          汇款完成
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="js">
import { defineExpose, ref } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const visible = ref(false);
const offlineData = ref();
defineExpose({
  open(data) {
    visible.value = true;
    offlineData.value = data;
  }
});
const onComplete = async () => {
  const res = await request({
    url: '/platform/fund/recharge/v1/queryResult',
    method: 'post',
    data: {
      id: offlineData.value.rechargeId,
    }
  });
  visible.value = !['success', 'failed', 'cancel'].includes(res.data.statusCode);
  let em = ElMessage.info;
  if (res.data.statusCode === 'success') {
    em = ElMessage.success;
  } else if (['failed', 'cancel'].includes(res.data.statusCode)) {
    em = ElMessage.error;
  }
  em({
    message: res.data.statusMsg || res.data.statusName,
    duration: 5000,
  });
};
const onCancel = async () => {
  await request({
    url: '/platform/fund/recharge/v1/cancel',
    method: 'post',
    data: {
      id: offlineData.value.rechargeId,
    }
  });
  ElMessage.success({
    message: '您已取消充值',
    duration: 5000,
  });
  visible.value = false;
};
</script>

<style lang="scss" scoped>
.offline-form {
  :deep(.el-form-item--default) {
    margin-bottom: 0;
  }
}
</style>