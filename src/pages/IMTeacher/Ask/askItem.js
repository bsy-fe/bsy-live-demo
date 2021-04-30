import React, {useState} from 'react'
import className from 'classnames/bind'
import {message} from 'antd'
import {sendAsk} from '@/api/ask'
import {QUESTION_ENUM} from '@/consts'
import eye from '@/assets/eye.svg'
import send from '@/assets/send.svg'
import IMUtil from 'utils/IMUtil'
import styles from './index.module.styl'


const s = className.bind(styles)


const sendQuestion = async (item) => {
  let id = item.questionId
  try {
    const res = await sendAsk(id)

    if (String(res.code) === '1') {
      message.success('发送成功', 1)
    }

    return res
  } catch(res) {
    let {msg} = res
    if(res.data) {
      msg = res.data.msg
    }
    message.error(msg, 1)
    return res
  }
}
const questResult = data => {
  // window.BSYIM.handlerAskMessage(data, 'pageTeacher')
  IMUtil.showAskModal(data)
  // globalConst.client.triggerAsk({
  //   data,
  //   type: 'pageTeacher'
  // })
}
const AskItem = props => {
  const { refresh, currentRow, isLesson } = props

  const [sending, setSending] = useState(false)
  const handleClick = item => {
    if(isLesson) {
      return
    }

    if (item.isSend === 1) {
      // 查看结果
      questResult(item)
    } else if (!sending) {
      // 发送
      setSending(true)
      sendQuestion(item).then(res => {
        refresh()
      }).finally(() => {
        setSending(false)
      })
    }
  }


  return (
    <div className={s('ask-item')}>
      <div className={`${s('ask-item-container')} ${s('ask-no-cur')}`}>
        <div className={s('ask-item-tea-content')}>
          {currentRow.description}
        </div>
        <div className={s('ask-item-bottom')}>
          <span className={s('ask-item-type')}>
            {currentRow.questionId} · {QUESTION_ENUM.get(currentRow.type)}
          </span>
          <span
            className={s('ask-send-btn')}
            onClick={() => handleClick(currentRow)}
          >
            {currentRow.isSend === 1 ? (
              <>
                <img
                  src={eye}
                  className={s('ask-send-icon')}
                />
                <span className={s('ask-send-txt')}>查看结果</span>
              </>
            ) : (
              <>
                <img
                  src={send}
                  className={s('ask-send-icon')}
                />
                <span className={s('ask-send-txt')}>发送题目</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AskItem
