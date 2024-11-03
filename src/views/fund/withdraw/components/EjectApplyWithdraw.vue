<template>
  <el-button type="danger" v-bind="$props.btnProps" @click="onEject">驳回</el-button>
</template>

<script setup>
import { ElInput, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import request from '@/utils/request';
import { emitter } from '@/utils';

const props = defineProps({
  btnProps: Object,
  data: Object
});

const reason = ref('');

const onEject = () => {
  ElMessageBox({
    title: '提现申请驳回',
    message: () =>
      h(ElInput, {
        modelValue: reason.value,
        'onUpdate:modelValue': (val) => {
          reason.value = val
        },
        type: 'textarea',
        placeholder: '请输入提现驳回说明',
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
    customClass: 'eject-withdraw-msg-box'
  }).then(async () => {
    await request({
      url: '/platform/fund/withdraw/v1/failed',
      method: 'post',
      data: {
        id: props.data.id,
        reason: reason.value
      }
    });
    props.data.statusCode = 'failed';
    props.data.statusName = '失败';
    emitter.emit('withdraw-list-refresh');
  }).catch(() => {
    console.log('cancel');
  })
}
</script>

<style lang="scss">
.eject-withdraw-msg-box {
  .el-message-box__message {
    width: 100%;
  }
}
</style>