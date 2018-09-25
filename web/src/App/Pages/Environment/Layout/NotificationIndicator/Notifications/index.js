import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import gql from 'graphql-tag'
import withMutation from 'react-apollo-decorators/lib/withMutation'

@withMutation(gql`
  mutation toggleReaded($environmentId: ID, $notificationId: ID) {
    toggleReaded(environmentId: $environmentId, notificationId: $notificationId)
  }
`)
export default class NotificationIndicator extends React.Component {
  static propTypes = {
    environmentId: PropTypes.string,
    notifications: PropTypes.object,
    toggleReaded: PropTypes.func,
    hoverItem: PropTypes.func
  }

  async check(id) {
    const {environmentId} = this.props
    try {
      this.errorMessage = null
      await this.props.toggleReaded({
        environmentId,
        notificationId: id
      })
      this.props.hoverItem()
    } catch (error) {
      if (error.graphQLErrors) {
        const message = error.graphQLErrors.map(err => err.message).join('. ')
        this.errorMessage = message
      } else {
        this.errorMessage = error.message
      }
      return false
    }
  }

  render() {
    if (!this.props.environmentId || !this.props.notifications) return null
    const {notifications} = this.props
    return (
      <div className={notifications.length < 5 ? styles.shortContainer : styles.container}>
        <div className={styles.notifContainer}>
          {notifications.map((item, index) => {
            return item.path ? (
              <Link
                key={index}
                to={item.path}
                className={item.readed ? styles.linkItem : styles.notReadedLinkItem}
                {...!item.readed && {onClick: () => this.check(item._id)}}>
                <div>{item.title}</div>
                <div className={styles.itemContent}>{item.content}</div>
              </Link>
            ) : (
              <div
                key={index}
                className={item.readed ? styles.item : styles.notReadedItem}
                {...!item.readed && {onMouseOver: () => this.check(item._id)}}>
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
