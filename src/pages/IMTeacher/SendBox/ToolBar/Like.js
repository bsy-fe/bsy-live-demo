import React, {useEffect, useRef, useState} from 'react'
// import { Popover } from 'antd'
import { connect } from 'react-redux'
import className from 'classnames/bind'
import IMUtil from '@/utils/IMUtil'
import {IsPC} from '@/utils'
import PraiseBubble from '@/components/IM/PraiseBubble'
import styles from './index.module.styl'

const s = className.bind(styles)

// const AskDialog = props => {
//   return <div>这是ask dialog</div>
// }
const filterNum = num => {
  return num < 10000 ? num : `${(num / 10000).toFixed(1)}w`
}
const edgeX = 40
const edgeY = 220

let addZanEvent = null



const Like = props => {
  // const rpDialog = AskDialog(props)
  const { likeNum, role } = props

  const [visibleLikeNum, setVisibleLikeNum] = useState(0)

  const bubbleWrapper = useRef(null)

  const zanIcon = useRef()

  const listener = (element = bubbleWrapper.current) => {
    // const getPos = () => {
    const pos = zanIcon.current && zanIcon.current.getBoundingClientRect()
    const { left, top, width, height} = pos

    console.log('=============resize::', left,top, pos)
    // wh = width
    // zanStyle.push(
    //   ...[
    //     `width:${width}px`,
    //     `height:${height}px`,
    //     `left:${left}px`,
    //     `top:${top}px`
    //   ]
    // )
    // zanBox.style = `position: fixed;left:${x}px;top:${y}px;width:0;height:0`
    element ? element.style = `left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px;` : console.log('=============点赞气泡容器不存在')
  }


  const addZan = (number, event) => {
    if(role === 4) {
      if (!addZanEvent) {
        addZanEvent = PraiseBubble(bubbleWrapper.current, event)
      }
      addZanEvent && addZanEvent(number)
    }
  }


  const clickEvent = (e) => {
    // if(!disabled) {
      e.stopPropagation()
      addZan(1, clickEvent)
      IMUtil.addLike()
      setVisibleLikeNum((prevLike) => prevLike + 1)
      // addLikeEvent()
    // }
  }

  const checkLikeNum = () => {
    // console.log('like num, change', likeNum)
    if(likeNum > visibleLikeNum) {
      setVisibleLikeNum(likeNum)
      addZan(likeNum - visibleLikeNum, clickEvent)
    }
  }

  useEffect(() => {
    checkLikeNum()
  }, [])

  useEffect(() => {
    checkLikeNum()
  }, [likeNum])

  useEffect(() => {
    listener()
  }, [visibleLikeNum])


  useEffect(() => {

    const ele = document.createElement('div')

    ele.id = 'bubble-wrapper'

    bubbleWrapper.current = ele

    window.addEventListener('resize', listener)

    listener()

    ele.onclick = clickEvent

    document.body.appendChild(ele)



    return () => {
      window.removeEventListener('resize', listener)
      // document.body.removeChild(ele)
    }
  }, [])
  
  useEffect(() => {
    
  }, [visibleLikeNum])


  return (
    <div className={s(['tb-item', 'tb-item-like', !IsPC() ? 'tb-item-like-m' : ''])} onClick={clickEvent}>
      {IsPC() && <div ref={zanIcon} id='zan-icon' className={s('icon')} />}
      
      <span className={s(['like-num'])}>{filterNum(visibleLikeNum)}</span>
      {!IsPC() && <div  className={s('icon')} >

        <div id='zan-icon' ref={zanIcon} className={s('icon-like')}> </div>
        </div>}
    </div>
  )
}

const mapStateToProps = state => ({
  likeNum: state.message.likeNumber,
  role: state.user.role
})
const mapDispatchToProps = dispatch => ({
  setLikeNum: dispatch.message.setLikeNum
})

export default connect(mapStateToProps, mapDispatchToProps)(Like)
