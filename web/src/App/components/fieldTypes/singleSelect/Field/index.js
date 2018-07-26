import React from 'react'
import PropTypes from 'prop-types'
import Select from 'orionsoft-parts/lib/components/fields/Select'

export default class Field extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    errorMessage: PropTypes.node,
    passProps: PropTypes.object
  }

  render() {
    return (
      <Select
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.passProps.options}
        errorMessage={this.props.errorMessage}
        {...this.props.passProps}
      />
    )
  }
}
