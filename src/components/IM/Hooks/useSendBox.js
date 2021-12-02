/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useRef, useEffect } from 'react'

import getters from '@/store/getters'
// import { IMCommunicationInstance } from '@/consts/context'
import { IsPC } from '@/utils'
import { BSYIM_EMOJI_DISPLAY_CHANGE, BSYIM_MASK_CLICK } from '@/consts'
import {globalConst} from '@/consts/globalConst'
import IMUtil from '../../../utils/IMUtil'


const useSend = (chatRoomID, addMessage, setFocus) => {
  const msgRef = useRef()
  const [isSending, setSending] = useState(false)
  const [textValue, setTextValue] = useState('')
  const sendMessage = useCallback(
    async argmsg => {
      if (argmsg && !isSending) {
        let msg = argmsg.trim()
        if(!msg) {
          return
        }
        setSending(true)
        const isM = !IsPC()
        try {
          let message = await IMUtil.sendMessage(chatRoomID, msg, `test customPayloadData in text message at ${new Date().getTime()}`)
          console.log('=============sended message:', JSON.stringify(message))
          message = {
            ...message,
            nick: globalConst.client.nickname,
            avatar: globalConst.client.avatar
          }
          setSending(false)
          const msgInput = msgRef.current
          msgInput.value = ''
          setTextValue('')
          setFocus(false)
          if (isM) {
            // alert()
            msgInput.blur()
          } else {
            msgInput.focus()
          }
          addMessage({ message, selfSend: 1 })
        } catch (err) {
          console.log('发送失败', err)
          setSending(false)
          const msgInput = msgRef.current
          msgInput.value = ''
          setTextValue('')
          if (isM) {
            msgInput.blur()
          } else {
            msgInput.focus()
          }
          addMessage({
            message: {
              ID: String(Math.random() * 100000000000000),
              payload: {
                text: msg
              },
              nick: globalConst.client.nickname,
              avatar: globalConst.client.avatar,
              from: globalConst.client.buid,
              to: globalConst.client.imGroupInfo.timGroupId
            },
            selfSend: 1
          })
        }
      }
    },
    [chatRoomID]
  )
  const handlerInput = useCallback(
    e => {
      setTextValue(msgRef.current.value)
      if (e && e.keyCode === 13) {
        e.preventDefault()
        sendMessage(msgRef.current.value)
      }
    },
    [sendMessage]
  )

  return [isSending, sendMessage, handlerInput, msgRef, textValue]
}

const postEmojiDisplay = showEmoji => {
  console.log('emoji状态变化，只有移动端触发')
  // IMUtil.IMCommunicationInstance.createSession({
  //   type: BSYIM_EMOJI_DISPLAY_CHANGE,
  //   params: showEmoji
  // })
  // postMessage.send({
  //   type: BSYIM_EMOJI_DISPLAY_CHANGE,
  //   data: showEmoji,
  // })
}

const isM = !IsPC()

