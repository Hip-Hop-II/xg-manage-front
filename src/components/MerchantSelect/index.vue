<template>
  <el-select v-model="model" @change="onChange" placeholder="请选择商户" v-bind="$props">
    <el-option v-for="item in userStore.merchants" :key="item.merchantNum" :label="item.merchantName"
      :value="item.merchantNum" />
  </el-select>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import useUserStore from '../../store/modules/user';

const userStore = useUserStore();
const emit = defineEmits(['change']);
const props = defineProps({
  value: [Number, String],
  style: {
    type: Object,
    default: {
      width: '150px'
    }
  }
})
const model = ref(props.value);
const onChange = v => {
  emit('change', userStore.merchants.find(m => m.merchantNum === v));
}
onMounted(() => {
  if (userStore.merchants.length === 1) {
    emit('change', userStore.merchants[0]);
  }
})
</script>