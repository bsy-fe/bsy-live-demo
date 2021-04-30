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

const Mute = props => {
  const [isSending, setSending] = useState(false)
  const { allMute } = props
  // console.log(allMute, 'allMute')
  const setChangAllMute = () => {
    console.log(allMute, 'allMute')
    const newMuteStatus = !allMute
    setSending(true)
    changeAllMute(newMuteStatus)
      .then(() => {
        setSending(false)
        store.dispatch.message.setAllMute({
          allMute: newMuteStatus
        })
        message.success('操作成功', 1)
      })
      .catch(err => {
        setSending(false)
        message.error(err.data.msg)
      })
  }
  const iconclass = s(allMute ? 'mute-icon-select' : 'mute-icon')
  return (
    <div
      className={s('mute-container')}
      onClick={() => {
        if (isSending) {
          return
        }
        setChangAllMute()
      }}
    >
      <div className={iconclass}></div>
      <div className={s('word')}>全员禁言</div>
    </div>
  )
}
const mapStateToProps = state => ({
  allMute: state.message.allMute
})

export default connect(mapStateToProps)(Mute)
