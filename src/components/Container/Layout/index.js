import React  from 'react'
import classNames from 'classnames/bind'
import { filterComp, device, IsPC } from 'utils'
import s from  './index.styl'

const cx = classNames.bind(s)

const isIos = IsPC() && device('ios')

export const Layout = (props) => {
  return (
    <div id='bsy-liveroom' className={cx('bsy-liveroom')}>
      {props.children}
    </div>
  )

}

export const MLayout = props => {
  return (
    <div id='bsy-m-liveroom' className={cx('bsy-m-liveroom', isIos ? 'ios-fixed' : '')}>
      {props.children}
      <div id="m-addvert-container"></div>
    </div>
  )
}

export default filterComp(Layout, MLayout)
