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
    return [{title: 'Título', name: 'title'}]
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs
          right={<Button to={`/${environmentId}/charts/create`}>Crear gráfico</Button>}
        />
        <br />
        <PaginatedList
          title={null}
          name="charts"
          params={{environmentId}}
          canUpdate
          fields={this.getFields()}
          allowSearch
          basePath={`/${environmentId}/charts`}
          defaultLimit={50}
        />
      </div>
    )
  }
}
