import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Create from './Create'
import List from './List'

export default class Filters extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/admin/environments/:environmentId/filters" exact component={List} />
          <Route path="/admin/environments/:environmentId/filters/create" component={Create} />
        </Switch>
      </div>
    )
  }
}
