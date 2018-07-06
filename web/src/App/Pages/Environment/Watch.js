import React from 'react'
import gql from 'graphql-tag'
import {Subscription} from 'react-apollo'
import PropTypes from 'prop-types'

const onUpdateSubscription = gql`
  subscription onCommentAdded($environmentId: ID) {
    environmentUpdated(environmentId: $environmentId) {
      _id
    }
  }
`

export default class Watch extends React.Component {
  static propTypes = {
    environmentId: PropTypes.string
  }

  render() {
    return (
      <Subscription
        subscription={onUpdateSubscription}
        variables={{environmentId: this.props.environmentId}}>
        {({data, loading}) => {
          console.log(data)
          return null
        }}
      </Subscription>
    )
  }
}
