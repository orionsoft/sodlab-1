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

  getTypeLabel(type) {
    const typeLabels = {
      create: 'Crear',
      update: 'Editar'
    }
    return typeLabels[type]
  }

  getFields() {
    return [
      {name: 'name', title: 'Nombre'},
      {name: 'title', title: 'Título'},
      {name: 'collection.name', title: 'Colección'},
      {name: 'type', title: 'Tipo', render: doc => this.getTypeLabel(doc.type)}
    ]
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs
          right={<Button to={`/${environmentId}/forms/create`}>Crear formulario</Button>}
        />
        <br />
        <PaginatedList
          title={null}
          name="forms"
          canUpdate
          params={{environmentId}}
          fields={this.getFields()}
          allowSearch
          extraFields={['collection._id']}
          basePath={`/${environmentId}/forms`}
        />
      </div>
    )
  }
}
