import React from 'react'
import classNames from 'classnames/bind'
import { filterComp } from '@/utils'
import s from  './index.styl'
import Tips from './Tips'
import RTCComponents from '../RTCComponents'
import Whiteboard from '../WhiteBoard'

const cx = classNames.bind(s)


const Player = (props) => {
  let { liveStatus, type } = props
  return (
    <div className={cx('player-wrapper')}>
       <div 
        id={cx('player-container')}
        style={ type !== 'live' ? {display: 'none'} : {}}
       ></div>
      {
        type === 'rtc' &&  <RTCComponents {...props} />
      }

      {/* 播放提示 */}
      {
        typeof liveStatus === 'string' && liveStatus !== 'running' ? (
          <Tips 
            status={liveStatus}
          />
        ) : ''
      }
    </div>
  )
}


const MPlayer = props =>{
  let { liveStatus, type } = props
  console.warn('=====MPlayer', liveStatus, type )

  return (
    <div className={cx('player-wrapper')}>
       <div 
        id={cx('player-container')}
        style={ type !== 'live' ? {display: 'none'} : {}}
       ></div>
      {
        type === 'rtc' &&  <Whiteboard {...props} />
      }

      {/* 播放提示 */}
      {
        typeof liveStatus === 'string' && liveStatus !== 'running' ? (
          <Tips 
            status={liveStatus}
          />
        ) : ''
      }
    </div>
  )
}

export default filterComp(Player,MPlayer )