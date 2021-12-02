/*
eslint-disable camelcase
*/

import React from 'react'
import store from '@/store'
import {getUserDefinedFieldObj, isHKYClient, IsPC, sendMessageToClient, BSYWarn} from '@/utils'
import getters from '@/store/getters'
import {message as messagetip} from 'antd'
import {interval, timer} from 'rxjs'
import {
  CUSTOM_MSG,
  DANMU_POSITIONS,
  GROUP_EVENT_NOTIFY,
  GROUP_LIKE_NUM,
  GROUP_SHELF_HIDE,
  GROUP_SHELF_SHOW,
  GROUP_SILENCE,
  MULTI_PUSH_ADDR_CHANGED
} from '@/consts'

import {activityMessageBuffer, chatMessageBuffer} from '@/utils/messageBuffer'

import {globalConst} from '@/consts/globalConst'
// import {AskPageEventEmitter} from '@/pages/IM/AskWrapper/consts'
import {showLiveDialog} from '@/components/PopUp/showLiveDialog'
import {ActivityEventEmitter, AskPageEventEmitter} from '@/consts/subjects'
import {BARRAGE} from './barrageStyle'



// window.setInterval(() => {
//   const msg = {
//     ID: `@TIM#SYSTEM-${Math.random() * 10000000}`,
//     avatar: '',
//     clientSequence: 11476,
//     conversationID: '@TIM#SYSTEM',
//     conversationSubType: undefined,
//     conversationType: '@TIM#SYSTEM',
//     flow: 'in',
//     from: '@TIM#SYSTEM',
//     geo: {},
//     isPeerRead: false,
//     isPlaceMessage: 0,
//     isRead: false,
//     isResend: false,
//     isRevoked: false,
//     isSystemMessage: true,
//     nick: '',
//     payload: {
//       groupProfile: {
//         from: '@TIM#SYSTEM',
//         to: '3270435',
//         name: '测试红包',
//         groupID: '@TGS#3KPTGBSGT',
//       },
//       messageKey: 1593661690407,
//       operationType: 255,
//       operatorID: 'administrator',
//       userDefinedField: JSON.stringify({
//         proto_name: 'GROUP_EVENT_NOTIFY',
//         ver: '1.0',
//         content: {
//           tim_group_id: '@TGS#3OMXYFJGG',
//           event_type: parseInt(Math.random() * 2, 10) + 1,
//           show_position: 1,
//           show_style: 1,
//           notify_msg: {
//             nickname: '德玛西亚',
//             template_msg: '\u8d2d\u4e70\u4e86',
//             name: '一个大宝剑',
//           },
//           timestamp: 1593607197,
//         },
//       }),
//     },
//     priority: 'Normal',
//     protocol: 'JSON',
//     random: 1687455430,
//     sequence: 1175709376,
//     status: 'success',
//     time: 1593661690,
//     to: '@TGS#3KPTGBSGT',
//   }
//   // store.dispatch.message.addMessage({
//   //   message: msg,
//   //   selfSend: 0,
//   // })
//   postMessage.send({
//     type: BSYIM_IMONMESSAGE,
//     data: msg,
//   })
// }, 10000)
let allcount = 0
/*
setTimeout(() => {
  const add = () => {
    for (let i = 0; i < Math.ceil(Math.random() * 10); i++) {
      allcount++
      const msggg = {
        ID: `@TIM#SYSTEM-${Math.random()}--`,
        avatar: '',
        clientSequence: 11476,
        conversationID: 'GROUP@TGS#3CQAC2RGD',
        conversationSubType: undefined,
        conversationType: 'GROUP@TGS#3CQAC2RGD',
        flow: 'in',
        from: '@TIM#SYSTEM',
        geo: {},
        isPeerRead: false,
        isPlaceMessage: 0,
        isRead: false,
        isResend: false,
        isRevoked: false,
        isSystemMessage: true,
        nick: '',
        payload: {
          groupProfile: {
            from: '@TIM#SYSTEM',
            to: '3270435',
            name: '测试红包',
            groupID: '@TGS#3CQAC2RGD',
          },
          messageKey: 1593661690407,
          operationType: 255,
          operatorID: 'administrator',
          userDefinedField: JSON.stringify({
            proto_name: 'GROUP_EVENT_NOTIFY',
            ver: '1.0',
            content: {
              tim_group_id: '@TGS#3CQAC2RGD',
              event_type: parseInt(Math.random() * 2, 10) + 1,
              show_position: 1,
              show_style: 1,
              notify_msg: {
                nickname: '德玛西亚',
                template_msg: '\u8d2d\u4e70\u4e86',
                name: `一个大宝剑${allcount}`,
              },
              timestamp: 1593607197,
            },
          }),
        },
        priority: 'Normal',
        protocol: 'JSON',
        random: 1687455430,
        sequence: 1175709376,
        status: 'success',
        time: 1593661690,
        to: '@TGS#3CQAC2RGD',
      }

      MSGBuffer.addMessage(msggg)
    }
  }

  for (let i = 0; i < 1000; i++) {
    ;(idx => {
      setTimeout(() => {
        add()
      }, idx * 50)
    })(i)
  }
}, 5000)
*/

