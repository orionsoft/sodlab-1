import React from 'react'
import Percentage from 'App/components/fields/Percentage'
import PropTypes from 'prop-types'

export default class percentage extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    passProps: PropTypes.object
  }

  render() {
    const {
      passProps: {min, max},
      ...rest
    } = this.props
    return <Percentage min={min} max={max} {...rest} />
  }
}
