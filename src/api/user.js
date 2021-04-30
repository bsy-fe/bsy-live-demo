
import {globalConst} from '@/consts/globalConst'
import store from '@/store'

const getUserInfo = initUserInfo => {

  return globalConst.client.getUserInfo(initUserInfo)
}

const getUrlToken = () => {
  return globalConst.client.getTesToken()
}

const changeAllMute = (status) => {
  return globalConst.client.muteAll(status)

}
const changeUserMute = (status, uid, internal = false) => {
  console.log('userMuteList::', store.getState().message)
  return globalConst.client.muteUser({status, uid, internal})
}
const getUserMuteList = contentId => {
  return globalConst.client.getMuteUserList(contentId)

}

const getRoomInfo = () => {
  return globalConst.client.getRoomInfo()

}

export {
  getUserInfo,
  getUrlToken,
  changeAllMute,
  changeUserMute,
  getUserMuteList,
  getRoomInfo
}
