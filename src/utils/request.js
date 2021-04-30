import axios from 'axios'
import { assert } from '@/utils'
import { HTTP_STATUS } from '@/consts/statusCode'
import { notification, message } from 'antd'
import { API_URL } from '@/consts'
import getters from '@/store/getters'

axios.defaults.headers['Content-Type'] = 'application/json'
const service = axios.create({
  timeout: 50000, // 请求超时时间, 10秒
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: API_URL
})

// Vue.prototype.axios = axios
// const apiPrefix = getApiPrefix()
// const apiHttp = getApiHttp()
// 错误状态码 有返回错误直接进行操作-
// const errorStatus = [401, 500, 502, 504, 400]

service.interceptors.request.use(
  config => {
    let myConfig = config
    const { liveToken, auth } = getters()
    console.log('intercepte::', auth, getters())
    if (liveToken) {
      myConfig.headers['hky-live-token'] = liveToken // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if(auth) {
      myConfig.headers.Authorization = auth
    }
    return myConfig
  },
  error => {
    // Do something with request error

    return Promise.reject(error)
  }
)
// 中间件 拦截请求-

service.interceptors.response.use(
  response => {
    // if (errorStatus.indexOf(response.status) > -1) {
    //   router.push({
    //     path: '/',
    //   })
    // }
    // if ([403, -505].indexOf(response.data.code) > -1) {
    //   document.location.href = urlPassport
    // }
    // alert(response.data.code)
    if (response && response.data.code === -505) {
      // message.error('登录失效，请重新登录')
      // alert()
    }
    if (response && response.data.code === 1) {
      return response
    }
    if (process.env.NODE_ENV !== 'production') {
      notification.open({
        message: response.data.msg,
        description: response.request.responseURL
      })
    }
    // throw new Error(JSON.stringify(response))
    return Promise.reject(response)
    // return response
  },
  err => {
    if (!err.response) {
      // apiError('ApiError', err)
      return
    }
    // const res = err.response
    // const option = { status: res.status, url: res.config.url, params: res.config.params }
    // apiError('ApiError', option)
    return Promise.reject(err)
  }
)

// eslint-disable-next-line no-unused-vars
const exceptionHandling = data => {
  if (
    data.status === HTTP_STATUS.SUCCESS ||
    data.status === HTTP_STATUS.NOT_MODIFIED
  ) {
    if (!data.data.data) {
      assert(false, 'api data is empty')
      return
    }
    return data
  }
  assert(false, data.statusText)

  return false
}

/**
 * get
 * @param url
 * @param data
 * @returns {Promise}
 */

const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params
      })
      .then(response => {
        // if (response.data.code !== 1) {
        // console.error('api_error', response.data.msg)
        // reject(response)
        // }
        console.log(response)
        if (response) {
          resolve(response.data)
        } else {
          reject(response)
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * post
 * @param url
 * @param data
 * @returns {Promise}
 */

const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    service
      .post(url, data)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @description 检查游客模式并发送请求
 * @author yang xin
 * @param {Function} request: 要发送的请求，无参数
 * @return {Promise<any>} 请求返回值或游客模式返回值
 */
const checkGuest = (request) => {

    const { isGuestMode } = getters()

  if(isGuestMode) {
    return  new Promise(resolve => resolve({}))
  }
  return request()

}

export default {
  get,
  post,
  checkGuest
}
