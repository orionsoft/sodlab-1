import React from 'react'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'

@withRouter
@withGraphQL(gql`
  query getEnvironmentCollections($environmentId: ID) {
    forms(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
export default class CollectionSelect extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    environmentId: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    forms: PropTypes.object,
    passProps: PropTypes.object,
    errorMessage: PropTypes.node
  }

  render() {
    return (
      <Select
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.forms.items}
        errorMessage={this.props.errorMessage}
        {...this.props.passProps}
      />
    )
  }
}
