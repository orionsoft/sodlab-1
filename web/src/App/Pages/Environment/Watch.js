import React from 'react'
import PropTypes from 'prop-types'
import withSubscription from 'react-apollo-decorators/lib/withSubscription'
import gql from 'graphql-tag'

@withSubscription(
  gql`
    subscription onCommentAdded($environmentId: ID) {
      environmentUpdated(environmentId: $environmentId) {
        _id
        name
      }
    }
  `
)
export default class Watch extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    environmentId: PropTypes.string
  }

  render() {
    return <span />
  }
}
