import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import { getAdminList } from '@/api/liveGoods'
import { connect } from 'react-redux'
import NoDataTemplate from '@/components/IM/NoDataTemplate'
import { setSession } from '@/utils'
import { message } from 'antd'
import { BSYIM_TAB_LIVEGOODS } from '@/consts'
import ItemList from './itemList'

import styles from './index.module.styl'

const s = classNames.bind(styles)

const Activity = props => {
  const { activeKey, kkbLiveId, isLesson } = props

  const [activityList, setList] = useState([])
  const noData = {
    url: '',
    info: '当前没有货品，敬请期待'
  }

  const refresh = () => {
    getAdminList()
      .then(res => {
        if (res.data) {
          setList(res.data)
          setSession('imActivityList', res.data)
        }
      })
      .catch(error => {
        message.error(
          error && error.data ? error.data.msg : '获取货品列表失败',
          1
        )
        setList([])
      })
  }
  useEffect(() => {
    refresh()
  }, [])
  useEffect(() => {
    if (String(activeKey) === BSYIM_TAB_LIVEGOODS) {
      refresh()
    }
  }, [activeKey])
  return (
    <div className={s('acitivity-container')}>
      {activityList.length ? (
        activityList.map((item, index) => {
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
