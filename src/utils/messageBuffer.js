/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import store from '@/store'
import {interval, Subject} from 'rxjs'
import {bufferTime} from 'rxjs/operators'

const addMessageInterval = new Subject()

const addMessageSubscription = addMessageInterval.pipe(bufferTime(1000)).subscribe((lists) => {
  // console.log('=============lists::', lists)
  // const msgs = /
  if (lists.length) {
    store.dispatch.message.addMessageList({list: [].concat(...lists), selfSend: false})
  }
})

class MessageBuffer {

  bufferName

  // 每100毫秒添加的数量
  COUNT

  // 添加间隔
  ADD_INTERVAL

  get BUFFER_MAX(){
    return this.COUNT * 100
  }

  state = 0

  // bufferList = []

  list = []

  straightInsert

  insertInterval

  addToRedux = () => {
    // console.log('=============执行addToRedux', this)

    if(this.list.length) {
      addMessageInterval.next([...this.list])
      this.list.length = 0
    }


    // this.state = this.list.length ? 1 : 0
    // const run = () => {
    //   // const len = this.list.length
    //   // state = 1
    //   // const min = Math.min(len, this.COUNT)
    //   // let arr = this.list.splice(0, min)
    //   // arr = arr.map(msg => ({
    //   //     message: msg,
    //   //     selfSend: 0
    //   //   }))
    //   // arr.forEach( msg => {
    //     // console.log('=============系统通知添加::', msg)
    //     // store.dispatch.message.addMessage(msg)
    //   // })
    //
    //
    //   store.dispatch.message.addMessageList(this.list)
    //
    //   // store.dispatch.message.addMessageList({
    //   //   messages: arr
    //   // })
    //   // console.log(this.state, this.list.length, arr.length)
    //   if (this.list.length) {
    //     setTimeout(() => {
    //       run()
    //     }, this.ADD_INTERVAL)
    //     this.state = 1
    //   } else {
    //     this.state = 0
    //   }
    // }
    // setTimeout(run, this.ADD_INTERVAL)
    // run()
  }

  constructor(count = 4, straightInsert = false) {
    this.COUNT = count
    this.straightInsert = straightInsert
    this.ADD_INTERVAL = 1000
    // this.bufferName = name

    this.insertInterval = interval(this.ADD_INTERVAL)

    this.insertInterval.subscribe( () => {
      // console.log('=============interval 到期:', this)
      this.addToRedux()
    })

  }




  addMessage = (msg, priority = 1) => {
    // if (!msg.payload.text) {
    // console.log('=============add message:: ', this)
    if(this.straightInsert) {
      store.dispatch.message.addMessage({
            message: msg,
            selfSend: 0
          })
    } else {
      msg = {...msg, listPriority: priority}
      if (this.list.length < this.BUFFER_MAX) {
        this.list.push(msg)
      } else if (priority > 1) {
        // const firstThrow = this.list.findIndex(({listPriority}) => listPriority < 2)
        this.list.some( (item, index) => {
          if(item.listPriority < 2) {
            this.list.splice(index, 1, msg)
          }
          return item.listPriority < 2
        })

      }
    }



    // } else {
    //   console.log('msg to row, ', msg)
    //   store.dispatch.message.addMessage({
    //     message: msg,
    //     selfSend: 0,
    //   })
    // }
  }


  setCount(count) {
    this.COUNT = count
  }
}

export const activityMessageBuffer = new MessageBuffer(1, false)

export const chatMessageBuffer = new MessageBuffer(6, false)

export default {
  activityMessageBuffer,
  chatMessageBuffer
}
