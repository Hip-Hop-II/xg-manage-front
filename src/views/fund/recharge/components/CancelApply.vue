<template>
  <el-button type="danger" v-bind="$props.btnProps" @click="onCancel">撤销</el-button>
</template>

<script setup>
import { ElMessage, ElMessageBox, ElInput } from 'element-plus';
import request from '@/utils/request';
import { emitter } from '@/utils';
import { ref } from 'vue';

const props = defineProps({
  btnProps: Object,
  data: Object
});
const reason = ref('');
const onCancel = () => {
  ElMessageBox({
    title: '充值撤销',
    message: () =>
      h(ElInput, {
        modelValue: reason.value,
        'onUpdate:modelValue': (val) => {
          reason.value = val
        },
        type: 'textarea',
        placeholder: '请输入充值撤销说明',
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
    customClass: 'cancel-recharge-msg-box'
  }).then(async () => {
    await request({
      url: '/platform/fund/recharge/v1/cancel',
      method: 'post',
      data: {
        id: props.data.id,
        remark: reason.value
      }
    });
    props.data.statusCode = 'cancel';
    props.data.statusName = '已撤销';
    ElMessage.success('您已成功撤销本次充值');
    emitter.emit('recharge-list-refresh');
  })
}
</script>

<style lang="scss">
.cancel-recharge-msg-box {
  .el-message-box__message {
    width: 100%;
  }
}
</style>