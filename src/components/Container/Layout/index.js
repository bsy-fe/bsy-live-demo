import React, { useState, useContext, useEffect } from 'react'
import classNames from 'classnames/bind'
import { GlobalContext } from '@/context'
import { filterComp, device, IsPC, getLiveHeight } from 'utils'
import s from  './index.styl'

const cx = classNames.bind(s)

const isIos = !IsPC() && device('ios')

export const Layout = (props) => {
  return (
    <div id='bsy-liveroom' className={cx('bsy-liveroom')}>
      {props.children}
    </div>
  )

}

export const MLayout = props => {

  let { config } = useContext(GlobalContext)
  let [containerHeight, setContainerHeight ] = useState()
  useEffect(() => {
    let {container} = config
    let height = getLiveHeight(container)
    setContainerHeight(height.containerHeight)
  }, [config])


  return (
    <div 
      id='bsy-m-liveroom' 
      className={cx('bsy-m-liveroom', isIos ? 'ios-fixed' : '')}
      style={isIos ? {height: containerHeight}: {}}
    >
      {props.children}
      <div id="m-addvert-container"></div>
    </div>
  )
}

export default filterComp(Layout, MLayout)
