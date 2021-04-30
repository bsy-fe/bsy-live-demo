
import { RTC_INTERACTIVE_TYPE } from '@/consts/rtc'
// import 
/**
 * 检查设备权限
 * @param {*} instance 播放器示例
 * @returns 
 */
export const checkDeviceAuth = (instance) => {
  let video = new Promise((resolve, reject) => {
    instance
      .getBrowserAuth('video')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
  let audio = new Promise((resolve, reject) => {
    instance
      .getBrowserAuth('audio')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
  return new Promise((resolve, reject) => {
    Promise.all([video, audio])
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 * 判断自己是否在席位上
 * @param {*} instance 
 */
export const getRTCSeatList = (instance) => {
  return new Promise((resolve) => {
    instance.getSeatList().then(res => {
      console.log('=====getRTCSeatList instance.getSeatList',res )
      let { code, data} = res
      if (code === 1) {
        resolve(data)
      } else {
        resolve([])
      }
    }).catch(() => {
      resolve([])
    })
  })
}

/**
 * 判断当前席位上是否存在自己
 * @param {*} list  席位列表
 * @param {*} selfId 自己的id
 * @returns 
 */
export const selfIsOnSeat = (list, selfId) => {
  console.log('=====selfIsOnSeat', list, selfId)
  return list.find(item=> item.uid === selfId)
}


/**
 * 下台
 * @param {*} instance 
 */
export const studentOffSeat = (instance, id) => {
  return new Promise((resolve, reject) => {
    instance.studentOffSeat(id).then(() => {
      resolve()
    }).catch((err) => {
      reject(err)
    })
  })
}


export const isAdmin = (userInfo) => {
  return userInfo && userInfo.role && Number(userInfo.role) !== 4
}

/**
 * 格式化席位列表数据
 */
export const formatList = ({data, config,  client, rtcStore}) => {
  console.log('=====formatList', data, client)
  let list = []
  let  {audioDisable, interactType} = rtcStore
  console.log('=====formatList',audioDisable, interactType)
  data.forEach(item => {
    if (isAdmin(config.userInfo)) {
      item.isAdmin = true
    }
    item.configAudioDisable = audioDisable
    item.configVideoDisable = interactType !== RTC_INTERACTIVE_TYPE.video
    item.interactType = interactType
    if (item.uid === config.userId) {
      item.isSelf = true
      item.selfVideoDisable = rtcStore.localSelfInfo.videoDisable
      item.selfAudioDisable = rtcStore.localSelfInfo.audioDisable
      list.unshift(item)
    } else {
      item.isSelf = false
      list.push(item)
    }
  })
  
  return list
}


/**
 * 获取自己的音频状态
 * @param {*} selfInfo 
 * @returns {Object}  
 */
export const getSelfVideoDisabled = (selfInfo) => {
  let videoDisabledStatus = false
  if (selfInfo) {
    if (selfInfo.configVideoDisable) {
      videoDisabledStatus = true
    }
    if (selfInfo.videoDisable) {
      videoDisabledStatus = true
    }
  }
  return {
    videoDisabledStatus
  }
}

/**
 * 修改自己视频&音频状态 更新席位列表数据
 * @param {Array} oldList 席位列表
 * @param {String} key 修改的key值
 * @param {Boolean} value 修改的值
 * @returns {Array}
 */
export const updateSeatListStatus = (oldList ,key, value) => {
  let listKey = key.charAt(0).toUpperCase() + key.slice(1)
  let list = [...oldList]
  list.forEach((item) => {
    if (item.isSelf) {
      item[`self${listKey}Disable`] = value
    }
  })
  return list
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export const handleTeacherUpdateSeat = ({info, type, id, instance, rtcStore}) => {
  console.log('=====handleTeacherUpdateSeat', info, type, id, instance, rtcStore)
  if (rtcStore.audioDisable && type === 'audio') {
    // message('warning', '已经开启全员静音🔇')
    return
  }
  let {audioDisable, videoDisable} = info
  switch (type) {
    case 'hangup':
      instance.studentOffSeat(id)
      break
    case 'video':
      instance.muteStudentVideo(id, !videoDisable)
      break
    case 'audio':
      instance.muteStudentAudio(id, !audioDisable)
      break
    default:
      break
  }

}
