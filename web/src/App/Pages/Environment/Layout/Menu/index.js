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

@withEnvironmentId
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
    }
  }
`)
@withRouter
export default class Menu extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    environment: PropTypes.object
  }

  renderLink({title, path}) {
    const active = this.props.location.pathname.startsWith(path)
    return (
      <Link to={path} className={active ? styles.itemActive : styles.menuItem}>
        {title}
      </Link>
    )
  }

  render() {
    const {environment} = this.props
    return (
      <div className={styles.container}>
        <Link to="/" className={styles.title}>
          {environment.name}
        </Link>
        <div className={styles.divider} />
        {this.renderLink({title: 'Mi cuenta', path: '/settings'})}
        {this.renderLink({title: 'Mi cuenta', path: '/settings'})}
        {this.renderLink({title: 'Mi cuenta', path: '/settings'})}
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
