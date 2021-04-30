
import {globalConst} from '@/consts/globalConst'
import IMUtil from 'utils/IMUtil'

// IM活动接口-教师 ** 教师的不做
const getAdminList = async (type = 1) => {
  const ret = IMUtil.isSDKReady ? await globalConst.client.getActivityList(type) : []
  
  return ret
}
// 修改活动状态
/**
 *
 * @param {*} activityId
 * @param {*} status  1 启用 0 停用
 */
export function changeAdminActivity(activityId, status) {
  return globalConst.client.changeActivityStatus(activityId, status)
}

// 活动列表-学生
const getStudentList = async () => {

  // 游客模式 放开活动
  const ret = IMUtil.isSDKReady ? await globalConst.client.getActivityList() : []

  return ret
}

export { getAdminList, getStudentList }
