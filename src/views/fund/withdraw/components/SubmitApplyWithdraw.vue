<template>
  <el-button type="primary" v-bind="$props.btnProps" @click="onSubmit">结算</el-button>
</template>

<script setup>
import { showPayPassword } from '@/utils/auth';
import { emitter } from '@/utils';
import request from '@/utils/request';

const props = defineProps({
  btnProps: Object,
  data: Object
});

const onSubmit = () => {
  showPayPassword(async (pwd) => {
    await request({
      url: '/platform/fund/withdraw/v1/withdraw',
      method: 'post',
      data: {
        id: props.data.id,
        payPassword: pwd
      }
    });
    props.data.statusCode = 'success';
    props.data.statusName = '已处理';
    ElMessage.success('您已提交结算');
    emitter.emit('withdraw-list-refresh');
  });
}
</script>