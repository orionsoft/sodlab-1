import React from 'react'
import styles from './styles.css'
import logout from 'App/helpers/auth/logout'
import Button from 'orionsoft-parts/lib/components/Button'
import Logo from '../Logo'

export default class NotAllowed extends React.Component {
  static propTypes = {}

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
          <div className={styles.title}>No tiene permisos para estar aquí.</div>
          <div className={styles.buttonContent}>
            <Button className={styles.button} onClick={logout}>
              Salir
            </Button>
          </div>
        </div>
        <div className={styles.photo} />
      </div>
    )
  }
}
