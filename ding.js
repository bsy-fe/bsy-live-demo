/**
 * @author Hank
 * @description 项目打包钉钉通知 
 */
const Ding = require('kkb-ding')

let ding = new Ding({})
ding.send() // 默认发送
