import React, { Component } from 'react'
import PropTypes from 'prop-types'

import s from './index.module.less'

const pattern = new RegExp('http(s)?://[^s]*')
class ImgLoad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  onLoad = () => {
    this.setState({ loaded: true })
  }

  content() {

  }

  render() {
    let { src, imageProcess, ...props } = this.props
    let content = null
    if (!pattern.test(src)) {
      content = 'The img src link prefix must be http or https'
    } else {
      src = this.state.loaded ? src : `${src}${imageProcess}`
      content = <img src={src} onLoad={this.onLoad} {...props} className={s.bsyImgPrev}/>
    }


    return <div className={s.bsyImgPrevWrapper}>
      <div className={s.bsyImgPrevClose}>X</div>
      <div className={s.bsyImgPrevContainer}>
        {
          content
        }
      </div>
    </div>

  }
}

export default ImgLoad

ImgLoad.propTypes = { imageProcess: PropTypes.string }
ImgLoad.defaultProps = {
  imageProcess: ''
}
