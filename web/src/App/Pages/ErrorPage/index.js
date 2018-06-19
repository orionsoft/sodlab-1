import React from 'react'
import styles from './styles.css'
import Logo from '../Auth/Logo'
import PropTypes from 'prop-types'

export default class Auth extends React.Component {
  static propTypes = {
    text: PropTypes.node
  }

  renderLogo() {
    return (
      <div className={styles.logo}>
        <Logo color="black" />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container} style={{minHeight: window.innerHeight}}>
        <div className={styles.content}>
          {this.renderLogo()}
          <div className={styles.text}>{this.props.text}</div>
        </div>
        <div className={styles.photo} />
      </div>
    )
  }
}
