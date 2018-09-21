import React from 'react'
import styles from './styles.css'
import withEnvironmentUserId from 'App/helpers/auth/withEnvironmentUserId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

@withEnvironmentUserId
@withGraphQL(gql`
  query paginatedNotifications($environmentId: ID, $environmentUserId: ID) {
    notifications(limit: 20, environmentId: $environmentId, environmentUserId: $environmentUserId) {
      items {
        title
        content
        path
        readed
      }
    }
  }
`)
export default class NotificationIndicator extends React.Component {
  static propTypes = {
    environmentId: PropTypes.string,
    notifications: PropTypes.object
  }

  render() {
    if (!this.props.environmentId || !this.props.notifications) return null
    const {notifications} = this.props
    return (
      <div
        className={
          this.props.notifications.items.length < 5 ? styles.shortContainer : styles.container
        }>
        <div className={styles.divider} />
        <div className={styles.notifContainer}>
          {this.props.notifications.items.map((item, index) => {
            return item.path ? (
              <Link key={index} to={item.path} className={styles.notifItem}>
                <div>{item.title}</div>
                <div className={styles.itemContent}>{item.content}</div>
              </Link>
            ) : (
              <div key={index} className={styles.notifItem}>
                <div>{item.title}</div>
                <div className={styles.itemContent}>{item.content}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
