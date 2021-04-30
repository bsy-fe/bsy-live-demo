/* eslint-disable no-unused-vars */
import React from 'react'
import {Button} from 'antd'
import {connect} from 'react-redux'
import className from 'classnames/bind'
import useSendBox from '@/components/IM/Hooks/useSendBox'
import ToolBar from './ToolBar'
import Emojis from './ToolBar/EmojisM'
import styles from './index.module.styl'

const s = className.bind(styles)

const SendBox = props => {
  const {
    userMute,
    elementStyles
  } = props
  const {
    inputDisabled,
    sendBtnDisabled,
    maskClick,
    inputSendMessage,
    inputHandler,
    toggleEmoji,
    inputPlaceholder,
    msgRef,
    textValue,
    setFocus,
    handlerInput,
    isFocus,
    isHasText,
    rows,
    isM,
    isGuestMode,
    showEmoji
  } = useSendBox(props, s)

  const Mask = isGuestMode && (
    <div onClick={maskClick} className={s('mask')}></div>
  )

  return isM ? (
    <div
      className={s([
        'sendbox-wrapper-m',
        inputDisabled ? 'sendbox-wrapper-mute' : ''
      ])}
    >
      {/* <ToolBar msgInputRef={msgRef} userMute={allMute}></ToolBar> */}
      {Mask}
      <div
        className={s(['edit-area-box', isFocus ? 'edit-area-box-foucs' : ''])}
      >
        <textarea
          disabled={inputDisabled}
          ref={msgRef}
          maxLength='500'
          rows={rows}
          placeholder={inputPlaceholder()}
          className={s(['edit-area', isFocus ? 'edit-area-foucs' : ''])}
          onInput={inputHandler}
          onChange={e => {
            // console.log('changegg', e)
          }}
          onFocus={e => {
            setFocus(true)
            handlerInput(e)
          }}
          /* onBlur={(e) => {
            console.log('blur', e)
            handlerInput(e)
            setFocus(false)
          }} */
        />

        <div
          className={s([
            'icon-e',
            userMute ? 'icon-mute' : '',
            showEmoji ? 'icon-active' : ''
          ])}
          onClick={toggleEmoji}
        ></div>
      </div>

      {isFocus || isHasText ? (
        <div className={s('send-area-box')}>
          <Button
            type='primary'
            className={s(['send-area', isHasText ? 'send-area-active' : ''])}
            disabled={sendBtnDisabled}
            onClick={inputSendMessage}
          >
            <div className={s('send-icon')}></div>
          </Button>

        </div>
      ) : null}
      {
        <div
          className={s('toolbar-wrapper-container')}
          style={{display: isFocus || isHasText ? 'none' : 'block'}}
        >
          <ToolBar
            msgInputRef={msgRef}
            isM={isM}
            handlerInput={handlerInput}
            userMute={inputDisabled}
          />{' '}
        </div>
      }

      {showEmoji && !userMute && (
        <Emojis
          emojiClick={() => {
            setFocus(true)
          }}
          msgInputRef={msgRef}
          userMute={inputDisabled}
          handlerInput={handlerInput}
        />
      )}
    </div>
  ) : (
    <div
      className={s([
        'sendbox-wrapper',
        inputDisabled ? 'sendbox-wrapper-mute' : ''
      ])}
    >
      {Mask}
      <ToolBar msgInputRef={msgRef} userMute={inputDisabled}></ToolBar>
      <textarea
        disabled={inputDisabled}
        ref={msgRef}
        maxLength='500'
        placeholder={inputPlaceholder()}
        className={s('edit-area')}
        onKeyDown={inputHandler}
        onInput={inputHandler}
        onFocus={inputHandler}
        style={elementStyles[0]}
      />
      <div className={s('send-area')}>
        <Button
          type='primary'
          className={s(['send-area', textValue ? 'send-area-active' : ''])}
          disabled={inputDisabled}
          onClick={inputSendMessage}
        >
          <img
            className={s('send-icon')}
            src='https://img.kaikeba.com/01140232400202hgcc.png'
          ></img>
        </Button>
      </div>
    </div>
  )
}
const mapStateToProps = state => ({
  userInfo: state.user.userInfo,
  chatRoomID: state.user.chatRoomID,
  userMute: state.user.isMute,
  allMute: state.message.allMute,
  elementStyles: state.message.elementStyles
})
const mapDispatchToProps = dispatch => ({
  addMessage: dispatch.message.addMessage
})

export default connect(mapStateToProps, mapDispatchToProps)(SendBox)
