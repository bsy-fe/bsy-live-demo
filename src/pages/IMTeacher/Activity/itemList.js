import React from 'react'
import classNames from 'classnames/bind'
import { Button, message } from 'antd'
import { changeAdminActivity } from '@/api/activity'
import { IsPC } from '@/utils'
import styles from './index.module.styl'

const isM = !IsPC()

const s = classNames.bind(styles)
const ItemList = props => {
  const { refresh, currentRow, isLesson } = props
  
  // 教师发起活动
  const handlePause = (item, status) => {
    let params = {
      activity_id: item.activity_id,
      status
    }
    changeAdminActivity(params.activity_id, status)
      .then(() => {
        if (String(status) === '0') {
          message.success('停用成功', 1)
        } else {
          message.success('启用成功', 1)
        }
        refresh()
      })
      .catch(res => {
        message.error(res.data.msg, 1)
      })
  }

  return (
    <div
      className={`${s('activity-item-list')} ${
        isM ? s('m-activity-item-list') : ''
      }`}
    >
     <ul>
        <li className={s('list-item')}>
          <p>
            <b>{currentRow.name}</b>
          </p>
          <p>口令：{currentRow.keyword}</p>
          <div className={s('btn-container')}>
            {currentRow.status === 1 ? (
              <Button type='danger' disabled={!!isLesson} onClick={() => handlePause(currentRow, 0)}>
                停用
              </Button>
            ) : (
              <Button type='primary' disabled={!!isLesson} onClick={() => handlePause(currentRow, 1)}>
                启用
              </Button>
            )}
          </div>
        </li>
      </ul>
    </div>
  )
}
export default ItemList
