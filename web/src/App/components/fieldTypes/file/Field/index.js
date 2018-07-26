import React from 'react'
import File from 'orionsoft-parts/lib/components/fields/File'
import PropTypes from 'prop-types'
import fileUpload from 'App/helpers/fields/fileUpload'

export default class Field extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    errorMessage: PropTypes.node,
    passProps: PropTypes.object
  }

  render() {
    const {type, ...fileUploadFields} = fileUpload
    return (
      <File
        value={this.props.value}
        onChange={this.props.onChange}
        errorMessage={this.props.errorMessage}
        {...fileUpload}
        {...this.props.passProps}
      />
    )
  }
}
