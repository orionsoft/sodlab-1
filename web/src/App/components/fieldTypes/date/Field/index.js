import React from 'react'
import PropTypes from 'prop-types'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'

export default class Date extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string
  }

  state = {
    focused: false
  }

  getOptions() {
    return {
      formatDate: date => {
        return moment(date).format('DD/MM/YYYY')
      }
    }
  }

  render() {
    const {onChange, value} = this.props

    return (
      <div className="os-input-container">
        <Flatpickr
          value={value}
          onChange={date => {
            onChange(date && date[0] && date[0].getTime())
          }}
          className="os-input-text"
          dateFormat="F j, Y"
          options={this.getOptions()}
        />
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
