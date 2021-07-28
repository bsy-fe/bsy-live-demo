import { emojiMap, emojiUrl } from './emojiMap'

const sessionObj = {}

/**
 * 
 * @param {*} selector 
 * @param {*} node 
 */

export const $ = (selector, node) => {
  let n = node || document
  return typeof selector === 'string' ? n.querySelector(selector) : selector
}
/**
 * 
 * @param {*} type 
 * @param {*} className 
 * @param {*} innerHTML 
 */
export const createElement = (type, className, innerHTML) => {
  const ele = document.createElement(type)
  if (className) {
    ele.className = className
  }
  if (innerHTML) {
    ele.innerHTML = innerHTML
  }
  return ele
}

// 动态加载js并支持回调-
export function loadJs(src, callback) {
  let sc = document.createElement('script')
  sc.type = 'text/javascript'
  sc.src = src
  if (callback) {
    if (document.addEventListener) {
      sc.addEventListener('load', callback, false)
    } else {
      sc.onreadystatechange = function() {
        if (/loaded|complete/.test(sc.readyState)) {
          sc.onreadystatechange = null
          callback()
        }
      }
    }
  }
  document.body.appendChild(sc)
}

/**
 * 可以把容器里的dom节点映射到对象中，便于后面使用
 * @param {*} boxer 容器节点
 * @param {*} maps dom节点和所映射的属性
 * @param {*} ctx 所要映射的对象
 */
export const mapElements = (boxer, maps, ctx) => {
  // eslint-disable-next-line no-restricted-syntax
  for (let key in maps) {
    if (Object.prototype.hasOwnProperty.call(maps, key)) {
      ctx[key] = boxer.querySelector(maps[key])
    }
  }
}
/**
 * 
 */
export const cookie = {
  get(keys) {
    const mat = new RegExp(`(^|[^a-z])${  keys  }=(.*?)(;|$)`, 'i').exec(
      document.cookie
    )
    return mat ? decodeURIComponent(mat[2]) : ''
  },
  set(name, value, expires, path, domain, secure) {
    let cookieText = `${encodeURIComponent(name)  }=${  encodeURIComponent(value)}`
    if (expires instanceof Date) {
      cookieText += `; expires=${  expires.toGMTString()}`
    }
    if (path) {
      cookieText += `; path=${  path}`
    }
    if (domain) {
      cookieText += `; domain=${  domain}`
    }
    if (secure) {
      cookieText += '; secure'
    }
    document.cookie = cookieText
  },
  remove(name, path, domain, secure) {
    this.set(name, '', new Date(0), path, domain, secure)
  }
}


export const isHKYClient = () => {
  let ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('hky-live') !== -1
}

// 用于iframe的序列化参数
export const serialParams = (data, isPrefix = false, blackList = []) => {
  let prefix = isPrefix ? '?' : ''
  let result = []
  // console.log(Object.keys(data), blackList)
  Object.keys(data).forEach(i => {
    let value = data[i]
    if (!blackList.includes(i)) {
      if (Object.prototype.toString.call(value) === '[object Array]') {
        value.forEach(_value => {
          result.push(
            `${encodeURIComponent(i)}[]=${encodeURIComponent(_value)}`
          )
        })
      } else {
        result.push(`${encodeURIComponent(i)}=${encodeURIComponent(value)}`)
      }
    }
  })
  return result.length ? prefix + result.join('&') : ''
}


export const device = (dev) => {
  let ua = navigator.userAgent
  let map = {
    trident: ua.indexOf('Trident') > -1, // IE内核
    presto: ua.indexOf('Presto') > -1, // opera内核
    webKit: ua.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!ua.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1, // android终端
    iPhone: ua.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: ua.indexOf('iPad') > -1, // 是否iPad
    webApp: ua.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
    weixin: ua.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
    qq: ua.match(/\sQQ/i) === ' qq' // 是否QQ
  }
  return map[dev]
  // return ua.toLowerCase().indexOf('micromessenger') > -1;
}

/**
 * 拦截广告位事件
 */
export const interceptAdvert = (selector, cb) => {
  let oBtn = document.querySelector(selector)
  if (oBtn) {
    let handler = event => {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
      cb && cb()
    }
    oBtn.addEventListener('click', handler)
    return () => {
      oBtn.removeEventListener('click', handler)
    }
  } 
}

/**
 * 生成随机数
 * @param {*} min 最小值
 * @param {*} max 最大值
 */
export const randomNum = (min, max) => {
  return Math.floor(Math.random() * (min + 1)) + (max - min)
}

