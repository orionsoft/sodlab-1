import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import moment from 'moment-timezone/builds/moment-timezone-with-data'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    timezone: PropTypes.string
  }

  render() {
    const result = moment(this.props.value)
      .tz(this.props.timezone)
      .format('DD/MM/YYYY kk:mm')
    return <div className={styles.container}>{this.props.value && result}</div>
  }
}
