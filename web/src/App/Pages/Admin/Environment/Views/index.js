import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import View from './View'

export default class Views extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/views" exact component={List} />
          <Route path="/:environmentId/views/create" component={Create} />
          <Route path="/:environmentId/views/:viewId" component={View} />
        </Switch>
      </div>
    )
  }
}
