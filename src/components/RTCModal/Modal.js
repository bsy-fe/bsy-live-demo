import React from 'react'
import classNames from 'classnames/bind'
import s from  './index.module.styl'

const cx = classNames.bind(s)

const RTCModal = ({

  content= '我是内容啊',
  okText= '确定',
  cancelText = '取消',
  onYes,
  onNo
}) => {
  return (
    <div className={cx('rtc-mask')}>
      <div className={cx('rtc-confirm-container')}>
        <div 
          className={cx('rtc-close')}
          onClick={onNo}
        >
        </div>
        <div className={cx('rtc-content')}>
          {content}
        </div>
        <div className={cx('rtc-footer')}>
          <button 
            onClick={onNo}
            className={cx('rtc-btn-cancel')}
          >
            {cancelText}
          </button>
          <button 
            onClick={onYes}
            className={cx('rtc-btn-ok')}
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RTCModal