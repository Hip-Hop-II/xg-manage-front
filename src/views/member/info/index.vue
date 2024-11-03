<template>
  <section class="page-container">
    <QueryForm @submit="onQuery" ref="qsRef"></QueryForm>
    <div class="py-16">
      <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleOperation('', '')"
      >新增</el-button>
    </div>
    <el-table :data="tableData" height="calc(-211px + 100vh)" border>
      <el-table-column type="index" width="80" label="序号"/>
      <el-table-column prop="merchantNum" label="商户编号" />
      <el-table-column prop="merchantName" label="商户名称" />
      <el-table-column prop="memberName" label="会员名称" />
      <el-table-column prop="memberType" label="会员类型" />
      <el-table-column prop="memberCode" label="会员编号" />
      <el-table-column prop="loginName" label="登录用户名" />
      <el-table-column prop="telephone" label="手机号" />
      <el-table-column prop="statusName" label="商户状态" />
    </el-table>
    <pagination v-show="pagingTotal > 0" :total="pagingTotal" v-model:page="pagingParams.pageNum"
                v-model:limit="pagingParams.pageSize" @pagination="onPagination"/>
  </section>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted } from 'vue';
import { useRouter } from "vue-router";
import QueryForm from './QueryForm';
import { memberPageList } from "@/api/member/index";
import {timestampToYMD} from '@/utils'

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
  memberPageList({
    ...queryParams.value,
    ...pagingParams
  }).then(res => {
    if(res.code === 200){
      tableData.value.push(...res.data)
      pagingTotal.value = res.total
    } else {
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

