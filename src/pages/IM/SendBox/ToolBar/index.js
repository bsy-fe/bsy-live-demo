import React from 'react'
import className from 'classnames/bind'
import { connect } from 'react-redux'
// import { TEACHER, ASSISTANT } from '../../../consts/roles'
import Emojis from './Emojis'
import Like from './Like'

import styles from './index.module.styl'


const s = className.bind(styles)

const ToolBar = props => {
  const { isM, handlerInput } = props
  console.log(handlerInput, 'handlerInput')
  return (
    <div className={s('toolbar-wrapper', isM ? 'toolbar-wrapper-m' : '')}>
      <div className={s('tb-item') + s('tb-item-emoji')}>
        <div className='icon'></div>
      </div>
      {!isM && (
        <Emojis
          role={props.role}
          msgInputRef={props.msgInputRef}
          userMute={props.userMute}
          handlerInput={handlerInput}
        />
      )}
    
      <Like disabled={props.userMute} />
    </div>
  )
}
const mapStateToProps = state => ({
  role: state.user.role
})
export default connect(mapStateToProps)(ToolBar)
