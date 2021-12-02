import React, { useState } from 'react'
import { connect } from 'react-redux'
import { message, Icon } from 'antd'
import className from 'classnames/bind'
import IMUtil from '@/utils/IMUtil'
import styles from './index.module.styl'

const s = className.bind(styles)

const support = ['1', '2', '3']

const Image = props => {

  const {disabled} = props

  const [isSending, setSending] = useState(false)
  const setChangAllMute = () => {
    setSending(true)
  }

  const iconClick = e => {
    console.log('iconClick')
    document.querySelector('#BSY-IM-UPLOAD').click()
  }

  const uploadImage = e => {
    const {files} = e.target
    console.log('files to upload', files)
    IMUtil.sendCustomImage(files, 'test custom payload data in image message').then( msgs => {
      msgs.forEach(msg => {
        console.log('image', msg)
        // store.dispatch.message.addMessage({
        //   message: msg,
        //   selfSend: 1
        // })
      }, reject => {

      })

      const msgContainer = document.querySelector('#bsy-msg-container')
      setTimeout(() => {
        msgContainer.scrollTop = msgContainer.scrollHeight
      }, 300)
      document.querySelector('#BSY-IM-UPLOAD').value = ''
    }).catch(err => {
      console.error('=============upload image', err)
      message.error(e.msg)
    })
  }
  return (
    <div className={s(['tb-item', 'tb-item-image'])}>
      {/* <Icon
        type='picture'
        style={{ marginRight: 4, fontSize: 20 }}
        onClick={iconClick}
      /> */}
      <img src='https://res-qn.baoshiyun.com/a/52240191201202pzdb.png' style={{ marginRight: 4,width: 20, height: 20 }} onClick={iconClick}></img>
      <input
        disabled={disabled}
        type='file'
        id='BSY-IM-UPLOAD'
        onChange={uploadImage}
        style={{ visibility: 'hidden', display: 'none' }}
        accept='image/*'

      />
    </div>
  )
}
const mapStateToProps = state => ({})

export default connect(mapStateToProps)(Image)