class IMUtilsClass {

  constructor() {
    // this.addSDKEvents()
    this.isLogin = false
    this.isSDKReady = false

    this.unReadyList = []
    this.callbackList = []

  }

  init = opt => {
    console.log('=============imutils初始化， opt:', opt)
    this.chatRoomID = opt.chatRoomID
    this.client = opt.client

    this.register()

    this.readyToDo(() => {
      this.getRoleList()
    })

    this.readyToDo(() => {
      this.getLikeNum()
    })

    this.readyToDo(() => {
      this.startSimulation()
    })
  }

  logout = () => {
    this.destroy()
  }

  register = () => {
    console.log('注册事件')

    this.client.on('text-message', (msg) => {
      // console.log('textmessage,', msg)
      chatMessageBuffer.addMessage(msg)
    })


    this.client.on('img-message', (msg) => {
      // console.log('imgmessage,', msg)
      chatMessageBuffer.addMessage(msg, 2)
    })

    this.client.on('custom-message', (msg) => {
      console.log('=============收到用户自己发送的自定义消息，在这里填写处理逻辑', msg)
    })

    this.client.on('system-message', msg => {
      const userDefinedObj = getUserDefinedFieldObj(msg)
      console.log('ui接到系统通知::', msg, userDefinedObj)

      const showPosition = userDefinedObj.content.show_position
      if ([DANMU_POSITIONS.CHAT, DANMU_POSITIONS.CHAT_AND_PLAYER].includes(showPosition)) {
        activityMessageBuffer.addMessage(msg)
      }
      if ([DANMU_POSITIONS.PLAYER, DANMU_POSITIONS.CHAT_AND_PLAYER].includes(showPosition)) {
        const {event_type, notify_msg} = userDefinedObj.content
        // let {event_type, notify_msg} = msg.target
        const danmuHtml = BARRAGE[Number(event_type)](notify_msg)
        this.client.sendDanmu(danmuHtml)
      }
    })

    this.client.on('im-ready', (data) => {
      this.onSDKReady(data)
      // console.log(data, '++++++++++')
      console.log('设置成功onSDKReady', data)
    })

    this.client.on('login', (data) => {
      console.log('设置成功login', data)
      this.isLogin = true

    })

    this.client.on('user-profile', data => {
      console.log('=============ui get profile:', data)
      store.dispatch.user.setUserInfo(data)
    })

    this.client.on('error', data => {
      this.onSDKError(data)
      // console.log(data, '++++++++++')
      console.log('设置成功onSDKError', data)
    })

    this.client.on('im-error', data => {
      console.log('im-error触发::', data)
      const behaviors = {
        20001: () => {
          window.location.reload()
        }
      }

      const errorType = data.ErrorCode

      behaviors[errorType] && behaviors[errorType]()
    })

    this.client.on('ask-received', data => {
      console.log('get ask should pop window', data)

      this.showAskModal(data.params)
      AskPageEventEmitter.next(true)

    })

    this.client.on('activity-received', data => {
      const {role} = getters()
      if(role === 4) {
        console.log('get activity should pop window', data)

        const {web_action_url, mobile_action_url} = data.params
        const showUrl = IsPC() ? web_action_url : mobile_action_url
        const iframe = <iframe src={showUrl} frameBorder="0" style={{width: '100%', height: '100%'}}/>

        showLiveDialog({children: iframe})
      }
      ActivityEventEmitter.next(true)
    })

    this.client.on('like-number-change', data => {
      console.log('like number change', data)
      store.dispatch.message.setLikeNum({
        likeNumber: data
      })


    })

    this.client.on('online-number-change', ({online_num}) => {
      console.log('=============online number change', online_num)
      // store.dispatch.message.setOnlineNum(online_num)

    })

    this.client.on('all-muted', ({forbid}) => {
      store.dispatch.message.setAllMute({
        allMute: forbid
      })
    })
    
    this.client.on('user-muted', ({forbid}) => {
      console.log('store::', store)
      store.dispatch.message.setUserMute({
        mute: forbid
      })
    })

    this.client.on('forbidden-change', (list) => {
      console.log('=============禁言列表变化', list)
      const buidList = list.map(item => item.buid)
      store.dispatch.message.setMuteList({userMuteList: buidList})
    })

    this.client.on('re-join-group', ({error}) => {
      console.log('=============重新加入了群组，错误为：', error)
      WhiteBoardRefresh.next({from: 're-join-group'})
    })

    this.client.on('message-recalled', (event) => {
      // "{"account_id":"10013801","msg_seq":592271}}"
      store.dispatch.message.removeMessageBySeq(event.msg_seq)
    })

    this.client.on('group-custom-message', event => {
      // console.log('=============event', event)
      BSYWarn(`收到群组自定义消息:${JSON.stringify(event)}`)
      // messagetip.success(`收到群组自定义消息:${JSON.stringify(event)}`)
    })

    this.client.on('person-custom-message', event => {
      // console.log('=============event', event)
      BSYWarn(`收到个人自定义消息:${JSON.stringify(event)}`)
      // messagetip.success(`收到个人自定义消息:${JSON.stringify(event)}`)
    })

  }

