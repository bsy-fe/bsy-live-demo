import React, {useState} from 'react'
import classNames from 'classnames/bind'
import { Button, message } from 'antd'
import { changeAdminActivity } from '@/api/activity'
import { IsPC } from '@/utils'
import styles from './index.module.styl'

const isM = !IsPC()

// let isSending = false
const s = classNames.bind(styles)
const ItemList = props => {
  const { refresh, currentRow, isLesson } = props

  const [isSending, setIsSending] = useState(null)
  // 教师发起活动
  const handlePause = (item, status) => {
    let params = {
      activity_id: item.activity_id,
      status
    }
    if(isSending) {
      return
    }
    setIsSending(params.activity_id)
    changeAdminActivity(params.activity_id, status)
      .then(() => {
        if (String(status) === '0') {
          message.success('停用成功', 1)
        } else {
          message.success('启用成功', 1)
        }
        refresh()
        setIsSending(null)
      })
      .catch(res => {
        setIsSending(null)
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
           <p>发送次数：{currentRow.send_num}</p>
          <div className={s('btn-container')}>
              <Button type='primary' disabled={!!isLesson} onClick={() => handlePause(currentRow, 1)} loading={isSending === currentRow.activity_id}>
                发送
              </Button>
          </div>
        </li>
      </ul>
    </div>
  )
}
export default ItemList
