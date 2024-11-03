<template>
  <el-button type="primary" v-bind="$props.btnProps" @click="onQuery">查询状态</el-button>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import request from '@/utils/request';
import { emitter } from '@/utils';

const props = defineProps({
  btnProps: Object,
  data: Object
});

const onQuery = async () => {
  const res = await request({
    url: '/platform/fund/recharge/v1/queryResult',
    method: 'post',
    data: {
      id: props.data.id,
    }
  });
  props.data.statusCode = res.data.statusCode;
  props.data.statusName = res.data.statusName;
  let em = ElMessage.info;
  if (res.data.statusCode === 'success') {
    em = ElMessage.success;
  } else if (['failed', 'cancel'].includes(res.data.statusCode)) {
    em = ElMessage.error;
  }
  em({
    message: res.data.statusMsg,
    duration: 5000,
  });
  emitter.emit('recharge-list-refresh');
}
</script>