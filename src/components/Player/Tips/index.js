import React from 'react'
import classNames from 'classnames/bind'
import { IsPC } from 'utils'
import s from './index.styl'

const cx = classNames.bind(s)

const WEB_TIPS_TEXT = {
  ready: {
    img: 'https://res-qn.baoshiyun.com/a/45330180401202dsza.png',
    text: '直播未开始',
  },
  finished: {
    img: 'https://img.kaikeba.com/a/25648151500202tmkd.png',
    text: '休息一下',
  },
  suspend: {
    img: 'https://img.kaikeba.com/a/25648151500202tmkd.png',
    text: '休息一下',
  },
  stopped: {
    img: 'https://img.kaikeba.com/a/25648151500202tmkd.png',
    text: '休息一下',
  },
}

const WAP_TIPS_TEXT = {
  ready: {
    img: 'https://img.kaikeba.com/a/72535151600202akyz.png',
    text: '直播未开始',
  },
  finished: {
    img: 'https://img.kaikeba.com/a/15945151600202lnvu.png',
    text: '休息一下',
  },
  suspend: {
    img: 'https://img.kaikeba.com/a/72535151600202akyz.png',
    text: '休息一下',
  },
  stopped: {
    img: 'https://img.kaikeba.com/a/15945151600202lnvu.png',
    text: '休息一下',
  },
}

const WebTips = ({ status }) => {
  console.log('=====', status)
  let content = WEB_TIPS_TEXT[status]
  return (
    <div className={cx('tips-wall')}>
      <div className={cx('tips')}>
        <img className={cx('tips-img')} src={content.img} alt='未开始' />
        <p className={cx('tips-text')}>{content.text}</p>
      </div>
    </div>
  )
}

const WapTips = ({ status }) => {
  console.log('=====', status)
  let content = WAP_TIPS_TEXT[status]
  return (
    <div className={cx('m-tips-wall')}>
      <div className={cx('m-tips')}>
        <img className={cx('m-tips-img')} src={content.img} alt='未开始' />
        <p className={cx('m-tips-text')}>{content.text}</p>
      </div>
    </div>
  )
}

export default IsPC() ? WebTips : WapTips
