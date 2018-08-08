import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.string
  }

  render() {
    if (!this.props.value) return null
    return (
      <div className={styles.container}>
        <a href={this.props.value} target="blank" className={styles.hyperlink}>
          {this.props.value}
        </a>
      </div>
    )
  }
}
