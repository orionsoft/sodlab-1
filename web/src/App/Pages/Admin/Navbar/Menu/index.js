import React from 'react'
import styles from './styles.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import AccountIcon from 'react-icons/lib/md/person'
import AdminIcon from 'react-icons/lib/md/control-point'
import LoginIcon from 'react-icons/lib/md/open-in-browser'
import SettingsIcon from 'react-icons/lib/md/settings'
import LogoutIcon from 'react-icons/lib/md/exit-to-app'
import autobind from 'autobind-decorator'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import sleep from 'orionsoft-parts/lib/helpers/sleep'
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import logout from 'App/helpers/auth/logout'
import withUserId from 'App/helpers/auth/withUserId'
import includes from 'lodash/includes'

@withGraphQL(
  gql`
    query getMe {
      me {
        _id
        email
        roles
        profile {
          name
        }
      }
    }
  `,
  {
    loading: null
  }
)
@withUserId
@withRouter
export default class User extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    me: PropTypes.object,
    userId: PropTypes.string
  }

  state = {open: false}

  componentDidMount() {
    window.addEventListener('mouseup', this.closeMenu, false)
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.closeMenu)
  }

  @autobind
  async closeMenu(event) {
    if (!this.state.open) return true
    await sleep(100)
    this.setState({open: false})
  }

  @autobind
  toggleMenu() {
    this.setState({open: !this.state.open})
  }

  @autobind
  async logout() {
    await logout()
  }

  @autobind
  login() {
    this.props.history.push('/login')
  }

  renderAdmin() {
    if (!this.props.me.roles) return null
    if (!includes(this.props.me.roles, 'admin')) return null
    return (
      <Link to="/admin" className={styles.menuLink}>
        <AdminIcon size={20} />
        <span>Admin</span>
      </Link>
    )
  }

  renderMenu() {
    if (!this.props.me) return null
    if (!this.state.open) return null
    return (
      <div className={styles.menu} key="menu">
        <Link to="/settings" className={styles.account}>
          <div className={styles.name}>
            {(this.props.me.profile && this.props.me.profile.name) || 'Account'}
          </div>
          <div className={styles.email}>{this.props.me.email}</div>
        </Link>
        {this.renderAdmin()}
        <Link to="/settings" className={styles.menuLink}>
          <SettingsIcon size={20} />
          <span>Settings</span>
        </Link>
        <a onClick={this.logout} className={styles.menuLink}>
          <LogoutIcon size={20} />
          <span>Sign Out</span>
        </a>
      </div>
    )
  }

  renderIcon() {
    if (this.props.me) {
      return <AccountIcon className={styles.icon} size={25} onClick={this.toggleMenu} />
    } else if (!this.props.userId) {
      return <LoginIcon className={styles.icon} size={25} onClick={this.login} />
    }
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderIcon()}
        <ReactCSSTransitionGroup
          transitionName="user-menu"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}>
          {this.renderMenu()}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
