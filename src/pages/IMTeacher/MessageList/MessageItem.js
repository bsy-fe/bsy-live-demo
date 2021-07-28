import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import className from 'classnames/bind'
import getters from '@/store/getters'
import { IsPC, sanitizer} from '@/utils'
import useMessageItem from '@/components/IM/Hooks/useMessageItem'
import notifyStyles from './item.module.styl'

import newStyles from './new-item.module.styl'

const isM = !IsPC()
const s = className.bind(notifyStyles)
const ns = className.bind(newStyles)



const MessageItem = props => {
  const { msg, userInfo, userMuteList, userRole, elementStyles, highLightRealMsg } = props
  const { contentId, isStudent } = getters()
  const numberUserRole = Number(userRole)
  const  {isNotify, itemRole, eventType, changeUserMute, isImg, roleEnum, hanlderText,isMy,notifyMsg, muteHoverBtn, recallHoverBtn} = useMessageItem({...props, ns, s})

  // 2021.7.23 用msg.isDrama判断是不是剧本直播
  const hoverBtns = <div className={s('hover-wrapper')}>
    {
      !isMy && !isStudent && !msg.isDrama ? muteHoverBtn() : null
    }
    {
      !isStudent && !msg.isDrama ? recallHoverBtn() : null
    }
    </div>

  const script = {

    get isHighLight() {
      return highLightRealMsg  && !msg.isDrama
    }
  }
  
  const pcItemDefault = (
    <div
      className={`${s('msg-item')} ${isM ? s('msg-item-m') : ''} ${isImg ? s('msg-item-img') : ''} ${isMy ? s('self') : ''}`}
      onMouseOver={() => {
        // getPeopleDetail(msg, index)
        // console.log(msg, 'onMouseOver')
      }}
      key={msg.ID}
    >
      <div
        className={s('avatar')}
        style={{
          backgroundColor: isMy ? roleEnum[5].bg : roleEnum[numberUserRole].bg
        }}
      >
        <img src={msg.avatar || 'https://res-qn.baoshiyun.com/a/62346110201202mmco.png'}></img>
      </div>
      <div className={s('info')}>
        <div className={s('info-box')}>
           <div
              className={s('time')}
              
              style={{ color: roleEnum[numberUserRole].color }}
            >
              <span className={ns('user')} style={{'verticalAlign': 'middle'}}>
              {
                !itemRole.hidden && !isMy ? <span className={s('title')} style={{backgroundColor: itemRole.bg, color: itemRole.color}}>
                  {
                    itemRole.pcTitle
                  }
                </span> : null

              }
              <span title={msg.nick || '佚名用户'} className={s('nick')} style={elementStyles[0]} >
                {msg.nick || '佚名用户'}{msg.repeatMsgNames && msg.repeatMsgNames.length > 1 ? `等${msg.repeatMsgNames.length}人` : ''}
              </span>
              </span>

            </div>
          <div className={`${s('text')} ${script.isHighLight ? s('highlight') : ''}`}>
          
            {hanlderText(msg.payload)}
          </div>
        </div>
        {
          hoverBtns
        }
      </div>
      {
        msg.repeatMsgNum && msg.repeatMsgNum > 1 ? <div className={ns('repeat-num')}>x{msg.repeatMsgNum}</div> : null
      }
    </div>
  ) 
  // console.log(getUserDefinedFieldObj(msg), 'getUserDefinedFieldObj(msg)')
 
  const pcNotify = isNotify(msg) && (
    <div
      className={`${s('msg-item-notify')} ${
        eventType === 2 ? s('msg-item-notify-buy') : ''
      } ${
        eventType === 3 ? s('msg-item-notify-custom') : ''
      }`}
      key={msg.ID}
    >
      <div className={s('notify-body')}>
        <div className={s('notify-pre-img')}>
        </div>
        {
          notifyMsg.content.notify_msg && notifyMsg.content.notify_msg.content ?
            <span dangerouslySetInnerHTML={{__html: sanitizer(notifyMsg.content.notify_msg.content)}} />
            : <>
         <span className={s('nickname')}>
        {notifyMsg.content.notify_msg.nickname}
      </span>{' '}
              {notifyMsg.content.notify_msg.template_msg}{' '}
              {notifyMsg.content.notify_msg.name}
            </>
        }
      </div>

    </div>
  )
  const mNotify = isNotify(msg) && (
    <div
      className={`${s('msg-item-notify')} ${
        isM ? s('msg-item-notify-m') : ''
      } ${eventType === 2 ? s('msg-item-notify-buy') : ''} ${eventType === 3 ? s('msg-item-notify-custom') : ''}`}
      key={msg.ID}
    >
      <div className={s('notify-body')}>
        <div className={s('notify-pre-img')}>
        </div>
        {
          notifyMsg.content.notify_msg && notifyMsg.content.notify_msg.content ? <span dangerouslySetInnerHTML={{__html: sanitizer(notifyMsg.content.notify_msg.content)}} /> : <>
         <span className={s('nickname')}>
        {notifyMsg.content.notify_msg.nickname}
      </span>{' '}
            {notifyMsg.content.notify_msg.template_msg}{' '}
            {notifyMsg.content.notify_msg.name}
          </>
        }
      </div>

    </div>
  )




  const newItem = (
    <div
      className={`${(isM ? ns('m-msg-item') : ns('msg-item'))} `}
      key={msg.ID}
    >
      <div className={ns('info')}>
        <div className={ns('info-box')} style={{'verticalAlign': 'middle'}}>
          <div className={`${ns('text-wrapper')} ${numberUserRole !== 4 ? ns('sp') : ''}`} style={{'verticalAlign': 'middle'}}>
            <span className={ns('user')} style={{'verticalAlign': 'middle'}}>
              {
                !itemRole.hidden ? <span className={ns('title')} style={{backgroundColor: itemRole.bg, color: itemRole.color}}>
                  {
                    itemRole.pcTitle
                  }
                </span> : null
                /* <span className={ns('title')} style={{backgroundColor: itemRole.bg, color: itemRole.color}}>
                  {
                    itemRole.pcTitle
                  }
                </span> */

              }
              <span title={msg.nick || '佚名用户'} className={ns('nick')} style={elementStyles[0]} >
                {msg.nick || '佚名用户'}{msg.repeatMsgNames && msg.repeatMsgNames.length > 1 ? `等${msg.repeatMsgNames.length}人` : ''}：
              </span>
            </span>
            <span className={script.isHighLight ? ns('highlight') : ''}>
              {hanlderText(msg.payload, elementStyles[0])}
            </span>
          </div>
        </div>
      </div>
      {
        msg.repeatMsgNum && msg.repeatMsgNum > 1 ? <div className={ns('repeat-num')}>x{msg.repeatMsgNum}</div> : null
      }

      {/* <div className={s('mute-container')}>禁言ta</div> */}
    </div>
  )


  const pcItem = isNotify(msg) ? pcNotify : pcItemDefault
  const mItem = isNotify(msg) ? mNotify : newItem

  return isM ? mItem : pcItem
}

const mapStateToProps = state => ({
  userMuteList: state.message.userMuteList,
  elementStyles: state.message.elementStyles,
  highLightRealMsg: state.message.highLightRealMsg
})

export default connect(mapStateToProps)(MessageItem)
