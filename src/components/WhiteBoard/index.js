import React, {useContext, useState, useEffect} from 'react'

import classNames from 'classnames/bind'
import { GlobalContext } from '@/context'
import s from  './index.styl'

const cx = classNames.bind(s)

export default (props) => {
  let { client } = useContext(GlobalContext)

  let [src, setSrc ] = useState()
  useEffect(() => {
    console.log('=====whiteboard', client)
    setSrc(client.whiteBoardSrc)
    return () => {
      // cleanup
    }
  }, [client])

  return (
    <div className={cx('rtc-white-board')}>
      <iframe className={cx('white-board-iframe', props.hasPanel ? 'has-panel' : '')} src={src} frameBorder="0"></iframe>
    </div>
  )
}
