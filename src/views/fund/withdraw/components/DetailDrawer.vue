<template>
  <el-drawer v-model="visible" title="提现详情" :close-on-click-modal="false" :close-on-press-escape="false" size="70%"
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
          <el-form-item label="提现单号">{{ formData?.orderNum }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户ID">{{ formData?.memberId }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="用户名称">{{ formData?.memberName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出账方账户">{{ formData?.accountId }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入账方银行卡ID">{{ formData?.bankCardId }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="银行卡号">{{ formData?.bankCardNumber }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行账户名称">{{ formData?.bankAccountName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提现金额">{{ formatMoney(formData?.money) }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="提现说明">{{ formData?.remark }}</el-form-item>
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
          <el-form-item label="到账周期">{{ formData?.withdrawCycle }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="服务费金额">{{ formatMoney(formData?.serviceMoney) }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际到账金额">{{ formatMoney(formData?.receiveMoney) }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付方流水号">{{ formData?.outTradeNo }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="提现单状态">{{ formData?.statusName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态详细说明">{{ formData?.statusMsg }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建人">{{ formData?.createBy }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="创建时间">{{ timestampToYMD(formData?.createTime) }}</el-form-item>
        </el-col>
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
            <cancel-apply-withdraw :data="formData" />
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="['approve'].includes(formData?.statusCode)">
          <el-form-item>
            <approv-apply-withdraw :data="formData" />
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="['approve'].includes(formData?.statusCode)">
          <el-form-item>
            <eject-apply-withdraw :data="formData" />
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="['settle'].includes(formData?.statusCode)">
          <el-form-item>
            <submit-apply-withdraw :data="formData" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { formatMoney, timestampToYMD } from '@/utils';
import CancelApplyWithdraw from './CancelApplyWithdraw.vue';
import ApprovApplyWithdraw from './ApprovApplyWithdraw.vue';
import EjectApplyWithdraw from './EjectApplyWithdraw.vue';
import SubmitApplyWithdraw from './SubmitApplyWithdraw.vue';
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