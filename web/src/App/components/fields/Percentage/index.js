import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import cloneDeep from 'lodash/cloneDeep'

export default class Percentage extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string
  }

  static getDerivedStateFromProps(props, state) {
    if (state.beforeSeparator) {
      return {
        value: props.value
          ? `${(numeral(props.value).format('0.0[0000]') * 100).toFixed(0)}.%`
          : '',
        beforeSeparator: false
      }
    }
    return {
      value: props.value ? numeral(props.value).format('0.[00000]%') : '',
      separatorUsed: props.value && props.value.length === 1 && false
    }
  }

  state = {value: '', separatorUsed: false, fieldInit: false, beforeSeparator: false}

  getElementValidation(element) {
    if (!element.length || element === '.') return true
    const newElement = numeral._.stringToNumber(element)
    if (newElement || newElement === 0) return true
    return false
  }

  getNumber(value) {
    if (value.length > 11) return
    if (this.state.separatorUsed && value.slice(-1) === '.') return
    else if (value.slice(-1) === '.') {
      this.setState({separatorUsed: true, beforeSeparator: true})
    }
    if (!this.getElementValidation(value.slice(-1))) return
    if (value.length === 1 && value === '0') {
      this.props.onChange('')
      return
    }
    if (value.length === 1 && !this.state.fieldInit) {
      this.setState({fieldInit: true})
    }
    let chain = value ? cloneDeep(value) : ''
    if (!value.includes('%') && value.length > 1) {
      chain = chain.slice(0, -1)
      if (chain.slice(-1) === '.') {
        this.setState({separatorUsed: false})
      }
    } else if (!value.includes('%') && value.length === 1 && this.state.fieldInit) {
      this.setState({fieldInit: false})
      this.props.onChange('')
      return
    }

    const parsed = numeral._.stringToNumber(chain) * 0.01
    this.props.onChange(Number(parsed.toFixed(10)))
  }

  onBlur(event) {
    const value = event.target.value
    if (value === '') return
    const parsed = numeral._.stringToNumber(value) * 0.01
    this.props.onChange(Number(parsed.toFixed(10)))
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
            onBlur={event => this.onBlur(event)}
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
