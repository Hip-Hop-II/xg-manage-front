import Cookies from 'js-cookie'
import { ElMessageBox } from 'element-plus';

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function showPayPassword(success, failed) {
  ElMessageBox.prompt('支付密码', {
    inputType: 'password',
    inputPlaceholder: '请输入6位支付密码',
    inputValidator: (pwd) => {
    if (!pwd) {
      return '请输入6位支付密码';
    } else if (!/^\d{6}$/.test(pwd)) {
      return '支付密码错误';
    }
    return true;
  }}).then((data) => {
    success(data.value);
  }).catch(() => {
    failed && failed();
  })
}