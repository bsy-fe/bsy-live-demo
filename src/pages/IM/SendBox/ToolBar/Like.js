import React, {useEffect, useRef, useState} from 'react'
// import { Popover } from 'antd'
import { connect } from 'react-redux'
import className from 'classnames/bind'
import IMUtil from '@/utils/IMUtil'
import {IsPC} from '@/utils'
import Zan from '@/components/IM/Zan'
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

const addZan = (number, event) => {
  if (!addZanEvent) {
    addZanEvent = Zan(document.querySelector('#zan-icon'), edgeX, edgeY, event)
  }
  addZanEvent(number)
}

const Like = props => {
  // const rpDialog = AskDialog(props)
  const { likeNum } = props

  const [visibleLikeNum, setVisibleLikeNum] = useState(0)



  const clickEvent = () => {
    // if(!disabled) {
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


  return (
    <div className={s(['tb-item', 'tb-item-like', !IsPC() ? 'tb-item-like-m' : ''])} onClick={clickEvent}>
      {IsPC() && <div id='zan-icon' className={s('icon')} />}
      
      <span className={s(['like-num'])}>{filterNum(visibleLikeNum)}</span>
      {!IsPC() && <div  className={s('icon')} >

        <div id='zan-icon' className={s('icon-like')}> </div>
        </div>}
    </div>
  )
}

const mapStateToProps = state => ({
  likeNum: state.message.likeNumber
})
const mapDispatchToProps = dispatch => ({
  setLikeNum: dispatch.message.setLikeNum
})

export default connect(mapStateToProps, mapDispatchToProps)(Like)
