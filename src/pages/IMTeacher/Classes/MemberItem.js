/**
 * @author 杨欣
 * @date 2021-04-15 14:21
 */

import { roleEnum as roleEnumColor } from '@/components/IM/Hooks/useMessageItem'
import roleEnum from '@/consts/roles'
import React from 'react'
import { throttle } from 'lodash'
import { connect } from 'react-redux'

import classNames from 'classnames/bind'
import store from '@/store'
import { inviteStudent } from '@/api/mic'
import { message } from 'antd'
import styles from './index.module.styl'

const s = classNames.bind(styles)

const MemberItem = ({ item, onRefresh, isMicOnline, micSeatList }) => {
  const upQueue = throttle(() => {
    console.log('item when invite::', item)
    // console.log('1231323++++++++++++===')
    inviteStudent(item.uid || item.userID) // 老师的userID代表buid，会有uid表示业务系统的uid，普通学生的userID直接代表业务系统uid，但是没有uid字段
      .then(() => {
        message.success('操作成功')
      })
      .catch((err) => {
        message.warning(err.data && err.data.msg)
      })
  }, 3000)

  const changeForbid = () => {
    const { userID: uid, forbid } = item
    store
      .dispatch({
        type: 'message/changeUserMute',
        payload: {
          uid,
          status: !forbid
        }
      })
      .then(() => {
        console.log('改变成功')
        onRefresh()
      })
  }

  const canUpQueue =
    isMicOnline &&
    !micSeatList.find((teacherItem) => item.userID === teacherItem.uid) &&
    String(item.role) !== '1'

  return (
    <div className={s('table-item')} key={item.userID + item.role}>
      <div className={s('left')}>
        <div className={s('name')}>{item.nick}</div>
        {item.role !== 'Member' && (
          <div
            className={s('title')}
            style={{
              backgroundColor:
                roleEnumColor[item.role] && roleEnumColor[item.role].bg,
              color: roleEnumColor[item.role] && roleEnumColor[item.role].color
            }}
          >
            {roleEnum[item.role]}
          </div>
        )}
      </div>
      <div className={s('btn-container')}>
        {item.role !== 'Member' ? null : (
          <div className={s('btn')} onClick={changeForbid}>
            {item.muteUntil * 1000 > Date.now() || item.forbid
              ? '解除禁言'
              : '禁言'}
          </div>
        )}
        {canUpQueue && (
          <div className={s('btn-mic')} onClick={upQueue}>
            上台
          </div>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    micSeatList: state.mic.micSeatList
  }
}

export default connect(mapStateToProps)(MemberItem)
