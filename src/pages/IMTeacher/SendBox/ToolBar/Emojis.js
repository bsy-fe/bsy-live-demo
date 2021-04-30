import React, { useCallback } from 'react'
import { Popover } from 'antd'
import className from 'classnames/bind'
import { emojiMap, emojiName, emojiUrl } from 'utils/emojiMap'
import { insertSelectionText } from 'utils'
import styles from './index.module.styl'

const s = className.bind(styles)

const EmojiPopOver = props => {
  const { msgInputRef } = props
  // const msgInput = msgInputRef.current

  const hanlderInputEmoji = useCallback(
    emoji => {
      const msgInput = msgInputRef.current
      insertSelectionText(msgInput, emoji)
      msgInput.focus()
    },
    [msgInputRef]
  )
  return (
    <div className={s('emoji-wrapper')}>
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

const Emojis = props => {
  const emojis = EmojiPopOver(props)
  const { disabled } = props
  return (
    <div>
      {disabled ? (
        <div className={s(['tb-item', 'tb-item-emoji'])}>
          <div className={s(['icon', disabled ? 'icon-mute' : ''])} />
        </div>
      ) : (
        <Popover
          content={emojis}
          overlayClassName='emoji-popover'
          placement='topLeft'
          trigger='click'
        >
          <div className={s(['tb-item', 'tb-item-emoji'])}>
            <div className={s(['icon', disabled ? 'icon-mute' : ''])} />
          </div>
        </Popover>
      )}
    </div>
  )
}

export default Emojis
