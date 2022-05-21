import router from '@/router'
import store from '@/store'
import CryptoJS from 'crypto-js'

/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

export function getTicketFromLocation() {
  return getParamFromLocation('ticket')
}

export function getParamFromLocation(key) {
  let paramUrl1 = decodeURIComponent(window.location.search.substr(1));
  if (!paramUrl1) return null
  let paramObj = {}
  let replaceUrl = paramUrl1.replace(/=/g, '":"').replace(/&/g, '","')
  replaceUrl = '{"' + replaceUrl + '"}'
  try {
    paramObj = JSON.parse(replaceUrl)
  } catch (e) {
    let paramArray = paramUrl1.split("&")
    for (let i = 0; i < paramArray.length; i++) {
      let paramItem = paramArray[i]
      if (paramItem.indexOf("=") > 0) {
        paramObj[paramItem.split("=")[0]] = paramItem.split("=")[1];
      }
    }
  }
  return paramObj[key];
}

export function clearObjectValues(obj) {
  for (let key in obj) {
    obj[key] = null;
  }
}

export function cascaderOptions(list, idProperty, labelProperty, subListProperty) {
  const ret = []
  const converter = (ele) => {
    const item = {
      value: ele[idProperty],
      label: ele[labelProperty]
    }
    if (ele[subListProperty] && ele[subListProperty].length > 0) {
      const children = []
      for (let i = 0; i < ele[subListProperty].length; i++) {
        children.push(converter(ele[subListProperty][i]))
      }
      item.children = children
    }
    return item
  }
  for (let i = 0; i < list.length; i++) {
    ret.push(converter(list[i]))
  }
  return ret
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  sessionStorage.clear()
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}

/**
 * 获取当前用户信息
 */
export function getCurrentLoginInfo() {
  const userInfoStr = sessionStorage.getItem('gaff-user-info')
  if (userInfoStr) {
    return JSON.parse(userInfoStr)
  }
  return null
}

export function sleep(milliSeconds) {
  var StartTime = new Date().getTime();
  while (new Date().getTime() < StartTime + milliSeconds) ;
}

export function aesEncrypt(word, keyStr) {
  if (word == null || word == undefined || word == '') {
    return ''
  }
  keyStr = keyStr ? keyStr : 'gaff-aes-key1234';
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
  return encrypted.toString();
}

export function aesDecrypt(word, keyStr) {
  if (word == null || word == undefined || word == '') {
    return ''
  }
  keyStr = keyStr ? keyStr : 'gaff-aes-key1234';
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
