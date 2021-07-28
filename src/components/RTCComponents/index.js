import React, { useState, useContext, useEffect } from 'react'

// import classNames from 'classnames/bind'
// import s from  './index.styl'
import { IsPC, filterComp } from '@/utils'
import { GlobalContext } from '@/context'
import {  RTC_INTERACTIVE_TYPE }from '@/consts/rtc'
import ColumnGroup from 'antd/lib/table/ColumnGroup'
import ActionBtn from './ActionBtn'
import Panel from './Panel'
import { 
  getRTCSeatList, 
  selfIsOnSeat , 
  formatList, 
  studentOffSeat,
  handleTeacherUpdateSeat
} from './utils'
import WhiteBoard from '../WhiteBoard'
import RTCModeStore from './rtc'
// const cx = classNames.bind(s)
import { RTCConfirm } from '../RTCModal'
import message from '../Message/message'

const isPc = IsPC()
function useInitial(props) {
  let { client, config } = useContext(GlobalContext)
  let [interactType, setInteractType] = useState(RTC_INTERACTIVE_TYPE.close)
  let [selfOnline, setSelfOnline] = useState(false)
  let [seatList, setSeatList] = useState([])

  const handleClick = ({type, item}) => {

    let id = item.uid
    if (item.isAdmin) {
      handleTeacherUpdateSeat({info:item, type, id, instance: client, rtcStore: RTCModeStore})
      return
    }
    switch (type) {
      case 'hangup':
        // 挂断
        studentOffSeat(client, id).then(res => {
          RTCModeStore.switchOffSeat(client)
          // todo tips 挂断成功
        }).catch(() => {
        })
        break
      case 'video':
        let videoList = RTCModeStore.updateSelfVideo(client, type, item)
        videoList && setSeatList(videoList)
        break
      case 'audio':
        let audioList = RTCModeStore.updateSelfAudio(client, type, item)
        audioList && setSeatList(audioList)
        break
      default:
        break
    }
  }

  const getSeatList = () => {
    // 获取席位列表
    getRTCSeatList(client).then(data => {
      let list = formatList({data, config, client, rtcStore: RTCModeStore})
      setSeatList(list)
      if (list.length) {
        if (selfIsOnSeat(list, config.userId)) {
          setSelfOnline(true)
        } else {
          setSelfOnline(false)
        }
      }
      RTCModeStore.updateList(list, config, client)
    })
  }


  const interactConfigChange = data => {
    setInteractType(data.interactType)
    let l = RTCModeStore.updateInteractConfig(data, client)
    if (l) {
      let newList = formatList({data: l, config, client, rtcStore: RTCModeStore})
      setSeatList(newList)
      RTCModeStore.updateList(newList, config, client)
    }
  }

  const seatListUpdate = data =>{
    let list = formatList({data, config, client, rtcStore: RTCModeStore})
    setSeatList(list)
    if (selfIsOnSeat(list, config.userId)) {
      setSelfOnline(true)
    } else {
      setSelfOnline(false)
    }
    RTCModeStore.updateList(list, config, client)
  }


  const studentOnline = data => {
    RTCModeStore.updateLivingQueue('online',data.uid)
    RTCModeStore.playStream(data, config, client)
  }
  const studentOffline = data => {
    console.log('=====studentOffline', data)
    RTCModeStore.updateLivingQueue('offline',data.uid)
  }

  const invitedOnSeat = data => {
    if (!isPc) { return }
    let {fromId} = data
    RTCConfirm({
      content:'老师向您发起了上台邀请，确定接受上台？（如果接受，请允许浏览器调取本地摄像头和麦克风设备，保证正常连接）',
      okText: '确定',
      cancelText: '拒绝',
      onCancel: () => {
        client.responseInvited(false, fromId)
          .then(() => {
            message.error('您成功拒绝了老师邀请')
          })
          .catch((error) => {
            message.error(error.data.msg || '服务器开小差了，请稍后再试')
          })
      },
      onOk: async () => {
        try {
         const res = await client.responseInvited(true, fromId)
          if(res && res.code === 1) {
            // 成功
            message.success('已接受邀请')
          } else {
            message.error(res ? res.msg : '服务器开小差了，请稍后再试')
          }
        } catch (error) {
          message.error(error.data.msg || '服务器开小差了，请稍后再试')
        }
      }
    })
  }

  const seatStatusChange = data => {
    let {status } = data
    if (status === 2) {
      RTCModeStore.switchOffSeat(client)
      message.info('您已被老师请下台')
    }
  }

  const seatVideoStatusChange = data => {
    if (data.videoDisable) {
      client.interactLive.rtc.disableVideo()
    } else {
      client.interactLive.rtc.enableVideo()
    }
    getSeatList()
    message.info(`老师已${data.videoDisable ? '关闭' : '开启'}您的摄像头`)
  }

  const seatAudioStatusChange = data => {
    if (data.audioDisable) {
      client.interactLive.rtc.disableAudio()
    } else {
      client.interactLive.rtc.enableAudio()
    }
    getSeatList()
    message.info(`老师已${data.audioDisable ? '关闭' : '开启'}您的麦克风`)
  }

  const userAudioDisabled = data => {
    let l = RTCModeStore.updateAudioVideoStatusCurrentSeatList(data.uid, 'disabled', 'Audio')
    setSeatList(l)
  }
  const userAudioEnabled = data => {
    let l = RTCModeStore.updateAudioVideoStatusCurrentSeatList(data.uid, 'enabled', 'Audio')
    setSeatList(l)
  }
  const userVideoDisabled = data => {
    let l = RTCModeStore.updateAudioVideoStatusCurrentSeatList(data.uid, 'disabled', 'Video')
    setSeatList(l)
  }
  const userVideoEnabled = data => {
    let l = RTCModeStore.updateAudioVideoStatusCurrentSeatList(data.uid, 'enabled', 'Video')
    setSeatList(l)
  }
      
  useEffect(() => {
    let interactFn = null
    let seatListUpdateFn = null
    let studOnline = null
    let studOffline = null
    let invited = null
    let seatStatus = null
    let seatVideo = null
    let seatAudio = null
    let userAudioDisabledFn = null
    let userAudioEnabledFn = null
    let userVideoDisabledFn = null
    let userVideoEnabledFn = null

    if (client) {
      let interactConfig = client.getInteractConfig()
      RTCModeStore.updateInteractConfig(interactConfig, client)
      setInteractType(interactConfig.interactType)
      // RTCModeStore. playerready
      // 互动直播配置改变
      interactFn  = client.on('interact-config-change', interactConfigChange)
      // 监听席位变化
      seatListUpdateFn = client.on('seat-list-update', seatListUpdate)
      // 学生上线
      studOnline = client.on('student-online', studentOnline)
      studOffline = client.on('student-offline', studentOffline)
      // 被邀请上台
      invited = client.on('invited-on-seat', invitedOnSeat)
      // 自己上/下台
      seatStatus = client.on('seat-status-change', seatStatusChange)
      // 自己的摄像头被禁用或启用
      seatVideo = client.on('seat-video-status-change',seatVideoStatusChange)
      // 自己的麦克风被禁用或启用
      seatAudio = client.on('seat-audio-status-change', seatAudioStatusChange)

      userAudioDisabledFn = client.on('user-audio-disabled', userAudioDisabled)
      userAudioEnabledFn = client.on('user-audio-enabled', userAudioEnabled)
      userVideoDisabledFn = client.on('user-video-disabled', userVideoDisabled)
      userVideoEnabledFn = client.on('user-video-enabled', userVideoEnabled)
      getSeatList()
   
    }

    return () => {
      // cleanup
      client.off('interact-config-change', interactFn)
      client.off('seat-list-update', seatListUpdateFn)
      client.off('student-online',studOnline)
      client.off('student-offline',studOffline)
      client.off('invited-on-seat', invited)
      client.off('seat-status-change', seatStatus)
      client.off('seat-video-status-change', seatVideo)
      client.off('seat-video-status-change', seatAudio)
      client.off('seat-audio-status-change', userAudioDisabledFn)
      client.off('seat-audio-status-change', userAudioEnabledFn)
      client.off('seat-audio-status-change', userVideoDisabledFn)
      client.off('seat-audio-status-change', userVideoEnabledFn)
    }
  }, [client])


  useEffect(() => {
    if(props.ready) {
      RTCModeStore.updateRtcInit()
    }
  }, [props.ready])

  return {
    client, 
    config,
    interactType,
    seatList,
    selfOnline,
    handleClick
  }
}

const RTCCom =  (props) => {

  let {  
    client, 
    config,
    interactType,
    seatList,
    selfOnline,
    handleClick
  } = useInitial(props)

  console.log('=============props.liveStatus::', props.liveStatus)
  return (
    <>
    {
      interactType === RTC_INTERACTIVE_TYPE.close  ? '' : (
        <>
          <ActionBtn
            isOnline={selfOnline}
            client={client}
            config={config}
          />
          {
            seatList.length ?  (
              <Panel 
                list={seatList}
                onClick={handleClick}
              />
            ) : ''
          }
        </>
      )
    }
    {
      props.liveStatus === 'running' ? (<WhiteBoard hasPanel={seatList.length} />) : ''
    }
    </>
  )
}
// initialize
export const MRTCCom = (props) => {
  let {  
    client, 
    config,
    interactType,
    seatList,
    handleClick
  } = useInitial(props)
  return (
    <Panel
      style={props.style}
      list={seatList}
      onClick={handleClick}
    />
  )
}

export default filterComp(RTCCom, MRTCCom)
