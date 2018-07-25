import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import PaginatedList from 'App/components/Crud/List'
import Breadcrumbs from 'App/components/Breadcrumbs'
import withRoles from 'App/helpers/auth/withRoles'

@withRoles
export default class List extends React.Component {
  static propTypes = {
    roles: PropTypes.array
  }

  getFields() {
    return [{title: 'Nombre', name: 'profile.name'}, {title: 'Email', name: 'email'}]
  }

  renderTitle(role) {
    return (
      <div>
        <Breadcrumbs past={{'/admin': role}}>Usuarios</Breadcrumbs>
      </div>
    )
  }

  render() {
    const {roles} = this.props
    return (
      <div className={styles.container}>
        {roles.includes('superAdmin') ? this.renderTitle('Super Admin') : this.renderTitle('Admin')}
        <br />
        <PaginatedList
          title={null}
          name="users"
          canUpdate
          fields={this.getFields()}
          allowSearch
          basePath={'/admin/users'}
        />
      </div>
    )
  }
}
