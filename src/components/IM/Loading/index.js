import React, { Component } from 'react'
import './style.styl'
// import styles from './style.module.styl'

export default class Loading extends Component {
  static propTypes = {
    // validateId: PropTypes.string,
    // value: PropTypes.string,
    // onChange: PropTypes.func,
    // isPreview: PropTypes.bool
  }

  static defaultProps = {
    value: ''
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  render() {
    return (
      <div className='init'>
        <div className='loadingio-spinner-spinner-qz3svthqh7m'>
          <div className='ldio-vr4xjc5s5qi'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    )
  }
}
