import React from 'react'
import apolloClient from './apollo'
import {ApolloProvider} from 'react-apollo'
import OrionsoftProvider from 'orionsoft-parts/lib/components/Provider'
import './locale'
import PropTypes from 'prop-types'
import TwoFactorPromptProvider from './TwoFactorPromptProvider'

export default class Root extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <OrionsoftProvider meProvider={false}>
          <TwoFactorPromptProvider>{this.props.children}</TwoFactorPromptProvider>
        </OrionsoftProvider>
      </ApolloProvider>
    )
  }
}
