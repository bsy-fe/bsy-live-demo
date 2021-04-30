/* eslint-disable no-use-before-define */
import React from 'react'
import ReactDOM from 'react-dom'
import Modal from './Modal'





export const RTCConfirm = (props) => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  
  const component = (
    <Modal 
      visible={true}
      onYes={onYes}
      onNo={onNo}
      {...props}
    >
    </Modal>)
  ReactDOM.render(component, div)

  async function onYes(){
    console.log('=====RTCConfirm', props.onOk)
    if (props.onOk) {
      await props.onOk()
    }

    ReactDOM.render(React.cloneElement(component, {visible: false}), div)
    ReactDOM.unmountComponentAtNode(div)
    div.remove()
  }
  async function onNo(){
    console.log('=====RTCConfirm', props.onCancel)
    if (props.onCancel) {
      await props.onCancel()
    }
    ReactDOM.render(React.cloneElement(component, {visible: false}), div)
    ReactDOM.unmountComponentAtNode(div)
    div.remove()
   
  }
}