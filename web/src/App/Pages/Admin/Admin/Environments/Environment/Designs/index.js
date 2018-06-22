import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Create from './Create'
import List from './List'
import Design from './Design'

export default class Filters extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/admin/environments/:environmentId/designs" exact component={List} />
          <Route path="/admin/environments/:environmentId/designs/create" component={Create} />
          <Route path="/admin/environments/:environmentId/designs/:designId" component={Design} />
        </Switch>
      </div>
    )
  }
}
