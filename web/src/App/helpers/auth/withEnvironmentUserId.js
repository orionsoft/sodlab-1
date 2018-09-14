import React from 'react'
import withUserId from './withUserId'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

export default function(ComposedComponent) {
  @withUserId
  @withEnvironmentId
  @withGraphQL(
    gql`
      query getEnvironmentUserByUserId($userId: ID, $environmentId: ID) {
        environmentUser: environmentUserByUserId(userId: $userId, environmentId: $environmentId) {
          _id
        }
      }
    `
  )
  class WithEnvironmentUserId extends React.Component {
    static propTypes = {
      userId: PropTypes.string,
      environmentId: PropTypes.string,
      environmentUser: PropTypes.object
    }

    render() {
      return (
        <ComposedComponent
          environmentUserId={this.props.environmentUser._id}
          environmentId={this.props.environmentId}
        />
      )
    }
  }

  return WithEnvironmentUserId
}
