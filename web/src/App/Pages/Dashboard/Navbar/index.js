import React from 'react'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'
import Logo from './Logo'
import Menu from './Menu'

export default class Navbar extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Container>
          <div className={styles.flex}>
            <div className={styles.logo}>
              <Logo />
            </div>
            <div className={styles.menu}>
              <Menu />
            </div>
          </div>
        </Container>
      </div>
    )
  }
}
