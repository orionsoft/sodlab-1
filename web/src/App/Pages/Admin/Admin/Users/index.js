import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'

export default class Users extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route exact path="/admin/users" component={DynamicComponent(() => import('./List'))} />
          <Route path="/admin/users/:userId" component={DynamicComponent(() => import('./User'))} />
        </Switch>
      </div>
    )
  }
}
