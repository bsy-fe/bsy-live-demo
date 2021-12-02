import React from 'react'
import className from 'classnames/bind'
import { connect } from 'react-redux'
// import { TEACHER, ASSISTANT } from '../../../consts/roles'
import {globalConst} from '@/consts/globalConst'
import HighLight from './HighLight'
import Emojis from './Emojis'
import Like from './Like'
import Mute from './Mute'

import styles from './index.module.styl'
import Online from './Online'
import UploadImage from './Image'

const s = className.bind(styles)

const sendCustomMessage = () => {
  globalConst.client.sendCustomMessage({someKey: 'someValue'})
}

const ToolBar = props => {
  const { isM, handlerInput, userMute, msgInputRef } = props
  return (
    <div className={s('toolbar-wrapper', isM ? 'toolbar-wrapper-m' : '')}>
      <div className={s('tb-item') + s('tb-item-emoji')}>
        <div className='icon'></div>
      </div>
      {!isM && (
        <Emojis
          msgInputRef={msgInputRef}
          disabled={userMute}
          handlerInput={handlerInput}
        />
      )}
      {
        !isM && <UploadImage  disabled={userMute}/>
      }
      {
        !isM &&  <Mute  />
      }
      {
        !isM && <HighLight />
      }
      
      {/* <button onClick={sendCustomMessage}>点击发送自定义消息</button> */}
      <Online  />
      <Like disabled={userMute} />
    </div>
  )
}
export default ToolBar
