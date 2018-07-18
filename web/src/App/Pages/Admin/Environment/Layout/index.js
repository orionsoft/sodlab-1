import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Menu from './Menu'
import Container from 'orionsoft-parts/lib/components/Container'
import links from '../links'
import MenuIcon from 'react-icons/lib/fa/bars'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    environment: PropTypes.object
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
          <Menu
            toggleMenu={() => this.toggleMenu()}
            links={links}
            environment={this.props.environment}
          />
        </div>
        <div className={styles.content}>
          <Container>
            <div className={styles.innerContent} style={{minHeight: window.innerHeight}}>
              {this.props.children}
            </div>
          </Container>
        </div>
      </div>
    )
  }
}
