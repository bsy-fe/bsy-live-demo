import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import { getAdminList } from '@/api/activity'
import { connect } from 'react-redux'
import NoDataTemplate from '@/components/IM/NoDataTemplate'
import { message } from 'antd'
import { BSYIM_TAB_ACTIVITY } from '@/consts'

import getters from '@/store/getters'
import styles from './index.module.styl'
import ItemList from './itemList'

const s = classNames.bind(styles)

const Activity = props => {
  const { activeKey, kkbLiveId, isLesson } = props

  const [acitvityList, setList] = useState([])
  const noData = {
    url: '',
    info: '当前没有活动，敬请期待'
  }
  const { isGuestMode } = getters()

  let getListMatch = getAdminList

  if(isGuestMode) {
    // 2020.8.11 在游客模式下需要通过activity/list获取type为2（代表是群发红包）并且前端过滤，展示已发布的群发红包列表 yangxin
    getListMatch = () => getAdminList(2)
  }

  const refresh = () => {
    getListMatch()
      .then(res => {
        // console.log(res, 'getListMatch')
        if (res.data) {
          let filteredData = res.data
          if(isGuestMode) {
            filteredData = filteredData.filter(item => item.type !== 2 || item.status === 1)
          }
          setList(filteredData)
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
  }, [])
  useEffect(() => {
    if (String(activeKey) === BSYIM_TAB_ACTIVITY) {
      refresh()
    }
  }, [activeKey])
  return (
    <div className={s('acitivity-container')}>
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
            ></ItemList>
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
