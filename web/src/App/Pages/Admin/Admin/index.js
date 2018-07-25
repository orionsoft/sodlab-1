import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'
import {superAdminLinks, adminLinks} from './links'
import Container from 'orionsoft-parts/lib/components/Container'
import withRoles from 'App/helpers/auth/withRoles'
import Navbar from '../Navbar'

@withRoles
export default class Admin extends React.Component {
  static propTypes = {
    roles: PropTypes.array
  }

  superAdminRoutes() {
    return (
      <div>
        {superAdminLinks.map(link => (
          <Route key={link.path} path={link.path} component={link.component} />
        ))}
      </div>
    )
  }

  adminRoutes() {
    return (
      <div>
        {adminLinks.map(link => (
          <Route key={link.path} path={link.path} component={link.component} />
        ))}
      </div>
    )
  }

  render() {
    const {roles} = this.props
    return (
      <div className={styles.container}>
        <Navbar />
        <Container>
          <Switch>
            <Route path="/admin" exact component={DynamicComponent(() => import('./Main'))} />
            {roles.includes('superAdmin') ? this.superAdminRoutes() : this.adminRoutes()}
          </Switch>
        </Container>
      </div>
    )
  }
}
