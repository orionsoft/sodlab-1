import React from 'react'
import PropTypes from 'prop-types'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'

export default class DateTime extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string,
    format: PropTypes.string,
    enableTime: PropTypes.bool
  }

  static defaultProps = {
    format: 'DD/MM/YYYY'
  }

  state = {
    focused: false
  }

  getOptions() {
    return {
      formatDate: date => {
        return moment(date).format(this.props.format)
      }
    }
  }

  render() {
    const {onChange, value, enableTime} = this.props

    return (
      <div className="os-input-container">
        <Flatpickr
          className="os-input-text"
          value={value}
          onChange={date => {
            onChange(date && date[0] && date[0].getTime())
          }}
          data-enable-time={enableTime}
        />
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
