/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from 'react'
// import TIM from 'tim-js-sdk'
import classNames from 'classnames/bind'
import { connect } from 'react-redux'

import useChatRoom  from '@/components/IM/Hooks/useChatRoom'
import {globalConst} from '@/consts/globalConst'
import MsgList from '../MessageList'
import SendBox from '../SendBox'
import SpecialMessage from '../SpecialMessage'
import styles from './index.module.styl'

const s = classNames.bind(styles)

const chatRoom = props => {
  const [onScrollTop, {role}] = useChatRoom({client: globalConst.client})
  console.log('props', props, 'role,', role)

  const SendBoxRender = SendBox
  console.log('sendBoxRender,', role)
  return (
    <div className={s('chat-wrapper')}>
      {/* <Loading show={loadingShow}></Loading> */}
      <MsgList onScrollTop={onScrollTop}></MsgList>
      <SendBoxRender />
      <SpecialMessage></SpecialMessage>
    </div>
  )
}
const mapStateToProps = state => ({
  chatRoomID: state.user.chatRoomID,
  userInfo: state.user.userInfo
})
const mapDispatchToProps = dispatch => ({
  getMyInfo: () => dispatch.user.getMyInfo(),
  addMessage: dispatch.message.addMessage
})

export default connect(mapStateToProps, mapDispatchToProps)(chatRoom)
