import React from 'react'
import PropTypes from 'prop-types'
import PaginatedList from 'App/components/Crud/List'
import Breadcrumbs from '../../Breadcrumbs'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'

export default class List extends React.Component {
  static propTypes = {
    match: PropTypes.object
  }

  getFields() {
    return [
      {title: 'Nombre', name: 'name'},
      {title: 'Título', name: 'title'},
      {title: 'Colección', name: 'collection.name'}
    ]
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs
          right={<Button to={`/${environmentId}/filters/create`}>Crear filtro</Button>}
        />
        <br />
        <PaginatedList
          title={null}
          name="filters"
          params={{environmentId}}
          canUpdate
          fields={this.getFields()}
          allowSearch
          extraFields={['collection._id']}
          basePath={`/${environmentId}/filters`}
          defaultLimit={50}
        />
      </div>
    )
  }
}
