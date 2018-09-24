import React from 'react'
import PropTypes from 'prop-types'
import withSubscription from 'react-apollo-decorators/lib/withSubscription'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import {withApollo} from 'react-apollo'
import withEnvironmentUserId from 'App/helpers/auth/withEnvironmentUserId'

@withApollo
@withEnvironmentUserId
@withMessage
@withSubscription(
  gql`
    subscription notificationInserted($environmentId: ID) {
      notificationInserted(environmentId: $environmentId)
    }
  `,
  'onNotif'
)
export default class Watch extends React.Component {
  static propTypes = {
    environmentId: PropTypes.string,
    environmentUserId: PropTypes.string,
    notificationInserted: PropTypes.object,
    showMessage: PropTypes.object,
    client: PropTypes.object
  }

  @autobind
  async onNotif({notificationInserted}) {
    if (notificationInserted) {
      console.log(notificationInserted)
      this.props.showMessage(notificationInserted.title)
    }
  }

  render() {
    return <span />
  }
}
