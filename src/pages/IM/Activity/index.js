import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {getStudentList} from '@/api/activity'
import {connect} from 'react-redux'
import NoDataTemplate from '@/components/IM/NoDataTemplate'
import {setSession} from '@/utils'
import {message} from 'antd'
import {BSYIM_TAB_ACTIVITY} from '@/consts'

import getters from '@/store/getters'
import {ActivityEventEmitter} from '@/consts/subjects'
import styles from './index.module.styl'
import ItemList from './itemList'

const s = classNames.bind(styles)

const Activity = props => {
  const {activeKey, kkbLiveId, isLesson, style} = props

  const [acitvityList, setList] = useState([])
  const noData = {
    url: '',
    info: '当前没有活动，敬请期待'
  }
  const {isGuestMode} = getters()

  let getListMatch = getStudentList
  //
  // if(isGuestMode) {
  //   // 2020.8.11 在游客模式下需要通过activity/list获取type为2（代表是群发红包）并且前端过滤，展示已发布的群发红包列表 yangxin
  //   getListMatch = () => getGuestList
  // }

  const refresh = () => {
    console.log('=============获取列表：：')
    getListMatch()
      .then(res => {
        if (res.data) {
          let filteredData = res.data
          if (isGuestMode) {
            filteredData = filteredData.filter(item => item.type !== 2 || item.status === 1)
          }
          setList(filteredData)
          setSession('imActivityList', filteredData)
        }
      })
      .catch(error => {
        message.error(
          error && error.data ? error.data.msg : '获取活动列表失败',
          1
        )
        setList([])
      })
  }
  useEffect(() => {
    refresh()
    const subscription = ActivityEventEmitter.subscribe(() => {
      refresh()
    })

    return () => {
      subscription && subscription.unsubscribe()
    }
  }, [])
  useEffect(() => {
    if (String(activeKey) === BSYIM_TAB_ACTIVITY) {
      refresh()
    }
  }, [activeKey])
  return (
    <div className={s('activity-container')} style={style}>
      {acitvityList.length ? (
        acitvityList.map((item, index) => {
          return (
            <ItemList
              key={index}
              kkbLiveId={kkbLiveId}
              isLesson={isLesson}
              refresh={() => {
                refresh()
              }}
              currentRow={item}
            />
          )
        })
      ) : (
        <NoDataTemplate noData={noData} />
      )}
      {}
    </div>
  )
}
const mapStateToProps = state => ({
  role: state.user.role,
  kkbLiveId: state.user.kkbLiveId,
  isLesson: state.user.isLesson
})
export default connect(mapStateToProps)(Activity)
