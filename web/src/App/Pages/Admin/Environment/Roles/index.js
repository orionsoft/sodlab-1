import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import Role from './Role'

export default class Roles extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path="/:environmentId/roles"
            exact
            component={List}
          />
          <Route
            path="/:environmentId/roles/create"
            component={Create}
          />
          <Route
            path="/:environmentId/roles/:roleId"
            component={Role}
          />
        </Switch>
      </div>
    )
  }
}