  destroy = () => {
    this.chatRoomID = ''
    this.isLogin = false
    this.isSDKReady = false
    this.unReadyList = []
    this.callbackList = []
    // this.endHeartBeat()
  }

  addSDKEvents = () => {}

  onSDKReady = event => {
    const execute = e => {
      console.log('im sdk 准备好了', e, this)
      this.isSDKReady = true
      this.readyToDo()
    }

    execute(event)
  }

  onMessageReceived = event => {
    const { userId } = getters()
    event.data.forEach(msg => {
      const { groupProfile, userDefinedField } = msg.payload

      const userDefinedFieldObj =
        userDefinedField && userDefinedField !== ''
          ? JSON.parse(userDefinedField)
          : {}
      // 普通文字消息
      if (msg.to === this.chatRoomID && msg.payload.text) {
        // let myMSG = JSON.parse(JSON.stringify(msg))
        // myMSG.payload.text = createTextHtml(myMSG.payload.text)
        chatMessageBuffer.addMessage(msg)
      }
      // 自定义消息图片消息
      if (
        msg.payload.data &&
        msg.payload.data.includes(CUSTOM_MSG) &&
        msg.to === this.chatRoomID
      ) {
        console.log('图片消息::', userDefinedFieldObj)
        chatMessageBuffer.addMessage(msg, 2)
      }
      // GROUP_EVENT_NOTIFY 群系统通知
      if (
        userDefinedFieldObj.proto_name === GROUP_EVENT_NOTIFY &&
        msg.to === this.chatRoomID
      ) {
        const showPosition = userDefinedFieldObj.content.show_position
        console.log('系统通知::', userDefinedFieldObj)
        if (showPosition === DANMU_POSITIONS.CHAT || showPosition === DANMU_POSITIONS.CHAT_AND_PLAYER) {
          activityMessageBuffer.addMessage(msg)
        }
        if (showPosition === DANMU_POSITIONS.PLAYER || showPosition === DANMU_POSITIONS.CHAT_AND_PLAYER) {
          globalConst.client.sendDanmu(msg)
        }
      }

      // "{"proto_name":"GROUP_LIKE_NUM","ver":"1.0","content":{"like_num":2621,"timestamp":1587722885}}"
      if (groupProfile && msg.to === this.chatRoomID) {
        // 点赞数
        if (userDefinedFieldObj.proto_name === GROUP_LIKE_NUM) {
          store.dispatch.message.setLikeNum({
            likeNumber: userDefinedFieldObj.content.like_num
          })
          //
        }
        // 人数
        if (userDefinedFieldObj.proto_name === 'ONLINE_NUM') {
          console.log('onlineNum', userDefinedFieldObj)
          // eslint-disable-next-line camelcase
          const { online_num } = userDefinedFieldObj.content
          // store.dispatch.message.setOnlineNum(online_num)
          // this.IMCommunicationInstance.createSession({
          //   type: BSYIM_IM_INLINE_NUM,
          //   params: userDefinedFieldObj.content
          // })
          // postMessage.send({
          //   type: BSYIM_IM_INLINE_NUM,
          //   data: userDefinedFieldObj.content,
          // })
        }
        // 群组禁言
        if (userDefinedFieldObj.proto_name === GROUP_SILENCE) {
          this.getGroupProfile({ groupID: this.chatRoomID }).then(res => {
            const { group } = res.data
            store.dispatch.message.setAllMute({
              allMute: group.muteAllMembers
            })
            store.dispatch.message.setGroupDetail(group)
          })
        }

        // 显示货架通知
        if (userDefinedFieldObj.proto_name === GROUP_SHELF_SHOW) {
          console.log('显示货架通知::', userDefinedFieldObj)
          store.dispatch.message.setShelfInfo(userDefinedFieldObj.content)
          // postMessage.send({
          //   type: BSYIM_GROUP_SHELF_SHOW,
          //   data: userDefinedFieldObj.content,
          // })
        }
        // 隐藏货架通知
        if (userDefinedFieldObj.proto_name === GROUP_SHELF_HIDE) {
          console.log('隐藏货架通知::', userDefinedFieldObj)
          store.dispatch.message.setShelfInfo({})
          // postMessage.send({
          //   type: BSYIM_GROUP_SHELF_HIDE,
          //   data: userDefinedFieldObj.content,
          // })
        }
      }
      if (msg.payload.data) {
        console.log(msg, 'payload.data消息')
        // this.handlerSpecialMessage(msg, 'im')
      }
    })

  }

