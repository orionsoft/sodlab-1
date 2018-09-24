import React from 'react'
import styles from './styles.css'
import withEnvironmentUserId from 'App/helpers/auth/withEnvironmentUserId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import sleep from 'orionsoft-parts/lib/helpers/sleep'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import autobind from 'autobind-decorator'
import Notifications from './Notifications'

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

  state = {showNotif: false}

  componentDidMount() {
    window.addEventListener('mouseup', this.closeNotifications, false)
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.closeNotifications)
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
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={800}>
        {this.state.showNotif && (
          <Notifications environmentId={environmentId} notifications={notifications.items} />
        )}
      </ReactCSSTransitionGroup>
    )
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
      <div>
        <div className={styles.container} onClick={this.toggleNotifications}>
          {notifications.totalCount < 10 ? notifications.totalCount : '+9'}
        </div>
        {this.renderNotifications()}
      </div>
    )
  }
}
