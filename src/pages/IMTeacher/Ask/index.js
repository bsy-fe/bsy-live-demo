import React, {useEffect, useState} from 'react'
import className from 'classnames/bind'
import {connect} from 'react-redux'
import {message} from 'antd'
import NoDataTemplate from '@/components/IM/NoDataTemplate'
import {getAskList} from '@/api/ask'
import {BSYIM_TAB_ASK} from '@/consts'
import {AskPageEventEmitter} from '@/consts/subjects'
import styles from './index.module.styl'
import AskItem from './askItem'

const s = className.bind(styles)

const TeacherAsk = props => {
  const {activeKey, kkbLiveId, isLesson} = props
  let [list, setList] = useState([])
  let [allRightNum, setAllRightNum] = useState(0)
  let [totalNum, setTotalNum] = useState(0)
  const noData = {
    url: '',
    info: '当前没有答题'
  }

  const refresh = () => {
    getAskList()
      .then(res => {
        let {data} = res
        let num = 0
        data = res.data.list
        setTotalNum(res.data.totalAnswerNumber)
        if (data) {
          data.forEach(e => {
            let teacherDiv = document.createElement('div')
            let teacherReplaceImg = e.description.replace(
              /<img.*?>/gi,
              '【图片】'
            )
            teacherDiv.innerHTML = teacherReplaceImg
            e.description = teacherDiv.innerText
          })
          if (data.length) {
            num = data[0].allRightNumber
          }
          data.forEach(item => {
            if (item.isSend === 1 && item.allRightNumber <= num) {
              num = item.allRightNumber
            }
          })
          setAllRightNum(num)
          setList(data)
        }
      })
      .catch(error => {
        message.error(error.data ? error.data.msg : error, 1)
        setList([])
      })
  }
  useEffect(() => {
    const subscriber = AskPageEventEmitter.subscribe(e => {
      console.log(e, 'ask-init')
      if (e) {
        refresh()
      }
    })

    return () => {
      subscriber.unsubscribe()
    }
  }, [])
  useEffect(() => {
    if (String(activeKey) === BSYIM_TAB_ASK) {
      refresh()
    }
  }, [activeKey])
  return (
    <div className={s('ask-container')}>
      <div className={s('total-wrapper')}>
        <div style={{marginBottom: 2}}>
          当前参与答题人数统计：
        </div>
        <div>
          <span style={{marginRight: 24}}> 参与：{totalNum} </span>
          <span>答对：{allRightNum}</span>
        </div>
      </div>
      {list.length ? (
        list.map(item => {
          return (
            <AskItem
              key={item.questionId + Date.parse(new Date())}
              currentRow={item}
              kkbLiveId={kkbLiveId}
              isLesson={isLesson}
              refresh={() => {
                refresh()
              }}
            />
          )
        })
      ) : (
        <NoDataTemplate noData={noData}/>
      )}
    </div>
  )
}
const mapStateToProps = state => ({
  kkbLiveId: state.user.kkbLiveId,
  isLesson: state.user.isLesson
})
export default connect(mapStateToProps)(TeacherAsk)
