import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {getAdminList} from '@/api/liveGoods'
import {connect} from 'react-redux'
import NoDataTemplate from '@/components/IM/NoDataTemplate'
import {setSession} from '@/utils'
import {message} from 'antd'
import {BSYIM_TAB_LIVEGOODS} from '@/consts'

import styles from './index.module.styl'

const s = classNames.bind(styles)

const LiveGoods = props => {
  const {activeKey, kkbLiveId, isLesson, liveGoodsUrl} = props

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
    <div className={s('activity-container')}>
      {
        liveGoodsUrl ? <iframe src={liveGoodsUrl} frameBorder="0" style={{width: '100%', height: '100%'}}/> : <NoDataTemplate noData={noData}/>
      }
    </div>
  )
}
const mapStateToProps = state => ({
  role: state.user.role,
  kkbLiveId: state.user.kkbLiveId,
  isLesson: state.user.isLesson,
  liveGoodsUrl: state.message.liveGoodsUrl
})
export default connect(mapStateToProps)(LiveGoods)
