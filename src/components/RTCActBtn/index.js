import React, { useState, useContext, useEffect } from 'react'
import classNames from 'classnames/bind'
import PopUp from '@/components/PopUp/PopUp'
import {showLiveDialog} from '@/components/PopUp/showLiveDialog'
import {BSYIM_TAB_ASK} from '@/consts'
import { GlobalContext } from '@/context'
import {  getLiveHeight } from 'utils'
import s from  './index.module.styl'
import ASK from '../../pages/IM/Ask'
import Activity from '../../pages/IM/Activity'

const cx = classNames.bind(s)


const RTCActBtn = (props) => {
  let { liveDetails } = props
  let {config} = useContext(GlobalContext)

  let { cover } = liveDetails
  let [QAVisible, setQAVisible] = useState(false)
  let [actVisible, setActVisible] = useState(false)
  let [bottom, setBottom] = useState()


  useEffect(() => {
    let {imHeight} = getLiveHeight(config.container)
    let h = `calc(${imHeight - 114}px - 18vw)`
    setBottom(h)
  }, [config])
  const handleQA = () => {
    // showLiveDialog({children: })
    setQAVisible(true)
  }

  const handleActive = () => {
    setActVisible(true)
  }

  const handleSale = () => {
    const children = <iframe src={cover.mobileCoverUrl} frameBorder="0" style={{width: '100%', height: '100%'}}/>
    showLiveDialog({children})
  }

  return (
    <div className={cx('active-btn-wrap')} id="active-btn-wrap"  style={{bottom}}>
      <div className={cx('active-box')} id="qa-btn" onClick={handleQA}>
        <span className={cx('btn-icon', 'qa-btn-icon')}></span>
        <span className={cx('active-name')}>
          <span className={cx('active-name-scale')}>问答</span>
        </span>       
      </div>
      <div className={cx('active-box')} id="active-btn" onClick={handleActive}>
        <span className={cx('btn-icon', 'active-btn-icon')}></span>
        <span className={cx('active-name')}>
          <span  className={cx('active-name-scale')}>活动</span>
        </span>
      </div>
      {
        (cover && cover.mobileCoverUrl) ? (
          <div className={cx('active-box', 'sale-btn')} id="sale-btn" onClick={handleSale}>
            <span className={cx('btn-icon', 'sale-btn-icon')}></span>
            <span className={cx('active-name')}>
              <span  className={cx('active-name-scale')}>详情</span>
            </span>      
          </div>
        ) : ''
      }
      
      {
        QAVisible ? <PopUp container={config.container} onClose={() => setQAVisible(false)}>
          <ASK activeKey={BSYIM_TAB_ASK} style={{backgroundColor: '#0c0c0c'}} />
        </PopUp> : ''
      }
      {
        actVisible ? <PopUp container={config.container} onClose={() => setActVisible(false)}>
          <Activity  style={{backgroundColor: '#0c0c0c'}}  />
        </PopUp> : ''
      }
    </div>
  )
}

export default RTCActBtn
