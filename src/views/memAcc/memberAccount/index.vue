<template>
  <section class="page-container">
    <query-form @submit="onQuery" ref="qsRef" />
    <div class="py-16">
      <el-space wrap>
        <router-link to="/platform/fund/recharge/apply">
          <el-button type="primary">账户充值</el-button>
        </router-link>
        <router-link to="/platform/fund/withdraw/apply">
          <el-button type="primary">账户提现</el-button>
        </router-link>
        <router-link to="/platform/fund/settle/apply">
          <el-button type="primary">账户转出</el-button>
        </router-link>
      </el-space>
    </div>
    <el-table :data="tableData" class="member-account-table" border>
      <el-table-column prop="merchantNum" label="商户编号" :width="220" />
      <el-table-column prop="merchantName" label="商户名称" />
      <el-table-column prop="memberCode" label="会员编号" />
      <el-table-column prop="memberName" label="会员名称" :width="200" />
      <el-table-column prop="accountType" label="账户类型">
        <template #default="scope">{{dictStore.getBsDict('accountType', scope.row.accountType)?.label}}</template>
      </el-table-column>
      <el-table-column prop="avaliable" label="可用金额">
        <template #default="scope">{{ formatMoney(scope.row.avaliable) }}</template>
      </el-table-column>
      <el-table-column prop="freeze" label="冻结金额">
        <template #default="scope">{{ formatMoney(scope.row.freeze) }}</template>
      </el-table-column>
      <el-table-column prop="outMerchantNo" label="支付公司商户号" />
      <el-table-column prop="statusName" label="会员状态" />
    </el-table>
    <pagination v-show="queryParams.total > 0" :total="queryParams.total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="onPagination" />
  </section>
</template>

<script setup>
import { reactive, ref, onMounted, shallowRef } from 'vue';
import QueryForm from './QueryForm.vue';
import { formatMoney } from '@/utils';
import request from '@/utils/request';
import useDictStore from '@/store/modules/dict';

const tableData = ref([]);
const queryData = shallowRef({});
const queryParams = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10
});
const qsRef = ref(null);
const dictStore = useDictStore();

const queryList = async () => {
  const res = await request({
    url: '/platform/memAcc/v1/pageList',
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
  queryList();
}
const onQuery = async (data) => {
  queryData.value = data;
  queryList();
}

onMounted(() => {
  qsRef.value?.onSubmit();
})
</script>

<style lang="scss">
.member-account-table,
.member-account-table .el-table__inner-wrapper {
  height: calc(-310px + 100vh);
}

@media screen and (max-width: 1200px) {

  .member-account-table,
  .member-account-table .el-table__inner-wrapper {
    height: calc(-360px + 100vh);
  }
}
</style>