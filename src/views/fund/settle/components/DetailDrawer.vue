<template>
  <el-drawer v-model="visible" title="转账详情" :close-on-click-modal="false" :close-on-press-escape="false" size="70%"
    destroy-on-close>
    <el-form :model="formData" label-suffix=":" inline label-width="9em">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="商户编号">{{ formData?.merchantNum }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商户名称">{{ formData?.merchantName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级商户编号">{{ formData?.sassMerchantNum }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="上级商户名称">{{ formData?.saasMerchantNum }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="转账单号">{{ formData?.orderNum }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="转账类型">{{ dictStore.getBsDict('fundSettleType', formData?.settleType)?.label }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="出账方">{{ formData?.fromMemberName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出账方账户">{{ formData?.fromAccountId }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入账方">{{ formData?.toMemberName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="银行卡号">{{ formData?.toBankCardNumber }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行账户名称">{{ formData?.toBankAccountName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="转账金额">{{ formatMoney(formData?.settleMoney) }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="转账说明">{{ formData?.remark }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手续费承担方">{{ dictStore.getBsDict('feeUndertakeType', formData?.feeUndertakeType)?.label }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="服务费收取方式">{{ dictStore.getBsDict('feeType', formData?.feeType)?.label }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="费率">{{ formData?.feeRate }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手续费金额">{{ formatMoney(formData?.feeMoney) }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="服务费金额">{{ formatMoney(formData?.serviceMoney) }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="实际到账金额">{{ formatMoney(formData?.receiveMoney) }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付方流水号">{{ formData?.outTradeNo }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="转账单状态">{{ formData?.statusName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="状态详细说明">{{ formData?.statusMsg }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建人">{{ formData?.createBy }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">{{ timestampToYMD(formData?.createTime) }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="更新人">{{ formData?.updateBy }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="更新时间">{{ timestampToYMD(formData?.updateTime) }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" v-if="['create', 'approve'].includes(formData?.statusCode)">
          <el-form-item>
            <cancel-apply-settle :data="formData" />
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="['approve'].includes(formData?.statusCode)">
          <el-form-item>
            <approv-apply-settle :data="formData" />
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="['approve'].includes(formData?.statusCode)">
          <el-form-item>
            <eject-apply-settle :data="formData" />
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="['settle'].includes(formData?.statusCode)">
          <el-form-item>
            <submit-apply-settle :data="formData" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { formatMoney, timestampToYMD } from '@/utils';
import CancelApplySettle from './CancelApplySettle.vue';
import ApprovApplySettle from './ApprovApplySettle.vue';
import EjectApplySettle from './EjectApplySettle.vue';
import SubmitApplySettle from './SubmitApplySettle.vue';
import useDictStore from '@/store/modules/dict';

const visible = ref(false);
const formData = ref();
const dictStore = useDictStore();

defineExpose({
  open: (data) => {
    visible.value = true;
    formData.value = data;
  }
})
</script>