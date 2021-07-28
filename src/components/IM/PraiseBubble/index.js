/**
 * @author 杨欣
 * @date 2021-07-21 15:42
 */
import React, {useEffect, useState} from 'react'

import ReactDom from 'react-dom'

import {random} from '@/utils'
import s from './index.module.less'

const AnimationDuration = 3 // 动画持续时间（秒）

const MAX_BATCH_NUM = 12

const PraiseBubble = (container, zanEvent) => {
  //
  // const bubbleStyle = useState({
  //   width: container.width,
  //   height: container.height
  // })
  //
  // useEffect(() => {
  //   console.log('=============container change::', container)
  // }, [container])

  function sendBubble() {
    const newBubble = document.createElement('div')

    const randomNumber = Math.ceil(random(MAX_BATCH_NUM))

    newBubble.className = `${s.bubble} ${s[`bl-${randomNumber}`]}`

    newBubble.onclick = zanEvent

    // newBubble.style = `animation: bubble_y ${AnimationDuration}s linear 1 forwards;`

    container && container.appendChild(newBubble)

    setTimeout(() => {
      container.removeChild(newBubble)
    }, AnimationDuration * 1000)
  }

  return (number) => {

    const numberToShow = Math.min(number, MAX_BATCH_NUM)

    let createdNumber = 0


    if(number === 1) {
      sendBubble()
    } else {


      const run = () => {

        const sendTime = random(20, 500)

        setTimeout(() => {
          if (createdNumber < numberToShow) {
            sendBubble()
            run()
          }
          createdNumber += 1
        }, sendTime)
      }

      run()

    }
    



    
    
  }
}


export default PraiseBubble
