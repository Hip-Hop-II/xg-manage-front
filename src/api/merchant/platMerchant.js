import request from '@/utils/request'

// 获取商户列表
export const postPlatMerchantApi = (query) => {
    return request({
        url: '/saas/merchant/platMerchant/v1/pageList',
        method: 'post',
        data: query
    })
}

// 新增商户
export const postAddPlatMerchantApi = (query) => {
    return request({
        url: '/saas/merchant/platMerchant/v1/merchantAdd',
        method: 'post',
        data: query
    })
}

// 商户暂存
export const postPlatMerchantSaveApi = (query) => {
    return request({
        url: '/saas/merchant/platMerchant/v1/merchantSave',
        method: 'post',
        data: query
    })
}

// 平台商户详情
export const postDetailPlatMerchantApi = (query) => {
    return request({
        url: '/saas/merchant/platMerchant/v1/detail',
        method: 'post',
        data: query
    })
}

// 商户详情
export const postPlatMerchantDetailApi = (query) => {
    return request({
        url: '/platform/merchant/platMerchant/v1/detail',
        method: 'post',
        data: query
    })
}

// 获取子商户列表
export const postSubMerchantApi = (query) => {
    return request({
        url: '/platform/merchant/subMerchant/v1/pageList',
        method: 'post',
        data: query
    })
}

// 新增子商户
export const postAddSubMerchantApi = (query) => {
    return request({
        url: '/platform/merchant/subMerchant/v1/merchantAdd',
        method: 'post',
        data: query
    })
}

// 子商户暂存
export const postSubMerchantSaveApi = (query) => {
    return request({
        url: '/platform/merchant/subMerchant/v1/merchantSave',
        method: 'post',
        data: query
    })
}

// 子商户详情
export const postDetailSubMerchantApi = (query) => {
    return request({
        url: '/platform/merchant/subMerchant/v1/detail',
        method: 'post',
        data: query
    })
}

// 获取子商户列表
export const postSassSubMerchantApi = (query) => {
    return request({
        url: '/platform/merchant/subMerchant/v1/pageList',
        method: 'post',
        data: query
    })
}

// 子商户详情
export const postSaasDetailSubMerchantApi = (query) => {
    return request({
        url: '/platform/merchant/subMerchant/v1/detail',
        method: 'post',
        data: query
    })
}
