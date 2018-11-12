import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import Fields from './Fields'
import Indexes from './Indexes'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withRoles from 'App/helpers/auth/withRoles'
import Export from './Export'
import ImportDataTable from './ImportDataTable'
import RemoveData from './RemoveData'

@withGraphQL(gql`
  query getCollection($collectionId: ID) {
    collection(collectionId: $collectionId) {
      _id
      name
      environmentId
      ...adminCollectionFieldsUpdateFragment
    }
  }
  ${Fields.fragment}
`)
@withRoles
@withMessage
export default class Collection extends React.Component {
  static propTypes = {
    collection: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    roles: PropTypes.array
  }

  render() {
    if (!this.props.collection) return null
    const {params} = this.props.match

    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.collection.name}</Breadcrumbs>
        <Fields collection={this.props.collection} params={params} />
        <Indexes collection={this.props.collection} />
        <Export collectionId={this.props.collection._id} />
        <ImportDataTable collectionId={this.props.collection._id} />
        <RemoveData
          collection={this.props.collection}
          history={this.props.history}
          params={params}
          roles={this.props.roles}
        />
      </div>
    )
  }
}
