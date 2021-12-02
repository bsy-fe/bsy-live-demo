import { 
  RAISE_HAND_STATUS, 
  RTC_INTERACTIVE_TYPE 
} from '@/consts/rtc'
import { IsPC } from '@/utils'
import ClearableLabeledInput from 'antd/lib/input/ClearableLabeledInput'
import ColumnGroup from 'antd/lib/table/ColumnGroup'
import message from '../Message/message'
import { 
  getSelfVideoDisabled, 
  updateSeatListStatus
} from './utils'

const isPc = IsPC()

// rtc状态管理及操作
const RTCModeStore = {
  isReady: false,
  RTCReadyQueueEvent: [], // 事件队列
  selfInfo:{}, // 存储自己上次的状态
  selfOnLine: false, // 自己是否在线上
  actionBtnStatus: RAISE_HAND_STATUS.normal,
  lastInteractType:  RTC_INTERACTIVE_TYPE.close, // 上次的互动状态
  interactType: RTC_INTERACTIVE_TYPE.close,
  audioDisable: false,
  localSelfInfo: {  // 本地自己操作语音&视频的状态
    audioDisable: false,
    videoDisable: false
  },
  currentSeatList: [], // 当前席位
  _audioLevelTimer: null, // 轮询
  RTCLive: [], // 正在直播的RTC流
  // 更新座位列表
  updateList(list, config, instance) {
    if(!list.length) {
      this.RTCLive = []
    }
    // 保存上次状态
    this.selfInfo = this.currentSeatList.find((item) => item.isSelf) || {}
    this.currentSeatList = list
    this.updateSelfStatus(config, instance)
  },
  // 更新自己的状态
  updateSelfStatus(config,instance) {
    let isHasSelf = this.currentSeatList.find((item) => item.isSelf)
    if (isHasSelf) {
      let { videoDisabledStatus } = getSelfVideoDisabled()
      let p = {
        video: !videoDisabledStatus,
        audio: true
      }
      this.selfOnLine = true
      if (this.isReady) {
        // 如果当前状态 不是下台
        if (this.actionBtnStatus !== RAISE_HAND_STATUS.dropped ) {
          instance.interactLive.rtc.switchOnSeat(p)
          // this._setSelfInitVideoAudioStatus(isHasSelf, instance)
        } else {
          this._setSelfInitVideoAudioStatus(isHasSelf, instance)
        }
      } else {
        this.RTCReadyQueueEvent.push(() => {
          instance.interactLive.rtc.switchOnSeat(p)
        })
      }
    }
  },
  async playStream(data, config, instance) {
    // let isSelf = data.uid === config.userId
    let self = this.currentSeatList.find(i => i.buid === data.uid)
    console.log(self)
    try {
      await instance.interactLive.rtc.playStream(
        data.uid,
        `rtc-${data.uid}`,
        { fit: 'cover', muted: !!self.isSelf }
      )
      this._setSelfInitVideoAudioStatus(self, instance)
      // 视频镜像问题
      let video = document.querySelector(`#rtc-${data.uid}`).querySelector('video')
      video && (video.style.transform = '')
    } catch (error) {
      console.log('=====autoplay',error )
      // 返回0 则说明自动播放失败
      if (error.code === 0) {
        let dom = document.querySelector(`#muted-${data.uid}`)
        dom.style.display = 'block'
        // 取消静音限制
        dom.onclick = () => {
          console.log('=====autoplay', )
          instance.interactLive.rtc.stopStream(data.uid)
          dom.style.display = 'none'
          let playDom = document.querySelector(`#rtc-${data.uid}`)
          playDom && (playDom.innerHTML = '')
          this.playStream(data, config, instance)
        }
      }
   }    
  },
  // 更新当前正在直播
  updateLivingQueue(type, id){
    id = String(id)
    if (type === 'online') {
      let isHas = this.RTCLive.find(i => i===id)
      if (!isHas) {
        this.RTCLive.push(id)
      }
    } else {
      let index = this.RTCLive.findIndex((i) => i === id)

      if (index > -1) {
        this.RTCLive.splice(index, 1)
        let droppedDom = document.querySelector(`#rtc-${id}`)
         droppedDom && (droppedDom.innerHTML = '')
      }
    }
   
  },
  // 更新当前
  updateActionBtn(status) {
    this.actionBtnStatus = status
  },
  // 更新配置信息
  updateInteractConfig(info, instance){
    this.lastInteractType = this.interactType // 上次的互动状态
    this.interactType = info.interactType
    this.audioDisable = info.audioDisable
    console.log('=====updateInteractConfig', info.interactType,  this.lastInteractType)
    // 如果当前配置信息 不等于上次 
    if (info.interactType !== this.lastInteractType) {
      switch (info.interactType) {
        case RTC_INTERACTIVE_TYPE.video:
          if (this.lastInteractType !== RTC_INTERACTIVE_TYPE.close) {
            this.openUserVideo(instance)
          }
          break
        case RTC_INTERACTIVE_TYPE.audio:
          if (this.lastInteractType !== RTC_INTERACTIVE_TYPE.close) {
            this.closeUserVideo(instance)
          }
          break
        default:
          break
      }
      console.log('=====_startUpdateAudioLevel',this.lastInteractType  )
      // 当前改变状态与上次不等，并且本次是开启互动
      if (this.lastInteractType === RTC_INTERACTIVE_TYPE.close) {
        this._startUpdateAudioLevel(instance)
      }
      console.log('=====_startUpdateAudioLevel',this.lastInteractType, this.interactType )
      //  当前改变状态不相等，并且本次是关闭
      if (this.interactType === RTC_INTERACTIVE_TYPE.close) {
        this.selfOnLine && this.switchOffSeat(instance)
        this._destroy()
      }
    }
    return this.currentSeatList
  },
  updateRtcInit() {
    this.isReady = true
    this.RTCReadyQueueEvent.forEach(item => {
      item()
    })
  },
  // 更新自己的视频状态
  updateSelfVideo(instance, type, info) {
    // 如果老师关闭当前摄像头 或者 互动模式不是视频 则不允许操作摄像头
    if (info.videoDisable || this.interactType !== RTC_INTERACTIVE_TYPE.video) {
      message.error('老师已关闭您的摄像头')
      return null
    } 
    this.localSelfInfo = {
      ...this.localSelfInfo,
      videoDisable: !this.localSelfInfo.videoDisable
    }
    if (info.selfVideoDisable) {
      instance.interactLive.rtc.enableVideo()
      return updateSeatListStatus(this.currentSeatList, type, false)
    } 
    instance.interactLive.rtc.disableVideo()
    return updateSeatListStatus(this.currentSeatList, type, true)
  },
  // 更新自己的音量
  updateSelfAudio(instance, type, info) {
    // 如果老师关闭当前摄像头 或者 互动模式不是视频 则不允许操作摄像头
    if (info.audioDisable || this.audioDisable) {
      message.error('老师已关闭您的麦克风')
      return null
    } 
    this.localSelfInfo = {
      ...this.localSelfInfo,
      audioDisable: !this.localSelfInfo.audioDisable
    }
    if (info.selfAudioDisable) {
      instance.interactLive.rtc.enableAudio()
      return updateSeatListStatus(this.currentSeatList, type, false)
    } 
    instance.interactLive.rtc.disableAudio()
    return updateSeatListStatus(this.currentSeatList, type, true)
  },
  updateAudioVideoStatusCurrentSeatList(id, type, key) {
    const insertKey = `other${key}Disabled`
    this.currentSeatList = this.currentSeatList.map((item) => {
      let obj = { ...item}
      if (item.buid === String(id)) {
        if (type === 'enabled') {
          obj[insertKey] = false
        } else {
          obj[insertKey] = true
        }
      }
      return obj
    })
    return this.currentSeatList
  },
  // 下台
  switchOffSeat(instance) {
    console.log('=====switchOffSeat', )
    instance.interactLive.rtc.switchOffSeat()
    this._resetLocalSelf()
  },
  // 关闭视频
  closeUserVideo(instance) {
    let isHasSelf = this.currentSeatList.find((item) => item.isSelf)
    isHasSelf && instance.interactLive.rtc.disableVideo()
  },
  // 开启视频模式
  openUserVideo(instance) {
    let isHasSelf = this.currentSeatList.find((item) => item.isSelf)
    if (!this.localSelfInfo.videoDisable && isHasSelf) {
      isHasSelf.videoDisable && instance.interactLive.rtc.enableVideo()
    }
  },
  // 设置初始化音频视频状态
  _setSelfInitVideoAudioStatus(data, instance) {
    if (this.localSelfInfo.videoDisable || this.localSelfInfo.audioDisable) {
      return
    }
    let  RTCContext = instance.interactLive.rtc
    const selfAndTeacherStatus = ()=> {
      if (this.selfInfo.videoDisable !== data.videoDisable || data.videoDisable) {
        // 自己禁止后 也无法开启
        if (!data.configVideoDisable) {
          data.videoDisable
          ? RTCContext.disableVideo()
          : RTCContext.enableVideo()
        }
      } else {
        !data.configVideoDisable && RTCContext.enableVideo()
      }
      if (this.selfInfo.audioDisable !== data.audioDisable || data.audioDisable) {
        if (!data.configAudioDisable) {
          // 自己禁止
          data.audioDisable
          ? RTCContext.disableAudio()
          : RTCContext.enableAudio()
        }
      } else {
        !data.configAudioDisable && RTCContext.enableAudio()
      }
    }
    //  全局video & audio 都禁止 则 全关闭 return
    if (data.configVideoDisable && data.configAudioDisable) {
      RTCContext.disableVideo() 
      RTCContext.disableAudio()
      return
    } if (data.configVideoDisable) {
      // 如果单独video 则关闭video 开启audio
      RTCContext.disableVideo() 
      selfAndTeacherStatus()
      return
      // RTCContext.enableAudio()
    } if(data.configAudioDisable) {
        // 如果单独audio 则关闭audio 开启video
      RTCContext.disableAudio() 
      selfAndTeacherStatus()
      return
      // RTCContext.enableVideo()
    } 
    RTCContext.enableVideo()
    RTCContext.enableAudio()
    
    selfAndTeacherStatus()
  },
  // 重置本地状态
  _resetLocalSelf() {
    this.localSelfInfo = {
      audioDisable: false,
      videoDisable: false
    }
    this.selfOnLine = false
  },
  // 轮询时间
  _startUpdateAudioLevel(instance) {
    this._audioLevelTimer && clearInterval(this._audioLevelTimer)
    this._audioLevelTimer = setInterval(() => {

    this.RTCLive.forEach((id) => {
        let rtcHorn = !isPc
          ? document.querySelector(`.m-rtc-view[data-id='${id}'] .m-rtc-horn`)
          : document.querySelector(`.rtc-view[data-id='${id}'] .rtc-horn`)
        let level = instance.interactLive.rtc.getAudioLevel(id)
        if (rtcHorn) {
          if (level > 0.2) {
            rtcHorn.style.display = 'block'
          } else {
            rtcHorn.style.display = 'none'
          }
        }
      })
    }, 1000)
  },
  // 清空
  _destroy() {
    this._audioLevelTimer && clearInterval(this._audioLevelTimer)
    this._resetLocalSelf()
    this.RTCLive = []
    this.currentSeatList = []
  }

}

export default RTCModeStore
