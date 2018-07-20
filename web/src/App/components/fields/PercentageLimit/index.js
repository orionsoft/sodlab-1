import React from 'react'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format'
import round from 'lodash/round'

export default class Percentage extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string
  }

  onChange(values) {
    if (values.floatValue && values.floatValue <= 100 && values.floatValue > 0) {
      this.props.onChange(round(values.floatValue / 100, 10))
    } else {
      this.props.onChange(undefined)
    }
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
