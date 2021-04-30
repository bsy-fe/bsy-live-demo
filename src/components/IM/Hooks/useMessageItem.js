import React from 'react'
import store from '@/store'
import getters from '@/store/getters'
import {handlerEmojiText, isJSONString, IsPC, isHKYClient, getUserDefinedFieldObj} from '@/utils'
import { emojiMap, emojiUrl } from '@/utils/emojiMap'
import { CUSTOM_MSG, IMG_PRELOAD, GROUP_EVENT_NOTIFY } from '@/consts'
import {globalConst} from '@/consts/globalConst'
import showPopUp from '@/components/PopUp/showPopUp'
import {showLiveDialog} from '@/components/PopUp/showLiveDialog'
import showImage from '@/components/ImgLoad/showImage'

const isM = !IsPC()

export const roleEnum = {
  1: {
    color: '#E15102',
    title: '师',
    pcTitle: '讲师',
    bg: '#702400'
  },
  2: {
    color: '#3B9EFE',
    title: '助',
    pcTitle: '助教',
    bg: '#073B99'
  },
  3: {
    color: '#E29E02',
    title: '班',
    pcTitle: '班班',
    bg: '#6F4200'
  },
  4: {
    hidden: true,
    color: '#C2EEFE',
    title: '测试测试',
    pcTitle: '测试测试',
    bg: '#35C6FE'
  },
  5: {
    color: '#fff',
    title: '我',
    pcTitle: '自己',
    bg: '#00AFF2'
  }
}


const isNotify = msg => {

  const userDefinedFieldObj = getUserDefinedFieldObj(msg)
  return userDefinedFieldObj.proto_name === GROUP_EVENT_NOTIFY
}

const useMessageItem = (props, ns, s) => {
  const { msg, userInfo, userMuteList, userRole, elementStyles } = props
  const hanlderImage = payload => {
    const data = JSON.parse(payload.data)
    // todo
    const { ImageInfoArray } = data.content.MsgContent
    const item2 = ImageInfoArray.find(ele => ele.Type === 1)
    // const item3 = ImageInfoArray.find(ele => ele.Type === 3)
    const item = ImageInfoArray.find(ele => ele.Type === 3) || item2 || {}

    const url = item.URL
    let height = item.Height
    if (!isM) {
      if (item.Width >= 362) {
        height = (362 * item.Height) / item.Width
      }
    } else {
      const mwidth = (window.innerWidth / 100) * 0.266 * 236
      if (item.Width >= mwidth) {
        height = (mwidth * item.Height) / item.Width
      }
    }
    return (
      <div
        className={s('img')}
        onClick={() => {
          if (isHKYClient() && window.remote_object) {
            window.remote_object.invoke(
              'open_image',
              JSON.stringify({
                url: item2.URL,
                width: item2.Width,
                height: item2.Height,
                size: item2.Size
              })
            )
            return
          }
          console.log(window,'window')
          showImage({src: item2.URL, width: item2.Width, height: item2.Height})
          // window.BSYIM.handleChatImgLoad(IMG_PRELOAD,item2)
          // IMUtil.IMCommunicationInstance.createSession({
          //   type: IMG_PRELOAD,
          //   params: item2 || {},
          // })
          // postMessage.send({
          //   type: IMG_PRELOAD,
          //   data: item2 || {},
          // })
        }}
      >
        <img
          className={s('message-img')}
          style={{ height: `${height}px` }}
          alt={url}
          src={url}
        />
      </div>
    )
  }

  const hoverFunction = (msgProp, userInfoProp, memberList, changeUserMute) => {
    let list = new Set(memberList)
    const has = list.has(msgProp.from)
    return (
      <div
        className={s('hover-function')}
        onClick={() => {
          changeUserMute(msgProp.from, !has)
        }}
      >
        {has ? '解除禁言' : '禁言'}
      </div>
    )
  }

  function hasImg(payload) {
    return payload.data && payload.data.includes(CUSTOM_MSG)
  }

  const hanlderText = (payload, stylesData) => {
    if (hasImg(payload)) {
      return hanlderImage(payload)
    }
    const textArr = payload.text
      ? handlerEmojiText(payload.text)
      : ['自定义消息']

    return (
      <span style={{ verticalAlign: 'middle' }}>
        {textArr.map((text, index) => {
          const mapText = emojiMap[text]
          return (
            <span key={index} style={stylesData}>
              {mapText ? (
                <img
                  style={{ verticalAlign: 'middle' }}
                  src={emojiUrl + mapText}
                  className={ns('emj-img')}
                />
              ) : (
                text
              )}
            </span>
          )
        })}
      </span>
    )
  }
  const isImg = msg.payload.data && msg.payload.data.includes(CUSTOM_MSG)
  const { contentId, isStudent } = getters()
  const changeUserMute = (uid, status) => {
    store
      .dispatch({
        type: 'message/changeUserMute',
        payload: {
          contentId,
          uid,
          status,
          internal: true
        }
      })
      .then(() => {
        console.log('改变成功')
      })
  }
  const revokeMessage = message => {
    console.log(
      {
        ID: message.ID
      },
      message
    )
    let promise = tim.revokeMessage(message)
    promise
      .then(function(imResponse) {
        console.log('消息撤回成功')
        // 消息撤回成功
      })
      .catch(function(imError) {
        // 消息撤回失败
        console.warn('revokeMessage error:', imError)
      })
  }
  const isMy =
    String(msg.from) === String(globalConst.client.buid) ||
    (msg.repeatMsgNames &&
      msg.repeatMsgNames
        .map(from => String(from))
        .indexOf(String(globalConst.client.buid)) > -1)
  console.log('is my?:', msg.from, globalConst.client.buid, globalConst.client)
  const itemRole = isMy ? roleEnum[5] : roleEnum[Number(userRole) || 4]
  const notifyMsg = getUserDefinedFieldObj(msg)
  const eventType = (notifyMsg.content && notifyMsg.content.event_type) || false

  // console.log(getUserDefinedFieldObj(msg), 'getUserDefinedFieldObj(msg)')

  return [
    isNotify,
    function() {
      return hoverFunction(msg, userInfo, userMuteList, changeUserMute)
    },
    itemRole,
    eventType,
    changeUserMute,
    isImg,
    roleEnum,
    hanlderText,
    isMy,
    notifyMsg
  ]
}

export default useMessageItem
