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
    if (link.type === 'path') {
      const roles = link.linkRoles
        .map(linkRole => {
          return linkRole.name
        })
        .join(', ')
      return <div>{roles.length ? roles : 'Vacío'}</div>
    } else {
      const roles = link.linkRoles.map(linkRole => {
        return <div key={linkRole.title}>{linkRole.title + ': ' + linkRole.roles + '\n'}</div>
      })
      return <div>{roles.length ? roles : 'Vacío'}</div>
    }
  }

  getTypeLabel(type) {
    const typeLabels = {
      path: 'Ruta',
      category: 'Categoría'
    }
    return typeLabels[type]
  }

  getFields() {
    return [
      {name: 'title', title: 'Título'},
      {name: 'type', title: 'Tipo', render: link => this.getTypeLabel(link.type)},
      {name: 'linkRoles', title: 'Roles', render: link => this.renderRoles(link)},
      {name: 'position', title: 'Posición'}
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
          defaultLimit={50}
        />
      </div>
    )
  }
}
