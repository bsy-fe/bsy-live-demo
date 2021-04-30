import React from 'react'
import ReactDom from 'react-dom'
import {IsPC} from '@/utils'
import {tabChanger} from '@/consts/subjects'
import {BSYIM_TAB_LIVEGOODS} from '@/consts'
import store from '@/store'
import {Addvert, MAddvert} from './dom'
/**
 * 处理货架消息
 */


let isPc = IsPC()



const exitFullScreen = (instance) => {
  // console.log('=====', instance.livePlayer, instance.livePlayer.isFullscreen , instance.livePlayer.isFullscreen&& instance.livePlayer.isFullscreen())
  if (isPc && instance.livePlayer && instance.livePlayer.isFullscreen && instance.livePlayer.isFullscreen()) {
    instance.livePlayer.exitFullscreen()
  }
}

const handleClick = (dom, instance) => {
  let fn = () => {
    exitFullScreen(instance)
    tabChanger.next(BSYIM_TAB_LIVEGOODS)
  }
  dom.addEventListener('click', fn)
  return () => {
    dom.removeEventListener('click', fn)
  }
}

export default { 
  _advertDom: null, // dom
  isLive: true, //
  handleClickFn: null,
  create(data, instance, isLive) {
    this.hide(instance)
    this.isLive = isLive
    // 货架类型 1：文字类型   2：图片类型
    let type = Number(data.entrance_style)
    let showWay = Number(data.show_way)
    let isText = type === 1
    let content = data.entrance_content
    let link = isPc ? data.web_action_url : data.mobile_action_url

    if (showWay === 2) {
      store.dispatch.message.setLiveGoodsUrl({url: link})
    } else {
      store.dispatch.message.setLiveGoodsUrl({url: null})
    }
    if (isPc) {
      const container = document.querySelector('#addvert-container')
      ReactDom.render(<Addvert
          content={content}
          showWay={showWay}
          type={type}
          link={link}
          isText={isText}
          isLive={this.isLive}
        />,
        container
      )

      let dom = container.childNodes
      this._advertDom = dom[0].cloneNode(true)
      this.handleClickFn && this.handleClickFn()
      if (instance.liveStatus === 'running' && this.isPlayer) {
        if(showWay === 2) {
          this.handleClickFn = handleClick(this._advertDom, instance)
        }
        instance.livePlayer.appendChildToPlayer(this._advertDom)
      } else {
        if(showWay === 2) {
          this.handleClickFn = handleClick(container, instance)
        }
        container.style.display = 'block'
      }
      return
    }

    ReactDom.render(<MAddvert 
      content={content}
      showWay={showWay}
      type={type} 
      link={link} 
      isText={isText} 
      isLive={this.isLive}
    />,
    document.querySelector('#m-addvert-container'))
  },
  showPlayer(instance) {
    if (this._advertDom) {
      this.isPlayer = true
      document.querySelector('#addvert-container').style.display = 'none'
      instance.livePlayer.appendChildToPlayer(this._advertDom)
      this.handleClickFn && this.handleClickFn()
      this.handleClickFn = handleClick(this._advertDom, instance)
    }
  },
  showLiveroom(instance) {
    let addvertDom = document.querySelector('#addvert-container')
    if (this._advertDom && addvertDom.style.display !== 'block') {
      this.isPlayer = false
      addvertDom.style.display = 'block'
      instance.livePlayer.removePlayerChild(this._advertDom)
      this.handleClickFn && this.handleClickFn()
      this.handleClickFn = handleClick(addvertDom, instance)
    }
  },
  getAddvert() {
    return this._advertDom
  },

  hide(instance) {
    store.dispatch.message.setLiveGoodsUrl({url: null})
    this.handleClickFn && this.handleClickFn()
    this.handleClickFn = null

    if(isPc) {
      console.log('=====', instance.liveStatus, this._advertDom , this.isLive)
      if (instance.liveStatus === 'running' && this._advertDom && this.isLive ) {
        instance.livePlayer.removePlayerChild(this._advertDom)
      }
      ReactDom.render('', document.querySelector('#addvert-container'))
      this._advertDom = null

    } else {
      ReactDom.render('', document.querySelector('#m-addvert-container'))
    }
  }
}
