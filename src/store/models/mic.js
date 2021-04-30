import { getSeatList } from '@/api/mic'
import { RTC_INTERACTIVE_TYPE } from '@/consts/rtc'
import { setSomething } from '../utils'

export default {
  state: {
    micSeatList: [],
    rtcInfo: {
      interactType: RTC_INTERACTIVE_TYPE.close,
      audioDisable: false
    }
  },
  reducers: {
    setMicSeatList(state, payload) {
      const { micSeatList } = payload
      return {
        ...state,
        micSeatList
      }
    },
    setSomething(state, payload) {
      console.log(payload, 'rtcInfo')
      return setSomething(state, payload)
    }
  },
  effects: dispatch => ({
    async getMicSeatList(payload, rootState) {
      return new Promise((resolve, reject) => {
        getSeatList()
          .then((res) => {
            if (res && res.data) {
              resolve(res.data)
              this.setMicSeatList({
                micSeatList: res.data
              })
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  })
}
