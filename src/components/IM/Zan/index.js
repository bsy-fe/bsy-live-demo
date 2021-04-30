/* eslint-disable no-nested-ternary */
import anime from 'animejs'
import throttle from 'lodash.throttle'
import { random } from 'utils'

const MAX_COUNT = 12
let current = 0

const randomLikeIcon = size => {
  const randomIconNum = 10

  const randomOffset = Math.floor(random(randomIconNum))

  const likeIcon = document.createElement('div')

  likeIcon.style = [
    `width: ${size}px`,
    `height: ${size}px`,
    'background-image: url(\'//img.kaikeba.com/20945142400202yarm.png\')',
    'background-repeat: no-repeat',
    'background-size: 100% auto',
    `background-position: 0 ${-randomOffset * size}px`
  ].join(';')

  return likeIcon
}

const zanStyle = ['position: fixed', 'cursor: pointer']
const createZan = (style, width) => {
  const zan = document.createElement('div')
  zan.style = style
  const zanIcon = randomLikeIcon(width)
  zan.appendChild(zanIcon)
  // console.log('like icon', zan, zanIcon)

  return zan
}

const getNumberArray = val => {
  const x1 = 0.33333
  const x2 = 0.66667
  const x3 = 0.9
  const ret = []
  const firstNeg = random() >= 0.5 ? -1 : 1
  for (let i = 0; i < 3; i++) {
    if (i === 0) {
      ret.push(firstNeg * random() * x3)
    } else {
      const last = ret[i - 1]
      const num =
        last >= x2
          ? random(x1, x3)
          : last >= x1
          ? random(x2 * x1, x2 * x2)
          : random() >= 0.5
          ? -1 * random(x1)
          : random(x1)
      ret.push(num * firstNeg)
    }
  }
  ret.unshift(0)
  return ret.map(item => item * val)
}
const easing = [
  'easeInOutQuad',
  'easeInOutCubic',
  'easeOutQuad',
  'easeInOutSine'
]
const createAnimation = (node, x, y) => {
  const animeObj = {
    targets: node,
    opacity: [1, 1, 1, 0],
    easing: easing[Math.floor(random(easing.length))],
    complete() {
      current--
      node && node.parentNode && node.parentNode.removeChild(node)
    }
  }
  animeObj.duration = parseInt(random(1500, 3000), 10)
  animeObj.translateY = [0, -1 * random(0.7, 0.9) * y]
  animeObj.translateX = getNumberArray(x)

  return animeObj
}
const Zan = (ele, edgeX, edgeY, zanEvent) => {
  let zanBox = document.querySelector('zan-items-box')
  let wh
  if (!zanBox) {
    zanBox = document.createElement('div')
    zanBox.id = 'zan-items-box'
    document.body.appendChild(zanBox)
  }
  const getPos = () => {
    const pos = ele.getBoundingClientRect()
    const { left, top, width, height } = pos
    wh = width
    zanStyle.push(
      ...[
        `width:${width}px`,
        `height:${height}px`,
        `left:${left}px`,
        `top:${top}px`
      ]
    )
    // zanBox.style = `position: fixed;left:${x}px;top:${y}px;width:0;height:0`
  }

  window.addEventListener(
    'resize',
    throttle(() => {
      getPos()
    }, 200)
  )
  getPos()
  // console.log('zanBox', zanBox)
  // eslint-disable-next-line func-names
  return function(argcount) {
    let count = argcount || 0
    if (count > 0) {
      const addZan = () => {
        if (current < MAX_COUNT) {
          getPos()
          current++
          const zan = zanBox.appendChild(createZan(zanStyle.join(';'), wh))
          zanBox.appendChild(zan)
          zan.addEventListener('click', () => zanEvent && zanEvent())
          // console.log(zanBox)
          const animation = createAnimation(zan, edgeX, edgeY)
          anime(animation)
        }
      }
      count = count > MAX_COUNT ? MAX_COUNT : count < 0 ? 1 : count
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          addZan()
        }, random(80, 4000 * (count / MAX_COUNT)))
      }
    }
  }
}

export default Zan
