<template>
  <section class="page-container">
    <query-form @submit="onQuery" ref="qsRef" />
    <div class="py-16">
      <el-space wrap>
        <router-link to="/platform/fund/settle/apply">
          <el-button type="primary">账户转账</el-button>
        </router-link>
      </el-space>
    </div>
    <el-table :data="tableData" border class="settle-table">
      <el-table-column fixed prop="id" label="ID" :width="220">
        <template #default="scope">
          <a class="color-primary" @click="showDetail(scope.row)">{{ scope.row.id }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="转账单号" :width="220" />
      <el-table-column prop="merchantNum" label="商户编号" :width="220" />
      <el-table-column prop="merchantName" label="商户名称" :width="220" />
      <el-table-column prop="fromMemberName" label="出账方" :width="220" />
      <el-table-column prop="toMemberName" label="入账方" :width="220" />
      <el-table-column prop="toBankAccountName" label="银行账户名" :width="220" />
      <el-table-column prop="toBankCardNumber" label="银行卡号" :width="220" />
      <el-table-column prop="settleMoney" label="转账金额" :width="120">
        <template #default="scope">{{ formatMoney(scope.row.settleMoney) }}</template>
      </el-table-column>
      <el-table-column prop="feeMoney" label="手续费" :width="120">
        <template #default="scope">{{ formatMoney(scope.row.feeMoney) }}</template>
      </el-table-column>
      <el-table-column prop="serviceMoney" label="服务费" :width="120">
        <template #default="scope">{{ formatMoney(scope.row.serviceMoney) }}</template>
      </el-table-column>
      <el-table-column prop="receiveMoney" label="到账金额" :width="120">
        <template #default="scope">{{ formatMoney(scope.row.receiveMoney) }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="转账说明" :width="220" />
      <el-table-column prop="statusName" label="转账状态" />
      <el-table-column prop="operation" label="操作" :width="190" fixed="right">
        <template #default="scope">
          <el-space>
            <cancel-apply-settle :btnProps="{ size: 'small' }"
              v-if="['create', 'approve'].includes(scope.row.statusCode)" />
            <approv-apply-settle :btnProps="{ size: 'small' }" v-if="['approve'].includes(scope.row.statusCode)" />
            <eject-apply-settle :btnProps="{ size: 'small' }" v-if="['approve'].includes(scope.row.statusCode)" />
            <submit-apply-settle :btnProps="{ size: 'small' }" v-if="['settle'].includes(scope.row.statusCode)" />
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="queryParams.total > 0" :total="queryParams.total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="onPagination" />
    <detail-drawer ref="detailDrawerRef" />
  </section>
</template>

<script setup>
import { ref, reactive, onMounted,shallowRef, onBeforeUnmount } from 'vue';
import { formatMoney, emitter } from '@/utils';
import request from '@/utils/request';
import QueryForm from './components/QueryForm.vue';
import DetailDrawer from './components/DetailDrawer.vue';
import CancelApplySettle from './components/CancelApplySettle.vue';
import ApprovApplySettle from './components/ApprovApplySettle.vue';
import EjectApplySettle from './components/EjectApplySettle.vue';
import SubmitApplySettle from './components/SubmitApplySettle.vue';

const detailDrawerRef = ref(null);
const tableData = ref([]);
const queryData = shallowRef({});
const qsRef = ref(null);

const queryParams = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10
});

const querySettleList = async () => {
  const res = await request({
    url: '/platform/fund/settle/v1/pageList',
    method: 'post',
    data: {
      ...queryData.value,
      ...queryParams
    }
  });
  queryParams.total = res.total;
  tableData.value = res.data;
}

const onPagination = ({page, limit}) => {
  queryParams.pageNum = page;
  queryParams.pageSize = limit;
  querySettleList();
}

const onQuery = async (data) => {
  queryData.value = data;
  querySettleList();
}

const showDetail = async (row) => {
  const res = await request({
    url: '/platform/fund/settle/v1/detail',
    method: 'post',
    data: {
      id: row.id
    }
  });
  detailDrawerRef.value.open(res.data);
}
onMounted(() => {
  emitter.on('settle-list-refresh', querySettleList);
  qsRef.value?.onSubmit();
});
onBeforeUnmount(() => {
  emitter.off('settle-list-refresh', querySettleList);
});
</script>

<style lang="scss">
.settle-table,
.settle-table .el-table__inner-wrapper {
  height: calc(-328px + 100vh);
}

@media screen and (max-width: 1180px) {

  .settle-table,
  .settle-table .el-table__inner-wrapper {
    height: calc(-378px + 100vh);
  }
}
</style>