import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import sleep from 'App/helpers/misc/sleep'
import round from 'lodash/round'

export default class NumberIncrement extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    format: PropTypes.string
  }

  state = {value: 0}

  componentDidMount() {
    this.setValue(this.props.value)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      this.setValue(this.props.value)
    }
  }

  async setValue(value) {
    console.log('after0', value.toString().split('.')[1])
    const decimals = value.toString().split('.')[1] || ''
    const digits = decimals.length
    console.log(digits)
    const diff = value - this.state.value
    if (!diff) return
    const time = 600
    const perSecond = 20
    const parts = (perSecond * time) / 1000
    const duration = time / perSecond
    for (let i = 0; i < parts; i++) {
      const part = diff / parts
      await sleep(duration)
      const newValue = round(this.state.value + part, digits)
      this.setState({value: newValue})
    }
    this.setState({value})
  }

  render() {
    return numeral(this.state.value).format(this.props.format)
  }
}
