import React, { useCallback } from 'react'
import className from 'classnames/bind'
import { connect } from 'react-redux'
import { Button } from 'antd'
import styles from './index.module.styl'

const s = className.bind(styles)
const action = {
  KEYWORDS_WINNER: '红包',
  TOPIC_ANSWER: '答题'
}

const SpecialMessage = props => {
  const { specialMessage, setSpecialMessage } = props
  const clickHandle = useCallback(() => {
    setSpecialMessage({
      specialMessage: {}
    })
  })

  return (
    <>
      {specialMessage.proto_name && (
        <div className={`${s('special-msg-wrapper')}`}>
          <div className={s('sm-content')}>
            <h3 className={s('title')}>{action[specialMessage.proto_name]}</h3>
            <div className={s('con')}>
              <span>点击获取：</span>
              <a
                href={specialMessage.content.action_url}
                target='_blank'
                onClick={clickHandle}
              >
                {specialMessage.content.action_url}
              </a>
              <div className={s('btn-group')}>
                <Button type='primary' onClick={clickHandle}>
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const mapStateToProps = state => ({
  specialMessage: state.message.specialMessage
})
const mapDispatchToProps = dispatch => ({
  setSpecialMessage: dispatch.message.setSpecialMessage
})

export default connect(mapStateToProps, mapDispatchToProps)(SpecialMessage)
