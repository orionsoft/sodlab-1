import React from 'react'
import withUserId from './withUserId'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import NotAllowed from 'App/Pages/Auth/NotAllowed'

export default function(ComposedComponent) {
  @withUserId
  @withEnvironmentId
  @withGraphQL(
    gql`
      query getEnvironmentUserByUserId($userId: ID, $environmentId: ID) {
        environmentUser: environmentUserByUserId(userId: $userId, environmentId: $environmentId) {
          _id
          environmentId
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

    state = {envUserId: false}

    static getDerivedStateFromProps(props, state) {
      const {environmentUser, environmentId} = props
      if (!environmentUser || environmentUser.environmentId !== environmentId) {
        return {envUserId: false}
      }
      return {envUserId: true}
    }

    render() {
      if (!this.state.envUserId) return <NotAllowed />
      return <ComposedComponent environmentUser={this.props.environmentUser} />
    }
  }

  return WithEnvironmentUserId
}
