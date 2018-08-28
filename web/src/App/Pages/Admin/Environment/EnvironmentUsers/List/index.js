import React from 'react'
import styles from './styles.css'
import {withRouter} from 'react-router'
import Button from 'orionsoft-parts/lib/components/Button'
import PaginatedList from 'App/components/Crud/List'
import PropTypes from 'prop-types'
import Breadcrumbs from '../../Breadcrumbs'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withGraphQL(gql`
  query getEnvironmentData($environmentId: ID, $url: String) {
    environment(environmentId: $environmentId, url: $url) {
      _id
      profileFields {
        name
      }
    }
    roles(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withRouter
export default class List extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    environment: PropTypes.object,
    roles: PropTypes.object
  }

  getFields() {
    return [
      {title: 'Email', name: 'email'},
      {title: 'Schema', name: 'profile', render: ({profile}) => this.renderSchema(profile)},
      {
        title: 'Roles',
        name: 'roles',
        render: ({roles}) => this.renderRoles(roles)
      }
    ]
  }

  renderSchema(profile) {
    const {environment} = this.props
    if (!environment.profileFields || !environment.profileFields.length) return
    const hasEveryProfileField = environment.profileFields.every(field => profile[field.name])
    return <div className={styles.schema}>{hasEveryProfileField ? 'Si' : 'No'}</div>
  }

  renderRoles(userRoles) {
    if (!userRoles || !userRoles.length) return
    const {roles} = this.props
    const roleNames = userRoles.map(rol => {
      return (
        roles.items.find(role => {
          return rol === role.value
        }) || []
      )
    })
    if (!roleNames || !roleNames.length) return
    return roleNames.map((rol, index) => {
      return (
        <div key={index} className={styles.rol}>
          {rol.label}
        </div>
      )
    })
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs right={<Button to={`/${environmentId}/users/create`}>Crear Usuario</Button>} />
        <br />
        <PaginatedList
          title={null}
          name="environmentUsers"
          canUpdate
          params={{environmentId}}
          fields={this.getFields()}
          allowSearch
          basePath={`/${environmentId}/users`}
          defaultLimit={50}
        />
      </div>
    )
  }
}
