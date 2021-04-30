import React from 'react'
import classNames from 'classnames/bind'
import s from  './index.styl'

const cx = classNames.bind(s)

const Loading = (props) => {
  return (
    <div className={cx('loading')}>
      <div className={cx('loading-block')}>
        <div className={cx('loading4')}>
          <div className={cx('three1')}></div>
          <div className={cx('three2')}></div>
          <div className={cx('three3')}></div>
        </div>
        {props.children}
        <p className={cx('tips')}>进入直播间</p>
      </div>
    </div>
  )
}

export default Loading