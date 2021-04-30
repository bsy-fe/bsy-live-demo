/**
 * @description 答题相关接口
 */

import {globalConst} from '@/consts/globalConst'

// 获取学生答题列表
const getAskList = async () => {
  return globalConst.client.getAskList()
}
// 发送题目
const sendAsk = questionId => {
  return globalConst.client.sendAsk(questionId)
}

export { getAskList, sendAsk }
