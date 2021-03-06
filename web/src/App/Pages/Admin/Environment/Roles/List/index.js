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
    return [{title: 'Nombre', name: 'name'}]
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs right={<Button to={`/${environmentId}/roles/create`}>Crear rol</Button>} />
        <br />
        <PaginatedList
          title={null}
          name="roles"
          canUpdate
          params={{environmentId}}
          fields={this.getFields()}
          allowSearch
          basePath={`/${environmentId}/roles`}
          defaultLimit={50}
        />
      </div>
    )
  }
}
