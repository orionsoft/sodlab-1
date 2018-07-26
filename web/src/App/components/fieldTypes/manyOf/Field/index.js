import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import {withRouter} from 'react-router'
import gql from 'graphql-tag'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import withSubscription from 'react-apollo-decorators/lib/withSubscription'
import autobind from 'autobind-decorator'

@withRouter
@withGraphQL(gql`
  query getFormOneOfSelectOptions($environmentId: ID, $formId: ID, $fieldName: String) {
    selectOptions(environmentId: $environmentId, formId: $formId, fieldName: $fieldName) {
      label
      value
    }
  }
`)
@withSubscription(
  gql`
    subscription($environmentId: ID, $collectionId: ID) {
      collectionDataChanged(environmentId: $environmentId, collectionId: $collectionId)
    }
  `,
  'onUpdate',
  {
    getVariables(props) {
      const envId = props.collectionId.split('_')[0]
      const vars = {
        environmentId: envId,
        collectionId: props.collectionId
      }

      return vars
    }
  }
)
export default class ManyOf extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    value: PropTypes.array,
    onChange: PropTypes.func,
    errorMessage: PropTypes.node,
    formId: PropTypes.string,
    selectOptions: PropTypes.array,
    passProps: PropTypes.object,
    refetch: PropTypes.func,
    collectionId: PropTypes.string
  }

  @autobind
  onUpdate() {
    this.props.refetch()
  }

  render() {
    if (!this.props.selectOptions) return null
    return (
      <Select
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.selectOptions}
        errorMessage={this.props.errorMessage}
        multi
        {...this.props.passProps}
      />
    )
  }
}