  onSDKError = event => {
    console.log('SDK错误', event, this)
    if (event.data.code === 2999) {
      messagetip.success('消息发送失败，请重新进入直播间', 1)
      // setTimeout(() => {
      //   window.location.reload()
      // }, 1000)
    }
  }

  onKickedOut = event => {
    console.log('被踢出直播间::', event, this)

    this.destroy()
  }

  checkSDKready = function(callback) {
    this.callbackList.push(callback)
    console.log(callback, 'checkSDKready', this.isSDKReady)
    if (this.isSDKReady) {
      callback()
    } else {
      this.readyToDo(callback)
    }
  }

  handlerSpecialMessage = msg => {
    const { isStudent } = getters()
    let msgData = JSON.parse(msg.payload.data)
    console.log(msgData, 'SpecialMessage')
    if (isStudent) {
      console.log('不执行')
      // switch (msgData.proto_name) {
      //   case 'TOPIC_ASK':
      //     if (msg.to === this.chatRoomID) {
      //       IMSpecialMessage.handlerAskMessage(msgData.content, 'im')
      //     }
      //     break
      //   case 'KEYWORDS_WINNER':
      //     if (msgData.content.group_id === this.chatRoomID) {
      //       IMSpecialMessage.handlerActivityMessage(msgData.content, 'im')
      //     }
      //     break
      //   case GROUP_URL_SENDER:
      //     if (msgData.content.tim_group_id === this.chatRoomID) {
      //       IMSpecialMessage.handlerActivityMessage(
      //         msgData.content,
      //         'im群发红包'
      //       )
      //     }
      //     break
      //   default:
      //     break
      // }
    } else {
      switch (msgData.proto_name) {
        case MULTI_PUSH_ADDR_CHANGED:
          console.log('多机位推流地址已变化::', msgData)
          // this.IMCommunicationInstance.createSession({
          //   type: BSYIM_MULTI_PUSH_ADDR_CHANGED,
          //   params: msgData.content
          // })
          // postMessage.send({
          //   type: BSYIM_MULTI_PUSH_ADDR_CHANGED,
          //   data: msgData.content,
          // })
          break
        default:
          break
      }
    }
  }

