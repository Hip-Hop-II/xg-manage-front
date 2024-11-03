import request from '@/utils/request'

// 会员列表查询
export const memberPageList = (query) => {
    return request({
        url: '/platform/member/v1/pageList',
        method: 'post',
        data: query
    })
}
