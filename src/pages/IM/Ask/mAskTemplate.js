/**
 *@file 学生移动端答题ui
 */
import React from 'react'
import classNames from 'classnames/bind'
import style from './mItem.module.styl'

const ms = classNames.bind(style)
const questionEnum = new Map([
  [1, '单选题'],
  [2, '多选题'],
  [3, '不定选'],
  [4, '判断题']
])

const MAskTemplate = props => {
  const { currentRow } = props
  const handleAnswerQuestion = () => {
    props.handleAnswerQuestion()
  }
  return (
    <div onClick={handleAnswerQuestion} className={ms('m-ask-item-container')}>
      <div className={ms('m-ask-title-container')}>
        <div className={ms('m-ask-type-name')}>
          {questionEnum.get(currentRow.type)}
        </div>
        {currentRow.answerQuestion ? (
          <></>
        ) : (
          <div className={ms('m-ask-asked')}></div>
        )}
      </div>
      <div className={ms('m-ask-item-content')}>{currentRow.desc}</div>
    </div>
  )
}
export default MAskTemplate
