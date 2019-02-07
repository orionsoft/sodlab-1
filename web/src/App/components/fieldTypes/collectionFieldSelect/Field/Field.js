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
        type
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
    includeId: PropTypes.bool,
    schema: PropTypes.object
  }

  getOptions() {
    // !!TODO
    // Original code that stopped working most likely when "Sections" in forms were introduced
    // this.props.schema is always missing in props so the option to choose the ID is never available
    // Adding it like in the return statement makes it available everywhere where collectionFieldSelect is used
    // though that doesn't mean it will be correctly used/parsed

    // if (!this.props.includeId || !this.props.schema) return this.props.collection.fields || []
    // const {only, idField} = this.props.schema
    // const idOption = {label: idField || 'ID', value: '_id'}
    // const items = this.props.collection.fields || []
    // const options = only
    //   ? items.filter(item => {
    //       return only.includes(item.type)
    //     })
    //   : items
    // return idOption ? union([idOption], options) : options
    return union([{label: 'ID', value: '_id'}], this.props.collection.fields)
  }

  render() {
    if (!this.props.collection) return 'collectionNotFound'
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
