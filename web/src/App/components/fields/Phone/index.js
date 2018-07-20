import React from 'react'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format'

export default class Phone extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string
  }

  render() {
    return (
      <div>
        <div className="os-input-container">
          <NumberFormat
            className="os-input-text"
            onValueChange={(values, e) => {
              this.props.onChange(values.value)
            }}
            value={parseInt(this.props.value, 10)}
            format="(+56#) #### ####"
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
