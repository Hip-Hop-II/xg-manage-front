<template>
  <section class="page-container">
    <query-form @submit="onQuery" ref="qsRef" />
    <div class="py-16">
      <el-space wrap>
        <router-link to="/platform/fund/withdraw/apply">
          <el-button type="primary">账户提现</el-button>
        </router-link>
      </el-space>
    </div>
    <el-table :data="tableData" class="withdraw-table" border>
      <el-table-column fixed prop="id" label="ID" :width="180">
        <template #default="scope">
          <a class="color-primary" @click="showDetail(scope.row)">{{ scope.row.id }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="提现单号" />
      <el-table-column prop="merchantNum" label="商户编号" :width="220" />
      <el-table-column prop="merchantName" label="商户名称" />
      <el-table-column prop="memberName" label="提现用户" />
      <el-table-column prop="bankCardNumber" label="银行卡号" :width="200" />
      <el-table-column prop="money" label="提现金额">
        <template #default="scope">{{ formatMoney(scope.row.money) }}</template>
      </el-table-column>
      <el-table-column prop="feeMoney" label="手续费">
        <template #default="scope">{{ formatMoney(scope.row.feeMoney) }}</template>
      </el-table-column>
      <el-table-column prop="serviceMoney" label="服务费">
        <template #default="scope">{{ formatMoney(scope.row.serviceMoney) }}</template>
      </el-table-column>
      <el-table-column prop="receiveMoney" label="到账金额">
        <template #default="scope">{{ formatMoney(scope.row.receiveMoney) }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="提现说明" />
      <el-table-column prop="statusName" label="提现状态" />
      <el-table-column prop="operation" label="操作" :width="190" fixed="right">
        <template #default="scope">
          <el-space>
            <cancel-apply-withdraw :btnProps="{ size: 'small' }"
              v-if="['create', 'approve'].includes(scope.row.statusCode)" :data="scope.row" />
            <approv-apply-withdraw :btnProps="{ size: 'small' }" :data="scope.row" v-if="['approve'].includes(scope.row.statusCode)" />
            <eject-apply-withdraw :btnProps="{ size: 'small' }" :data="scope.row" v-if="['approve'].includes(scope.row.statusCode)" />
            <submit-apply-withdraw :btnProps="{ size: 'small' }" :data="scope.row" v-if="['settle'].includes(scope.row.statusCode)" />
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
import { ref, reactive, shallowRef, onBeforeUnmount } from 'vue';
import { formatMoney, emitter } from '@/utils';
import request from '@/utils/request';
import QueryForm from './components/QueryForm.vue';
import DetailDrawer from './components/DetailDrawer.vue';
import CancelApplyWithdraw from './components/CancelApplyWithdraw.vue';
import ApprovApplyWithdraw from './components/ApprovApplyWithdraw.vue';
import EjectApplyWithdraw from './components/EjectApplyWithdraw.vue';
import SubmitApplyWithdraw from './components/SubmitApplyWithdraw.vue';

const detailDrawerRef = ref(null);
const tableData = ref([]);
const qsRef = ref(null);
const queryData = shallowRef({});
const queryParams = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10
});

const queryWithdrawList = async () => {
  const res = await request({
    url: '/platform/fund/withdraw/v1/pageList',
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
  queryWithdrawList();
}

const onQuery = async (data) => {
  queryData.value = data;
  queryWithdrawList();
}

const showDetail = async (row) => {
  const res = await request({
    url: '/platform/fund/withdraw/v1/detail',
    method: 'post',
    data: {
      id: row.id
    }
  });
  detailDrawerRef.value.open(res.data);
}

onMounted(() => {
  emitter.on('withdraw-list-refresh', queryWithdrawList);
  qsRef.value?.onSubmit();
});

onBeforeUnmount(() => {
  emitter.off('withdraw-list-refresh', queryWithdrawList);
});
</script>

<style lang="scss">
.withdraw-table,
.withdraw-table .el-table__inner-wrapper {
  height: calc(-278px + 100vh);
}

@media screen and (max-width: 1440px) {

  .withdraw-table,
  .withdraw-table .el-table__inner-wrapper {
    height: calc(-328px + 100vh);
  }
}
</style>