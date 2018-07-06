import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import moment from 'moment'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.bool
  }

  render() {
    return (
      <div className={styles.container}>
        {this.props.value && moment(this.props.value).format('DD/MM/YYYY HH:mm')}
      </div>
    )
  }
}