/**
 * 判断当前环境是否为app内
 */
export const isKKBAPP = () => {
  let ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('kkbmobile') !== -1
}
/**
 * 判断当前平台
 */
export const platform = () => {
  if (isKKBAPP()) {
    return 'mobile'
  }
  return device('mobile') ? 'h5' : 'pc'
}

export const isFunc = v => typeof v === 'function'

export const isJSONString = str => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      return !!(typeof obj === 'object' && obj)
    } catch (e) {
      console.log(`error：${str}!!!`, e)
      return false
    }
  } else {
    // console.log('It is not a string!')
    return false
  }
}

export const getUserDefinedFieldObj = msg => {
  const { payload } = msg
  const { userDefinedField } = payload
  const userDefinedFieldObj =
    userDefinedField && isJSONString(userDefinedField)
      ? JSON.parse(userDefinedField)
      : {}
  return userDefinedFieldObj
}

export const assert = (condition, msg) => {
  if (!condition) throw new Error(`[dashboard]${msg}`)
}
export const toThousands = num => {
  let number = (num || 0).toString()
  let result = ''

  while (number.length > 3) {
    result = `,${number.slice(-3)}${result}`

    number = number.slice(0, number.length - 3)
  }

  if (number) {
    result = number + result
  }
  return result
}

export const timingFun = (
  func = () => {},
  interval = 1,
  defaultCall = true
) => {
  assert(isFunc(func), `${func} is not function`)
  const m = interval * 60 * 1000
  if (defaultCall) func()
  const time = window.setInterval(() => {
    func()
  }, m)
  return time
}

export const isChinese = str => {
  if (escape(str).indexOf('%u') < 0) return false
  return true
}

export const emoj2str = str => {
  return unescape(escape(str).replace(/%uD.{3}/g, ''))
}

export const handleText = str => {
  let res = emoj2str(str)
  if (isChinese(res)) {
    res = res.length > 4 ? `${res.slice(0, 6)}...` : res
  } else {
    res = res.length > 7 ? `${res.slice(0, 7)}...` : res
  }
  return res
}

export const insertSelectionText = (node, str) => {
  let mynode = node
  if (
    typeof node.selectionStart === 'number' &&
    typeof node.selectionEnd === 'number'
  ) {
    const startPos = node.selectionStart
    const endPos = node.selectionEnd
    let cursorPos = startPos
    const tmpStr = node.value
    mynode.value =
      tmpStr.substring(0, startPos) +
      str +
      tmpStr.substring(endPos, tmpStr.length)
    cursorPos += str.length
    mynode.selectionStart = mynode.selectionEnd = cursorPos
  } else {
    mynode.value += str
  }
}
export const handlerEmojiText = text => {
  const ret = []
  if (text.indexOf('[') !== -1 && text.indexOf(']') !== -1) {
    const reg = /\[[^[\]]+\]/gm
    const matchArr = text.match(reg) || []
    const splitArr = text.split(reg)
    for (let i = 0, len = splitArr.length; i < len; i++) {
      ret.push(splitArr[i])
      if (matchArr[i]) {
        ret.push(matchArr[i])
      }
    }
  } else {
    ret.push(text)
  }
  return ret.filter(item => item)
}
export const getQueryString = (name, search) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const r = (search || window.location.search).substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}

export function createArray(data) {
  const isArray = Object.prototype.toString.call(data) === '[object Array]'
  return isArray ? data : [data]
}
export const filterRolePeople = (list, role) => {
  if (!list) {
    return []
  }
  return list.map(item => {
    return typeof item === 'object'
      ? {
          nick: item.nickname,
          userID: item.uid,
          role
        }
      : {
          nick: String(item),
          userID: item,
          role
        }
  })
}

export const random = (min, max) => {
  let mymin = min || 1
  return max ? mymin + Math.random() * (max - mymin) : Math.random() * mymin
}

export function Enum(obj) {
  const keysByValue = new Map()
  const EnumLookup = value => keysByValue.get(value)
  Object.keys(obj).forEach((item, key) => {
    EnumLookup[key] = obj[key]
    keysByValue.set(EnumLookup[key], key)
  })
  // Return a function with all your enum properties attached.
  // Calling the function with the value will return the key.
  // disabled array-callback-return
  return Object.freeze(EnumLookup)
}
export const setSession = (name, data) => {
  sessionObj[name] = data
  // sessionStorage.setItem(name, JSON.stringify(data))
}
export const getSession = name => {
  let data = sessionObj[name]
  if (data) {
    if (isJSONString(data)) {
      data = JSON.parse(data)
    }
  } else {
    data = ''
  }
  return data
}
export const isMobile = /(iphone|android)/.test(
  navigator.userAgent.toLowerCase()
)

