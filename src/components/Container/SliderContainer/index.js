import React, { useState, useEffect } from 'react'
import {IM_CHAT_SIDEBAR_WIDTH, UI_PLATFORMS} from '@/consts'
import classNames from 'classnames/bind'
import {  RTC_INTERACTIVE_TYPE }from '@/consts/rtc'
import { filterComp } from '@/utils'
import RTCTeacher from '@/components/RTCComponents/Teacher'
import { imTabListChange } from '@/consts/subjects'
import s from  './index.styl'
import RTCCom from '../../RTCComponents'
import RTCActBtn from '../../RTCActBtn'

const cx = classNames.bind(s)


export const Slider = (props) => {
  let { type = 'live', platform } = props
  let chatWidth = platform === UI_PLATFORMS.APP ? IM_CHAT_SIDEBAR_WIDTH.pusher : IM_CHAT_SIDEBAR_WIDTH.reader
  let isTeacherView = platform !== UI_PLATFORMS.APP && type === 'rtc'
  let [leftWidth, setLeftWidth ] = useState(chatWidth)
  let [isOpen, setIsOpen] = useState(true)

  const handleClick = () => {
    setIsOpen(!isOpen)
    setLeftWidth(isOpen ? 0 : chatWidth)
  }

  return (

    <div
      className={cx('chat-sidebar',(isTeacherView && 'add-teacher-window') )}
      style={{width: leftWidth}}
    >
      <div
        className={cx('chat-control', isOpen ? 'right' : 'left')} 
        onClick={handleClick}
      ></div>
      {
        isTeacherView ?  <RTCTeacher style={!isOpen ? {display: 'none'} : {}}  {...props}/> : ''
      }
      {props.children}
    </div>
    
  )
}

export const MSlider = props => {
  // let { client, config } = useContext(GlobalContext)
  let { client, type='live' } = props
  let [interactType, setInteractType] = useState(RTC_INTERACTIVE_TYPE.close)
  let [rtcInfo, setRtcInfo] = useState({})
  let [visible, setVisible] = useState(false)
  let [liveDetails, setLiveDetails] = useState({})
  const handleIsPlaying = (v) => {
    setVisible(v)
  }

  const interactChange = data =>{
    setRtcInfo(data)
    setInteractType(data.interactType)
  }

  useEffect(() => {
    let fn = () => {}
    let detailsFn = () => {}
    if (client && type === 'rtc') {
      let interactConfig = client.getInteractConfig()
      setInteractType(interactConfig.interactType)
      fn = client.on('interact-config-change', interactChange)
    }
    if (client) {
      detailsFn = client.on('load-data', data => {
        console.log('=====', data)
        setLiveDetails(data)
        let {cover} = data
        if (cover && cover.mobileCoverUrl) {
          console.log('===== im', )
          imTabListChange.next({ 
            label: '详情',
            key: '_details',
            icon: '//img.kaikeba.com/55134112400202ltzu.png',
            iframeUrl: cover.mobileCoverUrl
          })
        }
      })
    }
    return () => {
      client.off('interact-config-change', fn)
      client.off('load-data', detailsFn)
      

    }
  }, [client, type])


  return (
    <div
      className={cx('m-chat-slider')}
    >
      <div>
        {
          type === 'rtc' ? (
            <RTCTeacher
              handleIsPlaying={handleIsPlaying}
              interact={interactType !== RTC_INTERACTIVE_TYPE.close}  
              {...props} 
            /> 
          ) 
          : ''
        }
        {
          type === 'rtc' ? (
            <RTCCom 
            rtcInfo={rtcInfo} 
            style={(visible &&  interactType !== RTC_INTERACTIVE_TYPE.close)? {display: 'block'} : {display: 'none'}} 
            /> 
          ) : ''
          
        }
      </div>
      {
        type === 'rtc' ? (
          <RTCActBtn liveDetails={liveDetails} />
        ) : ''
      }
     
      {props.children}
    </div>
  )
}


export default filterComp(Slider, MSlider)
