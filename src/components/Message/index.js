/**
 * @author 杨欣
 * @date 2021-04-09 14:45
 */
import React, {useEffect, useState} from 'react'
import {interval} from 'rxjs'
import {delay, tap} from 'rxjs/operators'
import s from './index.module.less'
import {MessageIcons} from './consts'



const Message = (props) => {


  const {content, type, time, onDestroy} = props

  const [visibleClass, setVisibleClass] = useState()

  const icon = MessageIcons[type]

  useEffect(() => {
    setTimeout(() => {
      console.log('mounted, props, ', props)
      setVisibleClass(s.visible)
    })

  }, [])
  
  useEffect(() => {
    let intervalTime = 3000
    if(typeof time === 'number' && !Number.isNaN(time)) {
      intervalTime = time
    }
    const subscription = interval(intervalTime).pipe(tap(() => {
      setVisibleClass(s.faded)
    }), delay(300)).subscribe(() => {
      onDestroy && onDestroy()
    })

    return () => {
      subscription && subscription.unsubscribe()
      onDestroy && onDestroy()
    }
  }, [time])

  return <div className={`${s.bsyMessageWrapper} ${visibleClass}`}>
    <span className={s.bsyIconWrapper}>
      <img src={`${icon}`} className={s.bsyIcon} alt=''/>
    </span>
    <span className={s.bsyTextWrapper}>
      {
        content || ''
      }
    </span>
  </div>
}

export default Message
