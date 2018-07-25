import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import {Route, Switch} from 'react-router-dom'
import forceLogin from 'App/helpers/auth/forceLogin'
import withRoles from 'App/helpers/auth/withRoles'
import Admin from './Admin'
import Settings from './Settings'
import Environment from './Environment'
import Navbar from './Navbar'

@forceLogin
@withRoles
export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    roles: PropTypes.array
  }

  renderNotAllowed() {
    return 'not allowed'
  }

  render() {
    if (!this.props.roles.includes('superAdmin') && !this.props.roles.includes('admin')) {
      return this.renderNotAllowed()
    }
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route
            path="/settings"
            component={() => (
              <div>
                <Navbar />
                <Settings />
              </div>
            )}
          />
          <Route path="/:environmentId" component={Environment} />
        </Switch>
      </div>
    )
  }
}
