import React from 'react'
import PropTypes from 'prop-types'
import withSubscription from 'react-apollo-decorators/lib/withSubscription'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'

@withSubscription(
  gql`
    subscription onEnvironmentUpdated($environmentId: ID) {
      environmentUpdated(environmentId: $environmentId)
    }
  `,
  'onChange'
)
export default class Watch extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    client: PropTypes.object,
    environmentId: PropTypes.string
  }

  @autobind
  onChange() {
    console.log('asudhas')
    this.props.client.queryManager.reFetchObservableQueries()
  }

  render() {
    return <span />
  }
}
