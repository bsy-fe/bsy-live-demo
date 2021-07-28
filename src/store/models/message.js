import { getUserMuteList, changeUserMute, getRoomInfo } from '@/api/user'
import {message as messageTip} from 'antd'

import { IsPC, calcRepeatMessages } from '@/utils'

const MAX_LENGTH = IsPC ? 1500 : 500

export default {
  state: {
    messageList: [],
    foldedMessageList: [],
    specialMessage: {},
    selfSend: false,
    isNew: false,
    isLive: true,
    teacherList: [],
    groupDetail: {},
    allMute: false,
    userMute: false,
    userMuteList: [],
    likeNumber: 0,
    isBottom: false,
    onlineNum: 0,
    scriptTimers: [],
    shelfInfo: {},
    foldSame: false, // 折叠同样的消息
    elementStyles: [],
    isOpenMic: false,
    highLightRealMsg: false,
    liveGoodsUrl: '',
    recallingMessage: [], // 删除中的消息
    deletedMsgSeq: [] // 被删除的msgSeq
  },
  reducers: {
    setMessageList(state, payload) {
      const {messageList} = payload
      const {foldSame} = state
      const foldedMessageList = calcRepeatMessages(messageList, foldSame)
      return {
        ...state,
        messageList,
        foldedMessageList
      }
    },
    addHistoryMessageList(state, payload) {
      const {historyMessageList} = payload
      const {foldSame} = state
      let messageList = [].concat(state.messageList) // 重新实例化 否则不会触发messagelist更新

      // historyMessageList. forEach 会比 map 快 for 比 forEach 快  while 最快
      let newlist = []
      historyMessageList.forEach(item => {
        if (!messageList.includes(item)) {
          newlist.push(item)
        }
      })
      messageList.unshift(...newlist)

      const foldedMessageList = calcRepeatMessages(messageList, foldSame)

      return {
        ...state,
        messageList,
        foldedMessageList
      }
    },
    setBottom(state, payload) {
      const {isBottom} = payload
      return {
        ...state,
        isBottom
      }
    },
    setLikeNum(state, payload) {
      // console.log('set like num::', payload)
      let {likeNumber} = payload
      likeNumber = Number(likeNumber)
      return likeNumber > state.likeNumber
        ? {
          ...state,
          likeNumber
        }
        : state
    },
    addLikeNum(state, payload) {
      let {likeNumber} = state
      return {
        ...state,
        likeNumber: ++likeNumber
      }
    },
    setLiveGoodsUrl(state, payload) {
      let {url} = payload

      return {
        ...state,
        liveGoodsUrl: url
      }
    },
    setTeacherList(state, payload) {
      const {teacherList} = payload
      console.log(teacherList,'---teacherlist')
      return {
        ...state,
        teacherList
      }
    },
    setMuteList(state, payload) {
      const {userMuteList} = payload
      return {
        ...state,
        userMuteList
      }
    },
    addMuteList(state, payload) {
      const {userId} = payload
      return {
        ...state,
        userMuteList: [...new Set([...state.userMuteList, userId])]
      }
    },
    removeMuteList(state, payload) {
      const {userId} = payload
      const arr = new Set([...state.userMuteList])
      arr.delete(userId)
      return {
        ...state,
        userMuteList: [...arr]
      }
    },
    addMessage(state, payload) {
      console.log('添加新消息::', payload)
      const {message, selfSend } = payload
      const {messageList, isBottom, foldSame} = state
      if (messageList.length >= MAX_LENGTH) {
        messageList.shift()
      }

      if (
        !messageList.find(item => {
          return item.ID === message.ID
        })
      ) {
        messageList.push(message)
      }

      const foldedMessageList = calcRepeatMessages(messageList, foldSame)

      return {
        ...state,
        messageList: [...messageList],
        foldedMessageList: [...foldedMessageList],
        selfSend: !!selfSend,
        isNew: true
      }
    },
    addMessageList(state, payload) {
      const {messageList, isBottom, foldSame } = state
      let { list, selfSend } = payload
      const messageIdList = messageList.map(({ID}) => ID)
      const messagesFiltered = list.filter( msg => messageIdList.indexOf(msg.ID) < 0)
      // const totalLength = messageList.length + messages.length
      // const hasSelf = messages.some(msg => !!msg.selfSend)
      let newMessageList = [...messageList, ...messagesFiltered]
      if (newMessageList.length > MAX_LENGTH) {
        newMessageList = newMessageList.slice(-MAX_LENGTH)
      }
      //
      const foldedMessageList = calcRepeatMessages(newMessageList, foldSame)


      return {
        ...state,
        messageList: newMessageList,
        foldedMessageList,
        isNew: !isBottom,
        selfSend
      }

    },
    removeMessageBySeq(state, payload) {
      const sequenceToRemove = payload

      const {foldSame, messageList, recallingMessage} = state

      let newList = messageList

      const indexToRemove = messageList.findIndex(msg => String(msg.sequence) === String(sequenceToRemove))

      if(indexToRemove > -1) {
        messageList.splice(indexToRemove, 1)
        newList = messageList

        const foldedMessageList = calcRepeatMessages(newList, foldSame)

        const index = recallingMessage.indexOf(sequenceToRemove)
        console.log('=============index to remove::', index)
        console.log()
        if(index > -1) {
          recallingMessage.splice(index, 1)
          messageTip.success('撤回成功')
        }

        return {
          ...state,
          messageList: newList,
          foldedMessageList,
          recallingMessage,
          deletedMsgSeq: [sequenceToRemove]
        }
      }

      return {
        ...state
      }
    },
    updateRecallingMessage(state, payload) {
      // if(state.recallingMessage.indexOf(payload))
      return {
        ...state,
        recallingMessage: payload
      }
    },
    setSpecialMessage(state, payload) {
      return {
        ...state,
        specialMessage: payload.specialMessage
      }
    },
    setNewMessage(state, payload) {
      return {
        ...state,
        isNew: payload
      }
    },
    setAllMute(state, payload) {
      let {allMute} = payload
      // console.log('sppppppp', payload)
      if (typeof allMute === 'string') {
        switch (allMute.toLocaleLowerCase()) {
          case 'off':
            allMute = false
            break
          case 'on':
            allMute = true
            break
          default:
            break
        }
      }
      return {
        ...state,
        allMute
      }
    },
    setUserMute(state, payload) {
      const {mute} = payload

      return {
        ...state,
        userMute: mute
      }
    },
    sethighLightRealMsg(state, payload) {
      return {
        ...state,
        highLightRealMsg: payload.highLightRealMsg
      }
    },
    setOpenMic(state, payload) {
      let {isOpenMic} = payload
      // console.log('sppppppp', payload)
      if (typeof isOpenMic === 'string') {
        switch (isOpenMic.toLocaleLowerCase()) {
          case 'off':
            isOpenMic = false
            break
          case 'on':
            isOpenMic = true
            break
          default:
            break
        }
      }
      return {
        ...state,
        isOpenMic
      }
    },
    setGroupDetail(state, payload) {
      // console.log('sppppppp', payload)
      return {
        ...state,
        groupDetail: payload
      }
    },
    setOnlineNum(state, payload) {
      return {
        ...state,
        onlineNum: payload
      }
    },
    setShelfInfo(state, payload) {
      return {
        ...state,
        shelfInfo: payload
      }
    },
    setElementStyles(state, payload) {
      return {
        ...state,
        elementStyles: payload
      }
    },
    setFoldSame(state, payload) {
      if(typeof payload === 'boolean') {
        const { messageList } = state
        const foldedMessageList = calcRepeatMessages(messageList, payload)
        return  {
          ...state,
          foldSame: payload,
          foldedMessageList
        }
      }
      return state
    }
  },
  effects: dispatch => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async getUserMuteList(payload, rootState) {
      const userList = await getUserMuteList(payload.contentId)
      // const dataList = userList.data.list.filter(item => {
      //   return item.ShuttedUntil * 1000 > Date.now()
      // }).map(item => item.Member_Account)
      if (userList && userList.data) {
        dispatch.message.setMuteList({
          userMuteList: userList.data
        })
      }

    },
    async changeUserMute(payload) {
      const {status, uid, internal} = payload
      return new Promise((resolve, reject) => {
        changeUserMute(status, uid, internal)
          .then(res => {
            messageTip.success('操作成功', 1)
            // refresh()
            if (status) {
              dispatch.message.addMuteList({
                userId: uid
              })
            } else {
              dispatch.message.removeMuteList({
                userId: uid
              })
            }
            resolve()
          })
          .catch(err => {
            reject()
            messageTip.error(err.data.msg, 1)
          })
      })
    }
  })
}
