<template>
  <el-button type="danger" v-bind="$props.btnProps" @click="onCancel">撤销</el-button>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';
import { emitter } from '@/utils';

const props = defineProps({
  btnProps: Object,
  data: Object
});
const reason = ref('');
const onCancel = () => {
  ElMessageBox({
    title: '提现申请撤销',
    message: () =>
      h(ElInput, {
        modelValue: reason.value,
        'onUpdate:modelValue': (val) => {
          reason.value = val
        },
        type: 'textarea',
        placeholder: '请输入提现申请撤销说明',
        style: {
          width: '100%'
        },
        maxlength: 100,
        showWordLimit: true,
        autosize: {
          minRows: 4,
          maxRows: 6
        }
      }),
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消',
    customClass: 'cancel-withdraw-msg-box'
  }).then(async () => {
    await request({
    url: '/platform/fund/withdraw/v1/cancel',
    method: 'post',
    data: {
      id: props.data.id,
      reason: reason.value
    }
  });
    props.data.statusCode = 'cancel';
    props.data.statusName = '已撤销';
    ElMessage.success('您已成功撤销该条提现申请');
    emitter.emit('withdraw-list-refresh');
  })
}
</script>

<style lang="scss">
.cancel-withdraw-msg-box {
  .el-message-box__message {
    width: 100%;
  }
}
</style>