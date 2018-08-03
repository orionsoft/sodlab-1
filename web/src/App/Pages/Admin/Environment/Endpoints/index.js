import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import Endpoint from './Endpoint'

export default class Endpoints extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/endpoints" exact component={List} />
          <Route path="/:environmentId/endpoints/create" component={Create} />
          <Route path="/:environmentId/endpoints/:endpointId" component={Endpoint} />
        </Switch>
      </div>
    )
  }
}
