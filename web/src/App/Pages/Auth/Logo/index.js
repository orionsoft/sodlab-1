import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class Logo extends React.Component {
  static propTypes = {
    src: PropTypes.string
  }

  static defaultProps = {
    src: '/dark.svg'
  }

  render() {
    return (
      <div className={styles.container}>
        <img className={styles.logo} src={this.props.src} alt="Logo" />
      </div>
    )
  }
}
