import React from 'react'
import className from 'classnames/bind'
import { QUESTION_ENUM } from '@/consts'
import { IsPC } from '@/utils'
import {globalConst} from '@/consts/globalConst'
import IMUtil from 'utils/IMUtil'
import styles from './index.module.styl'
import MAskTemplate from './mAskTemplate'

const isM = !IsPC()
const s = className.bind(styles)

const AskItem = props => {
  const { refresh, currentRow, isLesson } = props

  const handleAnswerQuestion = () => {
    IMUtil.showAskModal(currentRow)
    // window.BSYIM.handlerAskMessage(data, 'pageStudent')
    // globalConst.client.triggerAsk({
    //   data,
    //   type: 'pageStudent'
    // })
  }

  const StudentTemplate = () => {
    // 学生需兼容移动端
    const pcDom = (
      <div onClick={handleAnswerQuestion} className={s('ask-item-container')}>
        <div className={s('ask-title-container')}>
          <div className={s('ask-type-name')}>
            {QUESTION_ENUM.get(currentRow.type)}
          </div>
          {currentRow.answerQuestion ? (
            <></>
          ) : (
            <div className={s('ask-asked')}>未答</div>
          )}
        </div>
        <div className={s('ask-item-content')}>{currentRow.desc}</div>
      </div>
    )

    return (
      <>
        {isM ? (
          <MAskTemplate
            currentRow={currentRow}
            handleAnswerQuestion={handleAnswerQuestion}
          />
        ) : (
          pcDom
        )}
      </>
    )
  }
  return (
    <div className={s('student-ask-item')}>
      <StudentTemplate />
    </div>
  )
}

export default AskItem
