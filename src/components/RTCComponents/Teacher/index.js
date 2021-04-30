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
  const handleIsPlaying = (d) => {
    props.handleIsPlaying && props.handleIsPlaying(d)
  }

  // 播放按钮
  const handlePlay = () => {
    console.log('=====handlePlay')
    playClickRef.current = true
    let isSuccess = playStream(client, teacherUid.current)
    setPlayerSuccess(isSuccess)
    setVisible(false)
    handleIsPlaying(true)
  }

  const teacherOnline = data => {
    console.log('=====teacherOnline', client, data, playClickRef.current)
    teacherUid.current = data.uid
    if (playClickRef.current) {
      document.querySelector('#teacher-video').innerHTML = ''
      let isSuccess = playStream(client, data.uid)
      setPlayerSuccess(isSuccess)
      handleIsPlaying(true)
    } else {
      // teacherUid
      setVisible(true)
      handleIsPlaying(false)
    }
  }

  const teacherOffline = () => {
    document.querySelector('#teacher-video').innerHTML = ''
  }

  useEffect(() => {
    let teacherOnlineFn = null
    let teacherOfflineFn = null
    client.on('teacher-online', teacherOnline)
    client.on('teacher-offline', teacherOffline)
    return () => {
      // cleanup
      client.off('teacher-online', teacherOnlineFn)
      client.off('teacher-offline', teacherOfflineFn)
    }
  }, [client])

  useEffect(() => {
    if (props.liveStatus === 'finished') {
      document.querySelector('#teacher-video').innerHTML = ''
    }
  }, [props.liveStatus])

  return {
    visible,
    isPlayerSuccess,
    handlePlay
  }
}

export const Teacher = (props) => {
  let {visible, handlePlay} = useTeacher(props)

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
    </div>
  )
}


export const MTeacher = (props) =>{ 
  let {visible, handlePlay, isPlayerSuccess} = useTeacher(props)
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
    </div>
  )
}

export default filterComp(Teacher, MTeacher)