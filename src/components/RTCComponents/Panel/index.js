import React from 'react'

import classNames from 'classnames/bind'
import { filterComp } from '@/utils'
import s from  './index.styl'
import Watcher from '../Watcher'

const cx = classNames.bind(s)


const Panel = ({list, onClick}) => {
  return (
    <>
      <div className={cx('rtc-panel-wall')}>
        {
          list.map(item => {
            return (
              <Watcher 
                item={item} 
                key={item.buid} 
                handleClick={onClick}
              />
            )
          })
        }
      </div>
    </>
  )
}
const MPanel = ({list, onClick, style}) => {
  return (
    <div style={style}>
      <div className={cx('m-rtc-panel-wall')}>
        {
          list.map(item => {
            return (
              <Watcher 
                item={item} 
                key={item.buid} 
                handleClick={onClick}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default filterComp(Panel, MPanel)