/**
 * @author 杨欣
 * @date 2020-06-30 14:44
 */
import * as qiniu from 'qiniu-js'
import {urlGetUploadToken} from '@/api/upload'


/**
 * @description 通过七牛云上传图片的方法
 * @author yang xin
 * @param {File} file: 通过upload组件获得的要上传的文件的File对象
 * @param {Function} nextCb: 接收上传进度的回调，该函数有两个参数，第一个是进度对象，对象格式同七牛云的进度函数参数值，详见 https://developer.qiniu.com/kodo/sdk/1283/javascript，第二个参数是需要取消时调用的函数对象
 * @param {Function} successCb: 接收上传完成后的后端返回信息的回调函数
 * @param {Function} errorCb: 上传错误后触发的回调函数，参数格式和触发细节参见 https://developer.qiniu.com/kodo/sdk/1283/javascript
 * @param {Function} resultFormatter: successCb的格式化函数，非必填
 */
export const uploadQiniu = (file, nextCb, successCb, errorCb, resultFormatter = (res) => res) => {
  // 去请求上传的token
  urlGetUploadToken().then(res => {
    if (!res || !res.data) {
      errorCb('未获取到上传token')
      return
    }
    let uptoken = res.data.token
    let fileStr = file // Blob 对象，上传的文件
    let key = null // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。
    let config = {
      useCdnDomain: true, // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
      region: null // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
      // checkByMD5: true //是否开启 MD5 校验
    }
    let putExtra = {
      fname: '', // 文件原文件名
      params: {
        'x:name': fileStr.name
      }, // 用来放置自定义变量
      mimeType: null // 用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
    }
    // 上传到七牛

    const cancel = (sub) => {
      return () => sub.unsubscribe()
    }


    let observable = qiniu.upload(fileStr, key, uptoken, putExtra, config)
    let subscription = observable.subscribe({
      next: result => {
        console.log({result})
        nextCb(result, cancel(subscription))
      },
      error: result => {
        errorCb(result)
      },
      complete: result => {
        successCb(resultFormatter(result))
      }
    })


  }).catch(() => {
    errorCb('接口异常，请稍后再试')
  })
}

export const MessageFormat = (result) => {
  if (result && result.data) {
    // eslint-disable-next-line camelcase
    const {image_height, image_width, size, url} = result.data
    const imageHeight = result.data.image_height
    const imageWidth = result.data.image_width
    return [
      {
        Type: 1,
        Size: size,
        Width: image_width,
        Height: image_height,
        URL: `${url}?imageMogr2/quality/100/interlace/1`
      },
      {
        Type: 2,
        Size: size,
        Width: image_width,
        Height: image_height,
        URL: `${url}?imageMogr2/interlace/1`
      },
      {
        Type: 3,
        Size: size,
        Width: 180,
        Height: 180 * imageHeight / imageWidth,
        URL: `${url}?imageView2/2/w/180`
      }
    ]
  }
  return result
}
