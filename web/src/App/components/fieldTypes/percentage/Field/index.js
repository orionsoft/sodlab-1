import React from 'react'
import Percentage from 'App/components/fields/Percentage'
import PropTypes from 'prop-types'

export default class CustomDateTime extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    passProps: PropTypes.object
  }

  render() {
    const {
      passProps: {min, max},
      onChange,
      value
    } = this.props
    return <Percentage onChange={onChange} value={value} min={min} max={max} />
  }
}
