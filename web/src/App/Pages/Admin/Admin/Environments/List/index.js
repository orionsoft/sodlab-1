import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Button from 'orionsoft-parts/lib/components/Button'
import PaginatedList from 'App/components/Crud/List'
import withRoles from 'App/helpers/auth/withRoles'
import {withRouter} from 'react-router'

@withRouter
@withRoles
export default class List extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    roles: PropTypes.array
  }

  renderTitle(title, roles) {
    return (
      <div>
        <Breadcrumbs
          past={{'/admin': title}}
          right={
            roles.includes('superAdmin') && (
              <Button to="/admin/environments/create">Crear ambiente</Button>
            )
          }>
          Ambientes
        </Breadcrumbs>
      </div>
    )
  }

  render() {
    const roles = this.props.roles || []
    return (
      <div className={styles.container}>
        {roles.includes('superAdmin')
          ? this.renderTitle('Super Admin', roles)
          : this.renderTitle('Admin', roles)}
        <div className="divider" />
        <PaginatedList title={null} name="environments" canUpdate allowSearch basePath="" />
      </div>
    )
  }
}
