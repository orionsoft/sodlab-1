import React from 'react'
import styles from './styles.css'
import {withRouter} from 'react-router'
import Button from 'orionsoft-parts/lib/components/Button'
import PaginatedList from 'App/components/Crud/List'
import PropTypes from 'prop-types'
import Breadcrumbs from '../../Breadcrumbs'

@withRouter
export default class List extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
  }

  getFields() {
    return [{title: 'Email', name: 'email'}]
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
        />
      </div>
    )
  }
}
