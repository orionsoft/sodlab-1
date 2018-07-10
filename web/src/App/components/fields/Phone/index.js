import React from 'react'
import PropTypes from 'prop-types'

export default class Phone extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    field: PropTypes.object,
    errorMessage: PropTypes.string
  }

  getNumber(event) {
    this.props.onChange(event)
  }

  render() {
    return (
      <div>
        <div className="os-input-container">
          <input
            type="text"
            className="os-input-text"
            value={this.props.value}
            onChange={event => this.getNumber(event.target.value)}
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
