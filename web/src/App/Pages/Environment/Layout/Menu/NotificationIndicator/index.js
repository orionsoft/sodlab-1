import React from 'react'
import styles from './styles.css'
import withEnvironmentUserId from 'App/helpers/auth/withEnvironmentUserId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

@withEnvironmentUserId
@withGraphQL(gql`
  query paginatedNotifications($environmentId: ID, $environmentUserId: ID) {
    notifications(
      limit: 20
      environmentId: $environmentId
      environmentUserId: $environmentUserId
      readed: true
    ) {
      totalCount
    }
  }
`)
export default class NotificationIndicator extends React.Component {
  static propTypes = {
    environmentId: PropTypes.string,
    notifications: PropTypes.object
  }

  render() {
    if (
      !this.props.environmentId ||
      !this.props.notifications ||
      !this.props.notifications.totalCount
    )
      return null
    const {notifications} = this.props
    return (
      <div className={styles.container}>
        {notifications.totalCount < 10 ? notifications.totalCount : '+9'}
      </div>
    )
  }
}
