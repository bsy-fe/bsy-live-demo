import React, { useCallback } from 'react'
import { Popover } from 'antd'
import className from 'classnames/bind'
import { emojiMap, emojiName, emojiUrl } from 'utils/emojiMap'
import { insertSelectionText } from 'utils'
import styles from './index.module.styl'

const s = className.bind(styles)

const Emojis = props => {
  const { msgInputRef, emojiClick, handlerInput } = props
  // const msgInput = msgInputRef.current
  const hanlderInputEmoji = useCallback(
    emoji => {
      const msgInput = msgInputRef.current
      insertSelectionText(msgInput, emoji)
      // msgInput.blur()
      console.log(props.handlerInput, 'handlerInput', props)
      props.handlerInput && props.handlerInput()

      // 告诉上一级被点击了 来更改显示状态
      emojiClick && emojiClick()
    },
    [msgInputRef, handlerInput]
  )
  return (
    <div id='emoji-wrapper-m' className={s('emoji-wrapper-m')}>
      {emojiName.map(emoji => {
        return (
          <div
            className={s('emoji')}
            key={emoji}
            onClick={() => {
              hanlderInputEmoji(emoji)
            }}
          >
            <img
              className={s('emj-img')}
              src={emojiUrl + emojiMap[emoji]}
              alt=''
            />
          </div>
        )
      })}
    </div>
  )
}

const EmojisM = props => {
  const EmojisC = Emojis(props)
  const { userMute } = props
  return <div>{EmojisC}</div>
}

export default EmojisM
