import React from 'react'
import {withApollo} from 'react-apollo'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

let envId = null
let envFetched = false

const fetchEnvironment = async function(apollo, url) {
  console.log(url)
  envFetched = true
  const {data} = await apollo.query({
    query: gql`
      query getEnvironment($url: String) {
        environment(url: $url) {
          _id
        }
      }
    `,
    variables: {url}
  })
  if (data.environment) {
    envId = data.environment._id
  }
}

export default function(ComposedComponent) {
  @withApollo
  class WithEnvironmentId extends React.Component {
    static propTypes = {
      client: PropTypes.object
    }

    state = {loading: true}

    async componentWillMount() {
      if (envFetched) return this.setState({loading: false, envId})
      await fetchEnvironment(this.props.client, 'testing.localhost')
      this.setState({envId, loading: false})
    }

    getEnvironmentId() {
      return envId
    }

    render() {
      if (this.state.loading) return null
      return <ComposedComponent {...this.props} environmentId={this.state.envId} />
    }
  }

  return WithEnvironmentId
}
