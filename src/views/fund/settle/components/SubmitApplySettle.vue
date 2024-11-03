<template>
  <el-button type="primary" v-bind="$props.btnProps" @click="onSubmit">结算</el-button>
</template>

<script setup>
import { showPayPassword } from '@/utils/auth';
import request from '@/utils/request';
import { emitter } from '@/utils';

const props = defineProps({
  btnProps: Object,
  data: Object
});

const onSubmit = () => {
  showPayPassword(async (pwd) => {
    await request({
      url: '/platform/fund/settle/v1/settle',
      method: 'post',
      data: {
        id: props.data.id,
        payPassword: pwd,
      }
    });
    props.data.statusCode = 'success';
    props.data.statusName = '已处理';
    ElMessage.success('您已提交结算');
    emitter.emit('settle-list-refresh');
  });
}
</script>