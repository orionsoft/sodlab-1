import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'

export default class Credentials extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path="/settings/credentials"
            exact
            component={DynamicComponent(() => import('./List'))}
          />
          <Route
            path="/settings/credentials/add"
            component={DynamicComponent(() => import('./Add'))}
          />
        </Switch>
      </div>
    )
  }
}
