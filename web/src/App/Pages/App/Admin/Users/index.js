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
          <Route path="" component={DynamicComponent(() => import('./List'))} />
        </Switch>
      </div>
    )
  }
}
