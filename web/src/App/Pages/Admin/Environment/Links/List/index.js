import React from 'react'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import PaginatedList from 'App/components/Crud/List'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import Breadcrumbs from '../../Breadcrumbs'

@withRouter
export default class List extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
  }

  renderRoles(link) {
    const roles = link.linkRoles
      .map(linkRole => {
        return linkRole.name
      })
      .join(', ')
    return <div>{roles.length ? roles : 'Vacío'}</div>
  }

  getFields() {
    return [
      {name: 'title', title: 'Título'},
      {name: 'path', title: 'Ruta'},
      {name: 'linkRoles{name}', title: 'Roles', render: link => this.renderRoles(link)}
    ]
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs right={<Button to={`/${environmentId}/links/create`}>Crear Link</Button>} />
        <br />
        <PaginatedList
          title={null}
          name="links"
          canUpdate
          params={{environmentId}}
          fields={this.getFields()}
          allowSearch
          basePath={`/${environmentId}/links`}
        />
      </div>
    )
  }
}
