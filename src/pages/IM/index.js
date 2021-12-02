/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React from 'react'
import classNames from 'classnames/bind'
import { Tabs } from 'antd'
import {
  BSYIM_TAB_CHAT,
  BSYIM_TAB_ASK,
  BSYIM_TAB_ACTIVITY,
  BSYIM_TAB_GOODS,
  BSYIM_INITIAL_MODE
} from '@/consts'

import InitialEntry from '@/components/IM/InitialEntry'
import { IsPC, getRtcImHeight } from 'utils'
import Loading from '@/components/IM/Loading'
import {defaultStudentTabList as defaultTabList} from '@/consts/tabList'
import { imTabListChange } from '../../consts/subjects'
import ChatRoom from './ChatRoom'
import styles from './index.module.styl'

// role修改为： 1：教师、2：助教、3：班主任、4：学生
const isM = !IsPC()
const s = classNames.bind(styles)

class IM extends InitialEntry {

  state = {
    tabPaneList: defaultTabList,
    imModeStyle: {}
  }

  rerender = () => {
    const { initialMode, config } = this.props
    let style = {
      backgroundColor: isM ? 'transparent' : null
    }
    // console.log('active', initialMode)
    if (initialMode === BSYIM_INITIAL_MODE.imMode) {
      let height = getRtcImHeight(config.container)

      style.height = height
    }
    // console.log('active', style)
    this.setState({
      imModeStyle: style
    })
  }

  constructor(props) {
    super(props)
    this.tabListChange = imTabListChange.subscribe(item => {
      let list = [item, ...this.state.tabPaneList]
      this.setState({
        tabPaneList: list
      })
    })

    window.addEventListener('resize', this.rerender)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.initialMode !== this.props.initialMode || prevProps.config.container !== this.props.config.container) {
      this.rerender()
    }
  }

  componentWillUnmount() {
    this.tabListChange.unsubscribe()
    window.removeEventListener('resize', this.rerender)

  }




  render() {
    const { TabPane } = Tabs
    const { tabPaneList, defaultActiveKey, activeKey, imModeStyle } = this.state
    const { initialMode, config } = this.props

    return (
      <div
        className={
          s('student-chat-container', isM ? 'm-chart-container' : '', initialMode === BSYIM_INITIAL_MODE.imMode ? 'm-im-mode-container' : '')
        }
        style={{
          ...imModeStyle
        }}
      >
          <>
            {/* tab模式 */}
            {initialMode === BSYIM_INITIAL_MODE.tabMode &&
              (tabPaneList && tabPaneList.length > 0 ? (
                <Tabs
                  defaultActiveKey={defaultActiveKey}
                  activeKey={activeKey}
                  onChange={this.tabChange}
                  className={s('tab-wrapper')}
                >
                  {tabPaneList.map(e => (
                    <TabPane
                      tab={
                        <div className={s('tab-pane-container')}>
                          <span>
                            {/* {isM ? (
                              ''
                            ) : (
                              <img
                                src={e.icon || ''}
                                className={s('tab-pane-icon')}
                              />
                            )} */}

                            {e.label}
                          </span>
                        </div>
                      }
                      key={e.key}
                      forceRender
                    >
                      {e.iframeUrl ? (
                        this.displayTabPane(e.iframeUrl)
                      ) : (
                        <>
                          {e.Component ? (
                            <e.Component
                              uid={this.uid}
                              usig={this.usig}
                              chatRoomID={this.chatRoomID}
                              activeKey={activeKey}
                              kkbLiveId={this.kkbLiveId}
                            ></e.Component>
                          ) : (
                            '没有内容'
                          )}
                        </>
                      )}
                    </TabPane>
                  ))}
                </Tabs>
              ) : (
                <Loading />
              ))}
            {/* 纯im模式 */}
            {initialMode === BSYIM_INITIAL_MODE.imMode && (
              <ChatRoom
                uid={this.uid}
                usig={this.usig}
                chatRoomID={this.chatRoomID}
                kkbLiveId={this.kkbLiveId}
              />
            )}
          </>
      </div>
    )
  }
}


export default IM
