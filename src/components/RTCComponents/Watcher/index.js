import React from 'react'
import classNames from 'classnames/bind'
import {filterComp} from '@/utils'
import s from './index.styl'

const cx = classNames.bind(s)

const Watcher = (props) => {
  let {item, handleClick} = props

  return (
    <div id='rtc-view-wall'>
      <div data-id={item.buid} className={cx('rtc-view')}>
        <div
          className={`rtc-content ${(item.otherVideoDisabled || item.configVideoDisable || item.videoDisable || item.selfVideoDisable) ? 'rtc-content-disable' : ''}`}
          id={`rtc-${item.buid}`}/>
        <div className={cx('rtc-horn')}/>
        {item.isSelf || item.isAdmin ? (
          <div className={cx('rtc-view-mask')}>
            <div className={cx('rtc-action-wrapped')}>
              <div
                className={cx('rtc-hangup rtc-icon')}
                onClick={() => {
                  handleClick({
                    type: 'hangup',
                    item
                  })
                }}
              />
              <div
                className={cx(`rtc-video rtc-icon ${item.configVideoDisable
                  ? 'rtc-video-disable'
                  : item.videoDisable || item.selfVideoDisable
                    ? 'rtc-video-disable'
                    : ''
                }  ${item.interactType !== 'video' ? 'rtc-video-hidden' : ''}`)}
                onClick={() => {
                  handleClick({
                    type: 'video',
                    item
                  })
                }}
              />
              <div
                className={cx(`rtc-audio rtc-icon ${item.configAudioDisable
                  ? 'rtc-audio-disable'
                  : item.audioDisable || item.selfAudioDisable
                    ? 'rtc-audio-disable'
                    : ''
                }`)}
                onClick={() => {
                  handleClick({
                    type: 'audio',
                    item
                  })
                }}
              />
            </div>
          </div>
        ) : (
          ''
        )}
        <div className={cx('student-info')}>
          {
            item.isSelf || item.isAdmin ? (
              <div className={cx('rtc-username')}>{item.isSelf ? '??????' : item.nickname}</div>
            ) : (
              <div className={cx('rtc-username')}>?????????{item.nickname}</div>
            )
          }
          <div
            className={cx(`rtc-audio rtc-user-status ${(item.configAudioDisable || item.audioDisable || item.otherAudioDisabled)
              ? 'rtc-audio-disable'
              : ''
            }`)}
          />
        </div>
        <div id={`muted-${item.buid}`} className={cx('cancel-muted')}>
          <div className={cx('muted-icon-wall')}>
            <img className={cx('muted-icon')} src="https://res-qn.baoshiyun.com/a/64344190801202oajd.png?imageView2/0/interlace/1/q/90|imageslim" />
          </div>
        </div>
      </div>
    </div>
  )
}

const MWatcher = (props) => {
  let {item} = props
  return (
    <div id='m-rtc-view-wall'>
      <div data-id={item.buid} className={cx('m-rtc-view')}>
        <div className={cx(`m-rtc-content ${item.otherVideoDisabled ? 'm-rtc-content-disable' : ''}`)}
             id={`rtc-${item.buid}`}/>
        {item.isSelf ? (
          <div
            className={cx(`m-rtc-view-mask ${item.isSelf ? 'm-rtc-view-mask-self' : ''}`)}
          >
            <div className={cx('m-rtc-horn')}></div>
            <div className={cx('m-rtc-view-content')}>
              <div className={cx('m-rtc-nickname')}>
                ??????
              </div>
              {item.roleType === 1 && !item.isStream && (
                <div className={cx('m-rtc-no-stream')}>???????????????</div>
              )}
              {item.isSelf && (
                <div
                  className={cx(`m-rtc-audio m-rtc-user-status ${
                    item.configAudioDisable
                      ? 'm-rtc-audio-disable'
                      : item.audioDisable && 'm-rtc-audio-disable'
                  }`)}
                />
              )}
            </div>
          </div>
        ) : (
          <div className={cx('m-rtc-view-mask')}>
            <div className={cx('m-rtc-horn')}/>
            <div className={cx('m-rtc-view-content')}>
              <div className={cx('m-rtc-nickname')}>?????????{item.nickname}</div>
              <div
                className={cx(`m-rtc-audio m-rtc-user-status ${
                  (item.configAudioDisable || item.audioDisable || item.otherAudioDisabled)
                    ? 'm-rtc-audio-disable'
                    : ''
                }`)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default filterComp(Watcher, MWatcher)


