import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import Hook from './Hook'

export default class Views extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/hooks" exact component={List} />
          <Route path="/:environmentId/hooks/create" component={Create} />
          <Route path="/:environmentId/hooks/:hookId" component={Hook} />
        </Switch>
      </div>
    )
  }
}
