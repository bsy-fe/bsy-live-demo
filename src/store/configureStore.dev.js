/* eslint-disable no-underscore-dangle */
import { applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { init } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'
// import * as models from './models'
import models from './loader'
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const composeEnhancers = compose // Rematch具有开箱即用的Redux Devtools。不需要配置。
const loadingPlugin = createLoadingPlugin({ asNumber: true })
const configureStore = preloadedState => {
  const store = init({
    plugins: [loadingPlugin],
    models,
    redux: {
      initialState: preloadedState,
      enhancers: [composeEnhancers(applyMiddleware(thunk, createLogger()))]
    }
  })
  return store
}

export default configureStore
