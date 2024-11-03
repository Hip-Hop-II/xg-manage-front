<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>

<style lang='scss'>
.page-container {
  padding: 16px;
}

.mb-10 {
  margin-bottom: 10px;
}

.pt-16 {
  padding-top: 16px;
}

.pb-16 {
  padding-bottom: 16px;
}

.py-16 {
  padding: 16px 0;
}

.divder-border {
  border-bottom: 1px solid var(--el-border-color);
}

.color-primary {
  color: var(--el-color-primary);
}

.el-form .el-form-item__label {
  font-weight: normal;
}

.global-loading {
  .el-loading-spinner {
    .path {
      stroke: #fff;
    }

    .el-loading-text {
      color: #fff;
    }
  }
}
</style>