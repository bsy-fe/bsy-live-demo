import React, { useState, useEffect, useContext, useRef } from 'react'

import classNames from 'classnames/bind'
import { GlobalContext } from '@/context'
import { filterComp } from '@/utils'
import s from './index.module.styl'



const cx = classNames.bind(s)


const PlayBtn = (props) => {
  let { visible } = props
  if (!visible) {
    return ''
  }
  return (
    <div className={cx('rtc-play-btn')} onClick={props.onClick}>
      <img className={cx('play-icon')} src="https://img.kaikeba.com/a/72838152500202iazy.png" />
    </div>
  )
}

const MPlayBtn = (props) => {
  if (!props.visible) {
    return ''
  }
  return (
    <div className={cx('m-rtc-play-btn-wrap')}>
      <div 
        onClick={props.onClick}
        className={cx('m-rtc-play-btn')}
      >
        <img className={cx('m-btn-play')} src="https://res-qn.baoshiyun.com/a/43528180301202tcms.png" alt=""/>
        点击按钮，开始播放视频
      </div>
    </div>

  )
}

function playStream(instance, uid) {
  return instance.interactLive.rtc.playStream(
    uid,
    'teacher-video',
    {
      fit: 'cover',
      muted: false
    }
  )
}

const useTeacher = (props) => {
  let playClickRef = useRef(false)
  let teacherUid = useRef()
  let { client } = useContext(GlobalContext)
  let [ visible, setVisible] = useState(false)
  let [ isPlayerSuccess, setPlayerSuccess] = useState(false)
  const [videoDisabled, setVideoDisabled] = useState(false)
  const handleIsPlaying = (d) => {
    props.handleIsPlaying && props.handleIsPlaying(d)
  }

  // 重置播放
  const resetPlayer = () => {
    document.querySelector('#teacher-video').innerHTML = ''
    let isSuccess = playStream(client,  teacherUid.current)
    setPlayerSuccess(isSuccess)
  }

  const requestStats = () => {
    if(isPlayerSuccess && client.interactLive.rtc) {
      const videoMuted = client.interactLive.rtc.isVideoMuted(teacherUid.current)
      console.log('=============video muted::', videoMuted)
      setVideoDisabled(videoMuted)
      // client.interactLiveController.instance.rtc.getRemoteVideoStats().then( stats => {
      //   console.log('=============stats::', stats)
      //   if(!stats[teacherUid.current] || !stats[teacherUid.current].MuteState) {
      //       timer(1000).subscribe(() => {
      //         requestStats()
      //       })
      //   }
      // })
    }
  }


  // 播放按钮
  const handlePlay = () => {
    console.log('=====handlePlay')
    playClickRef.current = true
    let isSuccess = playStream(client, teacherUid.current)
    console.log('=====setPlayerSuccess', isSuccess)
    setPlayerSuccess(isSuccess)
    setVisible(false)
    handleIsPlaying(true)
  }

  const teacherOnline = data => {
    console.log('=====teacherOnline', client, data, playClickRef.current)
    teacherUid.current = data.uid
    if (playClickRef.current) {
      resetPlayer()
      handleIsPlaying(true)
    } else {
      setVisible(true)
      handleIsPlaying(false)
    }
    requestStats()
  }

  const teacherOffline = () => {
    setVideoDisabled(false)
    document.querySelector('#teacher-video').innerHTML = ''
  }

  const checkTeacherDisableVideo = (event) => {
    console.log('=============checkTeacherDisableVideo event::', event, teacherUid.current)
    if(String(event.uid) === String(teacherUid.current)) {
      // 是当前老师把自己的视频流关闭了
      setVideoDisabled(true)
    }
  }

  const checkTeacherEnableVideo = (event) => {
    console.log('=============checkTeacherEnableVideo event::', event, teacherUid.current)
    if(String(event.uid) === String(teacherUid.current)) {
      // 是当前老师把自己的视频流打开了
      setVideoDisabled(false)
      let videoDom = document.querySelector('#teacher-video').querySelector('video')
      if (videoDom && videoDom.style.display === 'none') {
        setTimeout(() => {
          videoDom.style.display = 'block'
        }, 3000)
      }
    }
  }

  useEffect(() => {
    let teacherOnlineFn = null
    let teacherOfflineFn = null
    let checkTeacherDisableVideoFn = null
    let checkTeacherEnableVideoFn = null
    teacherOnlineFn = client.on('teacher-online', teacherOnline)
    teacherOfflineFn = client.on('teacher-offline', teacherOffline)
    checkTeacherDisableVideoFn = client.on('user-video-disabled', checkTeacherDisableVideo)
    checkTeacherEnableVideoFn = client.on('user-video-enabled', checkTeacherEnableVideo)

    return () => {
      // cleanup
      client.off('teacher-online', teacherOnlineFn)
      client.off('teacher-offline', teacherOfflineFn)
      client.off('user-video-disabled', checkTeacherDisableVideoFn)
      client.off('user-video-enabled', checkTeacherEnableVideoFn)

    }
  }, [client])

  useEffect(() => {
    if (props.liveStatus === 'finished') {
      setVideoDisabled(false)
      document.querySelector('#teacher-video').innerHTML = ''
    }
  }, [props.liveStatus])


  useEffect(() => {
    console.log('=============change ::', isPlayerSuccess, client.interactLive)
    requestStats()

  }, [isPlayerSuccess, client.interactLive])


  return {
    visible,
    isPlayerSuccess,
    handlePlay,
    videoDisabled
  }
}

export const Teacher = (props) => {
  let {visible, handlePlay, videoDisabled} = useTeacher(props)

  return (
    <div className={cx('rtc-teacher-container')} style={props.style}>
      {
        props.liveStatus !== 'running' ? <p className={cx('rtc-teacher-tip')}>休息一下</p> : (
          <PlayBtn
            visible={visible}
            onClick={handlePlay}
          />
        )
      }
      <div id="teacher-video" className={cx('teacher-video-wrap')}></div>
      {
        videoDisabled && !visible ? <div className={cx('teacher-video-disabled')} /> : null
      }
    </div>
  )
}


export const MTeacher = (props) =>{ 
  let {visible, handlePlay, isPlayerSuccess, videoDisabled} = useTeacher(props)
  console.log('=====MTeacher', visible )
  return (
    <div className={cx('m-rtc-teacher-container')} style={props.style}>
      <MPlayBtn 
        visible={visible}
        onClick={handlePlay}
      />
      <div className={cx( props.interact ? 'm-teacher-container-rtc' : 'm-teacher-container-live' )} >
        <div id="teacher-video" className={cx('m-teacher-video-wrap', props.interact ? 'm-interact' : '')}></div>
        {
          props.interact && isPlayerSuccess ? (
            <div className={cx('m-teacher-content') } >
              <div className={cx('m-teacher-tag')}>老师</div>
              {/* <div className={cx('m-teacher-audio')}></div> */}
            </div>
          ) : ''
        }
      </div>
      {
       ( props.interact && videoDisabled && !visible) ? <div className={cx('m-teacher-video-disabled')} /> : null
      }
    </div>
  )
}

export default filterComp((Teacher), (MTeacher))
