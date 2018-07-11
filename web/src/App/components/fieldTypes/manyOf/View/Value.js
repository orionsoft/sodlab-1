import React from 'react'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

@withGraphQL(
  gql`
    query getOneOfValue($tableId: ID, $fieldName: String, $value: [String]) {
      labels: tableRelationLabels(tableId: $tableId, fieldName: $fieldName, value: $value)
    }
  `,
  {loading: null}
)
export default class Value extends React.Component {
  static propTypes = {
    labels: PropTypes.array
  }

  render() {
    return (this.props.labels || []).join(', ') || ''
  }
}
