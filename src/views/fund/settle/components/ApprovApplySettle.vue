<template>
  <el-button type="primary" v-bind="$props.btnProps" @click="onApprove">通过</el-button>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';
import { showPayPassword } from '@/utils/auth';
import { emitter } from '@/utils';

const props = defineProps({
  btnProps: Object,
  data: Object
});

const onApprove = () => {
  ElMessageBox.confirm(
    '确定要审核通过这条转账申请吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    await request({
      url: '/platform/fund/settle/v1/approved',
      method: 'post',
      data: {
        id: props.data.id,
        reason: '审核通过'
      }
    });
    props.data.statusCode = 'settle';
    props.data.statusName = '结算中';
    emitter.emit('settle-list-refresh');
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
  })
}
</script>