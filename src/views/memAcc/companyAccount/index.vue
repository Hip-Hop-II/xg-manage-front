<template>
  <section class="page-container">
    <div class="pb-16">
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
    <el-table :data="tableData" height="calc(-211px + 100vh)" border>
      <el-table-column prop="merchantNum" label="商户编号" :width="220" />
      <el-table-column prop="merchantName" label="商户名称" />
      <el-table-column prop="saasMerchantNum" label="服务商编号" :width="220" />
      <el-table-column prop="saasMerchantName" label="服务商名称" />
      <el-table-column prop="memberCode" label="会员编号" />
      <el-table-column prop="memberName" label="会员名称" :width="200" />
      <el-table-column prop="accountType" label="账户类型">
        <template #default="scope">{{dictStore.getBsDict('accountType', scope.row.accountType)?.label}}</template>
      </el-table-column>
      <el-table-column prop="available" label="可用金额">
        <template #default="scope">{{ formatMoney(scope.row.available) }}</template>
      </el-table-column>
      <el-table-column prop="freeze" label="冻结金额">
        <template #default="scope">{{ formatMoney(scope.row.freeze) }}</template>
      </el-table-column>
      <el-table-column prop="outMerchantNo" label="支付公司商户号" />
      <el-table-column prop="statusName" label="企业状态" />
    </el-table>
  </section>
</template>

<script setup>
import { formatMoney } from '@/utils';
import request from '@/utils/request';
import { onMounted } from 'vue';
import useDictStore from '@/store/modules/dict';

const tableData = ref([]);
const dictStore = useDictStore();

onMounted(async () => {
  const res = await request({
    url: '/platform/memAcc/v1/currAcc',
    method: 'post',
  });
  tableData.value = res.data;
})
</script>