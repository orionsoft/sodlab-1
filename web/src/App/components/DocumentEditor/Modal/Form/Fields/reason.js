import React from 'react'
import PropTypes from 'prop-types'
import Text from 'orionsoft-parts/lib/components/fields/Text'

export default class SignerReason extends React.Component {
  static propTypes = {
    elementId: PropTypes.object,
    collectionId: PropTypes.string,
    why: PropTypes.string,
    handleWhyChange: PropTypes.func,
    filename: PropTypes.string
  }

  componentDidMount() {
    if (!this.props.filename) return
    const fileNameLength = this.props.filename.split('.').length
    const why = this.props.filename
      .split('.')
      .splice(0, fileNameLength - 1)
      .join(' ')
    this.props.handleWhyChange(why)
  }

  render() {
    return (
      <div className="autoform-field">
        <div className="label">Nombre</div>
        <Text onChange={this.props.handleWhyChange} value={this.props.why} />
      </div>
    )
  }
}
