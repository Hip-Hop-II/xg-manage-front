<template>
  <section class="page-container">
    <query-form @submit="onQuery" ref="qsRef"/>
    <div class="py-16">
      <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleOperation('', '')"
      >新增</el-button>
    </div>
    <el-table :data="tableData" :loading="loading" class="withdraw-table" border>
      <el-table-column type="index" width="80" label="序号"/>
      <el-table-column v-for="item in tableProps"
                       :key="item.key"
                       :prop="item.prop"
                       :label="item.label"
                       :min-width="item.width">
        <template #default="scope">
          <div v-if="item.prop === 'platformRole'">平台商</div>
          <div v-if="item.prop === 'collaborateStartDate'">
            {{timestampToYMD(scope.row.collaborateStartDate)}}
          </div>
          <div v-if="item.prop === 'collaborateEndDate'">
            {{timestampToYMD(scope.row.collaborateEndDate)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" :width="160" fixed="right" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleOperation(scope.row, 'view')">查看</el-button>
<!--          <el-button link type="primary" icon="Edit" @click="handleOperation(scope.row, 'edit')">修改</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagingTotal > 0" :total="pagingTotal" v-model:page="pagingParams.pageNum"
                v-model:limit="pagingParams.pageSize" @pagination="onPagination"/>
  </section>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted } from 'vue';
import QueryForm from './components/QueryForm';
import { useRouter } from "vue-router";
import { postPlatMerchantApi } from "@/api/merchant/platMerchant";
import {timestampToYMD} from '@/utils'

const router = useRouter()
const pagingParams = reactive({
  pageNum: 1,
  pageSize: 10
})
const pagingTotal = ref(0)

const tableProps = [
  {key: 'merchantNum', prop: 'merchantNum', label: '商户编号', width: 180},
  {key: 'merchantName', prop: 'merchantName', label: '商户名称', width: 150},
  {key: 'merchantShortName', prop: 'merchantShortName', label: '商户简称', width: 200},
  {key: 'platformRole', prop: 'platformRole', label: '平台角色'},
  {key: 'lawPersonName', prop: 'lawPersonName', label: '法人名称'},
  {key: 'lawPersonTelephone', prop: 'lawPersonTelephone', label: '法人联系电话', width: 150},
  {key: 'collaborateStartDate', prop: 'collaborateStartDate', label: '合作开始时间', width: 200},
  {key: 'collaborateEndDate', prop: 'collaborateEndDate', label: '合作结束时间', width: 200},
  {key: 'statusName', prop: 'statusName', label: '状态'}
]
const tableData = ref([])
const loading = ref(false)
const qsRef = ref(null)
const queryParams = shallowRef({})

onMounted(() => {
  qsRef.value?.onSubmit();
})

const onQuery = (data) => {
  queryParams.value = data
  getPlatMerchantList()
}

const onPagination = ({page, limit}) => {
  pagingParams.pageNum = page;
  pagingParams.pageSize = limit;
  getPlatMerchantList();
}

const getPlatMerchantList = () => {
  loading.value = true;
  tableData.value = []
  postPlatMerchantApi({
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

const handleOperation = (row, type) => {
  router.push({
    path: '/saas/merchant/platMerchant/detail',
    query: {
      id: row.merchantNum && JSON.parse(row.merchantNum),
      type: type
    }
  })
}
</script>
