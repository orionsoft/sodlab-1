import React from 'react'
import FileManager from 'App/components/fields/FileManager'
import PropTypes from 'prop-types'

export default class Field extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    errorMessage: PropTypes.node,
    passProps: PropTypes.object
  }

  render() {
    return (
      <FileManager
        value={this.props.value}
        onChange={this.props.onChange}
        errorMessage={this.props.errorMessage}
        {...this.props.passProps}
      />
    )
  }
}
