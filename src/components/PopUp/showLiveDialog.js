import {isJSONString} from 'utils'
import {AskPageEventEmitter} from '@/consts/subjects'
import showPopUp from './showPopUp'

/**
 * @author 杨欣
 * @date 2021-04-10 13:53
 */
export const showLiveDialog = ({children}) => {

  const closePopUp = (ins, event) => {
    ins && ins.destroy()
    window.removeEventListener('message', event)
  }

  const popUpInstance = showPopUp({
    children
  })



  const messageEvent = (e) => {
    // 监听答题的回调
    let cbData = e.data
    if (isJSONString(cbData)) {
      cbData = JSON.parse(cbData)
    }
    // 2020.8.19 添加弹窗返回信息处理
    if (cbData && cbData.target === 'ad') {
      switch (cbData.action) {
        case 'close': // 关闭弹窗
          closePopUp(popUpInstance, messageEvent)
          break
        default:
          break
      }
    }else if (cbData && (cbData.type === 'BSYIM_CALLBACK_MESSAGE' || cbData.type === 'HKYIM_CALLBACK_MESSAGE')) {
      console.log(e, 'sdk回调消息')
      closePopUp(popUpInstance, messageEvent)
      AskPageEventEmitter.next(true)
    }
  }

  const subscription = popUpInstance.onDestroy.subscribe( res => {
    window.removeEventListener('message', messageEvent)
    subscription.unsubscribe()
  })

  window.addEventListener('message', messageEvent)
}
