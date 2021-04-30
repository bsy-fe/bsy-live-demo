import React, { useState, useEffect } from 'react'

import classNames from 'classnames/bind'
import { RAISE_HAND_TEXT, RAISE_HAND_STATUS  } from '@/consts/rtc'
import s from  './index.styl'
import { checkDeviceAuth, studentOffSeat} from '../utils'
import RTCModeStore from '../rtc'
import {RTCConfirm} from '../../RTCModal'
import message from '../../Message/message'

const cx = classNames.bind(s)

// 举手
async function handleRaiseHands (instance) {
  try {
    await checkDeviceAuth(instance.interactLive.rtc)
    return new Promise((resolve, reject) => {
      console.log('=====', instance)
      instance.raiseHands().then(()=> {
        resolve(true)
      }).catch(err => {
        reject()
        message.error(err.msg || '网络错误请稍后再试')
      })
    })
  } catch (error) {
    message.error('您禁用了你的摄像头，无法上台，请开启摄像头权限后')
    return false
  }
}

// 取消举手
async function handleCancelWaitHands(instance) {
  return new Promise((resolve, reject) => {
    instance.cancelRaiseHands().then(res => {
      console.log(res)
      resolve()
    }).catch(err => {
      console.log(err)
      reject()
    })
  })
  
}

// 下台
export default (props) => {
  let { client, config, isOnline = false} = props
  let [status, setStatus] = useState(RAISE_HAND_STATUS.normal)
  const handelClick = () => {
    switch (status) {
      case RAISE_HAND_STATUS.normal:
        RTCConfirm({
          content: '为了举手成功，需要【允许】浏览器调取本地摄像头和麦克风，确定允许么？',
          okText: '确定',
          cancelText: '取消',
          onOk: async () =>{
            try {
              let res = await handleRaiseHands(client)
              if(res) {
                setStatus(RAISE_HAND_STATUS.waiting)
                RTCModeStore.actionBtnStatus = RAISE_HAND_STATUS.waiting
              }
            } catch (error) {
              console.error('=====', error)
            }
          }
        })
        break
      case RAISE_HAND_STATUS.waiting:
        handleCancelWaitHands(client).then(res => {
          console.log('=====handleCancelWaitHands', res)
          setStatus(RAISE_HAND_STATUS.normal)
          RTCModeStore.actionBtnStatus = RAISE_HAND_STATUS.normal
        })
        break
      case RAISE_HAND_STATUS.dropped:
        studentOffSeat(client, config.userId).then(res =>{
          console.log('====', res)
          setStatus(RAISE_HAND_STATUS.normal)
          RTCModeStore.actionBtnStatus = RAISE_HAND_STATUS.normal
          RTCModeStore.switchOffSeat(client)
        }).catch(err => {
          console.log('=====', err)
        })
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!client) {
      return
    }
    client.getMyQueueStatus().then(res => {
      console.log('=====getMyQueueStatus', res)
      let { data, code, msg } = res
      if (code === 1) {
        if (data.waitStatus) {
          setStatus(RAISE_HAND_STATUS.waiting)
          RTCModeStore.actionBtnStatus = RAISE_HAND_STATUS.waiting
        }
        
      } 
    }).catch(err => {
      console.log(err)
      // todo 获取登录失败
      console.log('=====getMyQueueStatus', err)
    })

    client.on('removed-from-queue', () =>{
      message.error('您已被老师请出等候队列')
      setStatus(RAISE_HAND_STATUS.normal)
      RTCModeStore.actionBtnStatus = RAISE_HAND_STATUS.normal
    })
    return () => {
      // cleanup
    }
  }, [client])

  useEffect(() => {
    console.log('=====isOnline', isOnline)
    if (!isOnline && status === RAISE_HAND_STATUS.dropped) {
      setStatus(RAISE_HAND_STATUS.normal)
      RTCModeStore.actionBtnStatus = RAISE_HAND_STATUS.normal
    }
    if (isOnline)  {
      setStatus(RAISE_HAND_STATUS.dropped)
      RTCModeStore.actionBtnStatus = RAISE_HAND_STATUS.dropped
    }
  }, [isOnline])

  return (
    <div className={cx('rtc-action-wall')}>
      <button 
        onClick={handelClick}
        className={cx('rtc-action' , RAISE_HAND_STATUS[status])}
      >
        {RAISE_HAND_TEXT[status]}
      </button>
    </div>
  
  )
}
