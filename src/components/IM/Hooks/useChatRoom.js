/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import React, {useEffect, useState} from 'react'
// import TIM from 'tim-js-sdk'
import store from '@/store'
import IMUtil from '@/utils/IMUtil'
import {
  CUSTOM_MSG,
  BSYIM_SWITCH_ONLINENUM,
  BSYIM_GROUP_SHELF_SHOW
} from '@/consts'
import {isJSONString} from '@/utils'
import useRole from '@/components/IM/Hooks/useRole'

let nextReqMessageID = '' // 下一次拉去消息标识
let isCompleted = false // 是否拉取全部消息
let isMessageLoading = false
let memoList = []

const filterMsg = list => {
  return list.filter(item => {
    const { data } = item.payload
    const userDefinedFieldObj = isJSONString(data) ? JSON.parse(data) : {}
    console.log(userDefinedFieldObj.proto_name)
    return (
      (!item.payload.data && item.payload.text) ||
      userDefinedFieldObj.proto_name === CUSTOM_MSG
    )
  })
}

const getMsgList = chatRoomID => {
  let start = Date.now()
  return new Promise((resolve, reject) => {
    // 目前历史消息从tim拿，后面历史会从自己的服务器拿
    isMessageLoading = true
    // console.log(tim, nextReqMessageID)
    let params = {
      conversationID: `GROUP${chatRoomID}`,
      count: 15
    }
    if (nextReqMessageID) {
      params.nextReqMessageID = nextReqMessageID
    }
    IMUtil
      .getMessageList(params)
      .then(imResponse => {
        // console.log(imResponse, '................')
        nextReqMessageID = imResponse.data.nextReqMessageID
        isCompleted = imResponse.data.isCompleted
        const filterMsgList = filterMsg(imResponse.data.messageList)
        memoList.unshift(...filterMsgList)
        isMessageLoading = false
        if (memoList.length >= 20 || isCompleted) {
          store.dispatch.message.addHistoryMessageList({
            historyMessageList: memoList
          })
          memoList = []
          resolve(true)
        } else if (
          filterMsgList.length <= 15 &&
          imResponse.data.messageList.length &&
          !isCompleted
        ) {
          getMsgList(chatRoomID).then(res => {
            resolve(res)
          })
        }
        resolve(false)
      })
      .catch(() => {
        isMessageLoading = false
        resolve(false)
      })
  })
}

const useChatRoom = ({client}) => {

  const [role] = useRole()
  const onScrollTop = async () => {
    console.log('onScrollTop, getMsgList', isMessageLoading, isCompleted)
    if (isCompleted || isMessageLoading) {
      return false
    }
    isMessageLoading = true
    // console.log('onScrollTop, getMsgList')
    const ret = await getMsgList()
    return ret
  }




  return [onScrollTop, {role}]
}
export default useChatRoom
