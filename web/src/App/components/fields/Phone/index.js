import React from 'react'
import PropTypes from 'prop-types'

export default class Phone extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string
  }

  getNumber(event) {
    if (event.length < 6) {
      this.props.onChange('+(56)')
    } else if (event.length === 6 && event.slice(-1) !== ')') {
      this.props.onChange(`+(56${event.slice(-1)})`)
    } else if (event.length === 6 && event.slice(-1) === ')') {
      this.props.onChange(event)
    } else if (event.length > 6 && event.length < 15) {
      this.props.onChange(event)
    }
  }

  render() {
    return (
      <div>
        <div className="os-input-container">
          <input
            type="text"
            className="os-input-text"
            value={this.props.value ? this.props.value : '+(56)'}
            onChange={event => this.getNumber(event.target.value)}
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
