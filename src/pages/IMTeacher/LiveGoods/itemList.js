import React from 'react'
import classNames from 'classnames/bind'
import { Button, message } from 'antd'
import { changeAdminActivity } from '@/api/liveGoods'
import { IsPC } from '@/utils'
import { STATUS_ENUM } from '@/consts'
import styles from './index.module.styl'

const isM = !IsPC()

let isSending = false
const s = classNames.bind(styles)
const ItemList = props => {
  const { refresh, currentRow, isLesson } = props
  // 上下架
  const handlePause = (item, status) => {
    let params = {
      goodsId: item.goods_id,
      status
    }
    if(isSending) {
      return
    }
    isSending = true
    changeAdminActivity(params.goodsId, status)
      .then(() => {
        if (String(status) !== '1') {
          message.success('下架成功', 1)
        } else {
          message.success('上架成功', 1)
        }
        refresh()
        isSending = false
      })
      .catch(res => {
        isSending = false
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
          <p>入口样式：{['', '文字', '图片'][currentRow.style_type]}</p>
          <p>状态：{STATUS_ENUM[currentRow.status]}</p>
          <div className={s('btn-container')}>
            {currentRow.status === 1 ? (
              <Button
                type='danger'
                disabled={!!isLesson}
                onClick={() => handlePause(currentRow, 2)}
              >
                下架
              </Button>
            ) : (
              <Button
                type='primary'
                disabled={!!isLesson}
                onClick={() => handlePause(currentRow, 1)}
              >
                上架
              </Button>
            )}
          </div>
        </li>
      </ul>
    </div>
  )
}
export default ItemList
