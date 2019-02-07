import React from 'react'
import PropTypes from 'prop-types'
import Flatpickr from 'react-flatpickr'
import {Spanish} from 'flatpickr/dist/l10n/es'
import moment from 'moment-timezone/builds/moment-timezone-with-data'
import autobind from 'autobind-decorator'

export default class DateTime extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string,
    format: PropTypes.string,
    enableTime: PropTypes.bool,
    locale: PropTypes.any,
    passProps: PropTypes.object
  }

  static defaultProps = {
    format: 'DD/MM/YYYY',
    locale: Spanish
  }

  state = {
    focused: false
  }

  getOptions() {
    const timezone = this.props.passProps.timezone
      ? this.props.passProps.timezone
      : 'America/Santiago'

    return {
      disableMobile: true,
      locale: this.props.locale,
      formatDate: date => {
        return moment(date)
          .tz(timezone)
          .format(this.props.format)
      }
    }
  }

  @autobind
  onChange(dates) {
    this.props.onChange(dates[0])
  }

  render() {
    const {value, enableTime} = this.props

    return (
      <div>
        <div className="os-input-container">
          <Flatpickr
            className="os-input-text"
            value={value}
            placeholder="Seleccionar..."
            onChange={this.onChange}
            options={this.getOptions()}
            data-enable-time={enableTime}
          />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