export function IsPC() {
  let userAgentInfo = navigator.userAgent
  let Agents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod'
  ]
  let flag = true
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

export const filterComp = (WebComp, WapComp) => {
  let isPc = IsPC()
  return isPc ? WebComp : WapComp
}

export const createTextHtml = textA => {
  const textArr = textA ? handlerEmojiText(textA) : ['自定义消息']

  let htmlStr = ''
  textArr.forEach((text, index) => {
    const mapText = emojiMap[text]
    htmlStr += mapText
      ? ` <span >
    <img src="${emojiUrl + mapText}" className="emj-img" />
  </span>`
      : `${text}`
  })
  console.log(htmlStr, 'htmlStr')
  return htmlStr
}

export const sanitizer = text => {
  console.log(text)
  try {
    let data = JSON.parse(text)
    console.log(data)
    let str = ''
    data.forEach(item => {
      str += `<span style="color: ${item.color};">${item.text}</span>`
    })
    return str
  } catch (error) {
    console.log(error)
    return text.replace(/<script[\s\S]*?<\/script>/ig, '')
  }

}

export const isUrl = url => {
  let result = /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  return result
}

export const calcRepeatMessages = (messages, shouldCalc) => {
  if (!shouldCalc || !messages || !messages.length) {
    // console.log('foldMessage::', 'false', shouldCalc, messages)
    return messages.map( msg => msg.repeatMsgNum > 1 ? {...msg, repeatMsgNum: 1, repeatMsgNames: []} : msg)
  }

  const newList = []

  let lastNewMessage = null

  messages.forEach( msg => {
    // console.log('foldMessage::', msg)
    if(msg && (lastNewMessage && lastNewMessage.payload.text === msg.payload.text)) {
      const {repeatMsgNum, repeatMsgNames} = lastNewMessage
      lastNewMessage.repeatMsgNum = (repeatMsgNum || 1) + 1
      if(!repeatMsgNames || repeatMsgNames.indexOf(msg.from) < 0) {
        lastNewMessage.repeatMsgNames = [...(repeatMsgNames || []), msg.from]
      }
      lastNewMessage = {...lastNewMessage}
      newList.pop()
      newList.push(lastNewMessage)
    } else {

      lastNewMessage = msg
      lastNewMessage.repeatMsgNum = 1
      newList.push(lastNewMessage)
    }
      // if(lastNewMessage && last)
  })
  // console.log('foldMessage::', {messages, shouldCalc, newList})

  return newList
}

/**
 * 获取视频宽高
 * @param {*} container 元素dom
 */
// 视频宽高比
const playerRatio = 375 / 211

export const getLiveHeight = (container, ratio = playerRatio) => {
  let containerStyle = window.getComputedStyle(container, null)
  let containerWidth =
    container.clientWidth || Number(containerStyle.width.replace('px', ''))
  let containerHeight =
    container.clientHeight || Number(containerStyle.height.replace('px', ''))
  let playerHeight = Math.round(containerWidth / ratio)
  let imHeight = containerHeight - playerHeight
  return {
    playerHeight,
    imHeight,
    containerHeight
  }
}

export const getRtcImHeight = (container) => {
  let {imHeight} = getLiveHeight(container)
  return `calc(${imHeight}px - 18vw)`
}

export const BSYWarn = (...values) => console.warn('BSYLIVE:', ...values)


export const checkAndWarnOpt = (opt) => {



  let ret = true

  console.log(`
                //////////////////////////////
                /////欢迎使用bsylive demo//////
                //////////////////////////////
                `)
  console.log(`
                ///// 开始参数检查 /////
                `)

  console.log('传入参数：', opt)

  if (!opt) {
    BSYWarn('opt未定义，请检查init函数传入参数')
    return false
  }

  //    enterCode: "2411c01db53f4709a9d327c33ad4a984",
  //     liveId: "live-846918736510976",
  //     tenantId: "1130997662",
  //     userId: 57986922,
  //     userInfo: {nickname: "张零一", avatar: undefined, role: 2},

  const keys = ['enterCode', 'liveId', 'tenantId', 'userId']

  keys.forEach((key) => {
    if(!opt[key]) {
      BSYWarn(`未传入${key}`)
      ret = false
      // return false
    }
  })

  return ret
}

