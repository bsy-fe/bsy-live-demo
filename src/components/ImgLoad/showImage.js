/**
 * @author 杨欣
 * @date 2021-04-09 14:45
 */

import React from 'react'
import * as ReactDOM from 'react-dom'
import {Subject} from 'rxjs'
import {isFunc} from 'utils'
import s from './index.module.less'

import ImgLoad from './ImgLoad'

export default function showImage(config) {

  const onDestroy = new Subject()

  const {onClose, ...renderProps} = config

  const div = document.createElement('div')


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

  div.className = s.bsyImgPrevBg

  div.onclick = () => {
    destroy()
  }

  document.body.appendChild(div)

  function render(props) {
    /**
     * https://github.com/ant-design/ant-design/issues/23623
     *
     * Sync render blocks React event. Let's make this async.
     */
    setTimeout(() => {
      ReactDOM.render(
        <ImgLoad
          {...props}
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
