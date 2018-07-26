import React from 'react'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import withSubscription from 'react-apollo-decorators/lib/withSubscription'
import autobind from 'autobind-decorator'

@withGraphQL(
  gql`
    query getOneOfValue($tableId: ID, $fieldName: String, $value: String) {
      label: tableRelationLabel(tableId: $tableId, fieldName: $fieldName, value: $value)
    }
  `,
  {loading: null}
)
@withSubscription(
  gql`
    subscription($environmentId: ID, $collectionId: ID) {
      collectionDataChanged(environmentId: $environmentId, collectionId: $collectionId)
    }
  `,
  'onUpdate',
  {
    getVariables(props) {
      const envId = props.options.collectionId.split('_')[0]
      const vars = {
        environmentId: envId,
        collectionId: props.options.collectionId
      }

      return vars
    }
  }
)
export default class Value extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    refetch: PropTypes.func
  }

  @autobind
  onUpdate() {
    this.props.refetch()
  }

  render() {
    return this.props.label || ''
  }
}
