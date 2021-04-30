/**
 * @author 杨欣
 * @date 2021-04-13 18:42
 */
import React from 'react'
import * as ReactDOM from 'react-dom'
import s from './index.module.less'
import Message from './index'
import {MessageTypes} from './consts'

const containerClass = s.bsyMessageContainer

// const visibleInterval = 3

export const showMessage = ({type, content, time = 5000}) => {
  let existContainer = document.querySelector(`.${containerClass}`)
  if(!existContainer) {
    existContainer = document.createElement('div')
    existContainer.className = containerClass

    document.body.appendChild(existContainer)
  }

  const messageNode = document.createElement('div')

  existContainer.appendChild(messageNode)

  const destroy = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(messageNode)
    if(unmountResult && messageNode.parentNode) {
      messageNode.parentNode.removeChild(messageNode)
    }
  }
  
  const render = (props) => {
    setTimeout(() => {
      ReactDOM.render(
        <Message {...props}/>,
        messageNode
      )
    })
  }
  
  render({
    type,
    content,
    time,
    onDestroy: destroy
  })
}

const message = {
  success: (content) => showMessage({content, type: MessageTypes.Success}),
  info: (content) => showMessage({content, type: MessageTypes.Info}),
  error: (content) => showMessage({content, type: MessageTypes.Error}),
  warning: (content) => showMessage({content, type: MessageTypes.Warning})
}

export default message
