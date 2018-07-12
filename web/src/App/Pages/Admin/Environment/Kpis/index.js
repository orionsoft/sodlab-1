import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Create from './Create'
import Kpi from './Kpi'
import List from './List'

export default class Kpis extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/kpis" exact component={List} />
          <Route path="/:environmentId/kpis/create" component={Create} />
          <Route path="/:environmentId/kpis/:kpiId" component={Kpi} />
        </Switch>
      </div>
    )
  }
}
