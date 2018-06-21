import React from 'react'
import styles from './styles.css'
import PaginatedList from 'App/components/Crud/List'
import Breadcrumbs from 'App/components/Breadcrumbs'

export default class List extends React.Component {
  static propTypes = {}

  getFields() {
    return [{title: 'Nombre', name: 'profile.name'}, {title: 'Email', name: 'email'}]
  }

  render() {
    return (
      <div className={styles.container}>
        <Breadcrumbs past={{'/admin': 'Admin'}}>Usuarios</Breadcrumbs>
        <br />
        <PaginatedList title={null} name="users" canUpdate fields={this.getFields()} allowSearch />
      </div>
    )
  }
}
