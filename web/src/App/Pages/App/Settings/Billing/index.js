import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'

export default class Billing extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path="/settings/billing"
            exact
            component={DynamicComponent(() => import('./Main'))}
          />
          <Route
            path="/settings/billing/create"
            component={DynamicComponent(() => import('./CreateCard'))}
          />
        </Switch>
      </div>
    )
  }
}
