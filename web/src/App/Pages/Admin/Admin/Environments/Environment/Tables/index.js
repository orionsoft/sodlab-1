import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import Table from './Table'

export default class Views extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/admin/environments/:environmentId/tables" exact component={List} />
          <Route path="/admin/environments/:environmentId/tables/create" component={Create} />
          <Route path="/admin/environments/:environmentId/tables/:tableId" component={Table} />
        </Switch>
      </div>
    )
  }
}
