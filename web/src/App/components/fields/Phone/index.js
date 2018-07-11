import React from 'react'
import PropTypes from 'prop-types'

const numeral = global.numeral
if (!numeral) {
  throw new Error('Numeral is required in global variable')
}

export default class Phone extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string
  }

  getElementValidation(element) {
    const newElement = numeral._.stringToNumber(element)
    if (newElement) return newElement
    return false
  }

  getNumber(event) {
    if (!this.getElementValidation(event.slice(-1))) return
    if (event.length < 6) {
      this.props.onChange('(+56)')
    } else if (event.length === 6 && event.slice(-1) !== ')') {
      this.props.onChange(`(+56${event.slice(-1)})`)
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
            value={this.props.value ? this.props.value : '(+56)'}
            onChange={event => this.getNumber(event.target.value)}
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
