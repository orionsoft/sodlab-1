import React from 'react'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'

@withRouter
@withGraphQL(gql`
  query getEnvironmentIndicators($environmentId: ID) {
    indicators(limit: 200, environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
export default class IndicatorSelect extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    environmentId: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    indicators: PropTypes.object,
    passProps: PropTypes.object,
    errorMessage: PropTypes.node
  }

  render() {
    return (
      <Select
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.indicators.items}
        errorMessage={this.props.errorMessage}
        {...this.props.passProps}
      />
    )
  }
}
