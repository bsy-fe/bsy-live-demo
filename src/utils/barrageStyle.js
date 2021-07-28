import { isMobile  } from './index'

let iconStyle = 'margin-right:4px; vertical-align: bottom;'
let iconWidth = '25px'

if (isMobile) {
  iconWidth = '20px'
}
/**
 * 生成随机数
 * @param {*} min 最小值
 * @param {*} max 最大值
 */
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (min + 1)) + (max - min)
}

let icon = `<img src="https://img.kaikeba.com/a/64345172900202zyid.png" width="${iconWidth}" height="${iconWidth}" style="${iconStyle}" margin-right="4px" />`

/**
 * 过滤script脚本
 * @param {*} text 显示文案
 * @returns 
 */
function sanitizer (text) {
  try {
    let data = JSON.parse(text)
    let str = icon
    data.forEach(item => {
      str += `<span style="color: ${item.color};">${item.text}</span>`
    })
    return str
  } catch (error) {
    return text.replace(/<script[\s\S]*?<\/script>/ig, '')
  }
}


// 购买提示
export const BUY_TIPS = (msg) => ({
  text:
    `${icon}<span style="color: #FFFFFF">${msg.nickname}:</span><span style="color: #FF5A0F"> ${msg.template_msg} ${msg.name}</span>`,
  mode: 1,
  dur: randomNum(10000, 20000)
})

// 红包提示
export const RED_ENVELOPE = (msg) => ({
  text:
    `${icon}<span style="color: #FFFFFF">${msg.nickname}:</span><span style="color: #FF5A0F"> ${msg.template_msg} ${msg.name}</span>`,
  mode: 1,
  dur: randomNum(10000, 20000)
})
//
export const NORMAL = (msg) => {
  let { content } = msg
  let text = sanitizer(content)
  return {
    text,
    mode: 1,
    dur: randomNum(10000, 20000)
  }
}



// 弹幕类型
export const BARRAGE = {
  1: RED_ENVELOPE,
  2: BUY_TIPS,
  3: NORMAL
}
