<template>
  <section class="page-container">
    <query-form-page @submit="onQuery" ref="qsRef"/>
    <el-table :data="tableData" :loading="loading" class="withdraw-table" border>
      <el-table-column type="index" width="80" label="序号"/>
      <el-table-column v-for="item in tableProps"
                       :key="item.key"
                       :prop="item.prop"
                       :label="item.label"
                       :min-width="item.width">
        <template #default="scope">
          <div v-if="item.prop === 'ruleType'">
            {{dictStore.bsDictsMap.settleRuleType[scope.row.ruleType]}}
          </div>
          <div v-if="item.prop === 'feeUndertakeType'">
            {{dictStore.bsDictsMap.feeUndertakeType[scope.row.feeUndertakeType]}}
          </div>
          <div v-if="item.prop === 'feeType'">
            {{dictStore.bsDictsMap.feeType[scope.row.feeType]}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagingTotal > 0" :total="pagingTotal" v-model:page="pagingParams.pageNum"
                v-model:limit="pagingParams.pageSize" @pagination="onPagination"/>
  </section>
</template>

<script setup>
import {ref, reactive, shallowRef, onMounted} from 'vue';
import QueryFormPage from './components/QueryFormPage.vue';
import { useRouter } from "vue-router";
import { postMerchantFeeViewApi } from "@/api/merchant/merchantFee";
import useDictStore from '@/store/modules/dict';

const dictStore = useDictStore();
const router = useRouter()
const pagingParams = reactive({
  pageNum: 1,
  pageSize: 10
})
const pagingTotal = ref(0)
const tableData = ref([])
const loading = ref(false)
const qsRef = ref(null)
const queryParams = shallowRef({})
const tableProps = [
  {key: 'merchantNum', prop: 'merchantNum', label: '商户编号', width: 220},
  {key: 'merchantName', prop: 'merchantName', label: '商户名称'},
  {key: 'ruleType', prop: 'ruleType', label: '规则类型'},
  {key: 'feeUndertakeType', prop: 'feeUndertakeType', label: '手续费承担方'},
  {key: 'feeType', prop: 'feeType', label: '服务费收取方式'},
  {key: 'feeRate', prop: 'feeRate', label: '费率'},
  {key: 'statusName', prop: 'statusName', label: '状态'}
]
onMounted(() => {
  qsRef.value?.onSubmit();
})

const onQuery = (data) => {
  queryParams.value = data
  getMerchantFeeViewList()
}

const onPagination = ({page, limit}) => {
  pagingParams.pageNum = page;
  pagingParams.pageSize = limit;
  getMerchantFeeViewList();
}

const getMerchantFeeViewList = () => {
  loading.value = true;
  tableData.value = []
  postMerchantFeeViewApi({
    ...queryParams.value,
    ...pagingParams
  }).then(res => {
    if(res.code === 200){
      tableData.value.push(...res.data)
      pagingTotal.value = res.total
    }else {
      tableData.value = []
      pagingTotal.value = 0
    }
    loading.value = false
  })
}
</script>
