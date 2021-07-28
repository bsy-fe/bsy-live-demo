import React, {useEffect, useRef, useState} from 'react'

import store from '@/store'
import {IsPC} from '@/utils'
import getters from '@/store/getters'
import {Subject} from 'rxjs'
import {throttleTime} from 'rxjs/operators'
import {globalConst} from '@/consts/globalConst'
import IMUtils from '@/utils/IMUtil'


const MAX_VISIBLE_LIST = IsPC ? 200 : 100

let shouldBottom = true


let toBottomBeforeLoadHistory = 0

const scrollSubject = new Subject()

let scrollSubscription = null

const onTopEvent = new Subject()

let onTopSubscription = null

const listSize = 20

const useMessageList = props => {
  const {
    foldedMessageList,
    onScrollTop,
    teacherList,
    deletedMsgSeq
  } = props
  const {contentId, isStudent} = getters()
  const [visibleList, setVisibleList] = useState([])
  const [scrollEvent, setScrollEvent] = useState(null)
  const [handleTopEvent, setHandleTopEvent] = useState(null)
  const [nextReqID, setNextReqID] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyCompleted, setHistoryCompleted] = useState(false)

  const initScroll = useRef()
  let msgWrapperRef = useRef()


  // const [hasNewMessage, setNewMessage] = useState(false)
  const changeUserMute = (uid, status) => {
    store
      .dispatch({
        type: 'message/changeUserMute',
        payload: {
          contentId,
          uid,
          status
        }
      })
      .then(() => {
        console.log('改变成功')
      })
  }



  const teacherMemberList = teacherList


  const isBottom = () => {
    let ret = true
    if (msgWrapperRef && msgWrapperRef.current) {
      const {scrollTop, scrollHeight} = msgWrapperRef.current
      ret = scrollTop === scrollHeight
      // console.log('判断是否在底部', ret, scrollTop, scrollHeight)
    }

    return ret
  }


  let scrollToBottom = () => {
    if (scrollSubscription) {
      scrollSubject.next(true)
    }
  }
  // let hasNewMessage = false

  const refreshVisibleList = () => {
    // const visibleMessageList =
    return setVisibleList(foldedMessageList.slice(-MAX_VISIBLE_LIST))
  }

  const setHistoryIsLoading = () => {
    // console.log(messageList, visibleList)
    setHistoryLoading(true)
    // historyLoading = true
  }

  const addNewHistory = () => {
    setHistoryIsLoading()
    const loadStartIndex = foldedMessageList.indexOf(visibleList[0])

    let newVisibleList = []
    if (loadStartIndex > -1) {
      const loadHistoryList = foldedMessageList.slice(Math.max(loadStartIndex - MAX_VISIBLE_LIST, 0), loadStartIndex)
      newVisibleList = newVisibleList.concat(loadHistoryList).concat(visibleList)
      return setVisibleList(newVisibleList)
    }
    refreshVisibleList()


    // console.log(loadStartIndex, loadHistoryList, newVisibleList)
  }

  const hasNew = () => {
    // const {messageList, visibleList} = props
    return foldedMessageList && visibleList && foldedMessageList.length && visibleList.length && foldedMessageList[foldedMessageList.length - 1] !== visibleList[visibleList.length - 1]
  }

  const resolveNewMessage = () => {
    shouldBottom = true
    refreshVisibleList()
  }

  const getMessageList = async () => {
    // const params = {count: listSize}
    // if(nextReqID) {
    //   params.nextReqMessageID = nextReqID
    // }
    try {
      setHistoryIsLoading()

      const res = await IMUtils.getMessageList(listSize, nextReqID)

      console.log('=============historyList::', res)
      const {list, nextReqMessageID} = res

      setNextReqID(nextReqMessageID)

      list && store.dispatch.message.addHistoryMessageList({
        historyMessageList: list
      })

      if (list && list.length < listSize) {
        // completed

        setHistoryCompleted(true)
      }

      // if(nextReqMessageID) {
      //
      // }
      return list
    } catch (e) {
      console.warn('=============get message error', e)
      throw e
    }

// console.log(data, '++++++++++')
// console.log('设置成功onSDKReady', data)
  }

  const onTopHandler = (e) => {
    // console.log('onTopEvent:::', e, this, props, visibleList)
    if (e) {
      toBottomBeforeLoadHistory = e.target.scrollHeight
      if (foldedMessageList[0] !== visibleList[0]) {
        addNewHistory()
      }
    }

  }


  const onScroll = (e) => {
    // console.log(e)
  
    setScrollEvent(e)
  }


  useEffect(() => {


    const msgWrapper = msgWrapperRef.current

    if (msgWrapper) {
      console.log('开始监听')
      scrollSubscription = scrollSubject.subscribe(() => {
        console.log('滚到底部事件')

        msgWrapper.scrollTop = msgWrapper.scrollHeight
        // setShouldBottom(true)
        /* store.dispatch.message.setNewMessage({
          isNew: false,
        }) */
      })

      onTopSubscription = onTopEvent.pipe(throttleTime(500)).subscribe(e => {
        setHandleTopEvent(e)
      })

      msgWrapper.addEventListener('scroll', onScroll)
      scrollToBottom()

      globalConst.client.on('im-ready', () => getMessageList())

      return () => {
        if (scrollSubscription) {
          scrollSubscription.unsubscribe()
          scrollSubscription = null
        }
        // msgWrapper.removeEventListener('scroll', onScroll)
      }


    }
    console.error('找不到消息列表容器')


  }, [])

  useEffect(() => {
    onTopHandler(handleTopEvent)
  }, [handleTopEvent])

  useEffect(() => {
    const e = scrollEvent
    // console.log(e, Date.now())
    if (!(e && e.target)) {
      return
    }
    // console.log('scroll', e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight, messageList.length, visibleList.length)
    if (
      e.target.scrollTop + e.target.clientHeight >=
      e.target.scrollHeight - 120
    ) {
      shouldBottom = true
      // setNewMessage(false)
      // store.getState().message.isNew &&
      // store.dispatch.message.setNewMessage({
      //   isNew: false,
      // })
      if (hasNew()) {
        refreshVisibleList()
      }
    } else {
      shouldBottom = false
    }

    if (onScrollTop && e.target.scrollTop <= 32 && e.target.scrollHeight > e.target.clientHeight) {
      // console.log('on top now', messageList, visibleList)
      onTopEvent.next(e)
    }
  }, [scrollEvent])

  useEffect(() => {
    const msgWrapper = msgWrapperRef.current


    if (foldedMessageList && foldedMessageList.length) {

      const lastMessageItem = foldedMessageList[foldedMessageList.length - 1]
      const lastVisibleItem = visibleList.length ? visibleList[visibleList.length - 1] : {}

      if (historyLoading) {
        if (foldedMessageList[0] !== visibleList[0]) {
          addNewHistory()
        }
      }

      console.log(foldedMessageList[foldedMessageList.length - 1])
      if (lastMessageItem.from === globalConst.client.buid && lastMessageItem !== lastVisibleItem) { // 是自己发的
        shouldBottom = true
      }
    }
    if (shouldBottom) {
      refreshVisibleList()
      // setVisibleList(messageList.slice)
    }
  }, [foldedMessageList])


  useEffect(() => {
    console.log('visibleList change', {visibleList, historyLoading, shouldBottom})

    if (historyLoading) {
      msgWrapperRef.current.scrollTop = msgWrapperRef.current.scrollHeight - toBottomBeforeLoadHistory + 32
      setHistoryLoading(false)
      // historyLoading = false
    } else if (shouldBottom) {
      scrollToBottom()
    }
  }, [visibleList])


  useEffect(() => {
    if(deletedMsgSeq && deletedMsgSeq.length) {
      let newList = [...visibleList]
      deletedMsgSeq.forEach((msgSeq) => {
        const deletedIndex = visibleList.findIndex(msg => String(msg.sequence) === String(msgSeq))
        if(deletedIndex > -1) {
          newList.splice(deletedIndex, 1)
        }
      })

      setVisibleList(newList)
    }

  }, [deletedMsgSeq])

  return [visibleList, msgWrapperRef, hasNew, resolveNewMessage, getMessageList, historyCompleted, historyLoading]
}


export default useMessageList
