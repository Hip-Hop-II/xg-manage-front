export const useTypeList = [
    {label: '充值', value: 'recharge'},
    {label: '转账', value: 'settle'},
    {label: '提现', value: 'withdraw'},
]

export const BankCardTypeList = [
    {label: '借记卡', value: 'debit'},
    {label: '信用卡', value: 'credit'},
]

export const BankCardTypeMap = {
    debit: '借记卡',
    credit: '信用卡',
}

export const YesOrNoEnums = [
    {label: '否', value: 0},
    {label: '是', value: 1},
]

export const YesOrNoMap = {
    0: false,
    1: true
}

export const formRules = {
    memberId: [{ required: true, message: '请选择会员', trigger: 'change' }],
    contractUserName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
    bankAccountName: [{ required: true, message: '请输入银行账号名称', trigger: 'blur' }],
    bankCardNumber: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
    bankCode: [{ required: true, message: '请选择银行', trigger: 'change' }],
    useType: [{ required: true, message: '请选择卡用途', trigger: 'change' }],
    defaultCard: [{ required: true, message: '请选择是否默认转账卡', trigger: 'change' }],
    bankOpenName: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
    cardType: [{ required: true, message: '请选择银行卡类型', trigger: 'change' }],
    provinceCode: [{ required: true, message: '请选择省市区', trigger: 'change' }],
    legalLicenceFrontUrl: [{ required: true, message: '请上传法人身份证正面', trigger: 'change' }],
    legalLicenceBackUrl: [{ required: true, message: '请上传法人身份证反面', trigger: 'change' }],
    openAccountLicenceUrl: [{ required: true, message: '请上传开户行', trigger: 'change' }],
    bankCardFrontUrl: [{ required: true, message: '请上传银行卡正面', trigger: 'change' }],
    bankCardBackUrl: [{ required: true, message: '请上传银行卡反面', trigger: 'change' }],
    agreementPhotoUrl: [{ required: true, message: '请上传合作协议', trigger: 'change' }],
  }
