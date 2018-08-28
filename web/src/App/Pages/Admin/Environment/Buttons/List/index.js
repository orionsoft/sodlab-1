import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import PaginatedList from 'App/components/Crud/List'
import Breadcrumbs from '../../Breadcrumbs'
import Button from 'orionsoft-parts/lib/components/Button'

export default class List extends React.Component {
  static propTypes = {
    match: PropTypes.object
  }

  getFields() {
    return [{title: 'Nombre', name: 'name'}, {title: 'Título', name: 'title'}]
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs right={<Button to={`/${environmentId}/buttons/create`}>Crear botón</Button>} />
        <br />
        <PaginatedList
          title={null}
          name="buttons"
          params={{environmentId}}
          canUpdate
          fields={this.getFields()}
          allowSearch
          basePath={`/${environmentId}/buttons`}
          defaultLimit={50}
        />
      </div>
    )
  }
}
