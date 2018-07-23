import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import {withRouter} from 'react-router'
import gql from 'graphql-tag'
import Select from 'orionsoft-parts/lib/components/fields/Select'

@withRouter
@withGraphQL(gql`
  query getFormOneOfSelectOptions(
    $environmentId: ID
    $formId: ID
    $fieldName: String
    $typeFromForm: String
  ) {
    selectOptions(
      environmentId: $environmentId
      formId: $formId
      fieldName: $fieldName
      typeFromForm: $typeFromForm
    ) {
      label
      value
    }
  }
`)
export default class ManyOf extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    value: PropTypes.array,
    onChange: PropTypes.func,
    errorMessage: PropTypes.node,
    formId: PropTypes.string,
    selectOptions: PropTypes.array,
    passProps: PropTypes.object,
    typeFromForm: PropTypes.string
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
