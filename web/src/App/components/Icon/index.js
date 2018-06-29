import React from 'react'
import PropTypes from 'prop-types'
import icons from './icons'

export default class Icon extends React.Component {
  static propTypes = {
    icon: PropTypes.string
  }

  render() {
    const Icon = icons[this.props.icon]
    return <Icon />
  }
}
