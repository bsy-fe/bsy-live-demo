import React from 'react'
import ReactDOM from 'react-dom'
import {checkAndWarnOpt, loadJs} from 'utils'
import getApp from './app'
import { BSY_LIVE_URL } from './consts/urls'
// eslint-disable-next-line import/named
import LiveForm, {newParamsSubject} from './liveForm'

class LiveroomDemo {
  constructor(opt) {
    const subscription = newParamsSubject.subscribe( params => {
      console.log('=============params::', params)
      let newParams = {...params}
      if(this.container && !newParams.container) {
        newParams.container = this.container
      }

      this._initOpt(newParams)

      subscription.unsubscribe()
    })
    this._initOpt(opt)
  }

  _initOpt(opt) {

    this.options = opt
    this.container = opt.container
    this.client = null
    const result = checkAndWarnOpt(opt)

    if(!result) {
      this._initForm()
      return
    }

    this._init()
  }

  _init() {
    this._initStore()
    if (window.BSYLive) {
      this._initDom()
    } else {
      loadJs(BSY_LIVE_URL, () => {
        this._initDom()
      })
    }
  }

  _initStore() {}

  _initDom() {
    this.client = window.BSYLive.createClient({
      tenantId: this.options.tenantId
    })
    this.options.callback && this.options.callback(this.client)
    const App = getApp(this.options, this.client)
    ReactDOM.render(<App />, this.container)
  }

  _initForm() {
    ReactDOM.render(<LiveForm />, this.container)
  }
}
export default LiveroomDemo
