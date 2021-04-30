import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames/bind'
import s from './index.styl'

const cx = classNames.bind(s)

function useAnimate() {
  let [className, setClassName] = useState()
  let [state, setState] = useState('')

  useEffect(() => {
    if (state) {
      setClassName(`animate__animated animate__${state}`)
    } else {
      setClassName()
    }
  }, [state])

  function start(suffix) {
    setState(suffix)
  }

  return [className, start]
}

export default (props) => {
  let drawerRef = useRef(false)
  let { height = 300} = props
  let [className, start] =  useAnimate()
  
  useEffect(() => {
    if (!drawerRef.current) {
      drawerRef.current = true
      return
    }
    if (props.visible)  {
      start('fadeInUp')
    } else {
      start('fadeInDown')
    }
  }, [props.visible])

  return (
    <div 
      className={cx('drawer-wall', className)}
      style={{height}} 
    >
      <div className={cx('drawer-mask')}></div>
      <div className={cx('drawer-content-wrapper')}>
        <div className={cx('drawer-close')}>
          {props.header ? props.header : (
            <div onClick={props.onCancel}>取消</div>
          )}
        </div>
        <div className={cx('drawer-content')}>
          {props.content}
        </div>
      </div>
    </div>
  )
}
