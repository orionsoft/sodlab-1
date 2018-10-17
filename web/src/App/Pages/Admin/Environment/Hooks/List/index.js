import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PaginatedList from 'App/components/Crud/List'
import Breadcrumbs from '../../Breadcrumbs'
import Button from 'orionsoft-parts/lib/components/Button'

@withGraphQL(gql`
  query {
    functionTypes {
      _id
      name
      optionsParams
    }
  }
`)
export default class List extends React.Component {
  static propTypes = {
    match: PropTypes.object
  }

  getFields() {
    return [
      {title: 'Nombre', name: 'name'},
      {
        title: 'Tipo',
        name: 'functionTypeId',
        render: ({functionTypeId}) => this.renderFunctionType(functionTypeId)
      }
    ]
  }

  renderFunctionType(type) {
    if (!type) return
    return this.props.functionTypes.filter(({_id}) => _id === type).map(field => field.name)[0]
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs right={<Button to={`/${environmentId}/hooks/create`}>Crear hook</Button>} />
        <br />
        <PaginatedList
          title={null}
          name="hooks"
          params={{environmentId}}
          canUpdate
          fields={this.getFields()}
          allowSearch
          basePath={`/${environmentId}/hooks`}
          defaultLimit={50}
        />
      </div>
    )
  }
}
