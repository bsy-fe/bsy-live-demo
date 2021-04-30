/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import store from '@/store'
import {
  BSYIM_TAB_CHAT,
  BSYIM_INITIAL_MODE,
  BSYIM_TAB_ACTIVITY,
  BSYIM_TAB_ASK,
  BSYIM_TAB_CLASSES,
  BSYIM_TAB_GOODS, BSYIM_TAB_GROUP_ACTIVITY,
  BSYIM_TAB_LIVEGOODS
} from '@/consts'
import IMUtil from '@/utils/IMUtil'
import { IsPC } from '@/utils'

import ChatRoom from '@/pages/IM/ChatRoom'
import AskWrapper from '@/pages/IM/AskWrapper'
import Activity from '@/pages/IM/Activity'
import StudentGoods from '@/pages/IM/StudentGoods'
import Classes from '@/pages/IMTeacher/Classes'
import LiveGoods from '@/pages/IM/LiveGoods'
import GroupActivity from '@/pages/IM/GroupActivity'
import {tabChanger} from '@/consts/subjects'
import {defaultStudentTabList as defaultTabList} from '@/consts/tabList'


// role修改为： 1：教师、2：助教、3：班主任、4：学生
const isM = !IsPC()


class InitialEntry extends Component {

  // state = {
  //   tabPaneList: defaultTabList
  // }

  constructor(props) {
    console.log('im 组件初始化', props)
    super(props)
    this.initialMode = BSYIM_INITIAL_MODE.tabMode

    // loadJs(`${IM_SDK_URL}?${new Date().getTime()}`, () => this.init(props))
  }

  componentWillUnmount() {
    console.log('logout')
    IMUtil.logout()
    this.state.tabChangerSubscription && this.state.tabChangerSubscription.unsubscribe()
  }

