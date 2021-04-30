import React, { useState, useContext, useEffect } from 'react'
import classNames from 'classnames/bind'
import { GlobalContext } from '@/context'
import { getLiveHeight , filterComp } from 'utils'
import s from  './index.styl'


const cx = classNames.bind(s)

const MainContainer = (props) => {

  return (
    <div className={cx('main-content')}>
      <div id='addvert-container' style={{display: 'none'}}></div>
      {props.children}
    </div>
  )
}


const MMainContainer = props => {

  let { config } = useContext(GlobalContext)
  let [playerHeight, setPlayerHeight ] = useState()
  useEffect(() => {
    let {container} = config
    let height = getLiveHeight(container)
    setPlayerHeight(height.playerHeight)
  }, [config])


  return (
    <div 
      className={cx('m-live-content')}
      style={{height: playerHeight }}
    >
      {props.children}
    </div>
  )
}

export default filterComp(MainContainer, MMainContainer)
