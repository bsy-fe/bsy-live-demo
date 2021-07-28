import React, {useEffect, useState} from 'react'
import {Pagination} from 'antd'
import {connect} from 'react-redux'
import classNames from 'classnames/bind'
import getters from '@/store/getters'
import {BSYIM_TAB_CLASSES} from '@/consts'
import {RTC_INTERACTIVE_TYPE} from '@/consts/rtc'


import IMUtil from 'utils/IMUtil'
import {globalConst} from '@/consts/globalConst'
import MemberItem from '@/pages/IMTeacher/Classes/MemberItem'
import styles from './index.module.styl'

const s = classNames.bind(styles)

const format = (listToFormat) => {
  return listToFormat.map(item => ({
    role: item.userRole === 4 || !item.userRole || item.userRole === 999 ? 'Member' : item.userRole,
    nick: item.nickname || '无名称',
    userID: item.uid,
    forbid: item.forbid
  }))
}


const Classes = props => {
  const {
    activeKey,
    setOnlineNum,
    onlineNum,
    role,
    userInfo,
    micSeatList,
    rtcInfo,
    teacherList
  } = props
  const defaultPagination = {
    total: onlineNum,
    current: 1,
    pageSize: 10
  }
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [check, setCheck] = useState(false)

  const [pagination, setPagination] = useState(defaultPagination)
  // const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const {contentId} = getters()

  const [isMicOnline, setIsMicOnline] = useState(rtcInfo.interactType !== RTC_INTERACTIVE_TYPE.close)

  useEffect(() => {
    console.log('====rtcInfo change:: ', rtcInfo)
    setIsMicOnline(rtcInfo.interactType !== RTC_INTERACTIVE_TYPE.close)
  }, [rtcInfo])

  const getList = () => {
    console.warn('=============获得成员列表')
    console.log('current, pagesize', current, pagination.pageSize)
    return IMUtil.getGroupMemberList(current, pagination.pageSize).then(memberRes => {
      console.log(memberRes, 'imres.data.memberList')
      const memberList = format(memberRes.data.result)
      setList([...memberList])
      setOnlineNum(memberRes.data.total)
      setLoading(false)

    })

      .catch(err => {
        console.error(err, {role, userInfo})
        // console.log()
        setLoading(false)
      })
  }

  const refresh = () => {
    setLoading(true)
    console.warn('=============get room info')
    IMUtil.readyToDo(() => {
      getList()
    })
  }
  useEffect(() => {
    refresh()
    globalConst.client.on('interact-config-change', data => {

      if (data.interactType === RTC_INTERACTIVE_TYPE.close) {
        // 关闭连麦不展示上台按钮
        setIsMicOnline(false)
      } else {
        // 开启连麦
        setIsMicOnline(true)
      }
    })
  }, [])
  useEffect(() => {

    if (String(activeKey) === BSYIM_TAB_CLASSES) {
      refresh()
    }
  }, [activeKey])
  useEffect(() => {
    refresh()
  }, [check])
  useEffect(() => {
    refresh()
  }, [current])


  const handleChange = page => {
    const pager = {...pagination}
    pager.current = page
    setPagination(pager)
    setCurrent(page)

  }
  const onCheckChange = ({target}) => {
    setCheck(target.checked)
  }

  const renderMember = (item) => {
    return <MemberItem item={item} onRefresh={refresh} isMicOnline={isMicOnline} key={item.userID + item.role}/>
  }


  return (
    <div className={s('classes-wrapper')}>
      <div>
      </div>
      <div className={s('table-list')}>
        {
          teacherList.sort((prev, cur) => prev.role - cur.role).map(renderMember)
        }
        {list.map(renderMember)}
      </div>
      <div className={s('table-pagination')}>
        <span>{onlineNum} 人在线</span>
        {/* && onlineNum > pagination.pageSize */}
          <Pagination
            size='small'
            current={current}
            total={onlineNum}
            defaultPageSize={pagination.pageSize}
            pageSize={pagination.pageSize}
            onChange={handleChange}
          />
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  groupDetail: state.message.groupDetail,
  onlineNum: state.message.onlineNum,
  role: state.user.role,
  userInfo: state.user.userInfo,
  userID: state.user.uId,
  rtcInfo: state.mic.rtcInfo,
  teacherList: state.message.teacherList
})

const mapDispatchToProps = dispatch => ({
  setOnlineNum: dispatch.message.setOnlineNum
})

export default connect(mapStateToProps, mapDispatchToProps)(Classes)
