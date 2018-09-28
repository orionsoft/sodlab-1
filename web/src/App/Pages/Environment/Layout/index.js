import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Menu from './Menu'
import MenuIcon from 'react-icons/lib/fa/bars'
import NotificationIndicator from './NotificationIndicator'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.object
  }

  state = {isOpen: false}

  toggleMenu() {
    this.setState({isOpen: !this.state.isOpen})
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.menuButton}>
          <MenuIcon onClick={() => this.toggleMenu()} />
        </div>
        <div className={this.state.isOpen ? styles.showResponsiveMenu : styles.responsiveMenu}>
          <Menu toggleMenu={() => this.toggleMenu()} />
        </div>
        <div className={styles.content}>
          <div className={styles.notifications}>
            <NotificationIndicator />
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}
