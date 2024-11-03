<template>
  <section class="page-container">
    <query-form @submit="onQuery" ref="qsRef" />
    <div class="py-16">
      <el-space wrap>
        <router-link to="/platform/fund/recharge/apply">
          <el-button type="primary">账户充值</el-button>
        </router-link>
      </el-space>
    </div>
    <el-table :data="tableData" class="recharge-table" border>
      <el-table-column fixed prop="orderCode" label="充值单号" :width="220">
        <template #default="scope">
          <a class="color-primary" @click="showDetail(scope.row)">{{ scope.row.orderCode }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="merchantNum" label="商户编号" :width="220" />
      <el-table-column prop="merchantName" label="商户名称" :width="200" />
      <el-table-column prop="memberName" label="充值用户" :width="200" />
      <el-table-column prop="bankCardNumber" label="银行卡号" :width="200" />
      <el-table-column prop="money" label="充值金额">
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
      <el-table-column prop="remark" label="充值说明" :width="200" />
      <el-table-column prop="statusName" label="充值状态" />
      <el-table-column prop="operation" label="操作" :width="160" fixed="right">
        <template #default="scope">
          <el-space>
            <query-result :btnProps="{ size: 'small' }" v-if="['deal'].includes(scope.row.statusCode)"
              :data="scope.row" />
            <cancel-apply :btnProps="{ size: 'small' }"
              v-if="['create', 'approve', 'deal'].includes(scope.row.statusCode)" :data="scope.row" />
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
import { ref, reactive, shallowRef } from 'vue';
import { formatMoney, emitter } from '@/utils';
import request from '@/utils/request';
import QueryForm from './components/QueryForm.vue';
import DetailDrawer from './components/DetailDrawer.vue';
import CancelApply from './components/CancelApply.vue';
import QueryResult from './components/QueryResult.vue';

const detailDrawerRef = ref(null);
const tableData = ref([]);
const qsRef = ref(null);
const queryData = shallowRef({});
const queryParams = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10
});

const queryList = async () => {
  const res = await request({
    url: '/platform/fund/recharge/v1/pageList',
    method: 'post',
    data: {
      ...queryData.value,
      ...queryParams
    }
  });
  queryParams.total = res.total;
  tableData.value = res.data;
}

const onPagination = ({ page, limit }) => {
  queryParams.pageNum = page;
  queryParams.pageSize = limit;
  queryList();
}

const onQuery = async (data) => {
  queryData.value = data;
  queryList();
}

const showDetail = async (row) => {
  const res = await request({
    url: '/platform/fund/recharge/v1/detail',
    method: 'post',
    data: {
      id: row.id
    }
  });
  detailDrawerRef.value.open(res.data);
}

onMounted(() => {
  emitter.on('recharge-list-refresh', queryList);
  qsRef.value?.onSubmit();
})
</script>

<style lang="scss">
.recharge-table,
.recharge-table .el-table__inner-wrapper {
  height: calc(-278px + 100vh);
}

@media screen and (max-width: 1440px) {

  .recharge-table,
  .recharge-table .el-table__inner-wrapper {
    height: calc(-328px + 100vh);
  }
}
</style>