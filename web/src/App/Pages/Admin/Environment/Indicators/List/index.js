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
    return [
      {title: 'Nombre', name: 'name'},
      {title: 'Título', name: 'title'},
      {
        title: 'Tipo',
        name: 'indicatorType{name}',
        render: ({indicatorType}) => this.renderIndicatorType(indicatorType)
      }
    ]
  }

  renderIndicatorType(type) {
    if (!type || !type.name) return
    return type.name
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs
          right={<Button to={`/${environmentId}/indicators/create`}>Crear indicador</Button>}
        />
        <br />
        <PaginatedList
          title={null}
          name="indicators"
          params={{environmentId}}
          canUpdate
          fields={this.getFields()}
          allowSearch
          basePath={`/${environmentId}/indicators`}
        />
      </div>
    )
  }
}
