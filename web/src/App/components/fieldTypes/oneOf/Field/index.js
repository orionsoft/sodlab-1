import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Select from 'orionsoft-parts/lib/components/fields/Select'

@withGraphQL(gql`
  query getFormOneOfSelectOptions($formId: ID, $fieldName: String) {
    selectOptions(formId: $formId, fieldName: $fieldName) {
      label
      value
    }
  }
`)
export default class OneOf extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    errorMessage: PropTypes.node,
    formId: PropTypes.string,
    selectOptions: PropTypes.array,
    passProps: PropTypes.object
  }

  render() {
    return (
      <Select
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.selectOptions}
        errorMessage={this.props.errorMessage}
        {...this.props.passProps}
      />
    )
  }
}
