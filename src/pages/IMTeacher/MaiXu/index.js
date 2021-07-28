/**
 *@file
 */
import React, { useState, useEffect } from 'react'
import { Button, Pagination, message } from 'antd'
import store from '@/store'
import className from 'classnames/bind'
import { connect } from 'react-redux'
import {Subject} from 'rxjs'
import roleEnum from '@/consts/roles'
import getters from '@/store/getters'

import {
  getQueueList,
  studentOnSeatFromQueue,
  removeStudentFromQueue,
  studentOffSeat
} from 'api/mic'
import { BSYIM_TAB_WAITING } from '@/consts'
import { roleEnum as roleEnumColor } from '@/components/IM/Hooks/useMessageItem'
import { globalConst } from '@/consts/globalConst'
import {debounceTime, tap, throttleTime} from 'rxjs/operators'
import Setting from './setting'

import styles from './index.module.styl'
import {HTTP_STATUS} from "../../../consts/statusCode";

const s = className.bind(styles)

const getListSubject = new Subject()

const Maixu = (props) => {
  const { activeKey, getMicSeatList, teacherList, rtcInfo } = props
  const defaultPagination = {
    total: 0,
    current: 1,
    pageSize: 30
  }
  const [pagination, setPagination] = useState(defaultPagination)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  
  
  const { role } = getters()

  let [list, setList] = useState([])

  const handleChange = () => {}

  // 移除队列
  const handleDelete = async (uid, nickname) => {
    let res = await removeStudentFromQueue(uid, nickname)
  }

  // 上台
  const handleMic = (item) => {
    console.log('============上台::', item)
    if (item.isOpenMic) {
      studentOffSeat(item.uid)
        .then((res) => {
          if(res && res.code === 1) {
            message.success('操作成功')
          } else {
            message.warning(res.msg)
          }
        })
        .catch((res) => {
          message.warning(res.data.msg)
        })
    } else {
      studentOnSeatFromQueue(item.uid, item.nickname)
        .then((res) => {
          if(res && res.code === 1) {
            message.success('操作成功')
          } else {
            message.warning(res.msg)
          }
        })
        .catch((res) => {
          message.warning(res.data.msg)
        })
    }
  }

  const NoDataTemplate = () => {
    return (
      <div className={s('mai-no-template-wrapper')}>
        <div className={s('mai-no-template-container')}>
          <img
            src={'//res-qn.baoshiyun.com/a/70914102201202irrj.png'}
            className={s('nodata-img')}
          />
          <p className={s('nodata-info')}>暂无申请上麦的同学~</p>
        </div>
      </div>
    )
  }




  const getList = () => {
    getListSubject.next(true)
  }

  const handleWatchEvent = () => {

    globalConst.client.on('queue-update', () => {
      getList()
    })

    globalConst.client.on('seat-list-update', () => {
      getList()
    })

    globalConst.client.on('interact-config-change', (data) => {
      store.dispatch({
        type: 'mic/setSomething',
        payload: {
          rtcInfo: {
            ...rtcInfo,
            ...data
          }
        }
      })
    })





  }

  useEffect(() => {

    console.log('=============set函数变化')

    const httpGetList = async () => {
      let storeSeatList = await getMicSeatList()
      let res = await getQueueList()
      if (res && res.data) {
        let waitList = res.data
        storeSeatList.length && storeSeatList.forEach((e) => (e.isOpenMic = true))
        if (waitList.length) {
          waitList.forEach((e) => {
            e.isOpenMic = false
          })
          // 过滤席位
          waitList = waitList.filter((e) => {
            return !storeSeatList.find((seat) => {
              return e.uid === seat.uid
            })
          })
        }

        let newList = storeSeatList.concat(waitList)
        newList.length &&
        newList.forEach((item) => {
          item.role = 'Member'
          teacherList.length &&
          teacherList.forEach((teacherItem) => {
            if (String(item.uid) === String(teacherItem.userID)) {
              item.role = teacherItem.role
            }
          })
        })
        console.log(newList, '123newList')
        console.log(teacherList, 'teacherlist')
        setList(newList)
        setTotal(newList.length)
      }
    }

    const subscription = getListSubject.pipe(
      tap(val => console.log('=============trigger subject before debounce', val)),
      debounceTime(200),
      tap(val => console.log('=============trigger subject after debounce', val)),
    ).subscribe( () => {
      httpGetList()
    })

    return () => {
      subscription && subscription.unsubscribe()
    }

  }, [setList, setTotal])

  useEffect(() => {


    handleWatchEvent()

  }, [])

  useEffect(() => {
    if (String(activeKey) === BSYIM_TAB_WAITING) {
      getList()
     }
  }, [activeKey])

  return (
    <div className={s('teacher-mai-container')}>
      {list.length ? (
        <>
          <div className={s('table-list')}>
            {list.map((item, index) => {
              return (
                <div className={s('table-item')} key={item.uid + index}>
                  <div className={s('left')}>
                    <div className={s('name')}>{item.nickname}</div>
                    {item.role !== 'Member' && (
                      <div
                        className={s('title')}
                        style={{
                          backgroundColor:
                            roleEnumColor[item.role] &&
                            roleEnumColor[item.role].bg,
                          color:
                            roleEnumColor[item.role] &&
                            roleEnumColor[item.role].color
                        }}
                      >
                        {roleEnum[item.role]}
                      </div>
                    )}
                  </div>
                  <div className={s('right')}>
                    {!item.isOpenMic && (
                      <div
                        className={s('delete')}
                        onClick={() => handleDelete(item.uid, item.nickname)}
                      >
                        <img src='//res-qn.baoshiyun.com/a/41054102201202cdzj.png' />
                      </div>
                    )}

                    <div
                      className={`${s('hands-btn')} ${
                        item.isOpenMic ? s('hands-down') : ''
                      }`}
                    >
                      <Button onClick={() => handleMic(item)}>
                        {item.isOpenMic ? '下台' : '上台'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {list.length >= defaultPagination.pageSize && (
            <div className={s('table-pagination')}>
              <Pagination
                size='small'
                current={current}
                total={total}
                defaultPageSize={pagination.pageSize}
                pageSize={pagination.pageSize}
                onChange={handleChange}
              />
            </div>
          )}
        </>
      ) : (
        <NoDataTemplate />
      )}

      {}

      {String(role) !== '1' && (
        <div className={s('setting')}>
          <Setting />
        </div>
      )}
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    teacherList: state.message.teacherList,
    seatList: state.mic.micSeatList,
    isOpenMic: state.mic.rtcInfo.audioDisable,
    rtcInfo: state.mic.rtcInfo
  }
}
const mapDispatchToProps = ({ mic }) => {
  return {
    getMicSeatList: mic.getMicSeatList
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Maixu)
