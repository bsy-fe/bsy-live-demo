import React from 'react'
import classNames from 'classnames/bind'
import { IsPC } from '@/utils'
import {showLiveDialog} from '@/components/PopUp/showLiveDialog'
import styles from './index.module.styl'

const isM = !IsPC()

const s = classNames.bind(styles)
const ItemList = props => {
  const { refresh, currentRow, isLesson } = props

  // 学生查看活动
  const handleStudentAct = item => {
    const url = IsPC() ? item.ext.web_url : item.ext.mobile_url
    const children = <iframe src={url} frameBorder="0" style={{width: '100%', height: '100%'}}/>
    // window.BSYIM.handlerActivityMessage(data)
    showLiveDialog({children})
  }

  const StudentTemplate = () => {
    const pcDom = (
      <>
        <li
          className={`${s('list-item')} ${s('list-cur')}`}
          onClick={() => handleStudentAct(currentRow)}
        >
          {currentRow.name}
        </li>
      </>
    )
    const mobileDom = (
      <>
        <li
          className={s('m-list-item')}
          onClick={() => handleStudentAct(currentRow)}
        >
          {currentRow.name}
        </li>
      </>
    )
    return <ul>{isM ? mobileDom : pcDom}</ul>
  }
  return (
    <div
      className={`${s('activity-item-list')} ${
        isM ? s('m-activity-item-list') : ''
      }`}
    >
     <StudentTemplate/>
    </div>
  )
}
export default ItemList
