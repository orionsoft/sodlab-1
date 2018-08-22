import React from 'react'
import PropTypes from 'prop-types'

export default class Constant extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    constant: PropTypes.any
  }

  state = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.constant !== prevState.constant) {
      nextProps.onChange(nextProps.constant)
      return {constant: nextProps.constant}
    }
    return null
  }

  render() {
    return null
  }
}
