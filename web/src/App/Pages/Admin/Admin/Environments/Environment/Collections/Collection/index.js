import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import Fields from './Fields'
import Indexes from './Indexes'

@withGraphQL(gql`
  query getCollection($collectionId: ID) {
    collection(collectionId: $collectionId) {
      _id
      name
      ...adminCollectionFieldsUpdateFragment
    }
  }
  ${Fields.fragment}
`)
export default class Collection extends React.Component {
  static propTypes = {
    collection: PropTypes.object
  }

  render() {
    if (!this.props.collection) return
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.collection.name}</Breadcrumbs>
        <Fields collection={this.props.collection} />
        <Indexes collection={this.props.collection} />
      </div>
    )
  }
}
