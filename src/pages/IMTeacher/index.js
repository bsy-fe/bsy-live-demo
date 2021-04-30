/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import { Tabs, Icon, Button } from 'antd'
import {
  BSYIM_TAB_CLASSES,
  BSYIM_TAB_CHAT,
  BSYIM_TAB_ASK,
  BSYIM_TAB_ACTIVITY,
  BSYIM_TAB_GROUP_ACTIVITY,
  BSYIM_TAB_LIVEGOODS,
  BSYIM_TAB_GOODS,
  BSYIM_INITIAL_MODE,
  BSYIM_TAB_WAITING
} from '@/consts'
import store from '@/store'
import { RTC_INTERACTIVE_TYPE } from '@/consts/rtc'
import InitialEntry from '@/components/IM/InitialEntry'
import { IsPC, isHKYClient } from '@/utils'
import {globalConst} from '@/consts/globalConst'
import IMUtil from 'utils/IMUtil'
import {defaultTeacherTabList as defaultTabList} from '@/consts/tabList'
import Loading from '@/components/Loading'
import ChatRoom from './ChatRoom'
import Ask from './Ask'
import Activity from './Activity'
import GroupActivity from './GroupActivity'
import LiveGoods from './LiveGoods'
import StudentGoods from './StudentGoods'
import Classes from './Classes'
import Waiting from './MaiXu'
import styles from './index.module.styl'


// role修改为： 1：教师、2：助教、3：班主任、4：学生
const isM = !IsPC()
const isInHKYLive = isHKYClient()
const s = classNames.bind(styles)

class IMTeacher extends InitialEntry {

  state = {
    tabPaneList: defaultTabList
  }

  constructor(props) {
    super(props)

    console.log(props, store, this, '教师主入口')

    this.initParams = props.config

  }

  init(props){
    super.init(props)
    console.warn('=============imteacher init:::::', props)

    IMUtil.readyToDo(() => {
      // 获取禁言用户列表
      store.dispatch({
        type: 'message/getUserMuteList',
        payload: {
          contentId: this.contentId
        }
      })
      // 设置rtc 信息

      // 获取席位列表
      store.dispatch({
        type: 'mic/getMicSeatList',
        payload: {}
      })

      // 监听连麦，下发消息给客户端
      globalConst.client.on('interact-config-change', data => {
        console.warn('=============interact change on ui::', data)
        this.rtcUpdateTableList(data)
        // 设置rtc 信息
        if(data.interactType) {
          store.dispatch({
            type: 'mic/setSomething',
            payload: {
              rtcInfo: data
            }
          })
        }
      })

      console.warn('=============interact config change 监听完成:: client', globalConst.client)
    })





  }

  initComponent = tabPaneList => {
    console.log(tabPaneList, 'tabPaneList')
    tabPaneList.forEach(item => {
      switch (item.key) {
        case BSYIM_TAB_WAITING:
          item.Component = Waiting
          break
        case BSYIM_TAB_CLASSES:
          item.Component = Classes
          break
        case BSYIM_TAB_CHAT:
          item.Component = ChatRoom
          break
        case BSYIM_TAB_ASK:
          item.Component = Ask
          break
        case BSYIM_TAB_ACTIVITY:
          item.Component = Activity
          break
        case BSYIM_TAB_GOODS:
          item.Component = StudentGoods
          break
        case BSYIM_TAB_LIVEGOODS:
          item.Component = LiveGoods
          break
        case BSYIM_TAB_GROUP_ACTIVITY:
          item.Component = GroupActivity
          break
        default:
          item.Component = ''
          break
      }
    })
    return tabPaneList
  }

  // 接收信令更新tab
  rtcUpdateTableList(data) {
    const { interactType } = data
    // const { tabList } = this.initParams
    const isFind = this.state.tabPaneList.findIndex(e => e.key === BSYIM_TAB_WAITING)
    let newTableList = this.state.tabPaneList
    if (interactType === RTC_INTERACTIVE_TYPE.close) {
      // 关闭连接
      if (isFind !== -1) {
        newTableList.splice(isFind, 1)
        this.setTabs(newTableList)
        // setTimeout(() => {
        //   window.BSYIM.setTabActiveKey(BSYIM_TAB_CHAT)
        // }, 300)
      }
    } else {
      // 开启连接
      // eslint-disable-next-line no-lonely-if
      if (isFind === -1) {
        newTableList.unshift({
          label: '等候',
          key: BSYIM_TAB_WAITING,
          icon: '',
          iframeUrl: ''
        })
        this.setTabs(newTableList)
        // setTimeout(() => {
        //   window.BSYIM.setTabActiveKey(BSYIM_TAB_WAITING)
        // }, 300)
      }
    }
  }

  // componentDidMount() {
  //   console.log(this.state.tabPaneList,'tabPaneList')
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    super.componentDidUpdate(prevProps, prevState, snapshot)
    if(prevProps.rtcInfo !== this.props.rtcInfo || prevProps.rtcInfo.interactType !== this.props.rtcInfo.interactType) {
      console.log('rtc info change:: ,', this.props.rtcInfo)
      this.rtcUpdateTableList(this.props.rtcInfo)
    }
  }

  render() {
    const { TabPane } = Tabs
    const { tabPaneList, defaultActiveKey, activeKey } = this.state

    const operations = (
      <div className={s('tab-refresh-container')}>
        {/* <Button size='small' type='primary' className={s('tab-refresh-btn')}>
          刷新
        </Button> */}
      </div>
    )

    return (
      <div
        className={`${s('chat-container')} ${
          isM ? s('m-chart-container') : ''
        }`}
        style={{
          backgroundColor:
            this.initialMode === BSYIM_INITIAL_MODE.imMode && isM
              ? 'transparent'
              : null
        }}
      >
            {/* tab模式 */}
            {this.initialMode === BSYIM_INITIAL_MODE.tabMode &&
              (tabPaneList.length > 0 ? (
                <div className={s('tab-header-container')}>
                  <div className={s('tab-head-box')}>
                    <Tabs
                      defaultActiveKey={defaultActiveKey}
                      activeKey={activeKey}
                      onChange={this.tabChange}
                      tabBarExtraContent={isInHKYLive ? operations : ''}
                    >
                      {tabPaneList.map(e => (
                        <TabPane tab={e.label} key={e.key} forceRender>
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
                                ''
                              )}
                            </>
                          )}
                        </TabPane>
                      ))}
                    </Tabs>
                  </div>
                </div>
              ) : (
                <Loading />
              ))}
            {/* 纯im模式 */}
            {this.initialMode === BSYIM_INITIAL_MODE.imMode && (
              <ChatRoom
                uid={this.uid}
                usig={this.usig}
                chatRoomID={this.chatRoomID}
                kkbLiveId={this.kkbLiveId}
              />
            )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  chatRoomID: state.user.chatRoomID,
  userInfo: state.user.userInfo,
  elementStyles: state.message.elementStyles,
  rtcInfo: state.mic.rtcInfo
})
const mapDispatchToProps = dispatch => ({
  getMyInfo: () => dispatch.user.getMyInfo(),
  setActiveKey: dispatch.system.setActiveKey,
  setElementStyles: dispatch.message.setElementStyles,
  addMessage: dispatch.message.addMessage
})

export default connect(mapStateToProps, mapDispatchToProps)(IMTeacher)
