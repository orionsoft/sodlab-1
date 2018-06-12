import React from 'react'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'

export default class List extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Breadcrumbs past={{'/admin': 'Admin'}}>Usuarios</Breadcrumbs>
      </div>
    )
  }
}
