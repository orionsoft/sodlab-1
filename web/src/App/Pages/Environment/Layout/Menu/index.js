import React from 'react'
import styles from './styles.css'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import LogoutIcon from 'react-icons/lib/md/exit-to-app'
import logout from 'App/helpers/auth/logout'
import {withRouter} from 'react-router'
import CloseIcon from 'react-icons/lib/md/close'
import Links from './Links'

@withEnvironmentId
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
      sideBarColor
      sideBarTextColor
    }
    sideBar(environmentId: $environmentId)
  }
`)
@withRouter
export default class Menu extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    environment: PropTypes.object,
    sideBar: PropTypes.array,
    toggleMenu: PropTypes.func
  }

  renderLink({title, path}, useFullToCheck) {
    const {environment} = this.props
    const active = useFullToCheck
      ? this.props.location.pathname === path
      : this.props.location.pathname.startsWith(path)
    return (
      <Link
        key={path}
        to={path}
        className={active ? styles.itemActive : styles.menuItem}
        style={{color: environment.sideBarTextColor || '#fff'}}>
        {title}
      </Link>
    )
  }

  renderLinks() {
    const {sideBarTextColor} = this.props.environment
    return this.props.sideBar.map((link, key) => {
      return <Links link={link} key={key} customColor={sideBarTextColor} />
    })
  }

  toggleMenu = e => {
    e.preventDefault()
    this.props.toggleMenu()
  }

  render() {
    const {environment} = this.props
    return (
      <div
        className={styles.container}
        style={{
          backgroundColor: environment.sideBarColor || '#111',
          color: environment.sideBarTextColor || '#fff'
        }}>
        <div className={styles.menuButton}>
          <CloseIcon onClick={this.toggleMenu} />
        </div>
        <Link
          to="/"
          className={styles.title}
          style={{color: environment.sideBarTextColor || '#fff'}}>
          {environment.name}
        </Link>
        <div className={styles.divider} />
        {this.renderLinks()}
        <div className={styles.divider} />
        {this.renderLink({title: 'Mi cuenta', path: '/settings'})}
        <div className={styles.logout} onClick={logout}>
          <LogoutIcon />
          <span style={{marginLeft: 5}}>Salir</span>
        </div>
      </div>
    )
  }
}
