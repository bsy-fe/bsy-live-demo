import React, {useEffect, useState} from 'react'
import className from 'classnames/bind'
import {connect} from 'react-redux'
import {message} from 'antd'
import NoDataTemplate from '@/components/IM/NoDataTemplate'
import {BSYIM_TAB_ASK} from '@/consts'
import {Subject} from 'rxjs'
import {getAskList} from 'api/ask'
import {AskPageEventEmitter} from '@/consts/subjects'
import styles from './index.module.styl'
import AskItem from './askItem'

const s = className.bind(styles)

const Ask = props => {
  const {activeKey, kkbLiveId, isLesson, style} = props
  let [list, setList] = useState([])

  const noData = {
    url: '',
    info: '当前没有答题'
  }

  const refresh = () => {
    getAskList()
      .then(res => {
        let { data } = res
        if (data) {
          data.forEach(e => {
            let studentDiv = document.createElement('div')
            let StudentReplaceImg = e.desc.replace(/<img.*?>/gi, '【图片】')
            studentDiv.innerHTML = StudentReplaceImg
            e.desc = studentDiv.innerText
          })
          setList(data)
        }
      })
      .catch(error => {
        console.log(error, error)
        message.error(error.data.msg, 1)
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
    <div className={s('ask-container')} style={style}>
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
            ></AskItem>
          )
        })
      ) : (
        <NoDataTemplate noData={noData} />
      )}
    </div>
  )
}
const mapStateToProps = state => ({
  kkbLiveId: state.user.kkbLiveId,
  isLesson: state.user.isLesson
})
export default connect(mapStateToProps)(Ask)
