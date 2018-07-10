import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'

export default class Rut extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string
  }

  onInputChange(event) {
    if (event.length < 3) {
      this.setState({valid: false})
      this.props.onChange(event)
      return
    }
    var numbers = event.replace(/[^\dkK]/g, '')
    var parts = numbers.split('')
    if (parts.length === 0) return numbers
    var last = parts.pop()
    if (parts.length === 0) return numbers
    var final = numeral(parts.join('')).format('0,0') + '-' + last
    final = final.replace(/,/g, '.')
    this.props.onChange(final)
  }

  render() {
    return (
      <div>
        <div className="os-input-container">
          <input
            maxLength="12"
            type="text"
            className="os-input-text"
            value={this.props.value}
            onChange={event => this.onInputChange(event.target.value)}
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
