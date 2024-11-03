import request from '@/utils/request'

// 获取费率列表
export const postMerchantFeeApi = (query) => {
    return request({
        url: '/platform/merchant/fee/v1/pageList',
        method: 'post',
        data: query
    })
}

// 新增费率
export const postAddMerchantFeeApi = (query) => {
    return request({
        url: '/platform/merchant/fee/v1/add',
        method: 'post',
        data: query
    })
}

// 修改费率
export const postUpdateMerchantFeeApi = (query) => {
    return request({
        url: '/platform/merchant/fee/v1/update',
        method: 'post',
        data: query
    })
}

// 获取商户费率查看列表
export const postMerchantFeeViewApi = (query) => {
    return request({
        url: '/platform/merchant/fee/v1/pageList',
        method: 'post',
        data: query
    })
}
