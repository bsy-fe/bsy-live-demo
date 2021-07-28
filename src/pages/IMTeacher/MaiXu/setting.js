import React, { useState } from 'react'
import { connect } from 'react-redux'
import { setInteractConfig } from 'api/mic'
import { message } from 'antd'

import store from '@/store'
import className from 'classnames/bind'
import styles from './index.module.styl'

const s = className.bind(styles)

const Setting = (props) => {
  const [isSending, setSending] = useState(false)
  const { isOpenMic, rtcInfo } = props
  console.log(isOpenMic, 'isOpenMic')

  const setChangSetting = () => {
    setSending(true)
    setInteractConfig({ audioDisable: !isOpenMic })
      .then(() => {
        setSending(false)
        store.dispatch({
          type: 'mic/setSomething',
          payload: {
            rtcInfo: {
              ...rtcInfo,
              audioDisable: !isOpenMic,
            },
          },
        })
        message.success('操作成功', 1)
      })
      .catch((err) => {
        setSending(false)
        message.error(err.data.msg)
      })
  }
  const iconclass = s(isOpenMic ? 'mic-icon-select' : 'mic-icon')
  return (
    <div
      className={s('setting-container')}
      onClick={() => {
        if (isSending) {
          return
        }
        setChangSetting()
      }}
    >
      <div className={iconclass}></div>
      <div className={s('word')}>全体静音</div>
    </div>
  )
}
const mapStateToProps = (state) => ({
  isOpenMic: state.mic.rtcInfo.audioDisable,
  rtcInfo: state.mic.rtcInfo,
})

export default connect(mapStateToProps, null)(Setting)