  componentDidMount() {
    this.setTabs()
    if (this.props.client) {
      this.init(this.props)
    }

    this.setState({ tabChangerSubscription: tabChanger.subscribe(tabKey => {
      console.warn('====, tabKey::', tabKey)
        tabKey && this.tabChange(tabKey)
      })})
    // 初始化tab
    // console.log('---------------开始注册获取IM_CALLBACK_TAB_BEHAVIOR信息---------------')

/*
    IMUtil.IMCommunicationInstance.createSession({
      type: BSYIM_IFRAME_LOAD,
      params: {}
    })
*/
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.client && !prevProps.client) {
      console.log('new props', this.props)
      this.init(this.props)
    }
  }

  init(props){
    console.log('im ui 组件初始化：props', props)

    const initParams = props.config || {}

    /* IMUtil.IMCommunicationInstance = new IMCommunication({
      // bsy-liveroomInstance: initParams.bsy-liveroomCommunicationInstance,
      // sdkInstance: initParams.SDKCommunicationInstance
    }) */
    // this.setTabs = debounce(this.setTabs, 500)
    console.log(initParams, 'initParams参数')
    const {nickName, avatar, role} = initParams.userInfo
    this.uid = initParams.userID
    this.usig = initParams.userSig
    this.chatRoomID = initParams.roomID
    this.role = String(role)
    this.contentId = initParams.contentId
    this.avatar = avatar
    this.nickName = nickName|| '游客'
    this.kkbLiveId = initParams.liveId
    this.kkbLiveToken = initParams.liveToken
    this.isLesson = initParams.isLesson
    this.mode = initParams.isGuest === true
    this.tabActiveKey = initParams.tabActiveKey || BSYIM_TAB_CHAT
    this.auth = initParams.auth
    this.tesToken = initParams.tesToken
    this.learnApi = initParams.learnApi
    // this.SDKCommunicationInstance = initParams.SDKCommunicationInstance
    // this.bsy-liveroomCommunicationInstance = initParams.bsy-liveroomCommunicationInstance
    this.initialMode = initParams.initialMode || BSYIM_INITIAL_MODE.tabMode // 初始化模式

    // console.log('mode', this.mode)
    store.dispatch.user.setUserSomething({
      uId: this.uid || undefined,
      nickName: this.nickName || undefined,
      role: this.role,
      contentId: this.contentId,
      // userInfo: { nick: this.nickName, avatar: this.avatar, userID: this.uid },
      kkbLiveId: this.kkbLiveId || undefined,
      kkbLiveToken: this.kkbLiveToken || undefined,
      isLesson: this.isLesson || undefined,
      mode: this.mode ? 'guest' : 'default',
      auth: this.auth || undefined,
      tesToken: this.tesToken,
      learnApi: this.learnApi
    })


    const defaultActiveKey = this.tabActiveKey || BSYIM_TAB_CHAT
    console.log('setState:', defaultActiveKey)
    this.state = {
      ...this.state,
      defaultActiveKey,
      activeKey: defaultActiveKey
    }
    IMUtil.init({
      chatRoomID: this.chatRoomID,
      client: props.client
    })
    // IMUtil.readyToDo(this.timeoutSetTabs)
    store.dispatch.user.setChatRoom({
      chatRoomID: this.chatRoomID
    })

    // 半小时获取一次信息防止token 过期

    // IMUtil.IMCommunicationInstance.use(IM_CHANGE_TABKEY, (data, resolve) => {
    //   this.tabChange(data.key)
    //   console.log('设置成功')
    //   resolve({
    //     code: 1,
    //     msg: '设置成功'
    //   })
    // })
    // IMUtil.IMCommunicationInstance.use(ELEMENT_STYLES, (data, resolve) => {
    //   this.changeElementStyles(data.param)
    // })
    //
    // IMUtil.IMCommunicationInstance.use(
    //   BSYIM_IM_INIT_MESSAGE,
    //   (data, resolve) => {
    //     // console.log(data, '这是拿到的自定义消息')
    //     let messageData = data.messages
    //     this.props.addMessage({
    //       message: {
    //         ...messageData,
    //         ID: String(Math.random() * 100000000000000),
    //         avatar: '',
    //         from: messageData.uid,
    //         to: this.chatRoomID
    //       },
    //       selfSend: false
    //     })
    //     resolve({
    //       code: 1,
    //       msg: '发送成功'
    //     })
    //   }
    // )

    const listener = ev => {
      console.log('logout')
      IMUtil.logout()
    }
    window.addEventListener('beforeunload', listener)
  }

  get noTabList() {
    return !this.state.tabPaneList || !this.state.tabPaneList.length
  }

  initComponent = tabPaneList => {
    tabPaneList.forEach(item => {
      switch (item.key) {
        case BSYIM_TAB_CHAT:
          item.Component = ChatRoom
          break
        case BSYIM_TAB_ASK:
          item.Component = AskWrapper
          break
        case BSYIM_TAB_ACTIVITY:
          item.Component = Activity
          break
        case BSYIM_TAB_GOODS:
          item.Component = StudentGoods
          break
        case BSYIM_TAB_CLASSES:
          item.Component = Classes
          break
        case BSYIM_TAB_LIVEGOODS:
          item.Component = LiveGoods
          break
        case BSYIM_TAB_GROUP_ACTIVITY:
          item.Component = GroupActivity
          break
        // case BSYIM_TAB_LIVEGOODS:
        //   item.Component = LiveGoods
        //   break
        // case BSYIM_TAB_GROUP_ACTIVITY:
        //   item.Component = GroupActivity
        //   break
        default:
          item.Component = ''
          break
      }
    })

    console.log('new Tab List,', tabPaneList)
    return tabPaneList
  }

  getNewTabList = (newList, oldList) => {
    newList = this.initComponent(newList).map(newItem => {
      const sameItem = oldList.find(item => item.key === newItem.key)
      if (sameItem) {
        return sameItem
      }
      return newItem
    })
    return newList
  }

  setTabs = (tabList = this.state.tabPaneList) => {
    // debugger
    console.log('this.setTabs', this.noTabList, this.state.tabActiveKey)
    if (this.noTabList) {
      this.setState({
        tabPaneList: this.initComponent(tabList)
      })
    } else {
      const newTabPaneList = this.getNewTabList(tabList, this.state.tabPaneList)

      let newActiveKey = this.tabActiveKey
      if (
        newTabPaneList &&
        newTabPaneList.length &&
        !newTabPaneList.find(({ key }) => newActiveKey === key)
      ) {
        newActiveKey = newTabPaneList[0].key
      }
      this.setState({
        tabPaneList: newTabPaneList,
        activeKey: newActiveKey
      })
    }
  }

  changeElementStyles(stylesList) {
    this.props.setElementStyles(stylesList)
  }


  tabChange = e => {
    this.setState({
      activeKey: e
    })
    const zanBox = document.querySelector('#zan-items-box')
    if (e === BSYIM_TAB_CHAT) {
      zanBox && (zanBox.style.display = 'block')
    } else {
      zanBox && (zanBox.style.display = 'none')
    }
    const { tabPaneList } = this.state
    let currentTab = tabPaneList.filter(item => item.key === e)
    if (currentTab.length) {
      let data = {
        label: currentTab[0].label,
        key: currentTab[0].key,
        icon: currentTab[0].icon,
        iframeUrl: currentTab[0].iframeUrl
      }
      // console.log(IMUtil.IMCommunicationInstance, 'tabChange')
      // IMUtil.IMCommunicationInstance.createSession({
      //   type: BSYIM_TAB_CHANGE,
      //   params: data
      // })
    }
  }

  displayTabPane(iframeUrl) {
    const isPic = /[.]jpg|JPG|PNG|png|JPEG|jpeg$/.test(iframeUrl)
    return isPic ? (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <img
          src={iframeUrl}
          style={{ maxWidth: '100%', textAlign: 'center' }}
          alt=''
        />
      </div>
    ) : (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <iframe src={iframeUrl || ''} width='100%' height='100%' />
      </div>
    )
  }
  

  render() {
    return (
      <div>
        未初始化render
      </div>
    )
  }
}

export default InitialEntry
