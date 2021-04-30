/**
 * @author 杨欣
 * @date 2020-06-19 19:02
 */


import React from 'react'
import {connect} from 'react-redux'
import className from 'classnames/bind'
import {Icon} from 'antd'
import styles from './index.module.styl'


const s = className.bind(styles)

const filterNum = num => {
  if (Number.isNaN(Number(num))) {
    return 0
  }
  return num < 10000 ? num : `${(num / 10000).toFixed(1)}w`
}

const Online = (props) => {
  const {onlineNum, role} = props
  // console.log('role', role, typeof role)
  return Number(role) === 1 ?
    <div className={s('online-wrapper')} title={`在线人数${filterNum(onlineNum)}`}><Icon type='team' style={{marginRight: 4}}/>{filterNum(onlineNum)}
    </div> : null

}

const mapStateToProps = state => ({
  onlineNum: state.message.onlineNum,
  role: state.user.role
})

export default connect(mapStateToProps)(Online)
