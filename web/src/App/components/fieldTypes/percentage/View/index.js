import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import numeral from 'numeral'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.bool
  }

  renderWithDecimal() {
    return (
      <div className={styles.container}>
        {`${(numeral(this.props.value).format('0.0[0000]') * 100).toFixed(2)}%`}
      </div>
    )
  }

  renderInt() {
    return (
      <div className={styles.container}>
        {`${(numeral(this.props.value).format('0.0[0000]') * 100).toFixed(0)}%`}
      </div>
    )
  }

  render() {
    const {value} = this.props
    if ((value * 100) % 1 !== 0) {
      return this.renderWithDecimal()
    } else {
      return this.renderInt()
    }
  }
}
