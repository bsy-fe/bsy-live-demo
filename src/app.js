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


const getApp = (config, client) => {
  class App extends Component {
    state = {
      client
    }

    componentDidMount() {
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
      this.setState({ client })

      message.config({
        prefixCls: 'bsy-liveroom-message'
      })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevState.client !== this.state.client) {
        globalConst.client = this.state.client
      }
    }

    render() {
      return (
        <ConfigProvider prefixCls={globalConst.antdPrefixCls}>
          <ProviderStore store={store}>
            <GlobalContext.Provider
              value={{ config: {...config, userId: String(config.userId)}, client: this.state.client }}
            >
              <Index />
            </GlobalContext.Provider>
          </ProviderStore>
        </ConfigProvider>
      )
    }
  }
  return App
}

export default getApp
