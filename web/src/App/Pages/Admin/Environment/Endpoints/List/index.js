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

  getFields() {
    return [
      {name: 'name', title: 'Nombre'},
      {name: 'identifier', title: 'Identificador'},
      {name: 'collection.name', title: 'Colección'}
    ]
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs
          right={<Button to={`/${environmentId}/endpoints/create`}>Crear Endpoint</Button>}
        />
        <br />
        <PaginatedList
          title={null}
          name="endpoints"
          canUpdate
          params={{environmentId}}
          fields={this.getFields()}
          allowSearch
          extraFields={['collection._id']}
          basePath={`/${environmentId}/endpoints`}
          defaultLimit={50}
        />
      </div>
    )
  }
}
