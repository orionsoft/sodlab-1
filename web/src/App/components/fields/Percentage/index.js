import React from 'react'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format'
import round from 'lodash/round'

export default class Percentage extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string,
    passProps: PropTypes.object
  }

  onChange(values) {
    const {passProps} = this.props
    const min = passProps.min || Number.MIN_VALUE
    const max = passProps.max || Number.MAX_VALUE
    const newValue = Math.min(max, Math.max(min, values.floatValue))
    this.props.onChange(round(newValue / 100, 10))
  }

  render() {
    return (
      <div>
        <div className="os-input-container">
          <NumberFormat
            className="os-input-text"
            onValueChange={(values, e) => {
              this.onChange(values)
            }}
            suffix="%"
            value={round(this.props.value * 100, 10)}
            thousandSeparator=","
            decimalSeparator="."
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
