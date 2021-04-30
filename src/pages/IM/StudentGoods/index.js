import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {IsPC, isUrl} from '@/utils'
import NoDataTemplate from '@/components/IM/NoDataTemplate'
import {lte} from 'semver'
import s from './index.module.styl'

const isM = !IsPC()

function StudentGoods(props) {
  const {shelfInfo} = props
  let iframeUrl = isM ? shelfInfo.mobile_action_url : shelfInfo.web_action_url
  const showWay = shelfInfo.show_way
  if (!isUrl(iframeUrl) && iframeUrl) {
    iframeUrl = `//${iframeUrl}`
  }
  return iframeUrl && String(showWay) === '2' ? (
    <div className={s['iframe-wrapper']}>
      {/* 2020.8.24 修改iframe兼容性 */}
      <iframe src={iframeUrl || ''} width='100%' height='100%'/>
    </div>
  ) : (
    <NoDataTemplate noData={{url: '', info: '当前没有货品，敬请期待'}}/>
  )
}

const mapStateToProps = state => ({
  shelfInfo: state.message.shelfInfo
})
export default connect(mapStateToProps)(StudentGoods)
