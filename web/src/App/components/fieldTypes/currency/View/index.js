import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import numeral from 'numeral'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.bool
  }

  render() {
    return <div className={styles.container}>{numeral(this.props.value).format('$0,0')}</div>
  }
}
