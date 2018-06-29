import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import {Route, Switch} from 'react-router-dom'
import forceLogin from 'App/helpers/auth/forceLogin'
import Admin from './Admin'
import Settings from './Settings'
import Environment from './Environment'
import Navbar from './Navbar'

@forceLogin
export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
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
