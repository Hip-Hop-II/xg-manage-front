import request from '@/utils/request'

// 银行卡列表查询
export const bankCardPageList = (query) => {
    return request({
        url: '/platform/merchant/bankCard/v1/pageList',
        method: 'post',
        data: query
    })
}

// 银行卡暂存
export const bankCardSave = (query) => {
    return request({
        url: '/platform/merchant/bankCard/v1/bankCardAdd',
        method: 'post',
        data: query
    })
}

// 银行卡新增
export const bankCardApply = (query) => {
    return request({
        url: '/platform/merchant/bankCard/v1/bankCardApply',
        method: 'post',
        data: query
    })
}

// 银行卡编辑
export const bankCardUpdate = (query) => {
    return request({
        url: '/platform/merchant/bankCard/v1/bankCardUpdate',
        method: 'post',
        data: query
    })
}

// 设置默认卡
export const bankCardDefault = (query) => {
    return request({
        url: '/platform/merchant/bankCard/v1/bankCardDefault',
        method: 'post',
        data: query
    })
}

// 银行卡新增
export const rechargeBankCardAdd = (query) => {
  return request({
      url: '/platform/merchant/bankCard/v1/rechargeBankCardAdd',
      method: 'post',
      data: query
  })
}

// 银行卡详情
export const bankCardDetail = (query) => {
  return request({
      url: '/platform/merchant/bankCard/v1/bankCardDetail',
      method: 'post',
      data: query
  })
}

// 银行卡审核
export const bankCardAudit = (query) => {
  return request({
      url: '/platform/merchant/bankCard/v1/bankCardStatus',
      method: 'post',
      data: query
  })
}
