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

  renderRoles(view) {
    const roles = view.viewRoles
      .map(viewRole => {
        return viewRole.name
      })
      .join(', ')
    return <div>{roles.length ? roles : 'Vacío'}</div>
  }

  getFields() {
    return [
      {name: 'name', title: 'Nombre'},
      {name: 'title', title: 'Titulo'},
      {name: 'path', title: 'Ruta'},
      {name: 'viewRoles{name}', title: 'Roles', render: view => this.renderRoles(view)}
    ]
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs right={<Button to={`/${environmentId}/views/create`}>Crear Vista</Button>} />
        <br />
        <PaginatedList
          title={null}
          name="views"
          canUpdate
          params={{environmentId}}
          fields={this.getFields()}
          allowSearch
          basePath={`/${environmentId}/views`}
          defaultLimit={50}
        />
      </div>
    )
  }
}
