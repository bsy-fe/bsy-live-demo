import React, {useEffect, useRef, useState} from 'react'
import {connect} from 'react-redux'
import className from 'classnames/bind'

import useMessageList from '@/components/IM/Hooks/useMessageList'
import {filterRole} from 'utils/message'
import {Button} from 'antd'
import MsgItem from './MessageItem'

import styles from './index.module.styl'
import IMUtils from '../../../utils/IMUtil'

const s = className.bind(styles)

const MSGList = props => {
  const {
    userInfo,
    teacherList
  } = props
  // const [isBottom, setBottom] = useState(false)


  const [visibleList, msgWrapperRef, hasNew, resolveNewMessage, getMessageList, historyCompleted, historyLoading] = useMessageList(props)
  // const [hasNewMessage, setNewMessage] = useState(false)

  const teacherMemberList = teacherList

  let moreText = '加载更多'

  if(historyLoading) {
    moreText = '载入中'
  }

  if(historyCompleted) {
    moreText = '没有更多了'
  }

  return (
    <div className={s('msg-wrapper')}>
      <div ref={msgWrapperRef} id={'bsy-msg-container'} className={s('msg-con')}>
        <div className={s('msg-list')}>
          <Button type='link' block onClick={() => getMessageList(false)} disabled={historyCompleted || historyLoading}>
            {
              moreText
            }
          </Button>
          {visibleList && visibleList.map(msg => {
            const userRole = filterRole(teacherMemberList, msg.from)
            // console.log({messageList})
            return <MsgItem key={msg.ID} userInfo={userInfo} userRole={userRole} msg={msg}/>
          })}
        </div>
      </div>

      <div
        className={`${s('new-message')} ${hasNew() ? s('show') : ''}`}
        onClick={resolveNewMessage}
      >
        有新消息
        <img
          className={s('new-message-icon')}
          src='https://res-qn.baoshiyun.com/a/92507181201202sixs.png'
        />
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  foldedMessageList: state.message.foldedMessageList,

  teacherList: state.message.teacherList,
  userMuteList: state.message.userMuteList,
  selfSend: state.message.selfSend,
  userInfo: state.user.userInfo,
  isNew: state.message.isNew,
  isMute: state.user.isMute,
  foldSame: state.message.foldSame,
  deletedMsgSeq: state.message.deletedMsgSeq
})

export default connect(mapStateToProps)(MSGList)
