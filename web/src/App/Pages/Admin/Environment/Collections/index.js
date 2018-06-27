import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import Collection from './Collection'

export default class Collections extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/collections" exact component={List} />
          <Route path="/:environmentId/collections/create" component={Create} />
          <Route
            path="/:environmentId/collections/:collectionId"
            component={Collection}
          />
        </Switch>
      </div>
    )
  }
}
