import React from 'react'
import PropTypes from 'prop-types'
import Text from 'orionsoft-parts/lib/components/fields/Text'

export default class SignerReason extends React.Component {
  static propTypes = {
    why: PropTypes.string,
    handleWhyChange: PropTypes.func
  }

  render() {
    return (
      <div className="autoform-field">
        <div className="label">Razón</div>
        <Text onChange={this.props.handleWhyChange} value={this.props.why} />
      </div>
    )
  }
}
