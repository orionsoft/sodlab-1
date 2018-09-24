import React from 'react'
import styles from './styles.css'
import withEnvironmentUserId from 'App/helpers/auth/withEnvironmentUserId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import withSubscription from 'react-apollo-decorators/lib/withSubscription'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import sleep from 'orionsoft-parts/lib/helpers/sleep'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import autobind from 'autobind-decorator'
import Notifications from './Notifications'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withEnvironmentUserId
@withGraphQL(gql`
  query paginatedNotifications($environmentId: ID, $environmentUserId: ID) {
    notifications(limit: 20, environmentId: $environmentId, environmentUserId: $environmentUserId) {
      items {
        _id
        path
        title
        content
        readed
      }
    }
  }
`)
@withMessage
@withSubscription(
  gql`
    subscription notificationInserted($environmentId: ID) {
      notificationInserted(environmentId: $environmentId)
    }
  `,
  'onNotif'
)
export default class NotificationIndicator extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    environmentId: PropTypes.string,
    notifications: PropTypes.object,
    refetch: PropTypes.func
  }

  state = {showNotif: false}

  componentDidMount() {
    window.addEventListener('mouseup', this.closeNotifications, false)
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.closeNotifications)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.notifications.items.length !== nextProps.notifications.items.length) {
      this.props.showMessage(
        nextProps.notifications.items[0].title + ': ' + nextProps.notifications.items[0].content
      )
    }
  }

  @autobind
  async onNotif({notificationInserted}) {
    this.props.refetch()
  }

  @autobind
  async closeNotifications(event) {
    if (!this.state.showNotif) return true
    await sleep(10)
    this.setState({showNotif: false})
  }

  @autobind
  toggleNotifications() {
    this.setState({showNotif: !this.state.showNotif})
  }

  renderNotifications() {
    const {environmentId, notifications} = this.props
    return (
      <ReactCSSTransitionGroup
        transitionName="notificationscontainer"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}>
        {this.state.showNotif && (
          <div className={styles.notificationsBox}>
            <Notifications
              environmentId={environmentId}
              notifications={notifications.items}
              hoverItem={this.onNotif}
            />
          </div>
        )}
      </ReactCSSTransitionGroup>
    )
  }

  getLength() {
    const {notifications} = this.props
    return notifications.items.filter(item => {
      return !item.readed
    }).length
  }

  render() {
    if (!this.props.environmentId || !this.props.notifications) return null
    return (
      <div>
        <div className={styles.container} onClick={this.toggleNotifications}>
          {this.getLength() < 10 ? this.getLength() : '+9'}
        </div>
        {this.renderNotifications()}
      </div>
    )
  }
}
