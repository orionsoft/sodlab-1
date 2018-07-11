import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.bool
  }

  render() {
    const percentage = this.props.value * 100
    return <div className={styles.container}>{percentage.toFixed(2)}%</div>
  }
}
