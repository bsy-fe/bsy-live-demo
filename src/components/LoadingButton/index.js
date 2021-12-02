/**
 * @author 杨欣
 * @date 2020-11-03 15:18
 */

import React, {useState} from 'react'
import {Button} from 'antd'


/**
 * @typedef Props
 * @description 传入参数定义
 * @author yang xin
 * @property {Function<Promise| any>} onClick: 业务自定义onClick方法，返回Promise时自动按照Promise的执行状态展示loading，不返回Promise时则按照固定时长展示Loading
 * @property {number} timeout: 传入的onClick方法的返回值不是promise时展示loading的自定义时常，默认为1000
 * @extends props 其他的参数与antd的Button接受参数相同
 */
/**
 * @description 根据传入的onCLick方法自动判断是否需要loading的按钮
 * @author yang xin
 * @param {Props} props: 传入参数
 */

const DefaultTimeOut = 1000

const LoadingButton = (props) => {

  const {timeout = DefaultTimeOut} = props

  const [loading, setLoading] = useState(false)


  const handleClick = (e) => {
    if (props && props.onClick) {
      // console.log(props.onClick)

      try {
        setLoading(true)
        const ret = props.onClick(e)
        if (ret instanceof Promise) { // 是Promise对象

          ret.finally(res => {
            setLoading(false)
            // console.warn('in finally promise over', res)
          }).catch( err => {
            // setLoading(false)
            throw err
          })
        } else {
          setTimeout(() => {
            setLoading(false)
          }, timeout || DefaultTimeOut)
        }
        // console.log(ret)
      } catch (err) {
        setLoading(false)
        // console.warn('err::', err)
      }

    }

  }


  return <Button {...props} onClick={handleClick} loading={loading}/>
}

export default LoadingButton
