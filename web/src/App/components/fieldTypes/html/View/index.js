import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.bool
  }

  render() {
    return (
      <div className={styles.container}>
        <pre>{this.props.value}</pre>
      </div>
    )
  }
}
