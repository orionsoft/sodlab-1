import React from 'react'
import PropTypes from 'prop-types'
import Flatpickr from 'react-flatpickr'
import {Spanish} from 'flatpickr/dist/l10n/es'
import moment from 'moment'

export default class DateTime extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string,
    format: PropTypes.string,
    enableTime: PropTypes.bool,
    locale: PropTypes.any
  }

  static defaultProps = {
    format: 'DD/MM/YYYY',
    locale: Spanish
  }

  state = {
    focused: false
  }

  getOptions() {
    return {
      locale: this.props.locale,
      formatDate: date => {
        return moment(date).format(this.props.format)
      }
    }
  }

  render() {
    const {onChange, value, enableTime} = this.props

    return (
      <div>
        <div className="os-input-container">
          <Flatpickr
            className="os-input-text"
            value={value}
            onChange={date => {
              onChange(date && date[0] && date[0].getTime())
            }}
            options={this.getOptions()}
            data-enable-time={enableTime}
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
