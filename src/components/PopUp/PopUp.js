/**
 * @author 杨欣
 * @date 2021-04-09 14:45
 */
import React, {useEffect, useState} from 'react'
import {getLiveHeight, IsPC} from 'utils'
import s from './index.module.less'

const PopUp = ({onClose, container = document.body, ...props}) => {
  
  const isM = !IsPC()

  const {children} = props



  const [popupHeight, setPopUpHeight] = useState(0)

  useEffect(() => {
    if(container && isM) {

      const {imHeight} = getLiveHeight(container)
      console.log('popupHeight: ', imHeight)

      setPopUpHeight(imHeight)
    }
  } ,[container])
  
  return isM ? <div className={s.mBsyLivePopupWrapper} onClick={onClose}>
    <div className={s.mBsyLivePopup} style={{height: popupHeight || '50vh'}} onClick={e => e && e.stopPropagation()}>
      <div className={s.closeBtn} onClick={onClose}>x</div>
      {
        children || '没有内容'
      }
    </div>
  </div> : <div className={s.bsyLivePopupWrapper}>
    <div className={s.bsyLivePopup}>
      <div className={s.closeBtn} onClick={onClose}>x</div>
      {
        children || '没有内容'
      }
    </div>
  </div>
}

export default PopUp
