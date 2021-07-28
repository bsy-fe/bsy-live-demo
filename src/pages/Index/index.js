import React, { useEffect, useState, useContext, useRef } from 'react'
import { IsPC } from 'utils'
import handleAddvert from '@/components/Addvert'
import PlayContainer from '@/components/Player'
import { GlobalContext } from '@/context'
import SelectedLayout from '@/components/Container/Layout'
import MainContainer from '@/components/Container/MainContainer'
import SliderContainer from '@/components/Container/SliderContainer'
import Loading from '@/components/Loading'
import { BSYIM_INITIAL_MODE } from '@/consts'
import IMTeacher from '@/pages/IMTeacher'
import IM from '@/pages/IM'
import store from '@/store'

const isPc = IsPC()

export default (props) => {
  let typeRef = useRef('live')
  let { config, client } = useContext(GlobalContext)
  console.log('=====config, client', config, client)
  let [loading, setLoading] = useState(true)
  let [type, setType] = useState('live')
  let [imMode, setImMode] = useState(BSYIM_INITIAL_MODE.tabMode)
  let [liveStatus, setLiveStatus] = useState()
  let [playerReady, setPlayerReady] = useState(false)

  const RenderIM = [1, 2, 3].includes(Number(config.userInfo.role))
    ? IMTeacher
    : IM
  //  处理货架
  const shelfStatusChange = (data) => {
    console.log(data)
    if (data.show) {
      handleAddvert.create(data, client, typeRef.current === 'live')
    } else {
      handleAddvert.hide(client)
    }
  }

  // 直播状态改变
  const liveStatusChange = (data) => {
    console.log('=====live-status-change', data, type)
    if (data.status === 'running' && typeRef.current === 'live') {
      handleAddvert.showPlayer(client)
    }
    if (data.status !== 'finished' && typeRef.current === 'live') {
      if (data.status === 'running') {
        setTimeout(() => {
          setLiveStatus(data.status)
        }, 3000)
      }
    } else {
      setLiveStatus(data.status)
      client.livePlayer && client.livePlayer.pause && client.livePlayer.pause()
    }
  }

  const playerReadyFn = (playInstance) => {
    setPlayerReady(true)
    playInstance.on('liveend', (data) => {
      console.log('=====liveend', data)
      setLiveStatus('finished')
      typeRef.current === 'live' && handleAddvert.showLiveroom(client)
    })
  }

  useEffect(() => {
    console.log(client)
    if (client) {
      client.on('load-data', (data) => {
        console.log('demo=====', data)
        setLoading(false)
        // liveStatus = data.liveStatus
        if (data.type !== 'private') {
          const rtcInfo = {
            interactType: data.interactType,
            audioDisable: data.audioDisable
          }

          store.dispatch({
            type: 'mic/setSomething',
            payload: {
              rtcInfo
            }
          })

          setType('rtc')
          typeRef.current = 'rtc'
          if (!isPc) {
            setImMode(BSYIM_INITIAL_MODE.imMode)
          }
        }
        setLiveStatus(data.liveStatus)
      })
      // playerready
      client.on('player-ready', (data) => {
        console.log('=====player-ready', data)
        playerReadyFn(data)
      })
      client.on('shelf-status-change', (data) => {
        shelfStatusChange(data)
      })
      client.on('live-status-change', (data) => {
        liveStatusChange(data)
      })
    }
    return () => {
      // 清空事件监听
    }
  }, [client])

  return (
    <GlobalContext.Consumer>
      {(ctx) => {
        const imComp = (
          <SliderContainer
            type={type}
            liveStatus={liveStatus}
            client={client}
            platform={ctx.config.platform}
          >
            {ctx && ctx.client && <RenderIM {...ctx} initialMode={imMode} />}
          </SliderContainer>
        )

        if (ctx.config.platform === 'app') {
          return imComp
        }
        return (
          <SelectedLayout>
            <>
              {loading ? <Loading /> : ''}
              <MainContainer type={type}>
                <PlayContainer
                  type={type}
                  liveStatus={liveStatus}
                  ready={playerReady}
                />
              </MainContainer>
              {imComp}
            </>
          </SelectedLayout>
        )
      }}
    </GlobalContext.Consumer>
  )
}
