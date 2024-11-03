<template>
  <section class="page-container">
    <QueryForm @submit="onQuery" ref="qsRef"></QueryForm>
    <div class="py-16">
      <el-button type="primary" plain icon="Plus" @click="handleOperation('', '')">新增</el-button>
    </div>
    <el-table :data="tableData" height="calc(-211px + 100vh)" border>
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="memberName" label="会员名称" />
      <el-table-column prop="bankName" label="银行名称" />
      <el-table-column prop="bankOpenName" label="开户行" />
      <el-table-column prop="cardType" label="银行卡类型">
        <template #default="scope">
          <span>{{ BankCardTypeMap[scope.row.cardType] || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="useType" label="卡用途类型">
        <template #default="scope">
          <span>{{ dictStore.bsDictsMap.bankCardUseType[scope.row.useType] || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bankCardNumber" label="银行账号" />
      <el-table-column prop="bankAccountName" label="账户名称" />
      <el-table-column prop="statusName" label="商户状态" />
      <el-table-column prop="defaultCard" label="是否默认转账卡">
        <template #default="scope">
          <!--          <span>{{ YesOrNoMap[scope.row.defaultCard] || '-' }}</span>-->
          <el-switch v-model="scope.row.defaultCard"  @change="defaultCardChange(scope.row.id, $event)"/>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" :width="200" fixed="right" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleOperation(scope.row, 'view')">查看</el-button>
          <el-button link type="primary" icon="Edit" @click="handleOperation(scope.row, 'edit')">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagingTotal > 0" :total="pagingTotal" v-model:page="pagingParams.pageNum"
                v-model:limit="pagingParams.pageSize" @pagination="onPagination"/>
  </section>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted } from 'vue';
import { useRouter } from "vue-router";
import QueryForm from './QueryForm';
import { bankCardPageList, bankCardDefault } from "@/api/merchant/bindCard";
import { timestampToYMD } from '@/utils'
import { BankCardTypeMap, YesOrNoMap } from './data'
import useDictStore from '@/store/modules/dict';
import {ElMessage} from "element-plus";

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

onMounted(() => {
  qsRef.value?.onSubmit();
})

const onQuery = (data) => {
  queryParams.value = data
  getPlatMerchantList()
}

const onPagination = ({ page, limit }) => {
  pagingParams.pageNum = page;
  pagingParams.pageSize = limit;
  getPlatMerchantList();
}

const getPlatMerchantList = () => {
  loading.value = true;
  tableData.value = []
  bankCardPageList({
    ...queryParams.value,
    ...pagingParams
  }).then(res => {
    if (res.code === 200) {
      tableData.value.push(...res.data)
      tableData.value.map(item=>{
        item.id = item.id.toString()
        item.defaultCard = YesOrNoMap[item.defaultCard]
      })
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
    path: '/platform/merchant/bindCard/detail',
    query: {
      id: row.id,
      type: type
    }
  })
}
const defaultCardChange = (id, event) => {
  if(event){
    bankCardDefault({
      id: id
    }).then(res => {
      if (res.code === 200) {
        ElMessage.success(res.msg)
        getPlatMerchantList()
      }
    })
  }
}
</script>
