import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class Blackbox extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func
  }

  render() {
    return <div className={styles.container} />
  }
}
