import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Menu from './Menu'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.object
  }

  render() {
    return (
      <div className={styles.container} style={{minHeight: window.innerHeight}}>
        <Menu />
        <div className={styles.content}>{this.props.children}</div>
      </div>
    )
  }
}