  sendMessage = (chatRoomID, msg, customData, retry = false) => {
    console.log('user send 行为', chatRoomID, msg, store.getState())
    // console.log('getGroupProfile 开始')

    return new Promise((resolve, reject) => {
      if(store.getState().message.userMute) {
        throw new Error('被单独禁言了')
      }
      this.client.sendMessage(msg, customData).then(
          res => {
            if (!res.code) {

              console.log('发送成功了', res.data.message)
              resolve(res.data.message)
            }
          },
          async rejects => {
            console.error('发送被拒绝', rejects)
            // if (!retry) {
            // const res = await this.joinGroup(chatRoomID)
            // console.log(res)
            // resolve(this.sendMessage(chatRoomID, msg, true))
            // }

            reject(rejects)
          }
        )
        .catch(err => {
          console.error('发送错误', err)
          reject(err)
        })
    })
  }

  addLike() {

    return this.client.sendLike()

  /*  return this.IMCommunicationInstance.createSession({
      type: BSYIM_SEND_MESSAGE_LIKE,
      params: likeNum
    }) */


  }


  sendCustomImage(files, customPayloadData) {
    // 图片格式。JPG = 1，GIF = 2，PNG = 3，BMP = 4，其他 = 255
    // arr
    /**
     * {
      "Type": 1,           //原图
      "Size": 1853095,
      "Width": 2448,
      "Height": 3264,
       "URL": "http://img.jk51.com/img_jk51/359290272.jpeg"
    }
     */
    // return this.IMCommunicationInstance.createSession({
    //   type: BSYIM_SEND_CUSTSOM_IMAGE,
    //   params: {
    //     imgType,
    //     imgArray
    //   }
    // })

    return this.client.sendImageMessage(files, customPayloadData)
  }

  sendCustomMessage(obj) {
    return this.client.sendCustomMessage(obj)
  }

  sendGroupCustomMessage(msg) {
    return this.client.sendGroupCustomMessage(msg)
  }


  readyToDo = todo => {
    console.warn({todo, iii: {...this}})
    if (todo) {
      this.unReadyList.push(todo)
    }
    if (this.isSDKReady) {
      this.unReadyList.forEach(item => {
        // item && item.call(this)
        item()
      })
      this.unReadyList = []
    }
  }


  getGroupProfile = data => {
    console.log('getGroupProfile 开始')
    return {}
    // return this.IMCommunicationInstance.createSession({
    //   type: BSYIM_GET_GROUP_PROFILE,
    //   params: data
    // })
  }

  getMessageList = (count, nextReqMessageID) => {
    console.log('getMessageList 开始', {count, nextReqMessageID})
    return globalConst.client.getMessageList(count, nextReqMessageID)
    // return this.IMCommunicationInstance.createSession({
    //   type: BSYIM_GET_MESSAGELIST,
    //   params: data
    // })
  }

