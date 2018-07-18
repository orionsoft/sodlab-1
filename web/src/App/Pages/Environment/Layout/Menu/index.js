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

@withEnvironmentId
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
    }
    links(limit: null, environmentId: $environmentId) {
      items {
        title
        path
      }
    }
  }
`)
@withRouter
export default class Menu extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    environment: PropTypes.object,
    links: PropTypes.object,
    toggleMenu: PropTypes.func
  }

  renderLink({title, path}, useFullToCheck) {
    const active = useFullToCheck
      ? this.props.location.pathname === path
      : this.props.location.pathname.startsWith(path)
    return (
      <Link key={path} to={path} className={active ? styles.itemActive : styles.menuItem}>
        {title}
      </Link>
    )
  }

  renderLinks() {
    return this.props.links.items.map(link => {
      return this.renderLink(link, true)
    })
  }

  toggleMenu = e => {
    e.preventDefault()
    this.props.toggleMenu()
  }

  render() {
    const {environment} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.menuButton}>
          <CloseIcon onClick={this.toggleMenu} />
        </div>
        <Link to="/" className={styles.title}>
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
