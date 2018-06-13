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

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs
          right={
            <Button to={`/admin/environments/${environmentId}/forms/create`}>
              Crear formulario
            </Button>
          }
        />
        <br />
        <PaginatedList
          title={null}
          name="forms"
          params={{filter: {type: String}}}
          canUpdate
          allowSearch
          basePath={`/admin/environments/${environmentId}/forms`}
        />
      </div>
    )
  }
}
