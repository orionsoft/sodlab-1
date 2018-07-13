import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'

export default class Currency extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string
  }

  static getDerivedStateFromProps(props, state) {
    return {
      value: props.value ? numeral(props.value).format('$0,0') : ''
    }
  }

  state = {value: ''}

  getElementValidation(element) {
    if (!element.length || element === '$') return true
    const newElement = numeral._.stringToNumber(element)
    if (newElement || newElement === 0) return true
    return false
  }

  getNumber(value) {
    if (!this.getElementValidation(value.slice(-1))) return
    if (value.length === 1 && value === '0') {
      this.props.onChange('')
      return
    }
    this.props.onChange(numeral._.stringToNumber(value))
  }

  render() {
    return (
      <div>
        <div className="os-input-container">
          <input
            type="text"
            className="os-input-text"
            value={this.state.value}
            onChange={event => this.getNumber(event.target.value)}
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
