import React, {useEffect, useState} from 'react'
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

  const [loading, setLoading] = useState(false)

  useEffect(() => {

  } , [onYes, onNo])


  const innerOnYes = (e) => {
    setLoading(true)
    const res = onYes(e)

    if(res.then) {
      res.finally(() => {
        setLoading(false)
      })
    } else {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const innerOnNo = (e) => {
    setLoading(true)

    const res = onNo(e)

    if(res.then) {
      res.finally(() => {
        setLoading(false)
      })
    } else {
      setTimeout(() => setLoading(false), 1000)
    }
  }

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
            onClick={innerOnNo}
            disabled={loading}
            className={cx('rtc-btn-cancel')}
          >
            {cancelText}
          </button>
          <button
            disabled={loading}
            onClick={innerOnYes}
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
