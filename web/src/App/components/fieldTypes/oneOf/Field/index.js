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
  query getFormOneOfSelectOptions(
    $environmentId: ID
    $formId: ID
    $fieldName: String
    $collectionFieldName: String
    $filterId: ID
  ) {
    selectOptions(
      environmentId: $environmentId
      formId: $formId
      fieldName: $fieldName
      collectionFieldName: $collectionFieldName
      filterId: $filterId
    ) {
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
export default class OneOf extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    errorMessage: PropTypes.node,
    formId: PropTypes.string,
    selectOptions: PropTypes.array,
    passProps: PropTypes.object,
    collectionFieldName: PropTypes.string,
    collectionId: PropTypes.string,
    filterId: PropTypes.string,
    refetch: PropTypes.func
  }

  @autobind
  onUpdate() {
    this.props.refetch()
  }

  render() {
    if (!this.props.selectOptions) return null
    const passProps = {...this.props.passProps, placeholder: 'Seleccionar...'}
    return (
      <Select
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.selectOptions}
        errorMessage={this.props.errorMessage}
        passProps={passProps}
      />
    )
  }
}
