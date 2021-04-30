import React, { useState } from 'react'
import { connect } from 'react-redux'
import { changeAllMute } from '@/api/user'
import { message } from 'antd'

import getters from '@/store/getters'
import store from '@/store'
import className from 'classnames/bind'
import RoleControl from '@/components/IM/RoleControl'
import styles from './index.module.styl'
// import { TEACHER, ASSISTANT } from '../../../consts/roles'
// import { roleControl } from '../chatUtils'

const s = className.bind(styles)

const support = ['1', '2', '3']

const HighLight = props => {
  const { highLightRealMsg } = props
  console.log(highLightRealMsg, 'highLightRealMsg')
  const sethighLightRealMsg = () => {
    store.dispatch.message.sethighLightRealMsg({
      highLightRealMsg: !highLightRealMsg
    })
  }
  const iconclass = s(highLightRealMsg ? 'mute-icon-select' : 'mute-icon')
  return (
    <div
      className={s('mute-container')}
      onClick={() => {
        sethighLightRealMsg()
      }}
    >
      <div className={iconclass}></div>
      <div className={s('word')}>高亮真实</div>
    </div>
  )
}
const mapStateToProps = state => ({
  highLightRealMsg: state.message.highLightRealMsg
})

export default connect(mapStateToProps)(HighLight)
