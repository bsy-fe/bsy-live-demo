// import request from '../../utils/request'
import { setSomething } from '../utils'

export default {
  state: {
    chatRoomID: '',
    role: 4,
    isMute: false,
    contentId: '',
    likeNum: 0,
    kkbLiveId: undefined,
    kkbLiveToken: undefined,
    isLesson: false,
    uId: '',
    nickName: '',
    mode: '', // default: 默认登录模式， guest: 游客模式，无内容
    auth: '',
    tesToken: ''
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setUserInfo(state, payload) {
      return setSomething(state, payload)
    },
    setChatRoom(state, payload) {
      return setSomething(state, payload)
    },
    setRole(state, payload) {
      return setSomething(state, payload)
    },
    setMute(state, payload) {
      return setSomething(state, payload)
    },
    setUserSomething(state, payload) {
      return setSomething(state, payload)
    }
  },
  effects: dispatch => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async getMyInfo() {
      const info = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            nick: 'oceanking',
            avatar: 'https://learn.kaikeba.com/img_centre_man.png',
            role: 1
          })
        }, 500)
      })
      // const res = await tim.getMyProfile()
      dispatch.user.setUserInfo(info)
    }
  })
}
