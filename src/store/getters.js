/**
 * @author: Hank
 * @description: 用于处理rematch数据统一返回
 */
import {globalConst} from '@/consts/globalConst'
import store from './index'

function gettersWrapper() {
  const states = store.getState()
  const isStudent = String(states.user.role) === '4'
  const contentId = String(states.user.contentId)
  const isGuestMode = globalConst.client && globalConst.client.isGuest
  //   console.log('getters 被调用了')
  return {
    isStudent,
    contentId,
    chatRoomID: states.user.chatRoomID,
    role: globalConst.client.role,
    likeNum: states.message.likeNumber,
    onlineNum: states.message.onlineNum,
    teacherList: states.message.teacherList,
    kkbLiveId: states.user.kkbLiveId,
    liveToken: states.user.kkbLiveToken,
    isLesson: states.user.isLesson,
    uId: states.user.uId,
    nickName: states.user.nickName,
    isGuestMode,
    auth: states.user.auth,
    tesToken: states.user.tesToken,
    learnApi: states.user.learnApi
  }
}

export default gettersWrapper
