import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import EnvironmentUser from './EnvironmentUser'

export default class EnvironmentUsers extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/users" exact component={List} />
          <Route path="/:environmentId/users/create" component={Create} />
          <Route path="/:environmentId/users/:environmentUserId" component={EnvironmentUser} />
        </Switch>
      </div>
    )
  }
}
