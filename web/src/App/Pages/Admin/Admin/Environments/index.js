import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'

export default class Environments extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path="/admin/environments"
            exact
            component={DynamicComponent(() => import('./List'))}
          />
          <Route
            path="/admin/environments/create"
            component={DynamicComponent(() => import('./Create'))}
          />
        </Switch>
      </div>
    )
  }
}
