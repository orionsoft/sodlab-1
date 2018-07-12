import React from 'react'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import union from 'lodash/union'

@withGraphQL(gql`
  query getCollectionFields($collectionId: ID) {
    collection(collectionId: $collectionId) {
      _id
      fields {
        value: name
        label
      }
    }
  }
`)
export default class CollectionFieldSelect extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    environmentId: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    collection: PropTypes.object,
    errorMessage: PropTypes.node,
    passProps: PropTypes.object,
    includeId: PropTypes.bool
  }

  getOptions() {
    if (!this.props.includeId) return this.props.collection.fields
    const idOption = {label: 'ID', value: '_id'}
    const items = this.props.collection.fields || []

    return union([idOption], items)
  }

  render() {
    if (!this.props.collection) return 'collecitonNotFound'
    return (
      <Select
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.getOptions()}
        errorMessage={this.props.errorMessage}
        {...this.props.passProps}
      />
    )
  }
}
