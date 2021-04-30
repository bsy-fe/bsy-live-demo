import React, { useState} from 'react'
import classNames from 'classnames/bind'
import {BSYIM_TAB_LIVEGOODS} from '@/consts'
import {tabChanger} from '@/consts/subjects'
import s from './index.styl'
import MobileDrawer from '../MobileDrawer'

const cx = classNames.bind(s)

export const Addvert = (props) => {
  let {isText, content, link, showWay} = props


  const renderContent = isText ? (
    <p className={cx('living-ad-text')}>
      <span className={cx('text')}>{content}</span>
    </p>
  ) : (
    <img
      className={cx('living-ad-img')}
      src={content}
    />
  )
  return showWay === 2 ? <div
    id="living-ad-wall"
    className={cx('living-ad-wall', isText ? 'is-text' : '')}
  >
    {
      renderContent
    }
  </div> : (
    <a
      id="living-ad-wall"
      className={cx('living-ad-wall', isText ? 'is-text' : '')}
      href={link}
      target="_blank"
    >
      {
        renderContent
      }
    </a>
  )
}


export const MAddvert = props => {
  let {isText, content, link, showWay, isLive} = props
  let [visible, setVisible] = useState(false)

  const handleClick = (event) => {
    event.preventDefault()
    if (showWay === 2 && isLive) {
      tabChanger.next(BSYIM_TAB_LIVEGOODS)
    } else {
      setVisible(true)
    }
  }

  return (
    <div>
       <a
          id="m-living-ad-wall"
          className={cx('m-living-ad-wall', isText ? 'm-is-text' : '')}
          href={link}
          target="_blank"
          onClick={handleClick}
        >
          {
            isText ? (
              <p className={cx('m-living-ad-text')}>
                <span className={cx('m-text')}>{content}</span>
              </p>
            ) : (
              <img
                className={cx('m-living-ad-img')}
                src={content}
              />
            )
          }
       </a>
      <MobileDrawer
        visible={visible}
        onCancel={() => setVisible(false)}
        height={500}
        content={
          <iframe src={link} frameBorder="0" width={'100%'} height={'100%'}/>
        }
      />
    </div>
   
  )
}