const UseSendBox = (props, s) => {
  const { chatRoomID, addMessage, allMute  } = props
  const { isGuestMode } = getters()
  const [isFocus, setFocus] = useState(false)
  const [shouldFocusMsgInput, setShouldFocusMsgInput] = useState(false)


  const [isSending, sendMessage, handlerInput, msgRef, textValue] = useSend(
    chatRoomID,
    addMessage,
    setFocus
  )

  const [showEmoji, setShowEmoji] = useState(false)
  const msgInput = msgRef.current
  const nLength = textValue.split('\n').length
  const rows = nLength - 1 > 0 && nLength - 1 >= 3 ? 3 : nLength

  const isHasText = textValue


  const sendBtnDisabled =  isSending || allMute || isGuestMode

  const inputDisabled = sendBtnDisabled || showEmoji



  useEffect(() => {
    // 为了点击除表情区域外 关闭表情
    document.body.addEventListener('click', e => {
      const target = e ? e.target : window.event.srcElement
      const classNames = target.getAttribute('class')
      if (
        classNames &&
        classNames.indexOf('emj-img') === -1 &&
        classNames.indexOf('emoji') === -1 &&
        classNames.indexOf(s('icon')) === -1
      ) {
        setShowEmoji(false)
        // setFocus(false)
      }

      if (classNames && classNames.indexOf(s('edit-area')) > -1) {
        setFocus(true)
      } else {
        setFocus(false)
      }
    })

    postEmojiDisplay(false)
  }, [])
  useEffect(() => {
    const pasteEvent = e => {
      // let { clipboardData } = e
      // let file
      // let fileCopy
      // if (
      //   clipboardData &&
      //   clipboardData.files &&
      //   clipboardData.files.length > 0
      // ) {
      //   file = clipboardData.files[0]
      //   // 图片消息发送成功后，file 指向的内容可能被浏览器清空，如果接入侧有额外的渲染需求，可以提前复制一份数据
      //   fileCopy = file.slice()
      // }

      // if (typeof file === 'undefined') {
      //   console.warn('file 是 undefined，请检查代码或浏览器兼容性！')
      //   return
      // }
      // console.log(file, '123')
      // IMUtil.createImageMessage(file).then(res => {
      // //   console.log(res, '发送成功')
      //   addMessage({ res, selfSend: 1 })
      // })
    }
    msgInput &&
      msgInput.addEventListener('paste', pasteEvent)

    const clickEvent = () => {
      if(showEmoji) {
        setShouldFocusMsgInput(true)
      }
    }
    msgInput && msgInput.addEventListener('click', clickEvent)

    return () => {
      msgInput && msgInput.removeEventListener('paste', pasteEvent)
      msgInput && msgInput.removeEventListener('click', pasteEvent)
    }

  }, [msgInput, msgRef, showEmoji])

  useEffect(() => {
    postEmojiDisplay(showEmoji)
    if(!showEmoji && shouldFocusMsgInput) {
      msgInput && msgInput.focus()
      setFocus(true)
      setShouldFocusMsgInput(false)
    }
  }, [showEmoji])


  const inputPlaceholder = () => {
    if (isGuestMode) {
      return '游客模式无法发言'
    }
    if (allMute) {
      return '禁言中'
    }
    return '我也来两句吧'
  }

  const inputHandler = e => {
    if (!inputDisabled) {
      handlerInput(e)
    }
  }

  const toggleEmoji = () => {
    console.log(isGuestMode)

    let emojiStatus = false

    if (!isGuestMode) {
      if(!inputDisabled) {
        emojiStatus = !showEmoji
        setShowEmoji(emojiStatus)
      } else {
        setShowEmoji(emojiStatus) // 只允许关闭
      }
      // setShowEmoji(!showEmoji)
    }

    if(!emojiStatus) {

    }
  }
  const inputSendMessage = () => {
    if (!sendBtnDisabled) {
      sendMessage(msgInput.value)
      setShowEmoji(false)
    }
  }
  const maskClick = () => {
    // IMUtil.IMCommunicationInstance.createSession({
    //   type: BSYIM_MASK_CLICK,
    //   params: {
    //     isGuestMode
    //   }
    // })
    // postMessage.send({
    //   type: BSYIM_MASK_CLICK,
    //   data: {
    //     isGuestMode
    //   },
    // })
  }

//   const Mask = isGuestMode && (
//     <div
//       onClick={maskClick}
//       className={s('mask')}
//     ></div>
//   )

  return {
    inputDisabled,
    sendBtnDisabled,
    maskClick,
    inputSendMessage,
    inputHandler,
    toggleEmoji,
    inputPlaceholder,
    msgRef,
    textValue,
    setFocus,
    handlerInput,
    isFocus,
    isHasText,
    rows,
    isM,
    isGuestMode,
    showEmoji
  }
}
export default UseSendBox
