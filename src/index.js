import React from 'react'
import ReactDOM from 'react-dom'
// import {checkAndWarnOpt, loadJs} from 'utils'
// import { BSY_LIVE_URL } from './consts/urls'
import App from './app'


ReactDOM.render(<App />, document.getElementById('root'))

/*
class LiveroomDemo {
  constructor(opt) {
    this.options = opt
    this.container = opt.container
    this.client = null
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
}
export default LiveroomDemo
*/
