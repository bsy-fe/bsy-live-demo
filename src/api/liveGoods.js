import {globalConst} from '@/consts/globalConst'
import IMUtil from 'utils/IMUtil'
// IM群发红包 教师
const getAdminList = async () => {
  const ret = IMUtil.isSDKReady ? await globalConst.client.getGoodsList() : []

  return ret
}
// 修改活动状态
/**
 *
 * @param {*} activityId
 * @param {*} status  1 启用 0 停用
 */
export function changeAdminActivity(activityId, status) {
  return globalConst.client.changeGoodsStatus(activityId, status)
}

export { getAdminList }
