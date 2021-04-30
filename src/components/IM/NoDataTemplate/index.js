import React from 'react'
import { IsPC } from '@/utils'
import classNames from 'classnames/bind'

import styles from './style.styl'
import mStyles from './mstyle.styl'

const isM = !IsPC()
const s = classNames.bind(styles)
const ms = classNames.bind(mStyles)

const NoDataTemplate = props => {
  const { noData } = props
  let defaultUrl
  if (isM) {
    defaultUrl = '//img.kaikeba.com/a/42337182600202ynef.png'
  } else {
    defaultUrl = '//img.kaikeba.com/85119171400202rjbi.png'
  }
  const pcDom = (
    <div className={s('nodata-container')}>
      <div className={s('no-template-container')}>
        <img
          src={noData.url ? noData.url : defaultUrl}
          className={s('nodata-img')}
        />
        <p className={s('nodata-info')}>{noData.info}</p>
      </div>
    </div>
  )
  const mobileDom = (
    <div className={ms('m-no-template-container')}>
      <img
        src={noData.url ? noData.url : defaultUrl}
        className={ms('m-nodata-img')}
      />
      <p className={ms('m-nodata-info')}>{noData.info}</p>
    </div>
  )
  return <>{isM ? mobileDom : pcDom}</>
}
export default NoDataTemplate