  getGroupMemberList = (pageNo = 1, pageSize = 3) => {
    console.log('getGroupMemberList 开始')
    return globalConst.client.getMemberList({
      pageNo,
      pageSize // 只获得学生
    })
   /* return this.IMCommunicationInstance.createSession({
      type: BSYIM_GET_GROUP_MEMBERLIST,
      params: {
        groupID: this.chatRoomID,
        count: limit,
        offset: page
      }
    }) */
  }

  // /**
  //  *
  //  * @param {*} idList
  //  * @param {*} memberCustomFieldFilter  自定义字段过滤
  //  * @description 获取群成员信息
  //  */
/*  getGroupUserProfile = (idList = [], memberCustomFieldFilter = []) => {
    return this.IMCommunicationInstance.createSession({
      type: BSYIM_GET_GROUP_USERPROFILE,
      params: {
        groupID: this.chatRoomID,
        userIDList: createArray(idList),
        memberCustomFieldFilter: createArray(memberCustomFieldFilter)
      }
    })
  } */


  getRoleList = async () => {
    const roles = await this.client.getRoleList()
    console.log('---roles::', roles)
    if(roles && roles.data) {
      store.dispatch.message.setTeacherList({
        teacherList: roles.data.map( item => ({
          nick: item.userName || item.uid,
          ...item,
          userID: item.buid,
          role: item.roleType
        }))
      })
    }
  }

  getLikeNum = async () => {
    const likeNum = await this.client.getLikeNumber()

    console.log('like num::', likeNum)

    if(likeNum) {
      store.dispatch.message.setLikeNum({
        likeNumber: likeNum
      })
    }
  }

  showAskModal(data) {
    console.log('打开答题：', data)
    if(getters().isGuestMode) {
      console.warn('=============游客不打开这些东西')
      return
    }
    const {web_action_url, mobile_action_url} = data
    const showUrl = IsPC() ? web_action_url : mobile_action_url

    if (isHKYClient()) {
      sendMessageToClient('open_view', JSON.stringify({
        url: showUrl,
        width: 480,
        height: 550
      }))
      // window.remote_object.invoke()
    } else {
      const iframe = <iframe src={showUrl} frameBorder="0" style={{width: '100%', height: '100%'}}/>
      showLiveDialog({children: iframe})
    }
  }

  startSimulation() {
    const msg = () => {

      const time =  new Date().getTime().toString()
      return ({
        'ID': time,
        'conversationID': 'GROUP@TGS#35ZGGGGHT',
        'conversationType': 'GROUP',
        'time': time,
        'sequence': 48,
        'clientSequence': 1129110015,
        'random': 59349722,
        'priority': 'Normal',
        'nick': '模拟聊天人',
        'avatar': 'https://learn.kaikeba.com/img_centre_man.png',
        'isPeerRead': false,
        'nameCard': '',
        '_elements': [{'type': 'TIMTextElem', 'content': {'text': time}}],
        'isPlaceMessage': 0,
        'isRevoked': false,
        'geo': {},
        'from': '576086033',
        'to': '@TGS#35ZGGGGHT',
        'flow': 'out',
        'isSystemMessage': false,
        'protocol': 'JSON',
        'isResend': false,
        'isRead': true,
        'status': 'success',
        '_onlineOnlyFlag': false,
        '_groupAtInfoList': [],
        '_relayFlag': false,
        'atUserList': [],
        'cloudCustomData': '',
        'payload': {'text': `${time}-${time}-${time}-${time}-${time}-${time}-${time}-${time}-${time}-${time}`},
        'type': 'TIMTextElem'
      })
    }

    const send = () => {
      const timeout = Math.floor(Math.random()*1000)

      timer(timeout).subscribe( () => {

        const newMsg = msg()

        chatMessageBuffer.addMessage(newMsg)

        send()
      })
    }

    timer(5000).subscribe(() => {

      // send()
      // interval(25).subscribe(() => {
      //   const newMsg = msg()
      //
      //   chatMessageBuffer.addMessage(newMsg)
      // })
    })

  }
}

const IMUtils = new IMUtilsClass()

export default IMUtils
