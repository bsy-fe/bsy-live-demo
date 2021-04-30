import React from 'react'
import classNames from 'classnames/bind'
import styles from './index.module.styl'

const s = classNames.bind(styles)

const Loading = props => {
  return (
    <div
      className={s('loading-wrapper')}
      style={{ display: props.show ? 'flex' : 'none' }}
    >
      载入中...
    </div>
  )
}

export default Loading
