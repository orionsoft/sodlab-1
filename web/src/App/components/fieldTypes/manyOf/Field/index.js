import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'

@withEnvironmentId
@withGraphQL(gql`
  query getFormOneOfSelectOptions($environmentId: ID, $formId: ID, $fieldName: String) {
    selectOptions(environmentId: $environmentId, formId: $formId, fieldName: $fieldName) {
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
    environment: PropTypes.object,
    formId: PropTypes.string,
    selectOptions: PropTypes.array,
    passProps: PropTypes.object
  }

  render() {
    if (!this.props.environment) return null
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
