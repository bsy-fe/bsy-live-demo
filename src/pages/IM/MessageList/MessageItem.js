import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import className from 'classnames/bind'
import getters from '@/store/getters'
import useMessageItem from '@/components/IM/Hooks/useMessageItem'
import { IsPC, sanitizer} from '@/utils'
import useRole from '@/components/IM/Hooks/useRole'
import notifyStyles from './item.module.styl'

import newStyles from './new-item.module.styl'

const isM = !IsPC()
const s = className.bind(notifyStyles)
const ns = className.bind(newStyles)



const MessageItem = props => {
  console.log('message item props::', props)
  const { msg, userInfo, userMuteList, userRole, elementStyles } = props
  const { contentId } = getters()
  const  [isNotify, hoverFunction, itemRole, eventType, changeUserMute, isImg, roleEnum, hanlderText,isMy,notifyMsg] = useMessageItem(props, ns, s)

  const [role] = useRole()

  const [isStudent, setIsStudent] = useState(true)

  useEffect(() => {
    setIsStudent(Number(role) === 4)
  }, [role])
  
  const mItemDefault = (
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
          backgroundColor: isMy ? roleEnum[5].bg : roleEnum[userRole].bg
        }}
      >
        <img src={msg.avatar || 'https://res-qn.baoshiyun.com/a/61510150301202rnts.png'}></img>
      </div>
      <div className={s('info')}>
        <div className={s('info-box')}>
           <div
              className={s('time')}
              title={msg.nick}
              style={{ color: roleEnum[userRole].color }}
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

              {(!isStudent &&
            String(userRole) === '4') && !isMy ?
            hoverFunction() : null}
            </div>
          <div className={s('text')}>
            {hanlderText(msg.payload)}
          </div>
        </div>
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
          <div className={`${ns('text-wrapper')} ${Number(userRole) !== 4 ? ns('sp') : ''}`} style={{'verticalAlign': 'middle'}}>
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
            <span>
              {hanlderText(msg.payload, elementStyles[0])}
            </span>
          </div>
        </div>
          {(!isStudent &&
            String(userRole) === '4') && !isMy ?
            hoverFunction(msg, userInfo, userMuteList, changeUserMute) : null}
      </div>
      {
        msg.repeatMsgNum && msg.repeatMsgNum > 1 ? <div className={ns('repeat-num')}>x{msg.repeatMsgNum}</div> : null
      }

      {/* <div className={s('mute-container')}>禁言ta</div> */}
    </div>
  )


  const pcItem = isNotify(msg) ? pcNotify : mItemDefault
  const mItem = isNotify(msg) ? mNotify : newItem

  return isM ? mItem : pcItem
}

const mapStateToProps = state => ({
  userMuteList: state.message.userMuteList,
  elementStyles: state.message.elementStyles
})

export default connect(mapStateToProps)(MessageItem)
