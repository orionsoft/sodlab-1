import React from 'react'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'

@withRouter
@withGraphQL(gql`
  query getEnvironmentHooks($environmentId: ID) {
    hooks(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
export default class HookSelect extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    environmentId: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    hooks: PropTypes.object,
    passProps: PropTypes.object,
    errorMessage: PropTypes.node
  }

  render() {
    return (
      <Select
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.hooks.items}
        errorMessage={this.props.errorMessage}
        {...this.props.passProps}
      />
    )
  }
}
