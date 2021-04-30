import React, { Component } from 'react'
import { Provider as ProviderStore } from 'react-redux'
import { ConfigProvider, message } from 'antd'

import getContext from './context/contextStore'
import { GlobalContext } from './context'
import { CONFIG_CONTEXT } from './consts/context'

import store from './store'
// import Home from './pages/Home'
import Index from './pages/Index'

import './index.less'
import { globalConst } from './consts/globalConst'
import {checkAndWarnOpt, getQueryString, loadJs} from './utils'
import {BSY_LIVE_URL} from './consts/urls'




class App extends Component {
  state = {
    client: null,
    config: {
      userInfo: {}
    }
  }

  componentDidMount() {
    loadJs(BSY_LIVE_URL, () => {
      console.log('=============load over', BSY_LIVE_URL)
     const config = {
        enterCode: getQueryString('enterCode'),
        liveId: getQueryString('liveId'),
        tenantId: getQueryString('tenantId'),
        userId: getQueryString('userId') || undefined,
        userInfo: {nickname: getQueryString('nickname'), avatar: '', role: getQueryString('role')},
        container: document.getElementById('root'),
        platform: getQueryString('platform')
      }

      checkAndWarnOpt(config)

      const client = window.BSYLive.createClient({
        tenantId: config.tenantId
      })
      console.log('=============document.querySelector(\'#player-container\')', document.querySelector('#player-container'))
      client.enter(
        {
          ...config,
          userId: config.userId ? String(config.userId) : undefined,
          playerContainer: document.querySelector('#player-container')
        },
        (info) => {
          console.log('info:::::::::', info)
        }
      )
      globalConst.client = client
      this.setState({ client, config })
    })
    

    message.config({
      prefixCls: 'bsy-liveroom-message'
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (prevState.client !== this.state.client) {
    //   globalConst.client = this.state.client
    // }
  }

  render() {
    const {config} = this.state
    return (
      <ConfigProvider prefixCls={globalConst.antdPrefixCls}>
        <ProviderStore store={store}>
          {
            config && <GlobalContext.Provider
              value={{ config: {...this.state.config, userId: String(this.config?.userId)}, client: this.state.client }}
            >
              <Index />
            </GlobalContext.Provider>
          }
        </ProviderStore>
      </ConfigProvider>
    )
  }
}

export default App
