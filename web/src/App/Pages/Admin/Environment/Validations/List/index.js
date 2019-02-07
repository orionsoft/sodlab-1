import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import PaginatedList from 'App/components/Crud/List'
import Breadcrumbs from '../../Breadcrumbs'
import Button from 'orionsoft-parts/lib/components/Button'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withGraphQL(gql`
  query {
    validationTypes {
      _id
      name
    }
  }
`)
export default class List extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    validationTypes: PropTypes.object
  }

  getFields() {
    return [
      {title: 'Nombre', name: 'name'},
      {
        title: 'Tipo',
        name: 'validationTypeId',
        render: ({validationTypeId}) => this.renderValidationType(validationTypeId)
      }
    ]
  }

  renderValidationType(validationTypeId) {
    if (!validationTypeId) return
    const validationType =
      this.props.validationTypes.find(({_id}) => _id === validationTypeId) || {}
    return validationType.name
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs
          right={<Button to={`/${environmentId}/validations/create`}>Crear validación</Button>}
        />
        <br />
        <PaginatedList
          title={null}
          name="validations"
          params={{environmentId}}
          canUpdate
          fields={this.getFields()}
          allowSearch
          basePath={`/${environmentId}/validations`}
          defaultLimit={50}
        />
      </div>
    )
  }
}
