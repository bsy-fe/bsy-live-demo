import { globalConst } from '@/consts/globalConst'

/*
 获取席位列表
*/
export const getSeatList = () => {
  return globalConst.client.getSeatList()
}

// 获取举手队列
export const getQueueList = () => {
  return globalConst.client.getQueueList()
}

// 邀请学生
export const inviteStudent = (uid, nickname) => {
  return globalConst.client.inviteStudent(uid, nickname)
}

// 队列上台/teacher/seat/add
export const studentOnSeatFromQueue = (uid, nickname) => {
  return globalConst.client.studentOnSeatFromQueue(uid, nickname)
}

// 配置连麦信息
/**
 *
 * @param {interactType} params   // 非必填参数 连麦配置   "close"-关闭连麦 "video"-视频连麦 "audio"-音频连麦
 * @param {audioDisable} params   // 非必填参数 全体静音 false-正常 true-全体静音
 */
export const setInteractConfig = (params) => {
  return globalConst.client.setInteractConfig(params)
}
// 移除队列
export const removeStudentFromQueue = (uid, nickname) => {
  return globalConst.client.removeStudentFromQueue(uid, nickname)
}
// 下台
export const studentOffSeat = (uid) => {
  return globalConst.client.studentOffSeat(uid)
}
