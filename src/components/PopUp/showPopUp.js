/**
 * @author 杨欣
 * @date 2021-04-09 14:45
 */

import React from 'react'
import * as ReactDOM from 'react-dom'
import {Subject} from 'rxjs'
import {isFunc} from 'utils'
import PopUp from './PopUp'
import s from './index.module.less'

export default function showPopUp(config) {
  
  const onDestroy = new Subject()

  const {onClose, ...renderProps} = config

  const div = document.createElement('div')

  const root = document.body

  div.className = s.bsyLivePopupContainer

  root.appendChild(div)

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if(unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }

    if(onClose && isFunc(onClose)) {
      onClose()
    }

    onDestroy.next(true)
  }

  function render(props) {
    /**
     * https://github.com/ant-design/ant-design/issues/23623
     *
     * Sync render blocks React event. Let's make this async.
     */
    setTimeout(() => {

      ReactDOM.render(
        <PopUp
          {...props}
          onClose={destroy}
        />,
        div,
      )
    })
  }
  
  render(renderProps)

  return {
    destroy,
    onDestroy
  }
}
