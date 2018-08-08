import React from 'react'
import {withApollo} from 'react-apollo'
import {withRouter} from 'react-router'
import withSession from './withSession'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import ForceLogout from 'App/Pages/Auth/ForceLogout'

let envUserId = null
let envFetched = false

const fetchEnvironmentUser = async function(apollo, userId, environmentId) {
  envFetched = true
  const {data} = await apollo.query({
    query: gql`
      query getEnvironmentUser($userId: ID) {
        environmentUser(userId: $userId) {
          _id
          environmentId
        }
      }
    `,
    variables: {userId}
  })
  console.log('comparar')
  console.log(data.environmentUser, environmentId)
  if (data.environmentUser && data.environmentUser.environmentId === environmentId) {
    console.log('ENTRA')
    envUserId = data.environmentUser._id
  }
}

export default function(ComposedComponent) {
  @withRouter
  @withApollo
  @withSession
  @withEnvironmentId
  class WithEnvironmentUserId extends React.Component {
    static propTypes = {
      history: PropTypes.object,
      session: PropTypes.object,
      environmentId: PropTypes.string,
      client: PropTypes.object
    }

    state = {loading: true}

    async componentWillMount() {
      if (envFetched) return this.setState({loading: false, envUserId})
      const {userId} = this.props.session
      const {environmentId} = this.props
      await fetchEnvironmentUser(this.props.client, userId, environmentId)
      this.setState({envUserId, loading: false})
    }

    getEnvironmentId() {
      return envUserId
    }

    render() {
      console.log('props and state')
      console.log(this.props)
      console.log(this.state)
      if (this.state.loading || !this.state.envUserId) return <ForceLogout />
      return <ComposedComponent {...this.props} />
    }
  }

  return WithEnvironmentUserId
}
